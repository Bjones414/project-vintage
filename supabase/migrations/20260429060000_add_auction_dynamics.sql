-- =============================================================================
-- Step 1: Add auction dynamics columns to listings.
--
-- listed_at, days_on_market already exist (20260429040000) — skipped.
-- sold_at already exists as auction_ends_at (20260428040000) — skipped.
--
-- New columns:
--   bid_count              INTEGER      — bids placed at auction close
--   comment_count          INTEGER      — page comment count (BaT signal)
--   bid_to_buy_ratio       NUMERIC(10,4)— high_bid / asking_price
--   final_to_reserve_ratio NUMERIC(10,4)— final_price / reserve estimate
--
-- All columns nullable; populated by scrapers and future enrichment jobs.
--
-- Reversible: yes — DROP COLUMN statements in rollback section.
-- Apply: npx supabase db push
-- =============================================================================

BEGIN;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS bid_count              INTEGER,
  ADD COLUMN IF NOT EXISTS comment_count          INTEGER,
  ADD COLUMN IF NOT EXISTS bid_to_buy_ratio       NUMERIC(10,4),
  ADD COLUMN IF NOT EXISTS final_to_reserve_ratio NUMERIC(10,4);

COMMENT ON COLUMN listings.bid_count IS
  'Number of bids placed at auction close. Populated by scrapers when available.';

COMMENT ON COLUMN listings.comment_count IS
  'Listing page comment count. BaT-specific engagement signal; null for platforms without comments.';

COMMENT ON COLUMN listings.bid_to_buy_ratio IS
  'high_bid / asking_price when both exist. Null for auction-only formats without a buy-it-now price.';

COMMENT ON COLUMN listings.final_to_reserve_ratio IS
  'final_price / reserve estimate when reserve is inferrable. Null when reserve is unknown.';

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- ALTER TABLE listings
--   DROP COLUMN IF EXISTS final_to_reserve_ratio,
--   DROP COLUMN IF EXISTS bid_to_buy_ratio,
--   DROP COLUMN IF EXISTS comment_count,
--   DROP COLUMN IF EXISTS bid_count;
-- COMMIT;
