-- =============================================================================
-- Phase 5: Analyze flow v3 schema update
--
-- Changes:
--   1. Create content_status_t postgres enum ('draft','verified','published')
--   2. porsche_generations — add notes_full, hero image columns, content_status,
--      and guard for common_issues / period_reviews with updated column comments
--   3. porsche_color_codes — add content_status
--   4. listing_analyses — add findings, finding_count, confidence_score, comp_count
--   5. Data migration — promote generation_editorial 'verified' → 'published'
--      and defensive updates on the newly-added status columns
--   5.5 RLS and GRANTs for reference tables — backfills manually-applied production
--      grants that were never committed to migrations (porsche_generations,
--      porsche_color_codes, porsche_option_codes) and widens the existing
--      generation_editorial policy from authenticated-only to anon + authenticated
--   6. Indexes
--
-- generation_editorial: schema is intentionally NOT altered. It remains a
-- TEXT-based content_status column and serves as the editorial staging surface.
-- Future workflow: editorial drafts live in generation_editorial, promoted to
-- porsche_generations.notes / notes_full on publish. Out of scope here.
--
-- Reversible: yes — rollback statements at the bottom (commented out).
-- Apply: npx supabase db push (review before running)
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. content_status_t enum
--    Values align with generation_editorial.content_status CHECK constraint
--    but are stored as a proper postgres enum for the new columns.
--    generation_editorial keeps its TEXT column — no alteration needed.
-- ---------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type
    WHERE typname = 'content_status_t' AND typtype = 'e'
  ) THEN
    CREATE TYPE content_status_t AS ENUM ('draft', 'verified', 'published');
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. porsche_generations — new editorial content columns
-- ---------------------------------------------------------------------------

ALTER TABLE porsche_generations
  ADD COLUMN IF NOT EXISTS notes_full         TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_url     TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_caption TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_license TEXT,
  ADD COLUMN IF NOT EXISTS content_status     content_status_t NOT NULL DEFAULT 'draft';

-- Defensive guard: common_issues and period_reviews were in the original
-- CREATE TABLE but ADD COLUMN IF NOT EXISTS is a no-op if they already exist.
ALTER TABLE porsche_generations
  ADD COLUMN IF NOT EXISTS common_issues  JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS period_reviews JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Document expected jsonb element shapes.
-- IMPORTANT: filter by per-element content_status at the application layer
-- (TypeScript, after fetch). Do NOT use generated columns or SQL-side jsonb
-- filtering for V1 — app-layer filtering keeps the query simple and avoids
-- index-maintenance overhead on columns with infrequent writes.
COMMENT ON COLUMN porsche_generations.common_issues IS
  'Array of { title: string, severity: "low"|"moderate"|"high", mileage_threshold: integer|null, body: string, content_status: "draft"|"verified"|"published" }. Filter by content_status at the application layer.';

COMMENT ON COLUMN porsche_generations.period_reviews IS
  'Array of { publication: string, date: "YYYY-MM", title: string, url: string|null, archive_url: string|null, summary: string, pull_quote: string|null, pull_quote_attribution: string|null, paywalled: boolean, content_status: "draft"|"verified"|"published" }. Filter by content_status at the application layer.';

COMMENT ON COLUMN porsche_generations.notes_full IS
  'Long-form editorial prose for the full report page. notes remains the short summary for the initial report card.';

COMMENT ON COLUMN porsche_generations.content_status IS
  'Row-level publication status. draft = unpublished; verified = reviewed, not yet live; published = live on analyze page.';

-- ---------------------------------------------------------------------------
-- 3. porsche_color_codes — content_status
-- ---------------------------------------------------------------------------

ALTER TABLE porsche_color_codes
  ADD COLUMN IF NOT EXISTS content_status content_status_t NOT NULL DEFAULT 'draft';

COMMENT ON COLUMN porsche_color_codes.content_status IS
  'Row-level publication status. draft = unpublished; verified = reviewed, not yet live; published = live on analyze page.';

-- ---------------------------------------------------------------------------
-- 4. listing_analyses — findings tracking and normalized confidence score
-- ---------------------------------------------------------------------------

ALTER TABLE listing_analyses
  ADD COLUMN IF NOT EXISTS findings         JSONB         NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS finding_count    INTEGER       NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS confidence_score NUMERIC(4,3)
                             CONSTRAINT listing_analyses_confidence_score_range
                             CHECK (confidence_score IS NULL
                                    OR (confidence_score >= 0 AND confidence_score <= 1)),
  ADD COLUMN IF NOT EXISTS comp_count       INTEGER;

