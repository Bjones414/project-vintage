-- =============================================================================
-- Step 3: Add condition and originality signal columns to listings.
--
-- All columns nullable; populated by future Phase 2 extraction work.
-- CHECK constraints enforce a closed vocabulary to prevent freeform noise.
--
-- New columns:
--   condition_signal  TEXT — overall condition grade derived from listing signals
--   paint_signal      TEXT — paint originality assessment
--   interior_signal   TEXT — interior originality assessment
--   numbers_matching  BOOLEAN — engine/gearbox match factory spec
--   mod_status        TEXT — modification level assessment
--
-- Reversible: yes — DROP COLUMN statements in rollback section.
-- Apply: npx supabase db push
-- =============================================================================

BEGIN;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS condition_signal TEXT
    CONSTRAINT listings_condition_signal_check
    CHECK (condition_signal IN ('concours', 'excellent', 'good', 'driver', 'project')),

  ADD COLUMN IF NOT EXISTS paint_signal TEXT
    CONSTRAINT listings_paint_signal_check
    CHECK (paint_signal IN ('original', 'repaint_partial', 'repaint_full', 'unknown')),

  ADD COLUMN IF NOT EXISTS interior_signal TEXT
    CONSTRAINT listings_interior_signal_check
    CHECK (interior_signal IN ('original', 'refurbished', 'replaced')),

  ADD COLUMN IF NOT EXISTS numbers_matching BOOLEAN,

  ADD COLUMN IF NOT EXISTS mod_status TEXT
    CONSTRAINT listings_mod_status_check
    CHECK (mod_status IN ('stock', 'light_reversible', 'heavy', 'unknown'));

COMMENT ON COLUMN listings.condition_signal IS
  'Derived condition grade: concours | excellent | good | driver | project. Extracted from listing description by Phase 2 enrichment. Null = not yet assessed.';

COMMENT ON COLUMN listings.paint_signal IS
  'Paint originality: original | repaint_partial | repaint_full | unknown. Null = not yet assessed.';

COMMENT ON COLUMN listings.interior_signal IS
  'Interior originality: original | refurbished | replaced. Null = not yet assessed.';

COMMENT ON COLUMN listings.numbers_matching IS
  'True when engine and gearbox serial numbers match factory VIN assignment. Null = unknown.';

COMMENT ON COLUMN listings.mod_status IS
  'Modification level: stock | light_reversible | heavy | unknown. Null = not yet assessed.';

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- ALTER TABLE listings
--   DROP COLUMN IF EXISTS mod_status,
--   DROP COLUMN IF EXISTS numbers_matching,
--   DROP COLUMN IF EXISTS interior_signal,
--   DROP COLUMN IF EXISTS paint_signal,
--   DROP COLUMN IF EXISTS condition_signal;
-- COMMIT;
