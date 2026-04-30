-- =============================================================================
-- Step 2: Add vehicle attribute columns to listings.
--
-- New columns:
--   trim_category   TEXT — normalized trim grouping, distinct from raw `trim`
--                          e.g., 'GT3', 'Turbo', 'Carrera', 'Targa'
--   country_of_sale TEXT — ISO country code for the sale location
--                          e.g., 'US', 'UK', 'DE'; affects comp weighting
--
-- Both nullable; populated by scrapers and future enrichment jobs.
--
-- Reversible: yes — DROP COLUMN statements in rollback section.
-- Apply: npx supabase db push
-- =============================================================================

BEGIN;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS trim_category   TEXT,
  ADD COLUMN IF NOT EXISTS country_of_sale TEXT;

COMMENT ON COLUMN listings.trim_category IS
  'Normalized trim grouping (e.g., GT3, Turbo, Carrera, Targa). Distinct from raw trim text. Used by comp engine for trim-filtered similarity scoring.';

COMMENT ON COLUMN listings.country_of_sale IS
  'ISO 3166-1 alpha-2 country code for the sale location (e.g., US, UK, DE). Affects comp weighting for market-specific price differences.';

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- ALTER TABLE listings
--   DROP COLUMN IF EXISTS country_of_sale,
--   DROP COLUMN IF EXISTS trim_category;
-- COMMIT;
