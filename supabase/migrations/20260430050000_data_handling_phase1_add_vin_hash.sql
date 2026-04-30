-- =============================================================================
-- Data Handling Compliance Pass — Phase 1, Step 1
-- Add vin_hash_partial column for VIN identity matching.
-- cross_listing_group_id already exists from 20260430000000.
--
-- vin_hash_partial: SHA-256 hash of the last 6 chars of the VIN.
--   Used for cross-listing identity detection only.
--   Never displayed to users. Not reversible.
--
-- Apply: npx supabase db push --linked
-- Verify: SELECT column_name FROM information_schema.columns
--         WHERE table_name = 'listings' AND column_name = 'vin_hash_partial';
-- =============================================================================

BEGIN;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS vin_hash_partial TEXT;

COMMENT ON COLUMN listings.vin_hash_partial IS
  'SHA-256 hash of the last 6 chars of the VIN. Internal-only cross-listing identity key. Never displayed. Not reversible.';

-- cross_listing_group_id already exists from migration 20260430000000.
-- Verify it exists (no-op guard):
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'listings'
      AND column_name  = 'cross_listing_group_id'
  ) THEN
    RAISE EXCEPTION 'cross_listing_group_id missing — expected from 20260430000000';
  END IF;
END;
$$;

-- Index for cross-listing matching by hash.
CREATE INDEX IF NOT EXISTS listings_vin_hash_partial_idx
  ON listings (vin_hash_partial)
  WHERE vin_hash_partial IS NOT NULL;

COMMIT;
