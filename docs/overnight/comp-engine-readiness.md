# Comp Engine V2 — Session 1 Readiness Audit

**Date:** 2026-05-18  
**Auditor:** Read-only — no code changed, no tests run, no commits.  
**Scope:** `lib/comp-engine-v2/` (12 modules, 1,527 src lines), `tests/lib/comp-engine-v2/` (7 test files, 1,187 lines), callers in `app/api/`, `app/(app)/analyze/`, `scripts/`.

---

## 1. Module Inventory

| File | Lines | Responsibility |
|---|---|---|
| `types.ts` | 160 | All shared types: `V2Subject`, `V2CompCandidate`, `ScoredComp`, `FairValueV2`, `ConfidenceComponents`, `V2CompsResult`, `FactorName`, `CascadeLevel`, `MODEL_VERSION` |
| `index.ts` | 170 | Public entry: `computeCompsV2()`, `fetchV2Pool()`, 48-month cascade retry logic |
| `engine.ts` | 218 | 9-stage pipeline orchestrator (`runCompEngineV2`) — stateless, no DB, suitable for backtest |
| `hard-filter.ts` | 147 | Stage 1: trim isolation, body-style normalization, bilateral separate-market gate |
| `mileage-cohort.ts` | 38 | Stage 3: museum cohort separation (<1,000 mi threshold) |
| `similarity.ts` | 204 | Stage 4: 11-factor weighted similarity scoring, 0.4 drop threshold |
| `aggregation.ts` | 123 | Stages 5–7: recency weighting, weighted percentile median/P25/P75, confidence score 0–100 |
| `cascade.ts` | 169 | Stage 2: 6-level cascade pool selection, Carrera-family expansion |
| `condition-stub.ts` | 63 | V1 condition stub: paint/accident/photo/featured → 0–1 score |
| `methodology.ts` | 37 | Stage 8: per-run methodology text (stored in DB, not surfaced in UI) |
| `config-loader.ts` | 134 | DB config fetch: weights, mileage bands, trim taxonomy; generation fallback to 'default' |
| `logger.ts` | 64 | Stage 9: writes every prediction to `comp_engine_runs` |

**Callers:**
- `app/api/analyze/route.ts` — calls `computeCompsV2(listingId)` post-upsert (non-fatal)
- `app/api/watchlist/[listingId]/refresh/route.ts` — same pattern
- `app/(app)/analyze/[id]/page.tsx` — reads `comp_engine_runs` to display results
- `scripts/backtest-comp-engine-v2.ts` — offline 80/20 backtest harness, calls `runCompEngineV2` directly
- `scripts/preflight-correlation-analysis.ts` — correlation analysis; imports types only

---

## 2. Session 1 Deliverable Status

### 2.1 Feature Registry (`lib/comp-engine-v2/feature-registry.ts`)

**Status: Not started.**

No `feature-registry.ts` file exists. The concept is entirely absent from the codebase. Currently, features are hardcoded as individual named functions inside `similarity.ts` (e.g., `mileageSimilarity`, `yearSimilarity`, `specCompositeSimilarity`). There is no declarative registry; features are invoked imperatively in `scoreComp()` at `similarity.ts:130–188`.

What's missing: the entire file. A registry entry would need at minimum: `name` (matching a `FactorName`), `extractor` (function from subject + comp → raw value), `transformation` type (linear / log / polynomial / binary / interaction), and `description`. The transformation type is the critical new concept — it determines how raw feature values feed into the Ridge regression model.

**Architectural note:** The registry is the foundation for Session 1. The adaptive Ridge regression (§2.2) depends on it — it needs a way to programmatically extract and transform features into a design matrix. Without the registry, Ridge regression requires hard-coded feature extraction, defeating the purpose.

---

### 2.2 Adaptive Ridge Regression (`aggregation.ts`)

**Status: Not started.**

Current `aggregation.ts` (123 lines) implements weighted percentile aggregation — a pure ranking/interpolation method with no regression. There is no matrix math, no regularization, no `alpha` parameter.

