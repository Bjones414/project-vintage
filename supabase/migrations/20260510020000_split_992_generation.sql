BEGIN;

-- =============================================================================
-- Split the single '992' generation row into '992.1' (MY2020–2023) and
-- '992.2' (MY2024–present) to reflect the T-Hybrid refresh (Bug 3 fix).
--
-- factory-specs.ts already uses '992.1:...' compound keys — after this
-- migration the DB generation_id will match those keys.
--
-- Approach: insert two new rows, migrate FK children by year, delete old row.
-- =============================================================================

-- ── Step 1: Insert '992.1' (MY2020–2023) ──────────────────────────────────────

INSERT INTO porsche_generations (
  generation_id, model, year_start, year_end,
  body_styles, engine_type, notes, model_family, production_count,
  production_years, engine_family, msrp_launch_usd, units_produced
)
SELECT
  '992.1', model, year_start, 2023,
  body_styles, engine_type, notes, model_family, production_count,
  '2020–2023', engine_family, msrp_launch_usd, units_produced
FROM porsche_generations
WHERE generation_id = '992'
ON CONFLICT (generation_id) DO NOTHING;

-- ── Step 2: Insert '992.2' (MY2024–present, T-Hybrid refresh) ─────────────────

INSERT INTO porsche_generations (
  generation_id, model, year_start, year_end,
  body_styles, engine_type, notes, model_family, production_count,
  production_years, engine_family, msrp_launch_usd, units_produced
)
VALUES (
  '992.2', '911', 2024, NULL,
  ARRAY['Coupe', 'Cabriolet', 'Targa'],
  'Water-cooled',
  'Updated 992 with T-Hybrid powertrain (GTS and above): a 9A3 flat-six paired with an electric exhaust-gas turbocharger and an electric motor in the PDK housing producing 541 hp combined. All trims gain a fully digital 12.65-inch curved instrument cluster and revised exterior fascias.',
  '911', NULL,
  '2024–present',
  'T-Hybrid (9A3 + eTurbo + electric motor) / 9A2 Evo 3.0L twin-turbo (Carrera)',
  '$127,450–$260,000 (2025 MY Carrera to GTS T-Hybrid)',
  'Production ongoing'
)
ON CONFLICT (generation_id) DO NOTHING;

-- ── Step 3: Migrate listings FK references ─────────────────────────────────────
-- MY2024+ listings belong to 992.2; all others become 992.1.

UPDATE listings
SET generation_id = '992.2'
WHERE generation_id = '992' AND year >= 2024;

UPDATE listings
SET generation_id = '992.1'
WHERE generation_id = '992';

-- ── Step 4: Migrate generation_editorial ──────────────────────────────────────

UPDATE generation_editorial
SET generation_id = '992.1'
WHERE generation_id = '992';

-- ── Step 5: Update color_codes generation_applicability arrays ─────────────────
-- Replace '992' with '992.1' in the TEXT[] arrays.
-- Colors specific to 992.2 will be seeded in a future migration.

UPDATE porsche_color_codes
SET generation_applicability = array_replace(generation_applicability, '992', '992.1')
WHERE '992' = ANY(generation_applicability);

-- ── Step 6: Remove old '992' row ──────────────────────────────────────────────

DELETE FROM porsche_generations WHERE generation_id = '992';

COMMIT;
