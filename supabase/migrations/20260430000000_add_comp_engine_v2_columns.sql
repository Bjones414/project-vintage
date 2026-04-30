-- =============================================================================
-- Comp Engine V2 — Phase 1, Step 1
-- Add all new listings columns from spec. Skip columns that already exist.
-- Also updates three CHECK constraints from last night's run to match spec values.
--
-- Decisions (see docs/comp-engine-v2-decisions.md):
--   D1:  comments_count → use existing comment_count, not added here
--   D2:  documentation_score already exists; left as is
--   D3:  market_region added alongside country_of_sale (different granularity)
--   D4:  No CHECK constraints added to body_style / drivetrain
--   D8:  owner_count_stated added alongside existing owner_count
--   D12: generation TEXT not constrained to enum
--
-- CHECK constraint updates (all safe: all values currently NULL):
--   condition_signal: add 'unknown'
--   interior_signal: change values to spec (original/restored/modified/unknown)
--   mod_status: add 'period_correct_enhanced'
--
-- All new columns nullable. Apply: npx supabase db push
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- UPDATE EXISTING CHECK CONSTRAINTS
-- Drop old constraints, add new ones matching spec.
-- All values in these columns are currently NULL — safe to change.
-- ---------------------------------------------------------------------------

ALTER TABLE listings
  DROP CONSTRAINT IF EXISTS listings_condition_signal_check;
ALTER TABLE listings
  ADD CONSTRAINT listings_condition_signal_check
  CHECK (condition_signal IN ('concours','excellent','good','driver','project','unknown'));

ALTER TABLE listings
  DROP CONSTRAINT IF EXISTS listings_interior_signal_check;
ALTER TABLE listings
  ADD CONSTRAINT listings_interior_signal_check
  CHECK (interior_signal IN ('original','restored','modified','unknown'));

ALTER TABLE listings
  DROP CONSTRAINT IF EXISTS listings_mod_status_check;
ALTER TABLE listings
  ADD CONSTRAINT listings_mod_status_check
  CHECK (mod_status IN ('stock','light_reversible','heavy','period_correct_enhanced','unknown'));

-- ---------------------------------------------------------------------------
-- TAXONOMY & SPEC (V1 critical)
-- ---------------------------------------------------------------------------

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS trim_variant          TEXT,
  ADD COLUMN IF NOT EXISTS market_region         TEXT
    CONSTRAINT listings_market_region_check
    CHECK (market_region IN ('us','euro','row','japan')),
  ADD COLUMN IF NOT EXISTS is_federalized_import BOOLEAN,
  ADD COLUMN IF NOT EXISTS steering_side         TEXT
    CONSTRAINT listings_steering_side_check
    CHECK (steering_side IN ('lhd','rhd'));

COMMENT ON COLUMN listings.trim_variant IS
  'Free-form sub-trim within trim_category. E.g., g50_21 for a specific gearbox spec.';
COMMENT ON COLUMN listings.market_region IS
  'Coarse market region: us | euro | row | japan. Distinct from country_of_sale (ISO alpha-2).';
COMMENT ON COLUMN listings.is_federalized_import IS
  'True when a Euro/ROW car has been federalized for US road use.';
COMMENT ON COLUMN listings.steering_side IS
  'lhd (left-hand drive) | rhd (right-hand drive).';

-- ---------------------------------------------------------------------------
-- MECHANICAL / CONFIGURATION
-- ---------------------------------------------------------------------------

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS transmission_variant  TEXT,
  ADD COLUMN IF NOT EXISTS interior_color_rarity TEXT
    CONSTRAINT listings_interior_color_rarity_check
    CHECK (interior_color_rarity IN ('common','special_order','unknown')),
  ADD COLUMN IF NOT EXISTS seats_type            TEXT
    CONSTRAINT listings_seats_type_check
    CHECK (seats_type IN ('standard','sport','lightweight_bucket','unknown')),
  ADD COLUMN IF NOT EXISTS wheels_factory_correct BOOLEAN,
  ADD COLUMN IF NOT EXISTS delete_options        TEXT[];

COMMENT ON COLUMN listings.transmission_variant IS
  'Specific gearbox variant. E.g., g50_21_5spd, g50_21_6spd, tiptronic_s, pdk. Generation-specific.';
COMMENT ON COLUMN listings.interior_color_rarity IS
  'common | special_order | unknown. Used in color_rarity factor.';
COMMENT ON COLUMN listings.seats_type IS
  'standard | sport | lightweight_bucket | unknown. Used in spec_composite factor.';
COMMENT ON COLUMN listings.wheels_factory_correct IS
  'True when wheels match factory spec for this generation/trim. Used in spec_composite factor.';
COMMENT ON COLUMN listings.delete_options IS
  'Array of factory delete options ordered. E.g., [sunroof_delete, ac_delete, radio_delete].';

