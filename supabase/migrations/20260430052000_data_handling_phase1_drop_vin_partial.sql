-- =============================================================================
-- Data Handling Compliance Pass — Phase 1, Step 3
-- Drop vin_partial column from listings.
--
-- Safe to run after step 2 migration has nulled and replaced vin_partial data.
-- cross_listing_group_id and vin_hash_partial are the only VIN-related columns
-- remaining after this migration.
--
-- Apply: npx supabase db push --linked
-- Verify: SELECT column_name FROM information_schema.columns
--         WHERE table_name = 'listings' AND column_name = 'vin_partial';
--         (should return 0 rows)
-- =============================================================================

BEGIN;

ALTER TABLE listings
  DROP COLUMN IF EXISTS vin_partial;

COMMIT;
