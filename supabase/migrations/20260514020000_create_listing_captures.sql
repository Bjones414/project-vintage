-- =============================================================================
-- V1.5 Data Capture Layer
--
-- Preserves raw seller description and parser metadata from every user-triggered
-- analyze run. Purpose: build a historical corpus for future V2 features
-- (price attribution, condition extraction, disclosure analysis) with data from
-- day one of V1.5 launch.
--
-- Design decisions:
--   - Always-insert (no write-time dedup). Repeated analyses of the same listing
--     produce distinct rows — preserves the timeline for future learning.
--     Dedup at query time by content hash if needed.
--   - structured_data JSONB is a flexible bucket. No taxonomy committed here.
--     Future columns can be added as generated columns or in a separate migration.
--   - RLS: service role only. This corpus is platform-internal; users never
--     query it directly. Raw seller text never reaches a product surface.
--   - Kill switch: DATA_CAPTURE_ENABLED env var controls writes at the app layer.
--     The table always exists; the kill switch controls whether rows are added.
--
-- FK notes:
--   - listing_id → listings(id): nullable, ON DELETE SET NULL. Listing may not
--     exist if the upsert failed upstream (capture is a side effect, not a gate).
--   - analyze_run_id → listing_analyses(id): nullable, ON DELETE SET NULL.
--     Link to the listing_analyses row that triggered this capture.
--
-- Indexes:
--   - listing_id (sparse: WHERE listing_id IS NOT NULL)
--   - source_platform
--   - captured_at DESC (time-series queries)
--   - (source_platform, source_listing_id) for future purge-by-source operations
--
-- Apply: npx supabase db push
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS listing_captures (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  analyze_run_id    UUID        REFERENCES listing_analyses(id) ON DELETE SET NULL,
  listing_id        UUID        REFERENCES listings(id) ON DELETE SET NULL,
  source_platform   TEXT        NOT NULL,
  source_url        TEXT        NOT NULL,
  source_listing_id TEXT,
  raw_title         TEXT,
  raw_description   TEXT,
  structured_data   JSONB       NOT NULL DEFAULT '{}',
  captured_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  capture_version   TEXT        NOT NULL DEFAULT 'v1'
);

COMMENT ON TABLE listing_captures IS
  'Raw description and parser metadata from every user-triggered analyze run. '
  'Platform-internal corpus for future V2 feature development. '
  'Never exposed in product UI or user-facing API endpoints.';

COMMENT ON COLUMN listing_captures.analyze_run_id IS
  'FK to the listing_analyses row that triggered this capture. NULL when the analysis insert failed upstream.';

COMMENT ON COLUMN listing_captures.listing_id IS
  'FK to listings for the upserted listing row. NULL when the listings upsert failed upstream.';

COMMENT ON COLUMN listing_captures.raw_description IS
  'Verbatim seller description text, preserved for future NLP/extraction work. '
  'Never returned in any API response or rendered in any product surface.';

COMMENT ON COLUMN listing_captures.structured_data IS
  'Flexible JSONB bucket for parser metadata and analyze-pipeline byproducts. '
  'No taxonomy committed at schema level — add generated columns or a separate '
  'migration when a field graduates to first-class status.';

COMMENT ON COLUMN listing_captures.capture_version IS
  'Schema/extraction version. Bump when the shape of structured_data changes '
  'so analysts can filter by version for consistent comparisons.';

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS listing_captures_listing_id_idx
  ON listing_captures (listing_id)
  WHERE listing_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS listing_captures_source_platform_idx
  ON listing_captures (source_platform);

CREATE INDEX IF NOT EXISTS listing_captures_captured_at_idx
  ON listing_captures (captured_at DESC);

-- Composite for future purge-by-source operations (e.g., re-scrape a platform).
-- Not unique: always-insert policy means multiple captures per (platform, listing_id) are expected.
CREATE INDEX IF NOT EXISTS listing_captures_platform_listing_idx
  ON listing_captures (source_platform, source_listing_id)
  WHERE source_listing_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- RLS: platform-side only, no user access
--
-- Authenticated users: no read, no write.
-- Anonymous: no access.
-- Service role: full read/write (via GRANT, bypasses RLS policies).
-- ---------------------------------------------------------------------------

ALTER TABLE listing_captures ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE policies for anon or authenticated.
-- RLS is enabled with no permissive policies → deny-by-default for all roles
-- except service_role (which bypasses RLS entirely via PostgREST privilege check).

GRANT SELECT, INSERT, UPDATE ON listing_captures TO service_role;

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- REVOKE SELECT, INSERT, UPDATE ON listing_captures FROM service_role;
-- DROP TABLE IF EXISTS listing_captures;
-- COMMIT;
