BEGIN;

-- =============================================================================
-- Fix three year boundaries to align with US-market convention (BaT / MY basis)
--
--   996.1  year_start: 1998 → 1999  (US deliveries began MY 1999)
--   991.1  year_start: 2012 → 2013  (US deliveries began MY 2013)
--   95b    year_end:   2023 → 2024  (gas Macan sold in US through MY 2024)
-- =============================================================================

UPDATE porsche_generations
SET year_start = 1999, updated_at = now()
WHERE generation_id = '996.1' AND year_start IS DISTINCT FROM 1999;

UPDATE porsche_generations
SET year_start = 2013, updated_at = now()
WHERE generation_id = '991.1' AND year_start IS DISTINCT FROM 2013;

UPDATE porsche_generations
SET year_end = 2024, updated_at = now()
WHERE generation_id = '95b' AND year_end IS DISTINCT FROM 2024;

COMMIT;
