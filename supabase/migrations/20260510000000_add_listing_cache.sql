-- =============================================================================
-- Migration: Listing cache columns + watchlist table
--
-- Changes:
--   1. listings.last_fetched_at — timestamp of last successful source fetch
--   2. listings.cache_status    — 'live' (refresh if stale) or 'permanent' (never refresh)
--   3. Data backfill            — existing sold/no-sale rows → permanent
--   4. watchlist table          — user-saved listings (user_id, listing_id)
--
-- SAFETY NOTE: cache_status = 'permanent' rows are NEVER re-fetched. Fetches are
-- triggered exclusively by direct user actions (analyze URL, load watchlist page).
-- No cron jobs, no background tasks, no webhooks.
--
-- Reversible: yes — rollback at the bottom (commented out).
-- Apply: npx supabase db push (review before running)
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Cache control columns on listings
-- ---------------------------------------------------------------------------

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS last_fetched_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cache_status    TEXT NOT NULL DEFAULT 'live'
    CONSTRAINT listings_cache_status_check
    CHECK (cache_status IN ('live', 'permanent'));

COMMENT ON COLUMN listings.last_fetched_at IS
  'Timestamp of the most recent successful fetch from the source platform. '
  'NULL for rows inserted before this column existed. '
  'SAFETY: Updated only by direct user-triggered fetches — never by background jobs or cron.';

COMMENT ON COLUMN listings.cache_status IS
  'live = may be re-fetched when last_fetched_at is older than 1 hour. '
  'permanent = listing is sold or no-sale; state is final, never re-fetched. '
  'SAFETY: Once permanent, a listing is never downgraded back to live.';

-- ---------------------------------------------------------------------------
-- 2. Data backfill for existing rows
--
--    sold/no-sale: state is final, mark permanent. last_fetched_at approximated
--    as created_at since these rows predate the cache system.
--
--    all others: mark live so they can be refreshed when a user views them.
-- ---------------------------------------------------------------------------

UPDATE listings
   SET cache_status    = 'permanent',
       last_fetched_at = created_at
 WHERE listing_status IN ('sold', 'no-sale');

UPDATE listings
   SET cache_status    = 'live',
       last_fetched_at = created_at
 WHERE listing_status IS NULL
    OR listing_status NOT IN ('sold', 'no-sale');

-- ---------------------------------------------------------------------------
-- 3. Watchlist table
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS watchlist (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID        NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, listing_id)
);

COMMENT ON TABLE watchlist IS
  'User-saved listings. One row per (user, listing) pair. '
  'When the user loads /watchlist, stale live listings are re-fetched sequentially with delays. '
  'SAFETY: Refresh is triggered only by the user loading the watchlist page — not by cron or background jobs.';

-- ---------------------------------------------------------------------------
-- 4. RLS + grants for watchlist
--    Each user sees and mutates only their own rows.
-- ---------------------------------------------------------------------------

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS watchlist_own_rows ON watchlist;
CREATE POLICY watchlist_own_rows
  ON watchlist
  FOR ALL
  TO authenticated
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- authenticated users can manage their own rows directly
GRANT SELECT, INSERT, DELETE ON watchlist TO authenticated;
-- service_role is used by refresh endpoint which needs to read watchlist + write listings
GRANT SELECT, INSERT, UPDATE, DELETE ON watchlist TO service_role;

-- ---------------------------------------------------------------------------
-- 5. Indexes
-- ---------------------------------------------------------------------------

-- Sparse index: only live listings participate in batch-refresh queries
CREATE INDEX IF NOT EXISTS listings_cache_status_live_idx
  ON listings (cache_status)
  WHERE cache_status = 'live';

-- For stale-detection queries: find rows with last_fetched_at < (now - 1h)
CREATE INDEX IF NOT EXISTS listings_last_fetched_at_idx
  ON listings (last_fetched_at);

CREATE INDEX IF NOT EXISTS watchlist_user_id_idx
  ON watchlist (user_id);

CREATE INDEX IF NOT EXISTS watchlist_listing_id_idx
  ON watchlist (listing_id);

COMMIT;


-- =============================================================================
-- DOWN / ROLLBACK
-- =============================================================================

-- BEGIN;
--
-- DROP TABLE IF EXISTS watchlist;
--
-- DROP INDEX IF EXISTS watchlist_listing_id_idx;
-- DROP INDEX IF EXISTS watchlist_user_id_idx;
-- DROP INDEX IF EXISTS listings_last_fetched_at_idx;
-- DROP INDEX IF EXISTS listings_cache_status_live_idx;
--
-- ALTER TABLE listings
--   DROP CONSTRAINT IF EXISTS listings_cache_status_check,
--   DROP COLUMN IF EXISTS cache_status,
--   DROP COLUMN IF EXISTS last_fetched_at;
--
-- COMMIT;
