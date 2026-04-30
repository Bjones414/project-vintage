-- =============================================================================
-- Step 6: Create market_snapshots table.
--
-- Stores periodic market aggregations per (generation, trim, date).
-- One row per (generation_id, trim_category, snapshot_date) tuple.
-- Written by background aggregation jobs; read by the comp engine and
-- market trends UI.
--
-- generation_id is nullable to support marque-agnostic snapshots in future.
-- trim_category matches listings.trim_category added in step 2.
--
-- RLS: service_role writes (bypasses RLS by default).
--      anon + authenticated: SELECT only.
--
-- Reversible: yes — DROP TABLE statement in rollback section.
-- Apply: npx supabase db push
-- =============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS market_snapshots (
  id                    UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id         TEXT,
  trim_category         TEXT,
  snapshot_date         DATE         NOT NULL,
  active_listing_count  INTEGER,
  sold_count_30d        INTEGER,
  median_price_30d      BIGINT,
  median_dom_30d        INTEGER,
  sell_through_rate_30d NUMERIC(5,4)
    CONSTRAINT market_snapshots_sell_through_rate_check
    CHECK (sell_through_rate_30d IS NULL
           OR (sell_through_rate_30d >= 0 AND sell_through_rate_30d <= 1))
);

COMMENT ON TABLE market_snapshots IS
  'Periodic market aggregations per (generation_id, trim_category, snapshot_date). Written by background jobs; read by comp engine and trends UI.';

COMMENT ON COLUMN market_snapshots.generation_id IS
  'Porsche generation key (e.g., 993, 997.1). Nullable for future marque-agnostic aggregations.';

COMMENT ON COLUMN market_snapshots.trim_category IS
  'Normalized trim grouping; matches listings.trim_category.';

COMMENT ON COLUMN market_snapshots.snapshot_date IS
  'Date the snapshot was computed. Daily or weekly cadence depending on job schedule.';

COMMENT ON COLUMN market_snapshots.active_listing_count IS
  'Number of active (unsold) listings as of snapshot_date.';

COMMENT ON COLUMN market_snapshots.sold_count_30d IS
  'Number of sold listings in the 30 days ending on snapshot_date.';

COMMENT ON COLUMN market_snapshots.median_price_30d IS
  'Median final_price_cents of sold listings in the 30-day window.';

COMMENT ON COLUMN market_snapshots.median_dom_30d IS
  'Median days_on_market of sold listings in the 30-day window.';

COMMENT ON COLUMN market_snapshots.sell_through_rate_30d IS
  'sold_count_30d / (sold_count_30d + active_listing_count). 0.0000–1.0000.';

-- Composite index for the primary access pattern: all snapshots for a given
-- (generation, trim) pair ordered by date descending.
CREATE INDEX IF NOT EXISTS market_snapshots_gen_trim_date_idx
  ON market_snapshots (generation_id, trim_category, snapshot_date DESC);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE market_snapshots ENABLE ROW LEVEL SECURITY;

-- Public read: market trend data is derived from public auction results.
DROP POLICY IF EXISTS market_snapshots_public_read ON market_snapshots;
CREATE POLICY market_snapshots_public_read
  ON market_snapshots
  FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON market_snapshots TO anon, authenticated;
GRANT ALL    ON market_snapshots TO service_role;

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- REVOKE ALL ON market_snapshots FROM service_role;
-- REVOKE SELECT ON market_snapshots FROM anon, authenticated;
-- DROP TABLE IF EXISTS market_snapshots;
-- COMMIT;
