-- =============================================================================
-- Data Handling Compliance Pass — Phase 4, Step 17
-- Add source_publication column to listings table.
--
-- source_publication is the human-readable primary source attribution.
-- For records sourced from user pastes: platform name (e.g., "Bring a Trailer").
-- For records from market reports: report name (e.g., "Mecum Kissimmee 2024 Official Results").
--
-- Existing records will have NULL source_publication until backfilled.
-- Backfill for dev corpus: see docs/data-handling-decisions.md D5.
--
-- Apply: npx supabase db push --linked
-- Verify: SELECT column_name FROM information_schema.columns
--         WHERE table_name = 'listings' AND column_name = 'source_publication';
-- =============================================================================

BEGIN;

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS source_publication TEXT;

COMMENT ON COLUMN listings.source_publication IS
  'Human-readable primary source attribution. Platform name for user-paste records; report name for public-corpus records. Displayed as "Source: [publication]" on all comp rows.';

-- Confirm source_url and source_platform still exist (guard against accidental removal).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'listings' AND column_name = 'source_url'
  ) THEN
    RAISE EXCEPTION 'source_url column missing from listings — required for source attribution';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'listings' AND column_name = 'source_platform'
  ) THEN
    RAISE EXCEPTION 'source_platform column missing from listings — required for source attribution';
  END IF;
END;
$$;

COMMIT;