-- ---------------------------------------------------------------------------
-- V1 CONDITION STUB INPUTS (observable from BaT, no AI extraction needed)
-- V1 populates accident_history_stated and owner_count_stated via regex over raw_description.
-- ---------------------------------------------------------------------------

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS paint_meter_max_microns INTEGER,
  ADD COLUMN IF NOT EXISTS accident_history_stated TEXT
    CONSTRAINT listings_accident_history_stated_check
    CHECK (accident_history_stated IN ('none_stated','minor_stated','major_stated','unknown')),
  ADD COLUMN IF NOT EXISTS listing_photo_count    INTEGER,
  ADD COLUMN IF NOT EXISTS is_featured_listing    BOOLEAN,
  ADD COLUMN IF NOT EXISTS owner_count_stated     INTEGER;

COMMENT ON COLUMN listings.paint_meter_max_microns IS
  'Maximum paint thickness reading (µm). <150 = likely original, >300 = likely repainted.';
COMMENT ON COLUMN listings.accident_history_stated IS
  'V1: set by regex over raw_description. Phase 2: AI extraction.';
COMMENT ON COLUMN listings.listing_photo_count IS
  'Number of photos in the auction listing. Used in V1 condition stub photo_score.';
COMMENT ON COLUMN listings.is_featured_listing IS
  'True when BaT marked this as a featured/curated listing. Premium signal for condition_stub.';
COMMENT ON COLUMN listings.owner_count_stated IS
  'Number of prior owners as stated in listing text. V1: regex extraction. Phase 2: AI extraction.';

-- ---------------------------------------------------------------------------
-- GENERATION-SPECIFIC MECHANICAL RISK
-- ---------------------------------------------------------------------------

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS mechanical_remediation_status TEXT
    CONSTRAINT listings_mechanical_remediation_status_check
    CHECK (mechanical_remediation_status IN (
      'not_applicable','documented_complete','documented_partial',
      'none_documented','unknown'
    ));

COMMENT ON COLUMN listings.mechanical_remediation_status IS
  'Generation-specific. For 996/997.1: IMS/RMS/bore scoring remediation. For 993: not_applicable. For air-cooled: top-end refresh status.';

-- ---------------------------------------------------------------------------
-- PROVENANCE & HISTORY
-- ---------------------------------------------------------------------------

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS is_original_owner_sale     BOOLEAN,
  ADD COLUMN IF NOT EXISTS ownership_geography_chain  JSONB,
  ADD COLUMN IF NOT EXISTS is_single_family           BOOLEAN,
  ADD COLUMN IF NOT EXISTS notable_provenance         TEXT,
  ADD COLUMN IF NOT EXISTS recent_major_service       JSONB,
  ADD COLUMN IF NOT EXISTS ppi_completed_by           TEXT,
  ADD COLUMN IF NOT EXISTS is_comp_resistant          BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN listings.is_original_owner_sale IS
  'True when the seller is the original purchaser.';
COMMENT ON COLUMN listings.ownership_geography_chain IS
  'Ordered array of market regions this car has been registered in. E.g., [["de","euro"],["us","us"]].';
COMMENT ON COLUMN listings.is_single_family IS
  'True when owned by one family since new (multi-generational or long-term private ownership).';
COMMENT ON COLUMN listings.notable_provenance IS
  'Free-form notable ownership history (celebrity, racing driver, factory development, etc.).';
COMMENT ON COLUMN listings.recent_major_service IS
  'JSONB: { date: "YYYY-MM", scope: string, shop: string, cost_estimate_cents: integer|null }.';
COMMENT ON COLUMN listings.ppi_completed_by IS
  'Name of shop that performed a pre-purchase inspection, if stated.';
COMMENT ON COLUMN listings.is_comp_resistant IS
  'Editorially flagged. When true, comp engine returns "uncomparable" instead of a number. Default false.';

-- ---------------------------------------------------------------------------
-- DOCUMENTATION (additional — base set already exists from prior migration)
-- ---------------------------------------------------------------------------

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS has_books_literature BOOLEAN,
  ADD COLUMN IF NOT EXISTS has_tool_kit_complete BOOLEAN,
  ADD COLUMN IF NOT EXISTS has_spare_wheel_tire BOOLEAN,
  ADD COLUMN IF NOT EXISTS has_original_keys    BOOLEAN;

COMMENT ON COLUMN listings.has_books_literature IS
  'Original books, literature, or records packet present.';
COMMENT ON COLUMN listings.has_tool_kit_complete IS
  'Original tool kit (jack, tools, bag) present and complete.';
COMMENT ON COLUMN listings.has_spare_wheel_tire IS
  'Original spare wheel/tire present.';
COMMENT ON COLUMN listings.has_original_keys IS
  'All original keys present (factory key, valet key, etc.).';

-- ---------------------------------------------------------------------------
-- AUCTION SIGNAL (additional — bid_count, comment_count already exist)
-- ---------------------------------------------------------------------------

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS bidder_count    INTEGER,
  ADD COLUMN IF NOT EXISTS watcher_count  INTEGER,
  ADD COLUMN IF NOT EXISTS hours_to_reserve NUMERIC,
  ADD COLUMN IF NOT EXISTS consignor_type TEXT
    CONSTRAINT listings_consignor_type_check
    CHECK (consignor_type IN ('private','specialist_dealer','general_dealer','unknown')),
  ADD COLUMN IF NOT EXISTS auction_outcome TEXT
    CONSTRAINT listings_auction_outcome_check
    CHECK (auction_outcome IN ('sold','no_sale_reserve_not_met','withdrawn','relisted'));

