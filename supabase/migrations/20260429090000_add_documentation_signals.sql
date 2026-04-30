-- =============================================================================
-- Step 4: Add documentation and provenance signal columns to listings.
--
-- All columns nullable; populated by scrapers and future enrichment jobs.
--
-- Note on overlaps with existing columns:
--   has_service_records: semantically related to existing service_history_present
--     (BOOLEAN, base schema). has_service_records is the structured signal added
--     here for Phase 2; service_history_present remains for scraper-level detection.
--     Future work may consolidate; for now both columns exist.
--   owner_count: semantically related to existing ownership_count (SMALLINT,
--     base schema). owner_count (INTEGER) is the Phase 2 normalized integer.
--     Future work may consolidate; for now both columns exist.
--
-- New columns:
--   has_porsche_coa      BOOLEAN — Certificate of Authenticity from Porsche AG
--   has_kardex           BOOLEAN — factory build record from Porsche Archives
--   has_service_records  BOOLEAN — service records present (Phase 2 signal)
--   has_window_sticker   BOOLEAN — Monroney / delivery sticker present
--   has_owners_manual    BOOLEAN — original owners manual present
--   owner_count          INTEGER — normalized ownership count (Phase 2)
--   documentation_score  INTEGER — sum of documentation flags (0–6 scale)
--
-- Reversible: yes — DROP COLUMN statements in rollback section.
-- Apply: npx supabase db push
-- =============================================================================

BEGIN;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS has_porsche_coa     BOOLEAN,
  ADD COLUMN IF NOT EXISTS has_kardex          BOOLEAN,
  ADD COLUMN IF NOT EXISTS has_service_records BOOLEAN,
  ADD COLUMN IF NOT EXISTS has_window_sticker  BOOLEAN,
  ADD COLUMN IF NOT EXISTS has_owners_manual   BOOLEAN,
  ADD COLUMN IF NOT EXISTS owner_count         INTEGER,
  ADD COLUMN IF NOT EXISTS documentation_score INTEGER;

COMMENT ON COLUMN listings.has_porsche_coa IS
  'Certificate of Authenticity from Porsche AG is present. Null = not assessed.';

COMMENT ON COLUMN listings.has_kardex IS
  'Factory build record from the Porsche Archives (Kardex) is present. High-value provenance signal for air-cooled cars.';

COMMENT ON COLUMN listings.has_service_records IS
  'Structured Phase 2 signal: service records present. Related to service_history_present (base schema) but populated by Phase 2 enrichment rather than scraper-level detection.';

COMMENT ON COLUMN listings.has_window_sticker IS
  'Monroney / factory delivery sticker present. Confirms original spec and pricing.';

COMMENT ON COLUMN listings.has_owners_manual IS
  'Original owners manual present with the vehicle.';

COMMENT ON COLUMN listings.owner_count IS
  'Normalized ownership count from Phase 2 enrichment. Related to ownership_count SMALLINT (base schema); may be consolidated in a future migration.';

COMMENT ON COLUMN listings.documentation_score IS
  'Derived sum of documentation flags (0–6 scale: coa + kardex + service_records + window_sticker + owners_manual + low owner_count). Populated by future scoring logic.';

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- ALTER TABLE listings
--   DROP COLUMN IF EXISTS documentation_score,
--   DROP COLUMN IF EXISTS owner_count,
--   DROP COLUMN IF EXISTS has_owners_manual,
--   DROP COLUMN IF EXISTS has_window_sticker,
--   DROP COLUMN IF EXISTS has_service_records,
--   DROP COLUMN IF EXISTS has_kardex,
--   DROP COLUMN IF EXISTS has_porsche_coa;
-- COMMIT;
