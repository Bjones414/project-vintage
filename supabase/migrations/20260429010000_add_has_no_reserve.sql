-- Add has_no_reserve to listings.
-- true when the listing was explicitly listed with no reserve (no price floor).
-- Distinct from reserve_met=null, which means reserve status is unknown.

BEGIN;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS has_no_reserve BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN listings.has_no_reserve IS
  'true when the listing explicitly states "No Reserve" — distinct from reserve_met=null (unknown). Default false.';

COMMIT;

-- DOWN:
-- BEGIN;
-- ALTER TABLE listings DROP COLUMN IF EXISTS has_no_reserve;
-- COMMIT;
