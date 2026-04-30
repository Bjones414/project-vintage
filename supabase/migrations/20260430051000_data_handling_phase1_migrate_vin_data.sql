-- =============================================================================
-- Data Handling Compliance Pass — Phase 1, Step 2
-- VIN data migration: hash partial VIN → vin_hash_partial, null out vin + vin_partial.
--
-- For each existing record where vin IS NOT NULL:
--   1. Compute SHA-256 hash of the last 6 characters of the VIN.
--   2. Write the hash to vin_hash_partial.
--   3. Set vin = NULL (full VIN must not persist per compliance rule).
--
-- For records where vin_partial IS NOT NULL (none currently):
--   Hash and null it out as well.
--
-- After this migration:
--   - vin column: all NULL
--   - vin_partial column: all NULL
--   - vin_hash_partial column: populated for all records that had a VIN
--
-- Apply: npx supabase db push --linked
-- Verify: SELECT COUNT(*) FROM listings WHERE vin IS NOT NULL;  -- expect 0
--         SELECT COUNT(*) FROM listings WHERE vin_hash_partial IS NOT NULL;  -- expect 207
-- =============================================================================

BEGIN;

-- Step A: For records with full VIN — hash last 6 chars, write to vin_hash_partial, null vin.
-- Only update vin_hash_partial if it's not already set (idempotent on re-run).
UPDATE listings
SET
  vin_hash_partial = CASE
    WHEN vin_hash_partial IS NULL
    THEN encode(sha256(RIGHT(vin, 6)::bytea), 'hex')
    ELSE vin_hash_partial
  END,
  vin = NULL
WHERE vin IS NOT NULL;

-- Step B: For records with vin_partial — hash it if vin_hash_partial still unset, null vin_partial.
-- (Currently 0 records have vin_partial, but this step is included for correctness.)
UPDATE listings
SET
  vin_hash_partial = CASE
    WHEN vin_hash_partial IS NULL
    THEN encode(sha256(RIGHT(vin_partial, 6)::bytea), 'hex')
    ELSE vin_hash_partial
  END,
  vin_partial = NULL
WHERE vin_partial IS NOT NULL;

COMMIT;
