BEGIN;

-- =============================================================================
-- Backfill trim_category = 'coachbuilt' and 'limited' for existing listings.
--
-- Only sets trim_category where it is currently NULL — does not overwrite
-- existing values. Coachbuilt is evaluated first; a Singer Sport Classic
-- is coachbuilt, not limited.
--
-- Patterns match the deriveTrimCategory() logic in scrapers/normalize.ts.
-- Tested on: listings.trim column (title not stored separately in the DB).
-- =============================================================================

-- ── Coachbuilt: third-party heavily-modified builds ────────────────────────

UPDATE listings
SET trim_category = 'coachbuilt'
WHERE make ILIKE 'Porsche'
  AND trim_category IS NULL
  AND (
    trim ILIKE '%singer%'
    OR trim ILIKE '%ruf%'
    OR trim ILIKE '%workshop 5001%'
    OR trim ILIKE '%workshop5001%'
    OR trim ILIKE '%magnus walker%'
    OR trim ILIKE '%magnus-walker%'
    OR trim ILIKE '%outlaw%'
    OR trim ILIKE '%restomod%'
    OR trim ILIKE '%restoration mod%'
    OR trim ILIKE '%restoration-mod%'
  );

-- ── Limited: factory limited-edition variants (production < ~2000 units) ──
-- Evaluated after coachbuilt so coachbuilt takes precedence on overlap.
-- "911 R" is matched conservatively: the trim field must contain the
-- exact string "911 R" or be exactly "R" (auction trim for the 2016 model).

UPDATE listings
SET trim_category = 'limited'
WHERE make ILIKE 'Porsche'
  AND trim_category IS NULL
  AND (
    trim ILIKE '%sport classic%'
    OR trim ILIKE '%anniversary%'
    OR trim ILIKE '%911 R%'
    OR trim = 'R'
    OR trim ILIKE '%speedster%'
    OR trim ILIKE '%dakar%'
    OR trim ILIKE '%clubsport%'
    OR trim ILIKE '%club sport%'
    OR trim ILIKE '%salzburg%'
    OR trim ILIKE '%heritage design%'
    OR trim ILIKE '%heritage edition%'
  );

-- ── Report counts (informational — review after applying) ─────────────────

-- SELECT trim_category, COUNT(*) FROM listings
-- WHERE make ILIKE 'Porsche'
--   AND trim_category IN ('coachbuilt', 'limited')
-- GROUP BY trim_category;

COMMIT;
