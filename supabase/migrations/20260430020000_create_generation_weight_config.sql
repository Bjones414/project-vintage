-- =============================================================================
-- Comp Engine V2 — Phase 1, Step 3
-- Create generation_weight_config table.
-- Seed V1 weights for: 993, 996.1 (spec's 996_1), default.
--
-- Decision D9: using '993', '996.1', 'default' to match porsche_generations
-- generation_id values (dot notation, not underscore).
--
-- Weights per spec. Do NOT change seed values — leave V1 exactly as spec'd.
-- future tuning happens via new rows or explicit UPDATE after backtesting.
--
-- RLS: public read. Service role write.
-- Apply: npx supabase db push
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS generation_weight_config (
  generation   TEXT    NOT NULL,
  factor_name  TEXT    NOT NULL,
  weight       NUMERIC(4,3) NOT NULL
    CONSTRAINT generation_weight_config_weight_range
    CHECK (weight >= 0 AND weight <= 1),
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (generation, factor_name)
);

COMMENT ON TABLE generation_weight_config IS
  'Per-generation similarity factor weights for V2 comp engine. Loaded at prediction time. Use "default" generation as catch-all fallback.';

COMMENT ON COLUMN generation_weight_config.factor_name IS
  'One of: mileage_similarity | condition_stub | year_similarity | trim_variant_match | market_region_match | spec_composite | transmission_variant_match | color_rarity | consignor_tier_match | mechanical_remediation_status';

ALTER TABLE generation_weight_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS generation_weight_config_public_read ON generation_weight_config;
CREATE POLICY generation_weight_config_public_read
  ON generation_weight_config FOR SELECT TO anon, authenticated USING (true);

GRANT SELECT ON generation_weight_config TO anon, authenticated;
GRANT ALL    ON generation_weight_config TO service_role;

-- ---------------------------------------------------------------------------
-- Seed: 993 V1 weights (from spec Stage 4)
-- mechanical_remediation_status = 0.00 (not applicable for 993)
-- ---------------------------------------------------------------------------

INSERT INTO generation_weight_config (generation, factor_name, weight, notes) VALUES
('993', 'mileage_similarity',          0.300, 'Primary driver. Band-based, generation-relative via generation_mileage_bands.'),
('993', 'condition_stub',              0.150, 'V1 observable signals: paint thickness, accident history, photo count, featured. Phase 2 replaces with AI-extracted condition_signal.'),
('993', 'year_similarity',             0.100, 'Same year → 1.0; ±1 → 0.85; ±2 → 0.6; ±3 → 0.4; beyond → 0.'),
('993', 'trim_variant_match',          0.100, 'Exact match → 1.0; mismatch within same trim_category → 0.7.'),
('993', 'market_region_match',         0.100, 'Same region → 1.0; different → 0.4.'),
('993', 'spec_composite',              0.100, 'PTS (0.40) + seats_type (0.30) + wheels_factory_correct (0.30). Unknown → 0.5.'),
('993', 'transmission_variant_match',  0.050, 'Same → 1.0; different → 0.7.'),
('993', 'color_rarity',                0.050, 'common↔common → 1.0; special↔special → 1.0; mismatch → 0.6.'),
('993', 'consignor_tier_match',        0.050, 'Same consignor_type → 1.0; different → 0.7.'),
('993', 'mechanical_remediation_status', 0.000, 'Not applicable for 993 (air-cooled). Weight 0 = factor skipped entirely.')

ON CONFLICT (generation, factor_name) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Seed: 996.1 V1 weights (build but not used until 996 corpus exists)
-- Note: spec uses '996_1' notation; using '996.1' per D9 to match porsche_generations
-- ---------------------------------------------------------------------------

INSERT INTO generation_weight_config (generation, factor_name, weight, notes) VALUES
('996.1', 'mileage_similarity',          0.250, 'Still primary but slightly less dominant than 993 due to IMS/RMS importance.'),
('996.1', 'condition_stub',              0.150, 'V1 observable signals.'),
('996.1', 'mechanical_remediation_status', 0.150, 'IMS/RMS/bore scoring remediation is a major value driver for 996.1.'),
('996.1', 'transmission_variant_match',  0.150, 'Manual vs Tiptronic is a large price delta for 996; elevated weight.'),
('996.1', 'year_similarity',             0.100, 'Same as 993 tier.'),
('996.1', 'spec_composite',              0.100, 'PTS/seats/wheels composite.'),
('996.1', 'color_rarity',                0.050, 'Color rarity / PTS.'),
('996.1', 'consignor_tier_match',        0.050, 'Consignor tier.'),
-- Factors present in 993 not listed for 996.1 in spec — set to 0
('996.1', 'trim_variant_match',          0.000, 'Not listed in 996.1 spec weights. Set 0 until 996.1 corpus validates.'),
('996.1', 'market_region_match',         0.000, 'Not listed in 996.1 spec weights. Set 0 until 996.1 corpus validates.')

ON CONFLICT (generation, factor_name) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Seed: default (catch-all fallback = mirrors 993 weights per spec)
-- ---------------------------------------------------------------------------

INSERT INTO generation_weight_config (generation, factor_name, weight, notes)
SELECT 'default', factor_name, weight,
       'Default fallback = 993 V1 weights. Applies to any generation without its own config.'
FROM   generation_weight_config
WHERE  generation = '993'

ON CONFLICT (generation, factor_name) DO NOTHING;

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- DROP TABLE IF EXISTS generation_weight_config;
-- COMMIT;
