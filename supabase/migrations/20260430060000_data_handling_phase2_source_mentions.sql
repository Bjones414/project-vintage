-- =============================================================================
-- Data Handling Compliance Pass — Phase 2, Step 9
-- Add source-mention signal columns to listings table.
--
-- 8 boolean signal columns + 8 paired source citation text columns.
-- All nullable. Booleans: true = mentioned in source text; null = not present/unknown.
-- Source citations: "Publication Name|https://source-url" format.
--
-- The existing accident_history_stated enum field is NOT altered — it coexists with
-- mentioned_accident_history as per spec. accident_history_stated targets Phase 2
-- AI extraction; mentioned_accident_history is V1 regex-based.
--
-- Apply: npx supabase db push --linked
-- Verify: SELECT column_name FROM information_schema.columns
--         WHERE table_name = 'listings' AND column_name LIKE 'mentioned_%'
--         ORDER BY column_name;  -- expect 16 rows
-- =============================================================================

BEGIN;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS mentioned_repaint                    BOOLEAN,
  ADD COLUMN IF NOT EXISTS mentioned_repaint_source             TEXT,
  ADD COLUMN IF NOT EXISTS mentioned_accident_history           BOOLEAN,
  ADD COLUMN IF NOT EXISTS mentioned_accident_history_source    TEXT,
  ADD COLUMN IF NOT EXISTS mentioned_engine_service             BOOLEAN,
  ADD COLUMN IF NOT EXISTS mentioned_engine_service_source      TEXT,
  ADD COLUMN IF NOT EXISTS mentioned_transmission_service       BOOLEAN,
  ADD COLUMN IF NOT EXISTS mentioned_transmission_service_source TEXT,
  ADD COLUMN IF NOT EXISTS mentioned_matching_numbers           BOOLEAN,
  ADD COLUMN IF NOT EXISTS mentioned_matching_numbers_source    TEXT,
  ADD COLUMN IF NOT EXISTS mentioned_modifications              BOOLEAN,
  ADD COLUMN IF NOT EXISTS mentioned_modifications_source       TEXT,
  ADD COLUMN IF NOT EXISTS mentioned_recent_ppi                 BOOLEAN,
  ADD COLUMN IF NOT EXISTS mentioned_recent_ppi_source          TEXT,
  ADD COLUMN IF NOT EXISTS mentioned_original_owner             BOOLEAN,
  ADD COLUMN IF NOT EXISTS mentioned_original_owner_source      TEXT;

COMMENT ON COLUMN listings.mentioned_repaint IS
  'True when source text mentions repaint/respray. Null = not mentioned. Source: regex extraction at fetch time.';
COMMENT ON COLUMN listings.mentioned_repaint_source IS
  'Citation for mentioned_repaint: "Publication|URL" format. Null when boolean is null.';
COMMENT ON COLUMN listings.mentioned_accident_history IS
  'True when source text mentions accident history (either presence or absence). Null = not mentioned.';
COMMENT ON COLUMN listings.mentioned_accident_history_source IS
  'Citation for mentioned_accident_history.';
COMMENT ON COLUMN listings.mentioned_engine_service IS
  'True when source text mentions engine work/service/rebuild. Null = not mentioned.';
COMMENT ON COLUMN listings.mentioned_engine_service_source IS
  'Citation for mentioned_engine_service.';
COMMENT ON COLUMN listings.mentioned_transmission_service IS
  'True when source text mentions transmission/clutch/gearbox service. Null = not mentioned.';
COMMENT ON COLUMN listings.mentioned_transmission_service_source IS
  'Citation for mentioned_transmission_service.';
COMMENT ON COLUMN listings.mentioned_matching_numbers IS
  'True when source text mentions matching numbers or Kardex confirmation. Null = not mentioned.';
COMMENT ON COLUMN listings.mentioned_matching_numbers_source IS
  'Citation for mentioned_matching_numbers.';
COMMENT ON COLUMN listings.mentioned_modifications IS
  'True when source text mentions modifications, aftermarket parts, or non-stock spec. Null = not mentioned.';
COMMENT ON COLUMN listings.mentioned_modifications_source IS
  'Citation for mentioned_modifications.';
COMMENT ON COLUMN listings.mentioned_recent_ppi IS
  'True when source text mentions a recent pre-purchase inspection. Null = not mentioned.';
COMMENT ON COLUMN listings.mentioned_recent_ppi_source IS
  'Citation for mentioned_recent_ppi.';
COMMENT ON COLUMN listings.mentioned_original_owner IS
  'True when source text mentions original/first/one owner. Null = not mentioned.';
COMMENT ON COLUMN listings.mentioned_original_owner_source IS
  'Citation for mentioned_original_owner.';

COMMIT;
