-- =============================================================================
-- Add paint and interior originality disclosure columns to listings.
--
-- New columns:
--   original_exterior_color   TEXT      — factory color before any repaint
--   is_repainted              BOOLEAN   — null=unknown, true=repaint confirmed, false=original confirmed
--   repaint_year              INTEGER   — year of repaint when disclosed
--   repaint_disclosure        TEXT      — raw sentence excerpt documenting the repaint
--   original_interior_color   TEXT      — factory interior color before any reupholstery
--   is_reupholstered          BOOLEAN   — null=unknown, true=confirmed, false=original confirmed
--   reupholstery_disclosure   TEXT      — raw sentence excerpt documenting the reupholstery
--
-- Populated at parse time from description text; null = not disclosed in listing.
-- No backfill in this migration — forward-looking only.
-- V1.5 backfill task: re-parse source URLs for existing listings with description text.
--
-- Reversible: yes — DROP COLUMN statements in rollback section.
-- Apply: npx supabase db push
-- =============================================================================

BEGIN;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS original_exterior_color TEXT,
  ADD COLUMN IF NOT EXISTS is_repainted             BOOLEAN,
  ADD COLUMN IF NOT EXISTS repaint_year             INTEGER,
  ADD COLUMN IF NOT EXISTS repaint_disclosure       TEXT,
  ADD COLUMN IF NOT EXISTS original_interior_color  TEXT,
  ADD COLUMN IF NOT EXISTS is_reupholstered         BOOLEAN,
  ADD COLUMN IF NOT EXISTS reupholstery_disclosure  TEXT;

COMMENT ON COLUMN listings.original_exterior_color IS
  'Factory exterior color before any repaint. Null when no repaint is disclosed or description not parsed.';
COMMENT ON COLUMN listings.is_repainted IS
  'Paint originality: true = seller disclosed a repaint; false = seller confirmed original paint; null = not mentioned.';
COMMENT ON COLUMN listings.repaint_year IS
  'Year the repaint occurred, when disclosed in the listing. Null when year not mentioned.';
COMMENT ON COLUMN listings.repaint_disclosure IS
  'Raw sentence excerpt from listing description documenting the repaint (≤300 chars), stored for transparency.';
COMMENT ON COLUMN listings.original_interior_color IS
  'Factory interior color before any reupholstery. Null when not disclosed.';
COMMENT ON COLUMN listings.is_reupholstered IS
  'Interior originality: true = seller disclosed reupholstery; false = confirmed original; null = not mentioned.';
COMMENT ON COLUMN listings.reupholstery_disclosure IS
  'Raw sentence excerpt from listing description documenting the reupholstery (≤300 chars).';

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- ALTER TABLE listings
--   DROP COLUMN IF EXISTS reupholstery_disclosure,
--   DROP COLUMN IF EXISTS is_reupholstered,
--   DROP COLUMN IF EXISTS original_interior_color,
--   DROP COLUMN IF EXISTS repaint_disclosure,
--   DROP COLUMN IF EXISTS repaint_year,
--   DROP COLUMN IF EXISTS is_repainted,
--   DROP COLUMN IF EXISTS original_exterior_color;
-- COMMIT;