The locked spec calls for:
- **Ridge regression** replacing or supplementing weighted percentile
- **Adaptive alpha:** `alpha = base_alpha × (k / pool_size)` where `k` is the number of selected comps and `pool_size` is the total generation pool size — so regularization scales with data density (sparse pool → high alpha → more regularization → stays closer to prior)
- **Prior blending** (§2.3) — regression prediction blended with generation-level prior

Current fair-value computation (`computeWeightedFairValue`, `aggregation.ts:66–74`) is 9 lines. The Ridge path will be materially larger.

**Library gap:** No math/stats library is installed. `package.json` has zero dependencies matching any of: `ml-`, `simple-statistics`, `jstat`, `numeric`, `mathjs`, `sylvester`, `ndarray`, `scijs`. Ridge regression requires solving `(XᵀX + αI)⁻¹ Xᵀy`. Options:
1. **Implement inline** — for a single-feature case (mileage_log as primary predictor) this is trivial: `~15 lines` of vanilla JS math. For the full multi-feature case, requires a small matrix inverse utility.
2. **Add `ml-matrix`** (npm: `ml-matrix`, ~180 KB unpacked, no native deps) — standard in the JS ML ecosystem, covers matrix ops cleanly.
3. **Add `simple-statistics`** — covers OLS but not Ridge natively; would require manual regularization on top.

**Recommendation:** `ml-matrix` for the full spec. If the session targets only mileage-based Ridge as an MVP, inline math is sufficient and avoids a new dependency.

---

### 2.3 Prior Blending

**Status: Not started.**

Generation-level priors (mean sale price per generation) do not exist in any form in the current code. The blending weights from the spec:

| Comp tier | Comps | Regression weight | Prior weight |
|---|---|---|---|
| Tier 1 | 1–3 | 30% | 70% |
| Tier 2 | 4–9 | 60% | 40% |
| Tier 3 | 10–19 | 80% | 20% |
| Tier 4 | 20+ | 95% | 5% |

Currently, the engine only uses comps — there is no prior fallback. For 1–3 comp situations, the result is `low_confidence` with no blend toward a prior.

This feature requires:
1. A `generation_priors` table or in-memory cache of per-generation median prices (to be computed from the full `listings` corpus)
2. A `loadGenerationPrior(generationId)` function (likely a new export from `config-loader.ts`)
3. Blend logic in `aggregation.ts` — after Ridge prediction, blend with prior weighted by comp count tier

The nightly refresh hook mentioned in the spec (likely Session 2) means the prior itself doesn't need to be computed at prediction time — it's a cached DB value.

---

### 2.4 Initial Feature Set: `mileage_log`, `age_months`, `mileage_log_x_era`

**Status: Partially implemented (raw inputs available; transformations not applied).**

- **`mileage_log`:** Raw mileage is available on every `V2CompCandidate` (`types.ts:68`). The log transform (`Math.log(mileage)`) is not computed anywhere — mileage is used only as a band-lookup input to `mileageSimilarity()`. No continuous log-transformed feature exists.
- **`age_months`:** `sold_at` (ISO 8601 auction end date) is on every candidate (`types.ts:71`). Age in months is implicitly computed in `recencyWeight()` (`aggregation.ts:21–22`) but not exposed as a standalone feature. It is not logged or included in any feature vector.
- **`mileage_log_x_era`:** The interaction term doesn't exist. `era` assignment (§2.5) doesn't exist yet either, so this is doubly absent.

---

### 2.5 Era Taxonomy: air-cooled / water-cooled NA / water-cooled turbo+GT / modern turbo

**Status: Not started.**

No era mapping exists anywhere in the codebase. `generation_id` is used directly (e.g., '993', '996.1', '992') but there is no function mapping generation → era bucket. The `config-loader.ts` loads generation-specific weights but there is no `era` field on any type or config structure.

**What's needed:** A small lookup table or pure function `getEra(generationId: string): Era` — something like:

