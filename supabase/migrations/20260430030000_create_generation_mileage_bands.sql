-- =============================================================================
-- Comp Engine V2 — Phase 1, Step 4
-- Create generation_mileage_bands table.
-- Seed 993 bands (5 rows per spec) + default (mirrors 993).
--
-- ultra_low starts at 1000: 0-999 is museum/delivery cohort (Stage 3, not a band).
-- very_high has no upper bound: max_miles NULL.
--
-- RLS: public read. Service role write.
-- Apply: npx supabase db push
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS generation_mileage_bands (
  generation  TEXT     NOT NULL,
  band_name   TEXT     NOT NULL
    CONSTRAINT generation_mileage_bands_band_name_check
    CHECK (band_name IN ('ultra_low','low','moderate','high','very_high')),
  min_miles   INTEGER  NOT NULL,
  max_miles   INTEGER,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (generation, band_name)
);

COMMENT ON TABLE generation_mileage_bands IS
  'Per-generation mileage band thresholds. Same band_name across generations with different mile boundaries. Used by comp engine Stage 4 mileage_similarity factor.';

COMMENT ON COLUMN generation_mileage_bands.max_miles IS
  'Upper bound of band (inclusive). NULL for very_high (no upper limit).';

ALTER TABLE generation_mileage_bands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS generation_mileage_bands_public_read ON generation_mileage_bands;
CREATE POLICY generation_mileage_bands_public_read
  ON generation_mileage_bands FOR SELECT TO anon, authenticated USING (true);

GRANT SELECT ON generation_mileage_bands TO anon, authenticated;
GRANT ALL    ON generation_mileage_bands TO service_role;

-- ---------------------------------------------------------------------------
-- Seed: 993 bands per spec
-- Note: 0–999 miles = museum/delivery cohort handled separately in Stage 3.
-- ---------------------------------------------------------------------------

INSERT INTO generation_mileage_bands (generation, band_name, min_miles, max_miles, notes) VALUES
('993', 'ultra_low',  1000,   5000,   '1K–5K miles. Well-preserved low-mileage driver or stored example.'),
('993', 'low',        5000,   25000,  '5K–25K miles. Enthusiast-used, likely maintained.'),
('993', 'moderate',   25000,  75000,  '25K–75K miles. Normal use range for a car of this age.'),
('993', 'high',       75000,  125000, '75K–125K miles. Higher mileage; mechanical attention expected.'),
('993', 'very_high',  125000, NULL,   '125K+ miles. Heavily used; price sensitive to service records.')

ON CONFLICT (generation, band_name) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Seed: default = mirrors 993 (catch-all for generations without own config)
-- ---------------------------------------------------------------------------

INSERT INTO generation_mileage_bands (generation, band_name, min_miles, max_miles, notes)
SELECT 'default', band_name, min_miles, max_miles,
       'Default fallback = 993 bands. Applies to any generation without its own config.'
FROM   generation_mileage_bands
WHERE  generation = '993'

ON CONFLICT (generation, band_name) DO NOTHING;

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- DROP TABLE IF EXISTS generation_mileage_bands;
-- COMMIT;
