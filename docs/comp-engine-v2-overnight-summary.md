# Comp Engine V2 — Overnight Build Summary

**Date:** 2026-04-30  
**Model version:** v1.0  
**Status:** All phases complete. Working tree clean. Not pushed.

---

## Commits This Session (9 total)

| Hash | Description |
|---|---|
| `c6e331b` | feat: comp engine V2 schema — 33 new listing columns + constraint updates |
| `0fdf527` | feat: create trim_taxonomy table, seed 993 (16 rows) |
| `11b79b9` | feat: create generation_weight_config, seed 993 + 996.1 + default |
| `acd49e6` | feat: create generation_mileage_bands, seed 993 + default |
| `d887cdc` | feat: create comp_engine_runs table |
| `d35f333` | feat: comp engine v2 — Phase 2 pipeline implementation + unit tests |
| `4f878c5` | docs: SCHEMA.md — comp engine V2 tables and columns (Phase 1 step 6) |
| `a60fe30` | feat: comp engine v2 — Phase 3 backtest harness |
| `d8029cb` | feat: comp engine v2 — Phase 4 baseline backtest + admin flagging UI |

---

## Phase 1 — Schema Migrations

5 migrations pushed to remote Supabase (`npx supabase db push`, each verified):

| Migration | Content |
|---|---|
| `20260430000000` | 33 new `listings` columns: generation_id, trim_category, trim_variant, market_region, is_comp_resistant (NOT NULL DEFAULT FALSE), is_paint_to_sample, seats_type, wheels_factory_correct, transmission_variant, interior_color_rarity, consignor_type, mechanical_remediation_status, paint_meter_max_microns, accident_history_stated, listing_photo_count, is_featured_listing, cross_listing_group_id, and others. Drops and recreates 3 CHECK constraints to expand allowed values. |
| `20260430010000` | `trim_taxonomy` table — editorial config for which trim categories exist per generation and whether they form a separate comp market. Seeded with 16 rows for gen='993'. |
| `20260430020000` | `generation_weight_config` table — 10 similarity factor weights per generation. Seeded: 993 (sum=1.0), 996.1 (mechanical↑ transmission↑), default (copy of 993). |
| `20260430030000` | `generation_mileage_bands` table — 5-band mileage grouping per generation. Seeded: 993, default. |
| `20260430040000` | `comp_engine_runs` table — full prediction audit log (subject snapshot, weights used, comps used, predicted values, actual price, backtest flag). RLS: admin/beta read only. |

**SCHEMA.md** updated with full documentation of all V2 tables and new columns.

---

## Phase 2 — V2 Pipeline (`lib/comp-engine-v2/`)

9-stage pipeline, all in-memory, pure functions:

| Stage | File | What it does |
|---|---|---|
| 0 (pre) | `engine.ts` | comp_resistant short-circuit → "uncomparable" |
| 1 | `hard-filter.ts` | trim_category, body_style, drivetrain hard gates; is_separate_market isolation |
| 2 | `engine.ts` | sample floor (≥3 comps required) |
| 3 | `mileage-cohort.ts` | museum (<1000 mi) cohort separation |
| 4 | `similarity.ts` | 10-factor weighted similarity scoring; drop comps < 0.4 |
| 5 | `aggregation.ts` | recency decay (0→1.0, 6→1.0, 12→0.8, 24→0.6, 36→0.4, >36→drop) |
| 6 | `aggregation.ts` | true weighted median + P25/P75 + high_variance flag |
| 7 | `aggregation.ts` | ESS-based confidence (0–100), capped at 40 for 3–4 comps |
| 8 | `methodology.ts` | methodology text (stored, not surfaced in UI) |

Supporting files: `types.ts`, `config-loader.ts`, `condition-stub.ts`, `logger.ts`, `index.ts`.

**Condition stub (V1 observable signals):**
`0.4×paint + 0.3×accident + 0.2×photo + 0.1×featured`
- paint: <150µm→1.0, 150–200→0.7, 200–300→0.4, ≥300→0.1, null→0.5
- All signals null → 0.5 neutral score

---

## Phase 2 — Unit Tests

**130 new tests** across 5 files. 438 total passing (up from 308 at session start).

