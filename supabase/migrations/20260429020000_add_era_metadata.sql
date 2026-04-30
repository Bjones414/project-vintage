BEGIN;

-- Add verifiable public-record metadata columns to porsche_generations.
-- All TEXT and nullable — flexibility for marque expansion and partial data.
ALTER TABLE porsche_generations
  ADD COLUMN IF NOT EXISTS production_years TEXT,
  ADD COLUMN IF NOT EXISTS engine_family     TEXT,
  ADD COLUMN IF NOT EXISTS msrp_launch_usd   TEXT,
  ADD COLUMN IF NOT EXISTS units_produced    TEXT;

-- Seed 993 (last air-cooled 911, 1995–1998)
UPDATE porsche_generations SET
  production_years = '1995–1998',
  engine_family    = 'M64 air-cooled flat-six, 3.6L',
  msrp_launch_usd  = '$63,750–$105,000 (1995 Carrera to 1996 Turbo)',
  units_produced   = '~67,000 worldwide'
WHERE generation_id = '993';

-- Seed 992 (current 911, 2019–present)
UPDATE porsche_generations SET
  production_years = '2019–present',
  engine_family    = 'Twin-turbo flat-six, 3.0L–4.0L',
  msrp_launch_usd  = '$98,000–$240,000 (Carrera to Turbo S)',
  units_produced   = 'Production ongoing'
WHERE generation_id = '992';

COMMIT;
