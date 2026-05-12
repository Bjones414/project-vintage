BEGIN;

-- ============================================================
-- Backfill generation_id on null-tagged Porsche listings.
--
-- Strategy: model ILIKE patterns + year range, ordered from
-- most-specific (generation prefix in model name) to least-
-- specific (year-range fallback).
--
-- Each UPDATE has a generation_id IS NULL guard — safe to re-run.
-- Race cars, non-scope models (912, 914/6, 917, 924, 928, 944,
-- 959, 968, 918, Carrera GT, RS61, Kremer, RUF) and pure
-- competition variants (Cup, RSR, RSR-17) are intentionally
-- left NULL — no applicable generation entry exists for them.
-- ============================================================

-- ─── 356 Sub-generations ─────────────────────────────────────

-- 356 A (1955–1959): match on letter suffix in model field
UPDATE listings SET generation_id = '356a'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '356 A %';

-- 356 B (1959–1963)
UPDATE listings SET generation_id = '356b'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '356 B %';

-- 356 C / SC (1963–1965)
-- "SC" is the final 356 C variant (Super Coupe), same chassis.
UPDATE listings SET generation_id = '356c'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND (model ILIKE '356 C %' OR model ILIKE '356 SC %');

-- Unlettered / Pre-A "356" by year (no suffix already matched above)
UPDATE listings SET generation_id = '356-pre-a'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '356%' AND year <= 1955;

UPDATE listings SET generation_id = '356a'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '356%' AND year BETWEEN 1956 AND 1959;

UPDATE listings SET generation_id = '356b'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '356%' AND year BETWEEN 1960 AND 1963;

UPDATE listings SET generation_id = '356c'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '356%' AND year BETWEEN 1964 AND 1965;


-- ─── 930 Turbo (1975–1989) ───────────────────────────────────
-- Assigned before generic 911 patterns to avoid collision.

UPDATE listings SET generation_id = '930'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND (model = '930' OR model ILIKE '930 %');


-- ─── 911 Early / Short-Wheelbase (1963–1965) ─────────────────

UPDATE listings SET generation_id = '911-0'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '911%' AND year BETWEEN 1963 AND 1965;


-- ─── 911 F-series / Long-hood (1966–1973) ────────────────────

UPDATE listings SET generation_id = '911-f'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '911%' AND year BETWEEN 1966 AND 1973
  AND model NOT ILIKE '%singer%'
  AND model NOT ILIKE '%reimagined%';


-- ─── G-series 2.7 Carrera (1974–1977, non-Turbo) ────────────
-- '930' pattern above already handles 1975+ Turbos.

UPDATE listings SET generation_id = 'g-series-2.7'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '911 Carrera 2.7%' AND year BETWEEN 1974 AND 1977;


-- ─── 911 SC (1978–1983) ──────────────────────────────────────

UPDATE listings SET generation_id = '911-sc'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '911 SC%';


-- ─── 911 Carrera 3.2 (1984–1989) ────────────────────────────
-- Includes the 1989 Speedster (Carrera 3.2 derivative).
-- "Turbo-Look" trim is a body package, not a turbocharged car.

UPDATE listings SET generation_id = '911-3.2-carrera'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND (
    model ILIKE '911 Carrera 3.2%'
    OR model ILIKE '911 Carrera Speedster%'
  ) AND year BETWEEN 1984 AND 1989;


-- ─── 964 (1989–1994) — including Singer coachbuilts on 964 base

UPDATE listings SET generation_id = '964'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND (
    -- All "964 ..." models except Carrera Cup (race car)
    (model ILIKE '964 %' AND model NOT ILIKE '%Carrera Cup%')
    -- Singer/Reimagined builds on 964-era chassis
    OR (model ILIKE '%singer%'     AND year BETWEEN 1989 AND 1994)
    OR (model ILIKE '%reimagined%' AND year BETWEEN 1989 AND 1994)
  );


-- ─── 993 (1994–1998) ─────────────────────────────────────────
-- Excludes Cup RSR (full competition car).

UPDATE listings SET generation_id = '993'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '993 %'
  AND model NOT ILIKE '%Cup RSR%';


-- ─── 996 (1999–2005) ─────────────────────────────────────────

UPDATE listings SET generation_id = '996.1'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '996 %' AND year BETWEEN 1999 AND 2001;

UPDATE listings SET generation_id = '996.2'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '996 %' AND year BETWEEN 2002 AND 2005;


-- ─── 997 (2005–2013) ─────────────────────────────────────────
-- Excludes RSR (factory race variant, separate market).

UPDATE listings SET generation_id = '997.1'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '997 %' AND year BETWEEN 2005 AND 2008
  AND model NOT ILIKE '%RSR%';

UPDATE listings SET generation_id = '997.2'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '997 %' AND year BETWEEN 2009 AND 2013
  AND model NOT ILIKE '%RSR%';

-- model='Carrera' (no generation prefix) — 2005 model year → 997.1
UPDATE listings SET generation_id = '997.1'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model = 'Carrera' AND year = 2005;


-- ─── 991.2 (2016–2019) ───────────────────────────────────────
-- Excludes GT3 Cup and GT2 RS Clubsport (competition-only).

UPDATE listings SET generation_id = '991.2'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND (
    -- "991 ..." prefix models (GT3 RS, GT2 RS, Speedster, etc.)
    (
      model ILIKE '991 %'
      AND year BETWEEN 2016 AND 2019
      AND model NOT ILIKE '%GT3 Cup%'
      AND model NOT ILIKE '%GT2 RS Clubsport%'
    )
    -- 911 R (2016 limited edition)
    OR (model = '911 R' AND year = 2016)
    -- 911 Speedster (2019 — 991.2 Speedster, not 3.2 Carrera)
    OR (model = '911 Speedster' AND year = 2019)
    -- 911 Turbo S Exclusive Series (2018)
    OR (model ILIKE '911 Turbo S%Exclusive%' AND year BETWEEN 2016 AND 2019)
  );


-- ─── 992 (2019–present) ──────────────────────────────────────

UPDATE listings SET generation_id = '992'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE '911 GT3%' AND year >= 2020;


-- ─── Cayman ──────────────────────────────────────────────────

UPDATE listings SET generation_id = '987.2-cayman'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE 'Cayman%' AND year BETWEEN 2009 AND 2012;

UPDATE listings SET generation_id = '981-cayman'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE 'Cayman%' AND year BETWEEN 2013 AND 2016;

UPDATE listings SET generation_id = '982-cayman'
WHERE make ILIKE 'Porsche' AND generation_id IS NULL
  AND model ILIKE 'Cayman%' AND year >= 2017;


-- ─── Post-run audit ──────────────────────────────────────────
-- Run the SELECT below manually to verify counts per generation.
-- SELECT generation_id, COUNT(*) AS cnt
-- FROM listings
-- WHERE make ILIKE 'Porsche' AND listing_status = 'sold'
-- GROUP BY generation_id
-- ORDER BY generation_id NULLS LAST;

COMMIT;
