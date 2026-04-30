-- =============================================================================
-- Comp Engine V2 — Phase 1, Step 2
-- Create trim_taxonomy table and seed 993 generation (16 rows).
--
-- is_separate_market = true for motorsport homologations (RS, GT2, Speedster, Cup).
-- is_separate_market = false for factory variants that comp within the same family.
-- See decision D7: turbo_s is_separate_market = false.
--
-- RLS: public read (reference data). Service role write.
-- Apply: npx supabase db push
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS trim_taxonomy (
  generation       TEXT NOT NULL,
  trim_category    TEXT NOT NULL,
  display_name     TEXT NOT NULL,
  production_total INTEGER,
  is_separate_market BOOLEAN NOT NULL DEFAULT false,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (generation, trim_category)
);

COMMENT ON TABLE trim_taxonomy IS
  'Editorial mapping of generation × trim_category. Controls hard-filter behavior (is_separate_market) and display names.';

COMMENT ON COLUMN trim_taxonomy.is_separate_market IS
  'When true, cars of this trim only comp against same trim_category — never blended into broader gen pool. RS, GT2, Speedster, Cup homologations = true.';

ALTER TABLE trim_taxonomy ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS trim_taxonomy_public_read ON trim_taxonomy;
CREATE POLICY trim_taxonomy_public_read
  ON trim_taxonomy FOR SELECT TO anon, authenticated USING (true);

GRANT SELECT ON trim_taxonomy TO anon, authenticated;
GRANT ALL    ON trim_taxonomy TO service_role;

-- ---------------------------------------------------------------------------
-- Seed: 993 generation (16 rows per spec)
-- ---------------------------------------------------------------------------

INSERT INTO trim_taxonomy (generation, trim_category, display_name, production_total, is_separate_market, notes) VALUES

-- Narrow-body Carreras (standard market, comp within family)
('993', 'carrera_2_narrow',   '993 Carrera 2',           NULL,   false,
  'RWD narrow-body Carrera. The most common 993. Comps broadly within carrera_2_narrow.'),

('993', 'carrera_4_narrow',   '993 Carrera 4',           NULL,   false,
  'AWD narrow-body Carrera. Slight market discount vs C2 historically.'),

-- Wide-body Carreras (standard market, comp within family)
('993', 'carrera_s_wide',     '993 Carrera S',           NULL,   false,
  'RWD wide-body Carrera. Turbo body without turbo engine. Introduced 1997 MY.'),

('993', 'carrera_4s_wide',    '993 Carrera 4S',          NULL,   false,
  'AWD wide-body Carrera. Turbo body, AWD drivetrain. Introduced 1996 MY.'),

-- Targa (separate body style but same trim family as narrow Carreras)
('993', 'targa',              '993 Targa',               NULL,   false,
  'Fixed roll hoop with sliding glass roof. Comps to other Targa units; body_style filter handles the separation.'),

-- Turbo family (higher tier, but comps within turbo family)
('993', 'turbo_base',         '993 Turbo',               NULL,   false,
  'Standard 993 Turbo, 408 hp. Widebody, AWD. No X50 kit.'),

('993', 'turbo_x50',          '993 Turbo with X50',      NULL,   false,
  '993 Turbo with factory M637 X50 performance package, 450 hp. Commands premium over turbo_base.'),

('993', 'turbo_s',            '993 Turbo S',             345,    false,
  'US-market Turbo with additional factory equipment. Factory S designation. See decision D7.'),

-- Motorsport homologations — separate market, never blend
('993', 'rs_touring',         '993 Carrera RS Touring',  1956,   true,
  'Road-going RS variant, lighter and sportier. Street-legal focus. Separate comp pool.'),

('993', 'rs_clubsport',       '993 Carrera RS Clubsport', 227,   true,
  'Track-focused RS, lighter still. Predominantly European. Separate comp pool.'),

('993', 'gt2',                '993 GT2',                 57,     true,
  'Rear-wheel-drive Turbo-based race homologation. Extremely rare. Separate comp pool.'),

('993', 'gt2_evo',            '993 GT2 Evo',             NULL,   true,
  'Factory-evolved GT2 race car. Near-unique. Separate comp pool.'),

('993', 'speedster',          '993 Speedster',           1926,   true,
  'Limited production open-top variant. Lower windscreen, no convertible top mechanism. Separate comp pool.'),

('993', 'cup',                '993 Cup',                 NULL,   true,
  'Porsche Supercup / national series race car. Not road-legal. Separate comp pool.'),

('993', 'supercup',           '993 Supercup',            NULL,   true,
  'International Porsche Supercup specification. Higher spec than national Cup. Separate comp pool.'),

-- Factory special order body (wide body kit, not a full model line)
('993', 'turbo_look_m491',    '993 Carrera Turbo-Look (M491)', NULL, false,
  'Factory M491 Turbo-Look option: wide body on a Carrera. Not a true Turbo. Comps to wide-body Carreras.')

ON CONFLICT (generation, trim_category) DO NOTHING;

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- DROP TABLE IF EXISTS trim_taxonomy;
-- COMMIT;
