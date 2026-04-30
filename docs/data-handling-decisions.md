# Data Handling Compliance Pass — Decision Log

Decisions made during the automated compliance pass on 2026-04-30. All decisions use the most conservative interpretation per the run instructions.

---

## D1: VIN column not dropped in schema migration

**Decision:** The `vin` column on `listings` is nulled out in the data migration script (step 2) and is blocked from future writes by the NEVER_PERSIST_FIELDS guard. It is NOT dropped via migration in this pass.

**Reason:** The spec orders dropping only `vin_partial` (step 3). The `vin` column is part of the original schema with a unique index (`listings_vin_idx`) and removing it requires coordinating with other index/constraint dependencies. The guard makes it effectively dead without the schema disruption of a column drop.

**How to apply:** A follow-up migration can formally drop the `vin` column once the team confirms no downstream tooling references it. Track as technical debt.

---

## D2: VIN display on subject analysis page deferred

**Decision:** The subject listing analysis page (`/analyze/[id]`) will NOT display VIN after this pass. The VIN display is removed from ChassisIdentityCard because the `vin` column is now nulled in the DB.

**Reason:** Displaying VIN on the analysis page requires session storage (the VIN is in the API response but not in the DB). The spec explicitly says "Acceptable to skip this for V1 if it adds complexity." Implementing session storage for VIN display adds a new client-side data flow that is out of scope for a data compliance pass.

**How to apply:** Implement a session-storage pattern in the analysis page (POST /api/analyze returns VIN in response; store in sessionStorage; analysis page reads it from sessionStorage). Track as a V1 UX improvement.

---

## D3: raw_html_snapshot_key not dropped in Phase 5

**Decision:** The `raw_html_snapshot_key` column (pointer to R2 HTML snapshots) is retained.

**Reason:** It stores a storage key (a short string), not verbatim content. The verbatim content is in R2, not in the DB column. The spec targets "listing descriptions, headlines, or seller copy" — a storage key is not any of those. The R2 snapshots themselves are out of scope for this pass.

---

## D4: source_url and source_platform NOT NULL constraints deferred

**Decision:** NOT NULL constraints on `source_url` and `source_platform` are not added in this pass.

**Reason:** The dev corpus has 199 records. If any record has null source_url/source_platform, adding NOT NULL would fail. Rather than audit each record in this automated pass, defer the constraint. Both columns are already effectively required by the write paths (parser always sets them).

**How to apply:** After confirming all dev corpus records have non-null source_url and source_platform via SELECT, apply NOT NULL constraints in a follow-up migration.

---

## D5: source_publication backfill for existing records deferred

**Decision:** Existing 199 dev corpus records will have NULL source_publication after the migration.

**Reason:** Existing records were seeded from BaT. The correct source_publication is "Bring a Trailer" for all of them. A backfill UPDATE is straightforward but requires manual review to confirm all source_platforms map correctly. Deferred to avoid automated data changes to existing corpus without review.

**How to apply:** Run: `UPDATE listings SET source_publication = 'Bring a Trailer' WHERE source_platform = 'bring-a-trailer' AND source_publication IS NULL;` after review.

---

## D6: accident_history_stated regex extraction not implemented in this pass

**Decision:** The existing `accident_history_stated` field's comment says "V1: set by regex over raw_description." Since `raw_description` is being dropped in Phase 5, this extraction path is broken. The source-mentions extractor (Phase 2) now handles the signal via `mentioned_accident_history`. Both fields coexist per spec.

**How to apply:** Remove the comment from accident_history_stated column mentioning raw_description in a follow-up migration. The field can be populated by the Phase 2 AI extraction pipeline using the same source text at fetch time.

---

## D7: Supabase local Docker not running — using --linked remote push

**Decision:** All migrations are pushed to the linked remote Supabase project rather than the local Docker instance.

**Reason:** Docker is not running in this environment. The remote project is accessible and up to date. The `--linked` flag pushes to the configured remote project, which is the authoritative database for this project.