```
air_cooled:        356, 912, 914, 930, 964, 993
water_cooled_na:   996.1, 996.2, 997.1, 997.2, 991.1, 991.2, 718
water_cooled_gt:   997.2 GT3/GT2, 991.x GT3/RS/R
modern_turbo:      992, 992 Turbo
```

The exact mapping needs to be defined as part of Session 1. This is a ~20-line addition to `types.ts` + a small utility function, but the taxonomy itself requires a conscious decision.

---

### 2.6 Per-Prediction Feature Contribution Logging

**Status: Partially implemented (factor scores logged at similarity level; regression contributions not yet possible).**

`ScoredComp.factor_scores` (`types.ts:105`) captures each factor's raw similarity score (0–1) for every comp. This is logged via `comps_used_json` in `logger.ts:24–31`. However:

- The current log only includes `listing_id`, `similarity_score`, `recency_weight`, `final_weight`, `price_cents` — it explicitly **drops** `factor_scores` (`logger.ts:24–31`).
- Even if factor_scores were included, they are similarity scores, not regression coefficients. The spec calls for logging *how much each feature contributed to the final price prediction* — which requires regression coefficient × feature value, not similarity proximity.

The `comp_engine_runs` table stores `comps_used_json` as JSONB but the schema for that column would need to include factor-level contribution amounts. The logger would need to be extended once Ridge regression is in place.

**What's present that helps:** The `factor_scores` are already computed and available on every `ScoredComp` — they just need to (a) survive the logger and (b) be replaced/augmented with regression contribution amounts post-Session 1.

---

### 2.7 Cached Generation Priors with Nightly Refresh Hook

**Status: Not started (correctly — spec assigns to Session 2).**

No generation priors exist. No nightly cron hook exists for comp engine. `config-loader.ts` could host a `loadGenerationPrior()` function, but the refresh mechanism belongs in Session 2.

---

### 2.8 Confidence Surfacing to "The Take" Copy

**Status: Not started (correctly — spec assigns to Session 5).**

`confidence_score` is computed (`aggregation.ts:84–117`) and stored in `comp_engine_runs`, but it is not surfaced in any UI component. The analyze page reads from `comp_engine_runs` but no "moderate confidence (8 comps)" copy exists yet.

---

## 3. Architectural Conflicts

### Conflict 1: Similarity scoring vs. regression — parallel paths needed

The current engine uses similarity-weighted percentile aggregation as its **only** pricing method. Session 1 introduces Ridge regression as the primary predictor, with prior blending on top. These are not drop-in replacements — they operate on different input representations:

- **Current:** per-comp similarity score (0–1) × recency weight → weighted percentile
- **Proposed:** feature vector per comp → design matrix `X`, target vector `y` (log prices) → Ridge solve → prediction

**Resolution path:** The two systems are not mutually exclusive. The weighted percentile can serve as a fallback (or be retired after Session 1 validates Ridge). The cleanest architectural move is to add a new `computeRidgeFairValue()` function to `aggregation.ts` and route `engine.ts` Stage 6 through it conditionally (or unconditionally replacing Stage 6 once confidence is established). The similarity scoring (Stage 4) still provides the comp pool quality ranking — Ridge uses the comps, not the similarity scores, as its input.

**Risk:** If Ridge is introduced as a replacement and the new path has a bug, there is no automatic fallback. The recommendation is to run both and compare during Session 1, then cut over.

### Conflict 2: Logger drops `factor_scores`

`logger.ts:24–31` maps `comps_used` to a narrow shape that discards `factor_scores`. Per the spec, per-prediction feature contributions should be logged. This requires either:
1. Extending the `comps_used_json` schema to include contribution weights, or
2. Adding a separate `feature_contributions_json` column to `comp_engine_runs`

The current JSONB schema may accommodate option 1 without a migration (JSONB is schema-less on the Supabase side), but the TypeScript logger would need updating.

### Conflict 3: Feature registry vs. hardcoded factor functions