COMMENT ON COLUMN listings.bidder_count IS
  'Number of registered bidders on the auction. Distinct from bid_count (number of bids).';
COMMENT ON COLUMN listings.watcher_count IS
  'Number of users watching the auction. BaT-specific signal.';
COMMENT ON COLUMN listings.hours_to_reserve IS
  'Hours elapsed from auction open to reserve being met. Signal for demand strength.';
COMMENT ON COLUMN listings.consignor_type IS
  'private | specialist_dealer | general_dealer | unknown. Used in consignor_tier_match factor.';
COMMENT ON COLUMN listings.auction_outcome IS
  'sold | no_sale_reserve_not_met | withdrawn | relisted. More granular than status/listing_status.';

-- ---------------------------------------------------------------------------
-- CROSS-LISTING IDENTITY
-- ---------------------------------------------------------------------------

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS vin_partial            TEXT,
  ADD COLUMN IF NOT EXISTS cross_listing_group_id UUID;

COMMENT ON COLUMN listings.vin_partial IS
  'Partial VIN for cross-platform identity matching when full VIN is not available.';
COMMENT ON COLUMN listings.cross_listing_group_id IS
  'Groups multiple platform listings for the same physical car. Editorially flagged via admin UI.';

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS listings_is_comp_resistant_idx
  ON listings (is_comp_resistant)
  WHERE is_comp_resistant = true;

CREATE INDEX IF NOT EXISTS listings_cross_listing_group_id_idx
  ON listings (cross_listing_group_id)
  WHERE cross_listing_group_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS listings_trim_category_generation_idx
  ON listings (generation_id, trim_category)
  WHERE trim_category IS NOT NULL;

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- DROP INDEX IF EXISTS listings_trim_category_generation_idx;
-- DROP INDEX IF EXISTS listings_cross_listing_group_id_idx;
-- DROP INDEX IF EXISTS listings_is_comp_resistant_idx;
-- ALTER TABLE listings
--   DROP COLUMN IF EXISTS cross_listing_group_id,
--   DROP COLUMN IF EXISTS vin_partial,
--   DROP COLUMN IF EXISTS auction_outcome,
--   DROP COLUMN IF EXISTS consignor_type,
--   DROP COLUMN IF EXISTS hours_to_reserve,
--   DROP COLUMN IF EXISTS watcher_count,
--   DROP COLUMN IF EXISTS bidder_count,
--   DROP COLUMN IF EXISTS has_original_keys,
--   DROP COLUMN IF EXISTS has_spare_wheel_tire,
--   DROP COLUMN IF EXISTS has_tool_kit_complete,
--   DROP COLUMN IF EXISTS has_books_literature,
--   DROP COLUMN IF EXISTS is_comp_resistant,
--   DROP COLUMN IF EXISTS ppi_completed_by,
--   DROP COLUMN IF EXISTS recent_major_service,
--   DROP COLUMN IF EXISTS notable_provenance,
--   DROP COLUMN IF EXISTS is_single_family,
--   DROP COLUMN IF EXISTS ownership_geography_chain,
--   DROP COLUMN IF EXISTS is_original_owner_sale,
--   DROP COLUMN IF EXISTS mechanical_remediation_status,
--   DROP COLUMN IF EXISTS owner_count_stated,
--   DROP COLUMN IF EXISTS is_featured_listing,
--   DROP COLUMN IF EXISTS listing_photo_count,
--   DROP COLUMN IF EXISTS accident_history_stated,
--   DROP COLUMN IF EXISTS paint_meter_max_microns,
--   DROP COLUMN IF EXISTS delete_options,
--   DROP COLUMN IF EXISTS wheels_factory_correct,
--   DROP COLUMN IF EXISTS seats_type,
--   DROP COLUMN IF EXISTS interior_color_rarity,
--   DROP COLUMN IF EXISTS transmission_variant,
--   DROP COLUMN IF EXISTS steering_side,
--   DROP COLUMN IF EXISTS is_federalized_import,
--   DROP COLUMN IF EXISTS market_region,
--   DROP COLUMN IF EXISTS trim_variant;
-- -- Restore original CHECK constraints (values currently null, safe)
-- ALTER TABLE listings
--   DROP CONSTRAINT IF EXISTS listings_condition_signal_check,
--   ADD CONSTRAINT listings_condition_signal_check
--     CHECK (condition_signal IN ('concours','excellent','good','driver','project'));
-- ALTER TABLE listings
--   DROP CONSTRAINT IF EXISTS listings_interior_signal_check,
--   ADD CONSTRAINT listings_interior_signal_check
--     CHECK (interior_signal IN ('original','refurbished','replaced'));
-- ALTER TABLE listings
--   DROP CONSTRAINT IF EXISTS listings_mod_status_check,
--   ADD CONSTRAINT listings_mod_status_check
--     CHECK (mod_status IN ('stock','light_reversible','heavy','unknown'));
-- COMMIT;
