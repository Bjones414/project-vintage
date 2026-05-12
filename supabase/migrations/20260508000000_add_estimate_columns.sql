BEGIN;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS estimate_low_cents  INTEGER,
  ADD COLUMN IF NOT EXISTS estimate_high_cents INTEGER,
  ADD COLUMN IF NOT EXISTS lot_number          TEXT;

COMMENT ON COLUMN listings.estimate_low_cents IS
  'Pre-sale estimate lower bound in cents. Populated by auction-house scrapers when available.';
COMMENT ON COLUMN listings.estimate_high_cents IS
  'Pre-sale estimate upper bound in cents. Populated by auction-house scrapers when available.';
COMMENT ON COLUMN listings.lot_number IS
  'Auction lot number as assigned by the house. Platform-specific format (e.g., "132").';

CREATE TABLE IF NOT EXISTS scraper_errors (
  id         UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform   TEXT        NOT NULL,
  source_url TEXT,
  error      TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMIT;

-- DOWN:
-- BEGIN;
-- DROP TABLE IF EXISTS scraper_errors;
-- ALTER TABLE listings
--   DROP COLUMN IF EXISTS lot_number,
--   DROP COLUMN IF EXISTS estimate_high_cents,
--   DROP COLUMN IF EXISTS estimate_low_cents;
-- COMMIT;
