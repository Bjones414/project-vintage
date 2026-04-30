-- =============================================================================
-- Add market-signal columns to listings table.
--
-- sold_at: already exists as auction_ends_at — reuse, no duplicate.
-- body_class: already exists as decoded_body_class — reuse, no duplicate.
--
-- New columns:
--   listed_at       TIMESTAMPTZ — when the auction started (BaT: parse from page)
--   days_on_market  INTEGER     — sold_at - listed_at in days, null if either missing
--
-- Reversible: yes — DROP COLUMN statements in rollback section below.
-- Apply: npx supabase db push
-- =============================================================================

BEGIN;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS listed_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS days_on_market  INTEGER;

COMMENT ON COLUMN listings.listed_at IS
  'When the auction opened / listing was created. Populated by scrapers when available.';

COMMENT ON COLUMN listings.days_on_market IS
  'Computed: (auction_ends_at - listed_at) in days. Null when either timestamp is missing.';

COMMENT ON COLUMN listings.auction_ends_at IS
  'When the auction ended / is scheduled to end. Serves as sold_at for comp-engine purposes.';

COMMENT ON COLUMN listings.decoded_body_class IS
  'NHTSA-decoded body style (Coupe, Cabriolet, Convertible, etc.). Serves as body_class for comp-engine filtering.';

CREATE INDEX IF NOT EXISTS listings_listed_at_idx
  ON listings (listed_at);

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- DROP INDEX IF EXISTS listings_listed_at_idx;
-- ALTER TABLE listings
--   DROP COLUMN IF EXISTS days_on_market,
--   DROP COLUMN IF EXISTS listed_at;
-- COMMIT;