| File | Tests | Coverage |
|---|---|---|
| `tests/lib/comp-engine-v2/hard-filter.test.ts` | 12 | trim gate, body_style, is_separate_market, D6 null pass-through |
| `tests/lib/comp-engine-v2/mileage-cohort.test.ts` | 8 | museum cohort, normal pool, null subject |
| `tests/lib/comp-engine-v2/condition-stub.test.ts` | 21 | each sub-score, formula weights, boundary values |
| `tests/lib/comp-engine-v2/similarity.test.ts` | ~50 | getBand, cross-band matrix, yearSimilarity, specComposite, drop threshold |
| `tests/lib/comp-engine-v2/aggregation.test.ts` | ~40 | recencyWeight, weighted median, P25/P75, high_variance, ESS confidence |

---

## Phase 3 — Backtest Harness (`scripts/backtest-comp-engine-v2.ts`)

- 10 random 80/20 splits over full corpus
- Metrics: MAPE (mean + median), range coverage (P25–P75), directional bias
- Per-cohort breakdowns: trim_category, mileage band, year decade
- Top-10 worst outliers
- Synthetic edge-case tests: comp_resistant, empty pool, museum subject, mileage perturbation, separate-market isolation
- Output: timestamped `.md` + `.json` in `docs/`
- Elapsed: **0.5s** (target was <60s)

---

## Phase 4 — Baseline Backtest + Admin UI

### Baseline numbers (993, seed=42, 10×80/20)

| Metric | Value | Notes |
|---|---|---|
| Corpus size | 199 listings | All 993 gen sold listings in DB |
| Total predictions | 397 / 400 | 0.8% insufficient rate |
| MAPE (mean) | 60.8% | Expected high — all trim/condition null |
| MAPE (median) | 43.6% | Better signal; outliers inflate mean |
| Range coverage | 50.9% | Close to 50% = P25/P75 band is tight |
| Directional bias | 50.9% | No systematic over/under estimation |
| Avg comp count | 197 | Near full pool (all trim_categories null) |
| Worst outlier | 4,228% APE | `f5a03a0b` — $3,050 actual vs $132k predicted; candidate for is_comp_resistant |
| Elapsed | 0.5s | |

**Why MAPE is high:** All new V2 columns (`trim_category`, `condition_stub` inputs, `spec_composite` inputs) are NULL on the current corpus. The engine falls back to year+mileage similarity only. MAPE will improve as these columns are populated.

**No directional bias** (50.9%) confirms the weighted median is working correctly — no systematic skew.

### Admin Flagging UI

- `GET /api/admin/comp-flags` — lists all comp_resistant or cross-grouped listings
- `PATCH /api/admin/comp-flags` — sets `is_comp_resistant` and/or `cross_listing_group_id`
- `app/(app)/admin/comp-flags/page.tsx` — minimal admin UI: toggle comp_resistant, edit cross_listing_group_id inline, add by UUID

---

## Key Architectural Decisions

See `docs/comp-engine-v2-decisions.md` for full log. Highlights:

- **D6 (NULL pass-through):** NULL on either side of any hard filter = skip that filter. Makes engine functional on current sparse corpus.
- **D9 (dot notation):** Generation IDs use `996.1` not `996_1` to match `porsche_generations.generation_id`.
- **Weighted median not mean:** V2 uses true weighted median + P25/P75. V1 used weighted mean ± stddev.
- **MODEL_VERSION = 'v1.0':** Bumped on every logic or weight change; logged in every `comp_engine_runs` row.
- **`is_comp_resistant` NOT NULL DEFAULT FALSE:** Editorial flag. Never null. Engine returns "uncomparable" verdict immediately when set.

---

## Working Tree

```
git status: clean
git log: 9 new commits on main, not pushed
test count: 438 passing (up from 308)
```

---

## What Improves MAPE Next

1. **Populate `trim_category`** on existing 199 listings — enables trim-based hard filtering and cohort separation
2. **Populate condition signals** (`paint_meter_max_microns`, `listing_photo_count`, etc.) — activates the condition_stub factor (currently 0.5 neutral for all)
3. **Expand corpus** — more listings per trim = better weighted median
4. **Flag `is_comp_resistant`** on outlier `f5a03a0b` ($3,050 listing) via `/admin/comp-flags`
