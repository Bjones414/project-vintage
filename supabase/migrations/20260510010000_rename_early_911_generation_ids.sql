BEGIN;

-- =============================================================================
-- Rename early 911 generation IDs to readable slugs (Bug 2 fix).
--
-- Changes:
--   '911-0'  → '911-pre-a'   (1963–1965 pre-Series-A / 901 badging)
--   '911-f'  → '911-f-body'  (1966–1973 long-hood F-body era)
--
-- Approach: insert new rows, migrate FK children, delete old rows.
-- Safer than UPDATE on a PK with child FK references.
--
-- Child tables with FK → porsche_generations:
--   listings             (generation_id, ON DELETE SET NULL)
--   generation_editorial (generation_id, ON DELETE CASCADE)
-- =============================================================================

-- ── Step 1: Insert renamed rows ───────────────────────────────────────────────

INSERT INTO porsche_generations (
  generation_id, model, year_start, year_end,
  body_styles, engine_type, notes, model_family, production_count,
  production_years, engine_family, msrp_launch_usd, units_produced
)
SELECT
  '911-pre-a', model, year_start, year_end,
  body_styles, engine_type, notes, model_family, production_count,
  production_years, engine_family, msrp_launch_usd, units_produced
FROM porsche_generations
WHERE generation_id = '911-0'
ON CONFLICT (generation_id) DO NOTHING;

INSERT INTO porsche_generations (
  generation_id, model, year_start, year_end,
  body_styles, engine_type, notes, model_family, production_count,
  production_years, engine_family, msrp_launch_usd, units_produced
)
SELECT
  '911-f-body', model, year_start, year_end,
  body_styles, engine_type, notes, model_family, production_count,
  production_years, engine_family, msrp_launch_usd, units_produced
FROM porsche_generations
WHERE generation_id = '911-f'
ON CONFLICT (generation_id) DO NOTHING;

-- ── Step 2: Migrate listings FK references ─────────────────────────────────────

UPDATE listings SET generation_id = '911-pre-a'  WHERE generation_id = '911-0';
UPDATE listings SET generation_id = '911-f-body' WHERE generation_id = '911-f';

-- ── Step 3: Migrate generation_editorial FK references ────────────────────────
-- (ON DELETE CASCADE would handle this on DELETE, but moving first keeps
--  editorial content alive rather than cascading it away.)

UPDATE generation_editorial SET generation_id = '911-pre-a'  WHERE generation_id = '911-0';
UPDATE generation_editorial SET generation_id = '911-f-body' WHERE generation_id = '911-f';

-- ── Step 4: Remove old rows ───────────────────────────────────────────────────

DELETE FROM porsche_generations WHERE generation_id IN ('911-0', '911-f');

COMMIT;
