-- =============================================================================
-- LEGAL SCOPE WARNING — READ BEFORE EXTENDING THIS TABLE
-- =============================================================================
--
-- This table captures FACTUAL SPECIFICATIONS ONLY, extracted from a seller's
-- own listing description for a specific car. Facts (paint color, options
-- listed, stated mileage) are not copyrightable and are safe to store.
--
-- The following fields are EXPLICITLY PROHIBITED and must NEVER be added:
--
--   ✗ Comment content, themes, sentiment, or counts from any platform
--     (BaT comments, Cars & Bids comments, etc. are user-generated
--     content — copyrighted and legally distinct from seller descriptions)
--   ✗ Raw listing description text — store a HASH ONLY (raw_description_hash)
--   ✗ Any user-generated content of any kind
--   ✗ Derivative analyses of community discussion
--   ✗ Seller responsiveness, comment patterns, or community-derived signals
--   ✗ Aggregated sentiment or crowd-sourced condition assessments
--
-- If you are unsure whether a field is permissible, ask legal before adding.
-- The distinction: seller states a fact about the car → OK.
--                  community discusses the car → NOT OK.
--
-- Purpose: structured spec extraction to power the originality score and
-- color rarity score in a future session. This migration creates only the
-- data foundation. Scoring algorithms, the LLM parser, pipeline integration,
-- and the admin UI are all deferred to future sessions.
--
-- Apply: npx supabase db push  (USER TO REVIEW will run manually — do NOT
--         apply automatically)
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Table: listing_metadata
--
-- One row per (listing_id, parser_version). Allows re-processing listings
-- with newer parser versions without losing prior extractions.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.listing_metadata (

  -- Primary key
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key: cascade-delete when the parent listing is removed
  listing_id                UUID        NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,

  -- ------------------------------------------------------------------
  -- Paint information — seller-stated facts only
  -- ------------------------------------------------------------------
  exterior_color_current    TEXT,
  exterior_color_original   TEXT,
  paint_code                TEXT,
  is_pts                    BOOLEAN,    -- Paint to Sample
  is_repaint                BOOLEAN,    -- seller-disclosed repaint
  paint_quality_notes       TEXT,

  -- ------------------------------------------------------------------
  -- Originality markers — seller-stated facts only
  -- ------------------------------------------------------------------
  is_matching_numbers       BOOLEAN,
  engine_original           BOOLEAN,
  transmission_original     BOOLEAN,
  modifications             JSONB,      -- array of modification descriptions
  owner_count               INTEGER,
  has_complete_service_records BOOLEAN,

  -- ------------------------------------------------------------------
  -- Options & equipment — seller-stated facts only
  -- ------------------------------------------------------------------
  factory_options           JSONB,      -- array of factory option codes/names
  aftermarket_equipment     JSONB,
  original_wheels           BOOLEAN,
  manuals_present           BOOLEAN,
  tools_present             BOOLEAN,
  spare_present             BOOLEAN,

  -- ------------------------------------------------------------------
  -- Provenance — seller-stated facts only
  -- ------------------------------------------------------------------
  accident_history          TEXT,
  carfax_clean              BOOLEAN,
  storage_history           TEXT,
  service_records_summary   TEXT,

  -- ------------------------------------------------------------------
  -- Meta
  -- ------------------------------------------------------------------
  parser_version            TEXT        NOT NULL,
  -- HASH ONLY — never store the raw description text (copyrighted)
  raw_description_hash      TEXT,
  extracted_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- One row per listing per parser version; re-runs with a newer parser
  -- insert a new row rather than clobbering prior extractions.
  UNIQUE (listing_id, parser_version)
);

COMMENT ON TABLE public.listing_metadata IS
  'Structured factual specs extracted from seller listing descriptions. '
  'Facts only — see file header for explicit legal-scope warning before '
  'adding any fields. Powers future originality and color rarity scoring. '
  'Internal access only; no user-facing exposure.';

COMMENT ON COLUMN public.listing_metadata.raw_description_hash IS
  'SHA-256 (or equivalent) hash of the raw listing description. '
  'HASH ONLY — the raw text is copyrighted and must never be stored here.';

COMMENT ON COLUMN public.listing_metadata.parser_version IS
  'Version string of the LLM parser that produced this row (e.g. "v1"). '
  'Bump when extraction logic changes so analysts can filter by version.';

COMMENT ON COLUMN public.listing_metadata.modifications IS
  'JSONB array of seller-disclosed modifications (e.g. ["Brembo brake upgrade", "H&R springs"]). '
  'Seller-stated facts only — no community-sourced content.';

COMMENT ON COLUMN public.listing_metadata.factory_options IS
  'JSONB array of factory option codes or names stated by the seller '
  '(e.g. ["M637", "Sport Chrono", "PASM"]). Seller-stated facts only.';

COMMENT ON COLUMN public.listing_metadata.aftermarket_equipment IS
  'JSONB array of aftermarket items disclosed by the seller. Seller-stated facts only.';

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

-- Primary lookup: all metadata rows for a given listing
CREATE INDEX IF NOT EXISTS idx_listing_metadata_listing_id
  ON public.listing_metadata (listing_id);

-- Sparse index: find PTS cars without a full-scan
CREATE INDEX IF NOT EXISTS idx_listing_metadata_is_pts
  ON public.listing_metadata (is_pts)
  WHERE is_pts = true;

-- Sparse index: find matching-numbers cars
CREATE INDEX IF NOT EXISTS idx_listing_metadata_is_matching_numbers
  ON public.listing_metadata (is_matching_numbers)
  WHERE is_matching_numbers = true;

-- Sparse index: find unrepainted cars (originality scoring)
CREATE INDEX IF NOT EXISTS idx_listing_metadata_no_repaint
  ON public.listing_metadata (is_repaint)
  WHERE is_repaint = false;

-- Parser version: filter extractions by which parser produced them
CREATE INDEX IF NOT EXISTS idx_listing_metadata_parser_version
  ON public.listing_metadata (parser_version);

-- ---------------------------------------------------------------------------
-- RLS: internal data only — no user-facing exposure
--
-- RLS is enabled with NO permissive policies for anon or authenticated roles.
-- Deny-by-default applies to all roles except service_role, which bypasses
-- RLS by default in Supabase/PostgREST.
--
-- If you want to surface any field to users in the future, add an explicit
-- SELECT policy at that time — do NOT disable RLS.
-- ---------------------------------------------------------------------------

ALTER TABLE public.listing_metadata ENABLE ROW LEVEL SECURITY;

-- No SELECT / INSERT / UPDATE / DELETE policies for anon or authenticated.
-- Service role gets explicit GRANT so the application layer can write rows.
GRANT SELECT, INSERT, UPDATE ON public.listing_metadata TO service_role;

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- Reuses the generic set_updated_at() function defined in
-- 20260428040000_phase4_vin_generation_editorial.sql — no need to redefine.
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON c.oid = t.tgrelid
    WHERE t.tgname = 'set_listing_metadata_updated_at'
      AND c.relname = 'listing_metadata'
  ) THEN
    CREATE TRIGGER set_listing_metadata_updated_at
      BEFORE UPDATE ON public.listing_metadata
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;

COMMIT;


-- =============================================================================
-- ROLLBACK — do not apply automatically
-- =============================================================================
-- BEGIN;
-- DROP TRIGGER IF EXISTS set_listing_metadata_updated_at ON public.listing_metadata;
-- REVOKE SELECT, INSERT, UPDATE ON public.listing_metadata FROM service_role;
-- DROP TABLE IF EXISTS public.listing_metadata;
-- COMMIT;
