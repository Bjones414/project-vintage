-- =============================================================================
-- Step 5: Add factory options columns to listings.
--
-- factory_options: marque-agnostic TEXT[] of normalized option codes extracted
--   from listing text. Distinct from existing options JSONB (raw strings/objects
--   from the original listing). Adding Ferrari option codes later requires no
--   schema change — they use the same factory_options array.
--
-- Porsche-specific convenience BOOLEANs: stored alongside factory_options per
--   the core architectural rule ("build data as if for all cars"). The Porsche
--   flags denormalize common high-signal options for fast filtering without
--   ARRAY contains queries. Adding has_ferrari_x_option later requires only a
--   new column, no migration on the shared columns.
--
-- New columns:
--   factory_options   TEXT[]  — normalized factory option codes
--   has_x50_powerkit  BOOLEAN — Porsche M637 / X50 GT powerkit
--   has_aero_kit      BOOLEAN — factory aero package
--   has_sport_seats   BOOLEAN — factory sport/bucket seats
--   is_paint_to_sample BOOLEAN — PTS (paint-to-sample) special color
--
-- All nullable; populated by future Phase 2 extraction work.
--
-- Reversible: yes — DROP COLUMN statements in rollback section.
-- Apply: npx supabase db push
-- =============================================================================

BEGIN;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS factory_options    TEXT[],
  ADD COLUMN IF NOT EXISTS has_x50_powerkit   BOOLEAN,
  ADD COLUMN IF NOT EXISTS has_aero_kit       BOOLEAN,
  ADD COLUMN IF NOT EXISTS has_sport_seats    BOOLEAN,
  ADD COLUMN IF NOT EXISTS is_paint_to_sample BOOLEAN;

COMMENT ON COLUMN listings.factory_options IS
  'Normalized factory option codes extracted from listing (e.g., [''M637'', ''030'', ''220'']). Marque-agnostic; distinct from raw options JSONB. Populated by Phase 2 extraction.';

COMMENT ON COLUMN listings.has_x50_powerkit IS
  'Porsche M637 / X50 GT powerkit present. Denormalized from factory_options for fast filtering. Null = not yet assessed.';

COMMENT ON COLUMN listings.has_aero_kit IS
  'Porsche factory aero package present. Denormalized from factory_options for fast filtering. Null = not yet assessed.';

COMMENT ON COLUMN listings.has_sport_seats IS
  'Porsche factory sport/bucket seats present. Denormalized from factory_options for fast filtering. Null = not yet assessed.';

COMMENT ON COLUMN listings.is_paint_to_sample IS
  'Paint-to-Sample (PTS) special color ordered from factory. High value signal for Porsche pricing. Null = not yet assessed.';

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- ALTER TABLE listings
--   DROP COLUMN IF EXISTS is_paint_to_sample,
--   DROP COLUMN IF EXISTS has_sport_seats,
--   DROP COLUMN IF EXISTS has_aero_kit,
--   DROP COLUMN IF EXISTS has_x50_powerkit,
--   DROP COLUMN IF EXISTS factory_options;
-- COMMIT;
