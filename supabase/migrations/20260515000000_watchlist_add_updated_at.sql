-- =============================================================================
-- Add updated_at to watchlist
--
-- updated_at tracks when the user last refreshed a row's analysis (by clicking
-- the row on /watchlist). The /watchlist page uses this for Fresh/Stale/Stale-urgent
-- state classification per the UI spec:
--   fresh        = updated_at <6h ago
--   stale        = updated_at ≥6h ago, auction not ending soon
--   stale-urgent = updated_at ≥6h ago AND auction_ends_at within 12h
--
-- The per-listing refresh endpoint (POST /api/watchlist/[listingId]/refresh)
-- sets updated_at = now() after each analysis run.
--
-- Backfill: existing rows get updated_at = created_at (treated as "never refreshed
-- by the user" — the analysis was run at listing-analyze time, not watchlist-expand time).
--
-- Trigger: auto-updates updated_at on any UPDATE to the row, so the endpoint
-- only needs to perform its UPDATE without explicitly setting the column.
--
-- Reversible: yes — rollback at bottom.
-- Apply: npx supabase db push (USER TO REVIEW will run manually)
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Add column as nullable first, backfill, then constrain
--    Adding NOT NULL DEFAULT now() directly would set all existing rows to the
--    migration timestamp rather than created_at, which is misleading.
-- ---------------------------------------------------------------------------

ALTER TABLE watchlist
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

UPDATE watchlist
   SET updated_at = created_at
 WHERE updated_at IS NULL;

ALTER TABLE watchlist
  ALTER COLUMN updated_at SET NOT NULL,
  ALTER COLUMN updated_at SET DEFAULT now();

COMMENT ON COLUMN watchlist.updated_at IS
  'Timestamp of the most recent per-row analysis refresh by the user on /watchlist. '
  'Initialized to created_at for rows that predate this column. '
  'Updated by POST /api/watchlist/[listingId]/refresh on every user-triggered row expand. '
  'Used for Fresh (<6h) / Stale (≥6h) / Stale-urgent (≥6h + auction ending <12h) classification.';

-- ---------------------------------------------------------------------------
-- 2. Trigger: keep updated_at current on any UPDATE
--    The refresh endpoint does UPDATE watchlist SET updated_at = now() — the
--    trigger fires on that UPDATE and keeps the value consistent.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION watchlist_touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS watchlist_updated_at_trig ON watchlist;
CREATE TRIGGER watchlist_updated_at_trig
  BEFORE UPDATE ON watchlist
  FOR EACH ROW EXECUTE FUNCTION watchlist_touch_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Index for freshness queries (find stale rows for a user)
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS watchlist_updated_at_idx
  ON watchlist (user_id, updated_at);

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- DROP TRIGGER IF EXISTS watchlist_updated_at_trig ON watchlist;
-- DROP FUNCTION IF EXISTS watchlist_touch_updated_at;
-- DROP INDEX IF EXISTS watchlist_updated_at_idx;
-- ALTER TABLE watchlist DROP COLUMN IF EXISTS updated_at;
-- COMMIT;
