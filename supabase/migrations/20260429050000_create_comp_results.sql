-- =============================================================================
-- Create comp_results table.
--
-- Stores the output of the comp engine for a given listing. One row per
-- computation run; listing_id is not unique so results can be refreshed.
-- The page fetches the most recent row (ORDER BY computed_at DESC LIMIT 1).
--
-- tier values:
--   'strict'       — same generation_id, same body_class, mileage ±30%, sold ≤24mo
--   'wide'         — same generation_id, any body_class, any mileage, sold ≤36mo
--   'insufficient' — wide set had <3 comps; fair value not computed
--
-- RLS: service-role can insert/update; anon + authenticated can read.
--
-- Reversible: yes — rollback below.
-- Apply: npx supabase db push
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS comp_results (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id              UUID        NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  tier                    TEXT        NOT NULL CHECK (tier IN ('strict', 'wide', 'insufficient')),
  comp_count              INTEGER     NOT NULL,
  fair_value_low_cents    BIGINT,
  fair_value_median_cents BIGINT,
  fair_value_high_cents   BIGINT,
  most_recent_comp_sold_at TIMESTAMPTZ,
  oldest_comp_sold_at     TIMESTAMPTZ,
  comp_listing_ids        UUID[]      NOT NULL DEFAULT '{}',
  computed_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE comp_results IS
  'Output of comp engine for each listing. Fetch most recent row via ORDER BY computed_at DESC LIMIT 1.';

COMMENT ON COLUMN comp_results.tier IS
  'strict: same generation + body_class, mileage ±30%, sold ≤24mo. wide: same generation, any body_class/mileage, sold ≤36mo. insufficient: <3 wide comps.';

COMMENT ON COLUMN comp_results.comp_listing_ids IS
  'Array of listings.id values used in the fair-value computation.';

CREATE INDEX IF NOT EXISTS comp_results_listing_id_idx
  ON comp_results (listing_id);

CREATE INDEX IF NOT EXISTS comp_results_computed_at_idx
  ON comp_results (computed_at DESC);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE comp_results ENABLE ROW LEVEL SECURITY;

-- Public read: comp results are derived from public auction data
DROP POLICY IF EXISTS comp_results_public_read ON comp_results;
CREATE POLICY comp_results_public_read
  ON comp_results
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Service role writes only (bypasses RLS by default — policy is for belt-and-suspenders)
GRANT SELECT ON comp_results TO anon, authenticated;

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- REVOKE SELECT ON comp_results FROM anon, authenticated;
-- DROP TABLE IF EXISTS comp_results;
-- COMMIT;
