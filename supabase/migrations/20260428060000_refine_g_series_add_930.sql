BEGIN;

-- =============================================================================
-- Phase 4, Task 2 (revision): Refine G-series + add 930 Turbo
--
-- Changes:
--   1. Remove monolithic '911-g' row (1974–1989); replaced by three rows below.
--   2. Add '930' — air-cooled Turbo era, distinct collector market.
--   3. Add 'g-series-2.7'     (1974–1977)  impact-bumper 2.7/3.0 Carrera
--   4. Add '911-sc'           (1978–1983)  Super Carrera 3.0
--   5. Add '911-3.2-carrera'  (1984–1989)  Carrera 3.2 / Bosch Motronic
--
-- Delete is safe: zero option_code, editorial, and listing FK references.
-- INSERT uses ON CONFLICT so the migration is safely re-runnable.
-- =============================================================================

-- Remove the monolithic G-series row being replaced by three distinct generations.
-- No FK children exist; DELETE is a no-op on re-run (row will already be gone).
DELETE FROM porsche_generations WHERE generation_id = '911-g';

INSERT INTO porsche_generations (
  generation_id,
  model,
  year_start,
  year_end,
  body_styles,
  engine_type,
  notes,
  model_family,
  production_count
)
VALUES

  -- 930: air-cooled Turbo (parallel to the G-series Carrera lineage)
  (
    '930', '911', 1975, 1989,
    ARRAY['Coupe', 'Targa', 'Cabriolet'],
    'Air-cooled',
    'First production turbocharged 911. 3.0-litre initially; revised to 3.3-litre with intercooler for 1978 MY — the definitive performance variant. Iconic whale-tail (3.0) and tea-tray (3.3) rear spoilers. Factory Slantnose (Flachbau, M505) is rare and commands a significant premium. Turbo Cabriolet available from 1988 MY. Trades in a distinct collector market from the contemporary Carrera.',
    '911', NULL
  ),

  -- G-series 2.7 / early impact-bumper era
  (
    'g-series-2.7', '911', 1974, 1977,
    ARRAY['Coupe', 'Targa'],
    'Air-cooled',
    'First G-series 911s; introduced impact bumpers to meet US Federal regulations. Engine range spans the 2.7 CIS (base, S) and Carrera 2.7/3.0 in performance trim. Early 2.7 engines are susceptible to heat exchanger cracking; a known inspection point on any survivor.',
    '911', NULL
  ),

  -- 911 SC: Super Carrera 3.0
  (
    '911-sc', '911', 1978, 1983,
    ARRAY['Coupe', 'Targa', 'Cabriolet'],
    'Air-cooled',
    'Super Carrera; single unified 3.0-litre engine replacing the fragmented 2.7/3.0 range. Widely regarded as the most reliable air-cooled 911 and the recommended first purchase for that reason. Cabriolet introduced for 1983 MY and is a collector favourite.',
    '911', NULL
  ),

  -- 911 Carrera 3.2: the definitive G-series
  (
    '911-3.2-carrera', '911', 1984, 1989,
    ARRAY['Coupe', 'Targa', 'Cabriolet', 'Speedster'],
    'Air-cooled',
    'The definitive G-series 911; Bosch Motronic injection and 3.2-litre engine producing 231 hp. Club Sport (1988 MY) is the lightweight, stripped driver variant. M491 Turbo Look — wide Turbo body, brakes, and suspension — is the most desirable option package. The 1989 Speedster (~2,100 built) is the generation send-off.',
    '911', NULL
  )

ON CONFLICT (generation_id) DO UPDATE SET
  model            = EXCLUDED.model,
  year_start       = EXCLUDED.year_start,
  year_end         = EXCLUDED.year_end,
  body_styles      = EXCLUDED.body_styles,
  engine_type      = EXCLUDED.engine_type,
  notes            = COALESCE(porsche_generations.notes, EXCLUDED.notes),
  model_family     = COALESCE(porsche_generations.model_family, EXCLUDED.model_family),
  production_count = COALESCE(porsche_generations.production_count, EXCLUDED.production_count),
  updated_at       = now();

COMMIT;