The feature registry is a new abstraction layer sitting between the raw `V2CompCandidate` fields and the Ridge design matrix. Currently, `similarity.ts` contains 11 hardcoded factor functions. The registry must map those factors (or a subset) to extractors + transformations. There is a choice:

- **Keep similarity scoring intact** (for the cascade/hard-filter/comp-selection stages) and add a separate registry that operates only on the final comp pool for Ridge pricing.
- **Unify** — make similarity scoring itself registry-driven.

The locked spec implies the registry is for the regression features (`mileage_log`, `age_months`, `mileage_log_x_era`), not for all 11 similarity factors. This is the safer path for Session 1: registry owns the 3 regression features; similarity.ts retains the 11 comp-scoring factors. They coexist.

### Conflict 4: Era taxonomy requires generation_id → era mapping — no authority exists

The era taxonomy (§2.5) is not derivable from any existing config table. It must be declared as code or as a new DB seed. The generation_id string space already has 20+ values; a mapping table or pure function must be authoritative from Session 1 forward, as `mileage_log_x_era` depends on it. If this decision is deferred, the interaction term cannot be built.

---

## 4. External Dependencies for Session 1

### Math/stats library: **NONE installed**

No matrix math, regression, or statistics library exists in `package.json`. Session 1 needs to solve `β = (XᵀX + αI)⁻¹ Xᵀy`.

**Options ranked:**

| Option | Package | Size | Pros | Cons |
|---|---|---|---|---|
| **Inline (recommended for MVP)** | none | 0 KB | Zero new deps; full control; ~30 lines for 1-3 features | Needs manual matrix inverse; fragile if feature count grows |
| **`ml-matrix`** | `ml-matrix` | ~180 KB | Battle-tested; handles arbitrary feature counts; Vitest-friendly | New dependency |
| **`simple-statistics`** | `simple-statistics` | ~50 KB | Already known quantity in JS ML | No native Ridge; would need regularization wrapper |

For Session 1's initial 3-feature Ridge, an inline implementation is entirely feasible. A 3×3 matrix inverse is analytically solvable. If the plan is to expand to 10+ features in Session 2, install `ml-matrix` now.

### No other new dependencies are required for Session 1.

---

## 5. Session 1 Work Breakdown

### Files requiring new creation

| New File | Est. Lines | Purpose |
|---|---|---|
| `lib/comp-engine-v2/feature-registry.ts` | ~80 | Declarative feature registry: 3 initial entries (mileage_log, age_months, mileage_log_x_era), extractor functions, transformation types, era utility |
| `tests/lib/comp-engine-v2/feature-registry.test.ts` | ~60 | Registry lookup, extractor correctness, era mapping, interaction term computation |
| `tests/lib/comp-engine-v2/ridge.test.ts` | ~80 | Ridge coefficient shape, adaptive alpha formula, prior blending at each tier threshold |

---

### Files requiring modification

#### `lib/comp-engine-v2/aggregation.ts` (123 lines currently)

**Add:**
- `computeRidgeFairValue(comps, config, prior, poolSize)` — builds design matrix from feature registry, solves Ridge, blends with prior (~80 new lines)
- `blendWithPrior(regressionPrediction, prior, compCount)` — implements the 70/40/20/5 tier table (~25 new lines)
- `adaptiveAlpha(baseAlpha, k, poolSize)` — single-line formula, exported for testing

**Modify:**
- Nothing removed in Session 1; `computeWeightedFairValue` stays as a fallback until Session 1 validates Ridge

**Net change:** +~110 lines added, 0 deleted.

---

#### `lib/comp-engine-v2/types.ts` (160 lines currently)

**Add:**
- `Era` type: `'air_cooled' | 'water_cooled_na' | 'water_cooled_gt' | 'modern_turbo'`
- `FeatureTransformation` type: `'linear' | 'log' | 'polynomial' | 'binary' | 'interaction'`
- `FeatureRegistryEntry` interface: `{ name, extractor, transformation, description }`
- `GenerationPrior` interface: `{ generation_id, median_cents, sample_size, computed_at }`
- Extend `V2CompsResult` with optional `feature_contributions?: Record<string, number>` — for per-prediction contribution logging

