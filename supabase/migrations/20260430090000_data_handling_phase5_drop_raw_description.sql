-- =============================================================================
-- Data Handling Compliance Pass — Phase 5, Step 22b
-- Drop raw_description column from listings.
--
-- Safe to run after 20260430080000 has nulled all existing values.
-- The column is no longer written to by any code path after this compliance pass.
--
-- Apply: npx supabase db push --linked
-- Verify: SELECT column_name FROM information_schema.columns
--         WHERE table_name = 'listings' AND column_name = 'raw_description';
--         (should return 0 rows)
-- =============================================================================

BEGIN;

ALTER TABLE listings DROP COLUMN IF EXISTS raw_description;

COMMIT;
