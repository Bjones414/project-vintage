BEGIN;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS data_source TEXT;

COMMENT ON COLUMN listings.data_source IS
  'Tag identifying the ingestion batch or run (e.g. ''foundation_test'', ''scheduled''). Null on rows ingested before this column existed.';

COMMIT;

-- DOWN:
-- BEGIN;
-- ALTER TABLE listings DROP COLUMN IF EXISTS data_source;
-- COMMIT;
