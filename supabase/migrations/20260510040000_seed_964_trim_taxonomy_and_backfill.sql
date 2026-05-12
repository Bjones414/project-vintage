-- ============================================================
-- Seed 964 trim_taxonomy and backfill trim_category
-- for existing 964 listings.
--
-- Follows the 993 taxonomy pattern: generation-specific
-- category names that reflect the collector market segments
-- for this generation.
--
-- is_separate_market = true means: when a subject is in
-- this category, the engine will only accept comps that
-- are ALSO in the same category (extra isolation gate).
-- Used for rare/collectible variants whose prices are
-- fundamentally uncorrelated with base Carrera prices.
-- ============================================================

-- ─── 964 Trim Taxonomy ──────────────────────────────────────────────────────

INSERT INTO trim_taxonomy (generation, trim_category, is_separate_market)
VALUES
  ('964', 'carrera_2_narrow', false),   -- Carrera 2 (RWD, any body style)
  ('964', 'carrera_4_narrow', false),   -- Carrera 4 (AWD, any body style)
  ('964', 'targa',            false),   -- Targa (semi-open top)
  ('964', 'rs_america',       false),   -- RS America (US-market lightweight base)
  ('964', 'rs_lightweight',   true),    -- Carrera RS, S Lightweight (homologation)
  ('964', 'turbo_base',       false),   -- Turbo 3.6 (base turbo)
  ('964', 'turbo_s',          false),   -- Turbo S, Turbo S X85, Turbo S Lightweight
  ('964', 'speedster',        true),    -- 964 Speedster (rare body variant)
  ('964', 'singer',           true)     -- Reimagined by Singer, Singer restomod builds
ON CONFLICT (generation, trim_category) DO NOTHING;

-- ─── Backfill trim_category for existing 964 listings ───────────────────────
-- Applies derivation logic in priority order. Only updates rows where
-- trim_category IS NULL and trim IS NOT NULL to avoid overwriting curated values.
-- Uses PostgreSQL POSIX regex (~*) for case-insensitive matching.
-- \y is the POSIX word-boundary anchor (PostgreSQL equivalent of \b).

UPDATE listings
SET trim_category = CASE
  -- Singer / restomod builds (must precede all other checks)
  WHEN trim ~* 'singer|reimagined'                           THEN 'singer'

  -- Speedster
  WHEN trim ~* 'speedster'                                   THEN 'speedster'

  -- Turbo S before base Turbo
  WHEN trim ~* 'turbo s'                                     THEN 'turbo_s'
  WHEN trim ~* 'turbo'                                       THEN 'turbo_base'

  -- RS America (must precede general RS check)
  WHEN trim ~* 'rs america'                                  THEN 'rs_america'

  -- Homologation RS / Leichtbau: Carrera RS, S Lightweight, RS N/GT
  WHEN trim ~* '\yrs\y|lightweight|leichtbau'                THEN 'rs_lightweight'

  -- Targa (semi-open top)
  WHEN trim ~* 'targa'                                       THEN 'targa'

  -- Cabriolet/convertible variants — comp within trim line, body_style filter separates
  WHEN trim ~* 'carrera 4.*(cabriolet|convertible|cabrio)'   THEN 'carrera_4_narrow'
  WHEN trim ~* 'cabriolet|convertible|cabrio'                THEN 'carrera_2_narrow'

  -- Base coupe variants
  WHEN trim ~* 'carrera 4'                                   THEN 'carrera_4_narrow'
  WHEN trim ~* 'carrera 2|carrera'                           THEN 'carrera_2_narrow'

  ELSE NULL
END
WHERE generation_id = '964'
  AND trim_category IS NULL
  AND trim IS NOT NULL;
