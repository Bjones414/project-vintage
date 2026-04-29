BEGIN;

-- =============================================================================
-- Phase 4: VIN decode columns, generation FK, T-0 verification, editorial seed
-- =============================================================================

-- ----------------------------------------------------------------------------
-- 1. Alter listings
--    New columns: auction timing, VIN decode output, generation FK
-- ----------------------------------------------------------------------------

ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS auction_ends_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_verified_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS generation_id          TEXT REFERENCES porsche_generations(generation_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS decoded_year           INTEGER,
  ADD COLUMN IF NOT EXISTS decoded_make           TEXT,
  ADD COLUMN IF NOT EXISTS decoded_model          TEXT,
  ADD COLUMN IF NOT EXISTS decoded_body_class     TEXT,
  ADD COLUMN IF NOT EXISTS decoded_engine         TEXT,
  ADD COLUMN IF NOT EXISTS decoded_plant          TEXT,
  ADD COLUMN IF NOT EXISTS decoded_transmission   TEXT,
  ADD COLUMN IF NOT EXISTS vin_decode_raw         JSONB;

-- Separate index creation so each can be skipped independently if it already exists.
CREATE INDEX IF NOT EXISTS listings_generation_id_idx   ON listings (generation_id);
CREATE INDEX IF NOT EXISTS listings_auction_ends_at_idx ON listings (auction_ends_at);

-- ----------------------------------------------------------------------------
-- 2. Alter porsche_generations — add columns missing from the original schema
--
--    Deviation from spec: spec names years_start / years_end but the schema
--    already has year_start / year_end (smallint) serving the same purpose.
--    Adding years_start / years_end alongside them would create duplicate,
--    conflicting columns. Skipping those two; applying the guard to both the
--    spec name and the actual column name so the migration is safe regardless
--    of which name was used.
--
--    production_count and model_family are genuinely absent — added below.
-- ----------------------------------------------------------------------------

DO $$
BEGIN
  -- Guard against both the spec name (years_start) and the schema name (year_start)
  -- so this block is safe whether or not either column already exists.
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'porsche_generations'
      AND column_name  IN ('years_start', 'year_start')
  ) THEN
    ALTER TABLE porsche_generations ADD COLUMN years_start INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'porsche_generations'
      AND column_name  IN ('years_end', 'year_end')
  ) THEN
    ALTER TABLE porsche_generations ADD COLUMN years_end INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'porsche_generations'
      AND column_name  = 'production_count'
  ) THEN
    ALTER TABLE porsche_generations ADD COLUMN production_count INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'porsche_generations'
      AND column_name  = 'model_family'
  ) THEN
    ALTER TABLE porsche_generations ADD COLUMN model_family TEXT;
  END IF;
END;
$$;

-- ----------------------------------------------------------------------------
-- 3. updated_at trigger function (idempotent via CREATE OR REPLACE)
--    Shared by generation_editorial and any future tables added in this phase.
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- 4. generation_editorial — one editorial row per Porsche generation
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS generation_editorial (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id    TEXT        NOT NULL REFERENCES porsche_generations(generation_id) ON DELETE CASCADE,
  summary          TEXT,
  watch_outs       JSONB       NOT NULL DEFAULT '[]'::jsonb,
  notable_variants JSONB       NOT NULL DEFAULT '[]'::jsonb,
  color_context    TEXT,
  production_notes TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (generation_id)
);

-- Trigger: keep updated_at current on every UPDATE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    WHERE t.tgname = 'set_generation_editorial_updated_at'
      AND c.relname = 'generation_editorial'
  ) THEN
    CREATE TRIGGER set_generation_editorial_updated_at
      BEFORE UPDATE ON generation_editorial
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;

-- ----------------------------------------------------------------------------
-- 5. RLS on generation_editorial
--    Reference data: any authenticated user can read; only service role writes.
--    Matches the access shape of porsche_generations.
-- ----------------------------------------------------------------------------

ALTER TABLE generation_editorial ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'generation_editorial'
      AND policyname = 'generation_editorial_select'
  ) THEN
    CREATE POLICY generation_editorial_select
      ON generation_editorial
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END;
$$;

COMMIT;
