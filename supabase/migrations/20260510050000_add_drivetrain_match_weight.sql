-- ============================================================
-- Add drivetrain_match factor to generation_weight_config.
--
-- Weight: 0.05 across all generations (mirrors transmission_variant_match).
-- The hard filter already separates C2/C4 when trim_category is known;
-- this factor ranks same-drivetrain comps higher within a pool when
-- trim_category is null on either side.
-- ============================================================

INSERT INTO generation_weight_config (generation, factor_name, weight, notes) VALUES
('993',     'drivetrain_match', 0.050, 'RWD vs AWD soft signal. Hard filter handles C2/C4 split when trim_category is known.'),
('996.1',   'drivetrain_match', 0.050, 'RWD vs AWD soft signal.'),
('default', 'drivetrain_match', 0.050, 'RWD vs AWD soft signal. Applies to all generations without their own config (e.g. 964, 997, 991, 992).')

ON CONFLICT (generation, factor_name) DO NOTHING;