COMMENT ON COLUMN listing_analyses.findings IS
  'Array of { rule_id: string, category: "this_car"|"worth_asking"|"watch_closely", severity: "positive"|"caution"|"concern", title: string, body: string, qualifier: string|null }';

COMMENT ON COLUMN listing_analyses.confidence_score IS
  'Normalized 0.000–1.000 confidence from the comp engine. Populated in V1.5+; not rendered in V1 UI. Replaces the 0–100 integer in analysis_data.confidence_score once the comp engine is updated.';

COMMENT ON COLUMN listing_analyses.comp_count IS
  'Number of comparable sales used in this analysis. Denormalized from analysis_data.comps_used for fast filtering without jsonb extraction.';

-- ---------------------------------------------------------------------------
-- 5. Data migration
-- ---------------------------------------------------------------------------

-- generation_editorial: promote existing 'verified' rows to 'published'.
-- These rows were the production-ready state under the old two-value workflow;
-- 'published' is the equivalent in the new three-value workflow.
UPDATE generation_editorial
   SET content_status = 'published'
 WHERE content_status = 'verified';

-- porsche_generations: defensive update. All existing rows received the
-- DEFAULT 'draft' when the column was added above; no 'verified' rows should
-- exist. Written defensively in case of manual intervention between migrations.
UPDATE porsche_generations
   SET content_status = 'published'
 WHERE content_status = 'verified';

-- porsche_color_codes: same defensive pattern.
UPDATE porsche_color_codes
   SET content_status = 'published'
 WHERE content_status = 'verified';

-- ---------------------------------------------------------------------------
-- 5.5 RLS and GRANTs for reference tables
--
-- These policies and grants were applied manually in production on 2026-04-28
-- but were never committed to migrations, leaving the schema non-reproducible
-- from version control. Folding them in here.
--
-- porsche_generations, porsche_color_codes, porsche_option_codes:
--   No RLS or policy existed in any migration file. Adding now.
--
-- generation_editorial:
--   RLS was enabled and a SELECT policy was created in migration
--   20260428040000, but the policy was scoped TO authenticated only.
--   The analyze flow serves anonymous users, so anon must be able to SELECT.
--   Dropping the narrow policy and recreating it with TO anon, authenticated.
--   A GRANT for the anon role is also added here (base-table privilege).
--
-- Idempotency:
--   ALTER TABLE ... ENABLE ROW LEVEL SECURITY is a no-op if already enabled.
--   GRANT SELECT ... is a no-op if the privilege already exists.
--   DROP POLICY IF EXISTS + CREATE POLICY is the standard idempotent pattern
--   used because CREATE OR REPLACE POLICY is not available in all PG versions
--   targeted by Supabase.
-- ---------------------------------------------------------------------------

-- ---- porsche_generations ----

ALTER TABLE porsche_generations ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON porsche_generations TO anon, authenticated;

DROP POLICY IF EXISTS porsche_generations_public_read ON porsche_generations;
CREATE POLICY porsche_generations_public_read
  ON porsche_generations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---- porsche_color_codes ----

ALTER TABLE porsche_color_codes ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON porsche_color_codes TO anon, authenticated;

DROP POLICY IF EXISTS porsche_color_codes_public_read ON porsche_color_codes;
CREATE POLICY porsche_color_codes_public_read
  ON porsche_color_codes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---- porsche_option_codes ----

ALTER TABLE porsche_option_codes ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON porsche_option_codes TO anon, authenticated;

DROP POLICY IF EXISTS porsche_option_codes_public_read ON porsche_option_codes;
CREATE POLICY porsche_option_codes_public_read
  ON porsche_option_codes
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---- generation_editorial ----
--
-- The Phase 4 migration (20260428040000) enabled RLS and created policy
-- generation_editorial_select scoped TO authenticated only. The analyze page
-- renders editorial content for anonymous users, so this was a gap filled
-- manually in production. Replacing the policy here to match that state.

ALTER TABLE generation_editorial ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON generation_editorial TO anon, authenticated;

