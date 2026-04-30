-- =============================================================================
-- Data Handling Compliance Pass — Phase 5, Step 22a
-- Null out raw_description for all existing records.
--
-- raw_description holds verbatim seller copy from source listings.
-- Per the facts-only architecture, verbatim text must not persist.
-- This migration clears existing data; the column is dropped in 20260430090000.
--
-- Apply: npx supabase db push --linked
-- Verify: SELECT COUNT(*) FROM listings WHERE raw_description IS NOT NULL;  -- expect 0
-- =============================================================================

BEGIN;

UPDATE listings SET raw_description = NULL WHERE raw_description IS NOT NULL;

COMMIT;
