-- =============================================================================
-- Color codes: schema promotion + initial seed
--
-- Changes:
--   1. Add id UUID PK, make paint_code nullable + unique where non-null
--   2. Add source_note TEXT for editorial provenance
--   3. Seed common 993 factory colors (7 rows)
--   4. Seed common 992 factory colors (4 rows)
--
-- Sources: Porsche AG press data / Stuttcars 993 and 992 palette references.
-- NOT sourced from Rennbow (prohibited per product policy).
--
-- Reversible: yes — rollback statements at the bottom (commented out).
-- Apply: npx supabase db push (review before running)
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Structural changes to porsche_color_codes
--
-- paint_code was the sole PK (NOT NULL). We need to support colors with no
-- known paint code (e.g., Paint to Sample colors on 992 listings scraped
-- without codes), so we promote a UUID to PK and relax paint_code to nullable.
-- A partial unique index preserves uniqueness for non-null codes.
-- ---------------------------------------------------------------------------

ALTER TABLE porsche_color_codes
  ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();

-- Drop the existing PRIMARY KEY on paint_code (constraint name follows
-- PostgreSQL default: tablename_pkey).
ALTER TABLE porsche_color_codes
  DROP CONSTRAINT IF EXISTS porsche_color_codes_pkey;

-- paint_code no longer PK; allow NULL for colors without a known code.
ALTER TABLE porsche_color_codes
  ALTER COLUMN paint_code DROP NOT NULL;

-- Promote id to PRIMARY KEY.
ALTER TABLE porsche_color_codes
  ADD PRIMARY KEY (id);

-- Non-null paint codes must still be unique.
CREATE UNIQUE INDEX IF NOT EXISTS porsche_color_codes_paint_code_unique
  ON porsche_color_codes (paint_code)
  WHERE paint_code IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 2. source_note column
-- ---------------------------------------------------------------------------

ALTER TABLE porsche_color_codes
  ADD COLUMN IF NOT EXISTS source_note TEXT;

COMMENT ON COLUMN porsche_color_codes.source_note IS
  'Free-text provenance for this color record — publication, edition, or dataset used to verify the code and rarity.';

-- ---------------------------------------------------------------------------
-- 3. Seed — 993 factory colors
--    Source: Porsche AG press data; Stuttcars 993 palette reference
--    generation_applicability scoped to '993'; Guards Red and Black carry
--    across multiple generations and are seeded once with a wide applicability
--    array to avoid duplicate paint codes.
-- ---------------------------------------------------------------------------

INSERT INTO porsche_color_codes
  (color_name, paint_code, color_family, finish_type, generation_applicability,
   rarity, is_special_order, source_note, content_status)
VALUES
  -- Arctic Silver Metallic — flagship 993 silver; the most common specification
  ('Arctic Silver Metallic', '92U', 'Silver', 'Metallic', ARRAY['993'],
   'common', false,
   'Porsche AG press data; Stuttcars 993 palette reference',
   'published'),

  -- Polar Silver Metallic — earlier 993 silver variant
  ('Polar Silver Metallic', '92A', 'Silver', 'Metallic', ARRAY['993'],
   'common', false,
   'Porsche AG press data; Stuttcars 993 palette reference',
   'published'),

  -- Midnight Blue Metallic
  ('Midnight Blue Metallic', '39J', 'Blue', 'Metallic', ARRAY['993'],
   'common', false,
   'Porsche AG press data; Stuttcars 993 palette reference',
   'published'),

  -- Speed Yellow — desirable but produced in smaller numbers
  ('Speed Yellow', '10U', 'Yellow', 'Solid', ARRAY['993', '964'],
   'rare', false,
   'Porsche AG press data; Stuttcars 993 palette reference',
   'published'),

  -- Riviera Blue — sought-after 993 color
  ('Riviera Blue', '38G', 'Blue', 'Solid', ARRAY['993'],
   'rare', false,
   'Porsche AG press data; Stuttcars 993 palette reference',
   'published'),

  -- Guards Red — standard production across the air-cooled and water-cooled eras
  ('Guards Red', '80K', 'Red', 'Solid',
   ARRAY['993', '964', '996.1', '996.2', '997.1', '997.2', '991.1', '991.2', '992'],
   'common', false,
   'Porsche AG press data; standard production colour across multiple generations',
   'published'),

  -- Black — standard production across all generations
  ('Black', '700', 'Black', 'Solid',
   ARRAY['930', '964', '993', '996.1', '996.2', '997.1', '997.2',
         '991.1', '991.2', '992', '982-cayman', '982-boxster'],
   'common', false,
   'Porsche AG press data; standard production colour across all generations',
   'published');

-- ---------------------------------------------------------------------------
-- 4. Seed — 992 factory colors
--    Source: Porsche AG press data
-- ---------------------------------------------------------------------------

INSERT INTO porsche_color_codes
  (color_name, paint_code, color_family, finish_type, generation_applicability,
   rarity, is_special_order, source_note, content_status)
VALUES
  -- GT Silver Metallic — predominant 992-era silver
  ('GT Silver Metallic', 'M7Z', 'Silver', 'Metallic', ARRAY['992', '991.1', '991.2'],
   'common', false,
   'Porsche AG press data; standard production colour',
   'published'),

  -- Carrara White Metallic
  ('Carrara White Metallic', 'D9A', 'White', 'Metallic', ARRAY['992', '991.1', '991.2'],
   'common', false,
   'Porsche AG press data; standard production colour',
   'published'),

  -- Chalk — distinctive matte-adjacent finish; notable for its rarity
  ('Chalk', 'E3', 'White', 'Solid', ARRAY['992', '991.2'],
   'uncommon', false,
   'Porsche AG press data; limited availability standard colour',
   'published'),

  -- Python Green — Paint to Sample; no universal code (PTS assignment varies)
  ('Python Green', NULL, 'Green', 'Solid', ARRAY['992'],
   'rare', true,
   'Porsche AG press data; Paint to Sample (PTS) colour for 992 generation',
   'published');

COMMIT;


-- =============================================================================
-- DOWN / ROLLBACK
-- Do not apply automatically. Review before executing.
-- =============================================================================

-- BEGIN;
--
-- -- Remove seed rows
-- DELETE FROM porsche_color_codes
--  WHERE source_note LIKE 'Porsche AG press data%';
--
-- -- Remove source_note
-- ALTER TABLE porsche_color_codes DROP COLUMN IF EXISTS source_note;
--
-- -- Restore paint_code as PK (requires all rows to have a non-null paint_code)
-- -- NOTE: rows with NULL paint_code must be removed first.
-- DROP INDEX IF EXISTS porsche_color_codes_paint_code_unique;
-- ALTER TABLE porsche_color_codes DROP CONSTRAINT IF EXISTS porsche_color_codes_pkey;
-- ALTER TABLE porsche_color_codes ALTER COLUMN paint_code SET NOT NULL;
-- ALTER TABLE porsche_color_codes ADD PRIMARY KEY (paint_code);
-- ALTER TABLE porsche_color_codes DROP COLUMN IF EXISTS id;
--
-- COMMIT;