-- Drop the narrow authenticated-only policy from Phase 4, then recreate
-- with TO anon, authenticated.
DROP POLICY IF EXISTS generation_editorial_select ON generation_editorial;
DROP POLICY IF EXISTS generation_editorial_public_read ON generation_editorial;
CREATE POLICY generation_editorial_public_read
  ON generation_editorial
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---------------------------------------------------------------------------
-- 6. Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS porsche_generations_content_status_idx
  ON porsche_generations (content_status);

CREATE INDEX IF NOT EXISTS porsche_color_codes_content_status_idx
  ON porsche_color_codes (content_status);

-- Sparse index: only rows with at least one finding are interesting for queue/triage.
CREATE INDEX IF NOT EXISTS listing_analyses_finding_count_idx
  ON listing_analyses (finding_count)
  WHERE finding_count > 0;

COMMIT;


-- =============================================================================
-- DOWN / ROLLBACK
-- Do not apply automatically. Review before executing.
--
-- Caveats:
--   (a) Data migration reversal (published → verified) will incorrectly demote
--       rows that were manually promoted to 'published' outside this migration.
--   (b) REVOKE SELECT is included for completeness but may not fully restore
--       prior state if other roles or grants existed before this migration.
--   (c) ALTER TABLE ... DISABLE ROW LEVEL SECURITY is intentionally omitted —
--       disabling RLS on a table removes ALL policy protection, including any
--       policies that may have existed before this migration. Do not include it.
-- =============================================================================

-- BEGIN;
--
-- -- 6. Remove indexes
-- DROP INDEX IF EXISTS listing_analyses_finding_count_idx;
-- DROP INDEX IF EXISTS porsche_color_codes_content_status_idx;
-- DROP INDEX IF EXISTS porsche_generations_content_status_idx;
--
-- -- 5.5 Remove RLS policies and GRANTs (reverse of step 5.5)
-- --     Note: this recreates the narrow authenticated-only policy for
-- --     generation_editorial that existed before this migration.
--
-- DROP POLICY IF EXISTS generation_editorial_public_read ON generation_editorial;
-- CREATE POLICY generation_editorial_select
--   ON generation_editorial
--   FOR SELECT
--   TO authenticated
--   USING (true);
-- REVOKE SELECT ON generation_editorial FROM anon;
--
-- DROP POLICY IF EXISTS porsche_option_codes_public_read ON porsche_option_codes;
-- REVOKE SELECT ON porsche_option_codes FROM anon, authenticated;
--
-- DROP POLICY IF EXISTS porsche_color_codes_public_read ON porsche_color_codes;
-- REVOKE SELECT ON porsche_color_codes FROM anon, authenticated;
--
-- DROP POLICY IF EXISTS porsche_generations_public_read ON porsche_generations;
-- REVOKE SELECT ON porsche_generations FROM anon, authenticated;
--
-- -- 5. Revert data migration (see caveat (a) above)
-- UPDATE generation_editorial
--    SET content_status = 'verified'
--  WHERE content_status = 'published';
--
-- UPDATE porsche_generations
--    SET content_status = 'verified'
--  WHERE content_status = 'published';
--
-- UPDATE porsche_color_codes
--    SET content_status = 'verified'
--  WHERE content_status = 'published';
--
-- -- 4. Remove listing_analyses columns
-- ALTER TABLE listing_analyses
--   DROP COLUMN IF EXISTS comp_count,
--   DROP COLUMN IF EXISTS confidence_score,
--   DROP COLUMN IF EXISTS finding_count,
--   DROP COLUMN IF EXISTS findings;
--
-- -- 3. Remove porsche_color_codes columns
-- ALTER TABLE porsche_color_codes
--   DROP COLUMN IF EXISTS content_status;
--
-- -- 2. Remove porsche_generations columns
-- --    Drop content_status last: ENUM type cannot be dropped while columns reference it.
-- ALTER TABLE porsche_generations
--   DROP COLUMN IF EXISTS common_issues,   -- only if added by this migration (no-op otherwise)
--   DROP COLUMN IF EXISTS period_reviews,  -- only if added by this migration (no-op otherwise)
--   DROP COLUMN IF EXISTS notes_full,
--   DROP COLUMN IF EXISTS hero_image_url,
--   DROP COLUMN IF EXISTS hero_image_caption,
--   DROP COLUMN IF EXISTS hero_image_license,
--   DROP COLUMN IF EXISTS content_status;
--
-- -- 1. Drop ENUM type
-- --    Will fail if any other column still references it. Verify before running.
-- DROP TYPE IF EXISTS content_status_t;
--
-- COMMIT;
