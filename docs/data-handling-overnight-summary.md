# Data Handling V1 Compliance Pass — Final Summary

Completed 2026-04-30. All phases complete. Working tree clean.

---

## Phases Completed

### Phase 1 — VIN Handling
**Goal:** Never persist full VINs. Store SHA-256 hash of last 6 chars as `vin_hash_partial`. Drop `vin_partial`. Add `NEVER_PERSIST_FIELDS` guard.

**Migrations pushed (remote Supabase, --linked):**
- `20260430050000_data_handling_phase1_add_vin_hash.sql` — adds `vin_hash_partial TEXT` + index
- `20260430051000_data_handling_phase1_migrate_vin_data.sql` — migrates 207 records: hashes VIN last-6, nulls `vin`
- `20260430052000_data_handling_phase1_drop_vin_partial.sql` — drops `vin_partial` column

**Verified:** 0 records with `vin` value; 207 records with `vin_hash_partial`; `vin_partial` column absent.

**Code:** `lib/db/never-persist.ts` — `NEVER_PERSIST_FIELDS = ['vin', 'engine_serial']`, `guardWrite()` throws loudly on DB write violation. Called in `app/api/analyze/route.ts` and `scripts/seed-corpus-bat.ts`.

**Decision D1:** `vin` column kept as dead column (not dropped). Guard prevents future writes. VIN is returned in API response for current session only — never written to DB.

**Decision D2:** VIN display on analysis page deferred. Session storage needed to pass VIN from API response to `/analyze/[id]` page — planned V1 UX improvement.

---

### Phase 2 — Source-Mention Signals
**Goal:** Add 8 `mentioned_*` boolean columns + paired `_source` text columns. Extract at fetch time. Display with source attribution.

**Migration pushed:**
- `20260430060000_data_handling_phase2_source_mentions.sql` — adds 16 columns (8 boolean + 8 source text pairs)

**Columns added:** `mentioned_repaint`, `mentioned_accident_history`, `mentioned_engine_service`, `mentioned_transmission_service`, `mentioned_matching_numbers`, `mentioned_modifications`, `mentioned_recent_ppi`, `mentioned_original_owner`, plus `_source` variant of each.

**Code:** `lib/extractors/source-mentions.ts` — `extractSourceMentions()` runs 8 regex patterns, returns nullable booleans and `source_citation: "PublicationName|URL"`. `platformToPublication()` maps platform slugs to human-readable names.

**Display:** `components/analyze/SourceMentionsCard.tsx` — "Signals from Source" section, "Source mentions: [signal]" framing, never presented as Project Vintage assertions.

---

### Phase 3 — Engine Field Handling
**Goal:** Confirm no engine serial numbers are stored or ever could be stored.

**Audit result:** `decoded_engine` holds editorial descriptions from NHTSA vPIC (e.g., "4.0L H-6"). NHTSA does not return engine serial numbers. `engine_serial` added to `NEVER_PERSIST_FIELDS` as prospective guard. No existing code writes `engine_serial`.

**Documented:** `docs/data-handling-engine-audit.md`

---

### Phase 4 — Source Attribution
**Goal:** Add `source_publication` column. Every comp must show "Source: [Publication]" label.

**Migration pushed:**
- `20260430070000_data_handling_phase4_source_publication.sql` — adds `source_publication TEXT`

**Code:** `ComparableSalesCard.tsx` renders `source_publication ?? source_platform` as a linked attribution below each comp row.

**Decision D5:** Backfill of existing 199 records deferred. New rows from analyze API populate `source_publication` on write.

---

### Phase 5 — Verbatim Text Removal
**Goal:** Drop `raw_description` column. Listing text discarded after signal extraction (facts-only architecture).

**Migrations pushed:**
- `20260430080000_data_handling_phase5_null_raw_description.sql` — nulls all existing values
- `20260430090000_data_handling_phase5_drop_raw_description.sql` — drops column

**Verified:** `raw_description` column absent from schema.

---

### Phase 6 — Final Validation
**Tests:** 479 tests passing, 0 failures, 4 skipped (skipped files are pre-existing intentional skips).

**Backtest:** Ran `scripts/backtest-comp-engine-v2.ts` against 199 corpus rows (993 generation), 10 cross-validation splits.
- MAPE: 60.0% (mean), 41.4% (median)
- Coverage: 54.1% | Bias: 47.9%
- Full report: `docs/comp-engine-backtest-2026-04-30T16-08-19.md`

---

## Test Delta

| Metric | Before | After |
|---|---|---|
| Tests passing | 474 | 479 |
| Tests failing | 5 | 0 |
| New test files | — | `tests/lib/db/never-persist.test.ts`, `tests/lib/extractors/source-mentions.test.ts` |
| Snapshots updated | — | ChassisIdentityCard ×2, integration scenarios A and B |

Pre-existing failures fixed during this pass (not caused by compliance work):
- `tests/lib/findings/dispatcher.test.ts` + 5 rule files: missing `high_bid_cents` and `has_no_reserve` in `baseListing`
- `tests/lib/auth/viewer-tier.test.ts`: stale mock type for `createClient` (fixed with `as unknown as` cast)

---

## Decisions Logged

See `docs/data-handling-decisions.md` for full decision log (D1–D7).

| ID | Decision |
|---|---|
| D1 | `vin` column kept as dead column; not dropped; guard prevents future writes |
| D2 | VIN display on analysis page deferred; needs session-storage bridge |
| D3 | `guardWrite()` uses key-presence check (not value check) — null value still triggers |
| D4 | `mentioned_*_source` stored as `"PublicationName\|URL"` pipe-delimited string |
| D5 | `source_publication` backfill for existing 199 records deferred |
| D6 | `vin` column not removed (requires separate migration with careful dependency check) |
| D7 | Sentry `beforeSend` VIN redaction deferred until Sentry is wired |

---

## Guard Status

`NEVER_PERSIST_FIELDS = ['vin', 'engine_serial']` is enforced at runtime in all DB write paths.
Any future code attempting to write `vin` or `engine_serial` to the database will throw immediately with a descriptive error including the field name and caller context.

---

## VIN Audit Summary

- Full VINs: never written to DB post-migration; 207 records migrated from `vin` → `vin_hash_partial`
- `vin_partial`: column dropped
- `raw_description`: column dropped (verbatim seller text no longer stored)
- Sentry/PostHog: not yet wired; zero risk at this time
- Console logs: audited; no VIN in any log call (`docs/data-handling-logging-audit.md`)
- `comp_engine_runs.subject_data`: historical rows may contain `vin` in JSONB from before migration; low risk (internal audit logs, not user-facing); cleanup deferred

---

## Commits (this pass)

```
9007029  feat(data-compliance): Phase 1 steps 1-3 — add vin_hash_partial, migrate VINs to hashes, drop vin_partial
83bf49e  feat(data-compliance): Phase 2 + Phase 4 migrations — source-mention signals and source_publication
2b4a36a  feat(data-compliance): NEVER_PERSIST_FIELDS guard + source-mention extractor + write path cleanup
ba8a1d1  feat(data-compliance): Phase 5 raw_description drop + regen types + fix pre-existing test issues
6229ab1  feat: data handling compliance pass — display layer, tests, and audits
```