**Net change:** +~25 lines added, 0 deleted.

---

#### `lib/comp-engine-v2/engine.ts` (218 lines currently)

**Modify Stage 6** (~lines 165–175): Route through `computeRidgeFairValue` when prior is available and pool size ≥ 3. Keep `computeWeightedFairValue` as a fallback if Ridge fails.

**Add:** Accept optional `prior` and `poolSize` parameters to `runCompEngineV2()` signature — both nullable for backward compatibility.

**Net change:** ~20 lines modified/added, 0 deleted.

---

#### `lib/comp-engine-v2/config-loader.ts` (134 lines currently)

**Add:** `loadGenerationPrior(generationId)` — queries a `generation_priors` table (to be created, or returns null if table doesn't exist yet). Returns `GenerationPrior | null`.

**Net change:** ~25 lines added.

---

#### `lib/comp-engine-v2/index.ts` (170 lines currently)

**Modify `computeCompsV2()`:** Pass pool size and loaded prior into `runCompEngineV2()`.

**Net change:** ~10 lines modified.

---

#### `lib/comp-engine-v2/logger.ts` (64 lines currently)

**Modify `logCompRun()`:** Include `factor_scores` in `comps_used_json` (or add `feature_contributions_json` column). The logger currently strips factor_scores at line 24–31 — that block needs expansion.

**Net change:** ~15 lines modified.

---

#### `tests/lib/comp-engine-v2/aggregation.test.ts` (125 lines currently)

**Add:** Tests for `adaptiveAlpha`, `blendWithPrior`, and `computeRidgeFairValue` with known inputs. Also test that prior blending at tier boundaries (3 comps = 70% prior, 10 comps = 20% prior) is correct.

**Net change:** ~60 lines added.

---

### Summary table

| File | New lines | Modified lines | Deleted lines | Net |
|---|---|---|---|---|
| `feature-registry.ts` (new) | 80 | — | — | +80 |
| `aggregation.ts` | 110 | 0 | 0 | +110 |
| `types.ts` | 25 | 0 | 0 | +25 |
| `engine.ts` | 10 | 20 | 0 | +30 |
| `config-loader.ts` | 25 | 0 | 0 | +25 |
| `index.ts` | 0 | 10 | 0 | +10 |
| `logger.ts` | 0 | 15 | 0 | +15 |
| `tests/feature-registry.test.ts` (new) | 60 | — | — | +60 |
| `tests/ridge.test.ts` (new) | 80 | — | — | +80 |
| `tests/aggregation.test.ts` | 60 | 0 | 0 | +60 |
| **Total** | **450** | **45** | **0** | **+495** |

Existing codebase: 1,527 source lines + 1,187 test lines = 2,714 lines total. Session 1 adds ~495 lines — an 18% increase, concentrated in `aggregation.ts` and the new registry/test files.

---

## 6. Recommended Order of Operations

1. **Define era taxonomy first** (`types.ts` + `feature-registry.ts`) — everything downstream depends on this. Era is a pure-code decision; it doesn't require a DB migration. Lock the 4 era buckets and the generation → era mapping before writing any regression code.

2. **Write `feature-registry.ts`** with the 3 initial features: extractor functions, transformation labels, era utility. Write `feature-registry.test.ts` in parallel — the registry is pure functions and trivially testable.

3. **Write `computeRidgeFairValue`** in `aggregation.ts` — start with a 1-feature version (`mileage_log` only) to validate that Ridge produces reasonable coefficients before adding `age_months` and the interaction term. Write inline matrix math first; add `ml-matrix` only if the multi-feature case is needed in this session.

4. **Write `blendWithPrior`** + `adaptiveAlpha` in `aggregation.ts` with stub prior (prior = null → regression-only). This allows the engine to run without a DB prior during development.

5. **Extend `engine.ts` Stage 6** to route through Ridge. Keep `computeWeightedFairValue` fallback in place — use it when pool size < 3 or Ridge returns NaN.

6. **Add `loadGenerationPrior`** to `config-loader.ts` — returns null until `generation_priors` table is seeded. The prior blending path already handles null (uses regression-only).

7. **Update logger** to include factor contributions in `comps_used_json`.

8. **Run backtest** against 993 corpus. Compare MAPE under Ridge vs. current weighted-percentile baseline. Gate on: MAPE not worse than current baseline before cutting over.

9. **Add tests** for `ridge.test.ts` and extend `aggregation.test.ts`.

---

## 7. Risk Assessment

### HIGH — Inline Ridge math correctness

If `(XᵀX + αI)⁻¹ Xᵀy` is implemented inline, a subtle numerical error (e.g., column centering/scaling omitted) will produce silently wrong coefficients. Symptoms: predictions look plausible but have systematic bias. **Mitigation:** Write the Ridge test (`ridge.test.ts`) with a hand-solved 1D case before touching the engine. Verify coefficient sign on `mileage_log` is negative (higher mileage → lower price — if it's positive, the math is wrong).

### HIGH — Era taxonomy definition

The `mileage_log_x_era` interaction term requires a definitive era assignment for every generation_id in the corpus. If the mapping is incomplete (e.g., '996.1' falls through to a null era), the interaction term is undefined and the feature silently drops out of the design matrix. **Mitigation:** Enumerate all generation_id strings present in the DB before writing the mapping. Use `SELECT DISTINCT generation_id FROM listings` — run this before Session 1 starts. Any unrecognized generation_id should throw at startup, not silently return null.

### MEDIUM — Prior blending without seeded priors

Until `generation_priors` is seeded, the blending path must gracefully degrade to regression-only. The risk is that the "prior = null → regression-only" fallback gets shipped and the prior never gets wired in. **Mitigation:** Add a console.warn when prior is null for a generation that should have one (i.e., generation_id is not 'default').

### MEDIUM — Backward compatibility of `V2CompsResult`

Adding `feature_contributions` to `V2CompsResult` changes the type contract. The analyze page, watchlist refresh route, and backtest harness all consume this type. If the field is optional (`feature_contributions?`) and existing callers are not updated, runtime behavior is correct but the contribution data is silently dropped by callers that don't read it. **Mitigation:** Mark as optional; update the logger first; update display layer in a later session (Session 5 per spec).

### LOW — `ml-matrix` dependency (if chosen)

`ml-matrix` is a well-maintained, MIT-licensed package with no native deps. Risk is low. If it causes bundle size concerns (this runs server-side only — route handlers and scripts), size is irrelevant.

### LOW — Existing tests

Session 1 adds ~495 lines. The 7 existing test files (1,187 lines) are unaffected — they test stages that are not modified (hard-filter, cascade, similarity, mileage-cohort, condition-stub, recency). The only existing test file touched is `aggregation.test.ts`, which gets new test cases added.

---

## 8. What Does NOT Need to Change in Session 1

For clarity: the following modules are **complete, correct, and should not be touched** in Session 1.

- `hard-filter.ts` — Stage 1 is final as-built
- `mileage-cohort.ts` — Stage 3 is final as-built
- `similarity.ts` — Stage 4 (11-factor scoring) remains unchanged; Ridge consumes the comp pool selected by this stage, not a replacement for it
- `cascade.ts` — Stage 2 cascade logic is final as-built
- `condition-stub.ts` — V1 stub is complete; V2 AI extraction is a later phase
- `methodology.ts` — Stage 8 text can be updated later to mention Ridge; not a Session 1 blocker
- `backtest-comp-engine-v2.ts` — will continue to work unchanged because `runCompEngineV2` signature additions are backward-compatible (optional parameters)

---

*End of audit. Recommendations: start with era taxonomy decision, then feature-registry.ts, then inline Ridge math with a hand-solved test case before integrating into the engine.*
