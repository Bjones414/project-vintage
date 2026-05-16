BEGIN;

-- =============================================================================
-- Fix 991.2 / 992.1 generation boundary overlap.
--
-- Problem: 992.1.year_start inherited 2019 from the old '992' row, while
-- 991.2.year_end is also 2019. Both generations matched MY2019 911s, and
-- disambiguateTransition defaulted to "pick later" → every 2019 911 was
-- mislabeled 992.1. The 992 Targa did not launch until MY2021; 2019 911s
-- are unambiguously 991.2.
--
-- Fix: advance 992.1.year_start to 2020 so MY2019 belongs exclusively to 991.2.
-- Backfill: reclassify any listing already labeled 992.1 with model year 2019.
-- =============================================================================

-- ── Step 1: Fix the generation boundary ──────────────────────────────────────

UPDATE porsche_generations
SET year_start = 2020
WHERE generation_id = '992.1';

-- ── Step 2: Log backfill scope before applying ────────────────────────────────

DO $$
DECLARE
  backfill_count INT;
BEGIN
  SELECT COUNT(*) INTO backfill_count
  FROM listings
  WHERE generation_id = '992.1' AND year = 2019;
  RAISE NOTICE 'Backfill: % listing(s) with generation_id=''992.1'' and year=2019 will be corrected to ''991.2''', backfill_count;
END $$;

-- ── Step 3: Backfill mislabeled MY2019 listings ───────────────────────────────

UPDATE listings
SET generation_id = '991.2'
WHERE generation_id = '992.1' AND year = 2019;

-- ── Step 4: Confirm backfill — expect 0 remaining ────────────────────────────

DO $$
DECLARE
  remaining INT;
BEGIN
  SELECT COUNT(*) INTO remaining
  FROM listings
  WHERE generation_id = '992.1' AND year = 2019;
  RAISE NOTICE 'Post-backfill: % listing(s) remain with generation_id=''992.1'' and year=2019 (expect 0)', remaining;
END $$;

COMMIT;
