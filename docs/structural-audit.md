# Structural Audit — Comp Engine Integration Planning

Generated 2026-04-30. Read-only. No production code modified.

---

## A. Schema and Storage

### A1. Reference Data Directories

All reference data is **database-driven via Supabase SQL migrations**. No filesystem `data/`, `lib/data/`, `src/data/`, or `prisma/seed/` directories exist.

| Migration File | Table Seeded | Format | Content |
|---|---|---|---|
| `supabase/migrations/20260428050000_seed_porsche_generations.sql` | `porsche_generations` | SQL INSERT | 34 rows — all Porsche generations (356 through Taycan); fields: generation_id, model, year_start/end, body_styles (array), engine_type, production_count |
| `supabase/migrations/20260429030000_color_codes_schema_and_seed.sql` lines 67–147 | `porsche_color_codes` | SQL INSERT | 11 rows — 7 for 993, 4 for 992; fields: color_code, color_name, rarity, is_special_order, generation_id |
| `supabase/migrations/20260430010000_create_trim_taxonomy.sql` lines 45–99 | `trim_taxonomy` | SQL INSERT | 16 rows for 993 generation — all trim_category values with display_name, production_total, is_separate_market |
| `supabase/migrations/20260430020000_create_generation_weight_config.sql` lines 50–94 | `generation_weight_config` | SQL INSERT | 30 rows — weights for 993, 996.1, and default fallback; 10 factors each |
| Comp engine v2 migration (commit `acd49e6`) | `generation_mileage_bands` | SQL INSERT | 993 + default bands: ultra_low/low/moderate/high/very_high with min/max_miles |

**Seed script (corpus):** `scripts/seed-corpus-bat.ts` — crawls BaT public archive, not a static file. Invocation: `npx tsx scripts/seed-corpus-bat.ts --generation 993 --max 200`

---

### A2. Database / ORM / Migration Tooling

**ORM / Query builder:** Supabase PostgREST client (`@supabase/supabase-js` v2.104.1, `package.json` lines ~16–17). No Prisma, Drizzle, or raw `pg`. All queries use the typed Supabase client or the service-role admin client.

**Migration tooling:** Supabase CLI. All migrations are timestamped SQL files in `supabase/migrations/`. Applied via:
- `npx supabase db push --linked` (targets remote project, no local Docker required)
- `supabase/config.toml` lines 53–65: migrations enabled; seeds only run on `db reset`, not on `db push`

**`supabase/seed.sql`:** Referenced in `config.toml` (`sql_paths = ["./seed.sql"]`) but **the file does not exist** in the repo. Config entry is a placeholder — no seed runs on `db reset`.

**Seed scripts in `scripts/`:**

| Script | Invocation | Notes |
|---|---|---|
| `scripts/seed-corpus-bat.ts` | `npx tsx scripts/seed-corpus-bat.ts --generation 993 --max 200` | Crawls BaT, writes to `listings` table |
| `scripts/backtest-comp-engine-v2.ts` | `npx tsx scripts/backtest-comp-engine-v2.ts [--generation 993] [--splits 10] [--seed N]` | Read-only backtest harness |
| `scripts/preflight-correlation-analysis.ts` | `set -a && source .env.local && set +a && npx tsx scripts/preflight-correlation-analysis.ts` | Read-only corpus correlation analysis |

---

### A3. Table Schemas

#### `listings` (121 columns — critical fields shown in full; remainder summarized)

**Identity and source**

| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NOT NULL | gen_random_uuid() |
| `source_platform` | text | NOT NULL | — |
| `source_url` | text | NOT NULL | — |
| `source_listing_id` | text | NOT NULL | — |
| `source_publication` | text | NULL | — |
| `vin` | text | NULL | — (dead column — NEVER_PERSIST_FIELDS) |
| `vin_hash_partial` | text | NULL | — |
| `make` | text | NOT NULL | — |
| `model` | text | NOT NULL | — |

**Vehicle identity — critical fields**

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `generation` | text | NULL | — | Legacy field (human label); distinct from `generation_id` |
| `generation_id` | text | NULL | — | FK-equivalent to `porsche_generations`; comp engine key |
| `year` | smallint | NOT NULL | — | Source year |
| `decoded_year` | integer | NULL | — | NHTSA-decoded year |
| `trim` | text | NULL | — | Raw text trim from listing |
| `trim_category` | text | NULL | — | V2 comp engine bucket; **0/199 populated in corpus** |
| `trim_variant` | text | NULL | — | Sub-category within trim_category; **0/199 populated** |
| `body_style` | text | NULL | — | Raw listing body style |
| `decoded_body_class` | text | NULL | — | NHTSA-decoded; used by hard filter |
| `transmission` | text | NULL | — | Raw NHTSA text — polluted with non-transmission values |
| `transmission_variant` | text | NULL | — | V2 comp field (manual/tiptronic/pdk); **0/199 populated** |
| `drivetrain` | text | NULL | — | Used by hard filter |
| `market_region` | text | NULL | — | V2 comp field; **0/199 populated** |

**Pricing (all in cents)**

| Column | Type | Nullable | Default |
|---|---|---|---|
| `asking_price` | integer | NULL | — |
| `high_bid` | integer | NULL | — |
| `final_price` | integer | NULL | — |
| `currency` | text | NOT NULL | 'USD' |
| `has_no_reserve` | boolean | NOT NULL | false |
| `mileage` | integer | NULL | — |
| `mileage_unit` | text | NOT NULL | 'mi' |

**V2 comp engine enrichment fields (all NULL in current corpus)**

| Column | Type | Nullable |
|---|---|---|
| `is_paint_to_sample` | boolean | NULL |
| `seats_type` | text | NULL |
| `wheels_factory_correct` | boolean | NULL |
| `interior_color_rarity` | text | NULL |
| `consignor_type` | text | NULL |
| `mechanical_remediation_status` | text | NULL |
| `paint_meter_max_microns` | integer | NULL |
| `accident_history_stated` | text | NULL |
| `listing_photo_count` | integer | NULL |
| `is_featured_listing` | boolean | NULL |
| `mod_status` | text | NULL |

**Condition signals**

| Column | Type | Nullable |
|---|---|---|
| `condition_signal` | text | NULL |
| `paint_signal` | text | NULL |
| `interior_signal` | text | NULL |
| `numbers_matching` | boolean | NULL |

**Data compliance**

| Column | Type | Nullable | Default |
|---|---|---|---|
| `is_comp_resistant` | boolean | NOT NULL | false |
| `cross_listing_group_id` | uuid | NULL | — |

**Source-mention signals (Phase 2 compliance pass)**

16 columns: `mentioned_repaint`, `mentioned_repaint_source`, `mentioned_accident_history`, `mentioned_accident_history_source`, `mentioned_engine_service`, `mentioned_engine_service_source`, `mentioned_transmission_service`, `mentioned_transmission_service_source`, `mentioned_matching_numbers`, `mentioned_matching_numbers_source`, `mentioned_modifications`, `mentioned_modifications_source`, `mentioned_recent_ppi`, `mentioned_recent_ppi_source`, `mentioned_original_owner`, `mentioned_original_owner_source` — all boolean/text, all NULL.

**`sub_generation`:** NOT IN SCHEMA. Does not exist as a column on `listings`.

---

#### `trim_taxonomy`

| Column | Type | Nullable | Default |
|---|---|---|---|
| `generation` | text | NOT NULL | — |
| `trim_category` | text | NOT NULL | — |
| `display_name` | text | NOT NULL | — |
| `production_total` | integer | NULL | — |
| `is_separate_market` | boolean | NOT NULL | false |
| `notes` | text | NULL | — |
| `created_at` | timestamptz | NOT NULL | now() |

PK: `(generation, trim_category)`. 16 rows seeded for 993; no other generations.

---

#### `generation_weight_config`

| Column | Type | Nullable | Default |
|---|---|---|---|
| `generation` | text | NOT NULL | — |
| `factor_name` | text | NOT NULL | — |
| `weight` | numeric | NOT NULL | — |
| `notes` | text | NULL | — |
| `created_at` | timestamptz | NOT NULL | now() |
| `updated_at` | timestamptz | NOT NULL | now() |

PK: `(generation, factor_name)`. Current weights for 993:

| Factor | Weight |
|---|---|
| `mileage_similarity` | 0.300 |
| `condition_stub` | 0.150 |
| `year_similarity` | 0.100 |
| `market_region_match` | 0.100 |
| `spec_composite` | 0.100 |
| `trim_variant_match` | 0.100 |
| `color_rarity` | 0.050 |
| `transmission_variant_match` | 0.050 |
| `consignor_tier_match` | 0.050 |
| `mechanical_remediation_status` | 0.000 |

---

#### `generation_mileage_bands`

| Column | Type | Nullable | Default |
|---|---|---|---|
| `generation` | text | NOT NULL | — |
| `band_name` | text | NOT NULL | — |
| `min_miles` | integer | NOT NULL | — |
| `max_miles` | integer | NULL | — (NULL = unbounded) |
| `notes` | text | NULL | — |
| `created_at` | timestamptz | NOT NULL | now() |

PK: `(generation, band_name)`. Bands: `ultra_low`, `low`, `moderate`, `high`, `very_high`.

---

#### `comp_engine_runs`

| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NOT NULL | gen_random_uuid() |
| `created_at` | timestamptz | NOT NULL | now() |
| `subject_listing_id` | uuid | NULL | — |
| `subject_data` | jsonb | NULL | — |
| `model_version` | text | NOT NULL | — |
| `generation_used` | text | NOT NULL | — |
| `weights_json` | jsonb | NOT NULL | — |
| `comps_used_json` | jsonb | NOT NULL | '[]' |
| `predicted_median` | bigint | NULL | — |
| `predicted_p25` | bigint | NULL | — |
| `predicted_p75` | bigint | NULL | — |
| `confidence_score` | numeric | NULL | — |
| `methodology_text` | text | NULL | — |
| `actual_price` | bigint | NULL | — |
| `was_backtest` | boolean | NOT NULL | false |
| `verdict` | text | NULL | — |

---

#### `market_snapshots`

| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | uuid | NOT NULL | gen_random_uuid() |
| `generation_id` | text | NULL | — |
| `trim_category` | text | NULL | — |
| `snapshot_date` | date | NOT NULL | — |
| `active_listing_count` | integer | NULL | — |
| `sold_count_30d` | integer | NULL | — |
| `median_price_30d` | bigint | NULL | — |
| `median_dom_30d` | integer | NULL | — |
| `sell_through_rate_30d` | numeric | NULL | — |

Not currently read by the comp engine.

---

### A4. `trim_category` Taxonomy — All Code Locations

`trim_category` is a **free-text column with no code-level constraint** (no TypeScript enum, no Zod schema, no const array). Validation is purely structural (DB uniqueness via PK on `trim_taxonomy`).

| Location | Type | Line(s) | Content |
|---|---|---|---|
| `supabase/migrations/20260430010000_create_trim_taxonomy.sql` | SQL INSERT seed | 45–99 | Authoritative list of 16 values for 993 |
| `lib/comp-engine-v2/types.ts` | TypeScript interface field | 71 | `trim_category: string \| null` on `V2CompCandidate` |
| `lib/comp-engine-v2/types.ts` | TypeScript interface field | ~51 | `trim_category: string` on `TrimTaxonomyEntry` (runtime-loaded) |
| `lib/comp-engine-v2/config-loader.ts` | Runtime DB load | 86–102 | `loadTaxonomy()` fetches all rows for generation at engine run time |
| `lib/comp-engine-v2/hard-filter.ts` | String comparison | 50–52 | `subject.trim_category !== comp.trim_category` — exact string match |
| `lib/comp-engine-v2/hard-filter.ts` | Lookup | 33–37 | `isSeparateMarket()` looks up `trim_category` in loaded taxonomy array |
| `scripts/backtest-comp-engine-v2.ts` | Interface field | 78 | `trim_category: string \| null` on `RawRow` |
| `scripts/seed-corpus-bat.ts` | Write path | — | Does NOT write `trim_category` (field left null by BaT parser) |

No Zod schemas, no TypeScript enums, no regex extractors, no repeated string literals for trim values in any app or component code.

---

### A5. Admin Comp-Flags UI

**Route:** `app/(app)/admin/comp-flags/page.tsx` (client component)  
**API:** `app/api/admin/comp-flags/route.ts`

**Auth gate** (`route.ts` lines 16–35): `requireAdmin()` — checks session exists, then queries `users` table for `role === 'admin'`. Returns 401 or 403 on failure. No route-level middleware — check is per-endpoint only.

**GET** (`route.ts` lines 37–54): Fetches all listings where `is_comp_resistant = true` OR `cross_listing_group_id IS NOT NULL`. Limit 500, ordered by `auction_ends_at DESC`.

**PATCH** (`route.ts` lines 56–107): Accepts `{ listing_id, is_comp_resistant?, cross_listing_group_id? }`. Updates one or both fields. Validates listing_id non-empty; fields are optional.

**UI controls** (`page.tsx`):
- Toggle button for `is_comp_resistant` (lines 149–159)
- Text input (onBlur save) for `cross_listing_group_id` (lines 162–172)
- "Add by ID" paste flow to immediately flag a listing (lines 94–109)

**Extensibility:** Not extensible — each admin feature requires a new route file, new API endpoint, and new page component. No shared admin layout, no reusable form abstraction, no `useAdminAuth()` hook. Each new admin UI must be built fresh.

---

## B. Engine Integration Points

### B6. Trim Matching Hard Filter

**File:** `lib/comp-engine-v2/hard-filter.ts`  
**Function:** `applyHardFilters`  
**Lines:** 39–75

```typescript
export function applyHardFilters(
  subject: V2Subject,
  candidates: V2CompCandidate[],
  taxonomy: TrimTaxonomyEntry[],
): V2CompCandidate[] {
  const subjectBodyStyle = normalizeBodyStyle(subject.body_style)
  const subjectDrivetrain = normalizeDrivetrain(subject.drivetrain)
  const subjectIsSeparateMarket = isSeparateMarket(subject.trim_category, taxonomy)

  return candidates.filter(comp => {
    // trim_category: exact match required if both sides are non-null
    if (subject.trim_category !== null && comp.trim_category !== null) {
      if (subject.trim_category !== comp.trim_category) return false
    }

    // body_style: exact match (normalized) if both are non-null
    const compBodyStyle = normalizeBodyStyle(comp.body_style)
    if (subjectBodyStyle !== null && compBodyStyle !== null) {
      if (subjectBodyStyle !== compBodyStyle) return false
    }

    // drivetrain: exact match (normalized) if both are non-null
    const compDrivetrain = normalizeDrivetrain(comp.drivetrain)
    if (subjectDrivetrain !== null && compDrivetrain !== null) {
      if (subjectDrivetrain !== compDrivetrain) return false
    }

    // is_separate_market gate: if subject is separate market,
    // comp must be exactly the same trim_category.
    if (subjectIsSeparateMarket && comp.trim_category !== null) {
      if (comp.trim_category !== subject.trim_category) return false
    }

    return true
  })
}
```

**Key behaviour:** NULL on either side of `trim_category` is treated as compatible (lines 50–52 guard: `if (subject.trim_category !== null && comp.trim_category !== null)`). This means null-category subjects match all comps and null-category comps survive all filters — critical for the current corpus where `trim_category` is 0/199 populated.

---

### B7. Comp Pool Flow Trace

**Step 1 — Entry point**  
`lib/comp-engine-v2/index.ts:97` — `computeCompsV2(listingId: string)`  
Fetches subject listing from `listings` table by `id`. Reads all V2 comp engine fields.

**Step 2 — Config load**  
`lib/comp-engine-v2/index.ts:124` → `lib/comp-engine-v2/config-loader.ts:104` — `loadEngineConfig(generationId)`  
Fires three parallel DB queries: `loadWeights()`, `loadBands()`, `loadTaxonomy()`. Falls back to `generation_id = 'default'` if generation-specific config is absent.

**Step 3 — Comp pool fetch**  
`lib/comp-engine-v2/index.ts:28` — `fetchV2Pool(generationId, excludeListingId)`  
Queries `listings` WHERE `generation_id = ?` AND `listing_status = 'sold'` AND `final_price IS NOT NULL` AND `auction_ends_at IS NOT NULL`, excludes subject listing, takes 500 most recent by `auction_ends_at`. Also applies 36-month recency cutoff (lines 62–70).

**Step 4 — `is_comp_resistant` gate**  
`lib/comp-engine-v2/engine.ts:57–61` — `runCompEngineV2()`  
If `subject.is_comp_resistant === true`, returns `emptyResult('uncomparable', ...)` immediately.

**Step 5 — Hard filter**  
`lib/comp-engine-v2/engine.ts:74` → `lib/comp-engine-v2/hard-filter.ts:39` — `applyHardFilters()`  
Drops comps by trim_category, body_style, drivetrain, and is_separate_market gate.

**Step 6 — Museum mileage cohort separation**  
`lib/comp-engine-v2/engine.ts:84–87` → `lib/comp-engine-v2/mileage-cohort.ts:14` — `applyCohortSeparation()`  
If subject < 1,000 miles: restrict pool to comps < 1,000 miles. If subject ≥ 1,000 miles: exclude comps < 1,000 miles.

**Step 7 — Similarity scoring + threshold drop**  
`lib/comp-engine-v2/engine.ts:96–101` → `lib/comp-engine-v2/similarity.ts:183` — `applySimilarityScoring()`  
Calls `scoreComp()` for each candidate; drops comps with weighted similarity score < 0.4 (`SIMILARITY_DROP_THRESHOLD`, line 21).

**Step 8 — Recency weighting**  
`lib/comp-engine-v2/engine.ts:112` → `lib/comp-engine-v2/aggregation.ts:37` — `applyRecencyWeighting()`  
Assigns recency weight by sale age in months (0–36 month breakpoints). `final_weight = similarity_score × recency_weight`.

**Step 9 — Minimum comp check**  
`lib/comp-engine-v2/engine.ts:~118` — if fewer than 3 comps survive, returns `emptyResult('insufficient_comps', ...)`.

**Step 10 — Weighted fair value**  
`lib/comp-engine-v2/engine.ts:124` → `lib/comp-engine-v2/aggregation.ts:66` — `computeWeightedFairValue()`  
Weighted median, P25, P75 by `final_weight`. Flags `high_variance` if `(P75 - P25) / median > 0.25`.

**Step 11 — Confidence score**  
`lib/comp-engine-v2/engine.ts:130–131` → `lib/comp-engine-v2/aggregation.ts:84` — `computeConfidence()` + `capConfidenceForCount()`

**Step 12 — Output**  
`lib/comp-engine-v2/engine.ts:145–158` — returns `V2CompsResult` with verdict, predicted_median/p25/p75, confidence_score, methodology_text, comp_count, comps_used, weights_used.

---

### B8. Weight Configuration

**Weights are loaded from DB at runtime**, not hardcoded.

**Load location:** `lib/comp-engine-v2/config-loader.ts:29–60` — `loadWeights(client, generationId)`  
Queries `generation_weight_config` WHERE `generation = ?`, parses `weight` column via `parseFloat()`, constructs `GenerationWeights` object.

**Fallback:** `config-loader.ts:47–49` — if no rows for requested generation, recursively loads `'default'`.

**Apply location:** `lib/comp-engine-v2/similarity.ts:122–180` — `scoreComp()` function.  
Iterates `Object.entries(factorScores)`, multiplies each factor score by `weights.weights[factor] ?? 0`, skips factors where weight === 0 (line 164). Computes normalized weighted average.

---

### B9. Confidence Score Calculation

**File:** `lib/comp-engine-v2/aggregation.ts`  
**Function:** `computeConfidence`  
**Lines:** 84–117

```typescript
export function computeConfidence(
  comps: ScoredComp[],
  fairValue: FairValueV2 | null,
): { score: number; components: ConfidenceComponents } {
  if (comps.length === 0 || fairValue === null) {
    return { score: 0, components: { sample_size: 0, iqr_tightness: 0, recency: 0, best_similarity: 0 } }
  }

  // Component 1: effective sample size (0–1, normalized to max 20 useful comps)
  const ess = Math.min(effectiveSampleSize(comps), 20) / 20

  // Component 2: IQR tightness — lower IQR/median = higher confidence
  const iqrRatio = fairValue.median_cents > 0
    ? (fairValue.p75_cents - fairValue.p25_cents) / fairValue.median_cents
    : 1
  const iqr_tightness = Math.max(0, 1 - iqrRatio / 0.5)

  // Component 3: recency of best comp (best = highest similarity_score)
  const bestComp = comps.reduce((best, c) => c.similarity_score > best.similarity_score ? c : best, comps[0])
  const recency = bestComp.recency_weight

  // Component 4: best similarity score (already 0–1)
  const best_similarity = bestComp.similarity_score

  // Weighted composite per spec
  const raw = 0.35 * ess + 0.25 * iqr_tightness + 0.20 * recency + 0.20 * best_similarity
  const score = Math.round(Math.min(100, Math.max(0, raw * 100)))

  return {
    score,
    components: { sample_size: ess, iqr_tightness, recency, best_similarity },
  }
}
```

**Sub-function `effectiveSampleSize`** (`aggregation.ts:78–82`):
```typescript
function effectiveSampleSize(comps: ScoredComp[]): number {
  const sumW = comps.reduce((s, c) => s + c.final_weight, 0)
  const sumW2 = comps.reduce((s, c) => s + c.final_weight ** 2, 0)
  return sumW2 > 0 ? (sumW ** 2) / sumW2 : 0
}
```

**Count cap** (`aggregation.ts:120–123`): `capConfidenceForCount()` — caps score to 40 if `comp_count <= 4`.

---

### B10. Feature Flags

**No feature flags exist in the comp engine.** The only conditional logic:

| Type | Location | Lines | Description |
|---|---|---|---|
| Model version constant | `lib/comp-engine-v2/types.ts:5` | 5 | `export const MODEL_VERSION = 'v1.0'` — logged to DB only, no branching |
| Per-listing gate | `lib/comp-engine-v2/engine.ts:57–61` | 57–61 | `is_comp_resistant` DB flag — exits early with `'uncomparable'` verdict |
| Generation fallback | `lib/comp-engine-v2/config-loader.ts:47–49` | 47–49 | Falls back to `'default'` weights if generation has no config |
| Env vars | `lib/comp-engine-v2/index.ts:22–23` | 22–23 | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — auth only, no behavioral gates |

---

## C. Build / Deploy / Data Lifecycle

### C1. Deploy Pipeline

**Deploy target:** Vercel (referenced in `.env.example` line 3: "Staging and production values are managed in Vercel environment variables").

**Configuration files found:**
- `supabase/config.toml` — Supabase CLI config only
- `package.json` scripts: `dev`, `build`, `start`, `lint`, `type-check`, `test`, `test:watch`

**NOT FOUND IN CODEBASE:**
- `vercel.json`
- `.github/workflows/` (no `.github` directory)
- `fly.toml`
- `Dockerfile`

**Migration auto-run:** No. `supabase/config.toml` lines 53–65 enables migrations, but they run only via explicit `npx supabase db push --linked`. No CI/CD pipeline to auto-run them exists in the repo.

**Seed scripts on deploy:** No. `supabase/config.toml` references `./seed.sql` for `db reset`, but that file does not exist. `scripts/seed-corpus-bat.ts` is a manual one-off script with no deploy hook.

---

### C2. Corpus Dev-Only Status

**The 199-record corpus is NOT environment-gated.** Key findings:

- **Seeded via:** `scripts/seed-corpus-bat.ts` — manually invoked, uses `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` from `.env.local` (lines 234–239)
- **No `NODE_ENV` check:** Script does not check `NODE_ENV`, `isDev`, or any production-safeguard flag
- **Same credentials as prod:** The env vars it reads are the same vars used in production (per `.env.example` structure)
- **No row-level identifier:** Corpus rows are indistinguishable from production rows — no `is_corpus`, `source`, or `environment` column separates them
- **Read path:** `fetchV2Pool()` in `lib/comp-engine-v2/index.ts:28–95` queries all `listings` WHERE `generation_id = ?` AND `listing_status = 'sold'` — corpus rows match this filter identically to production rows

**Implication:** Running `seed-corpus-bat.ts` with production credentials would write corpus data to the production database. There is no safeguard preventing this.

**Production implications of dropping corpus:** Cannot drop without migration — rows have no corpus-specific flag. Dropping all 993 sold listings would empty the comp pool for the 993 generation in any environment where the corpus was loaded.

---

### C3. Dev Environment Constraints / Feature Flags on Fair Value

**NOT FOUND IN CODEBASE.**

No feature flags, `"locked down"` comments, `"dev until"` comments, or env-gated logic found in:
- `lib/comp-engine-v2/` (all files)
- `app/api/analyze/route.ts`
- Any component or page file

The comp engine produces fair value range and comp count for any listing that satisfies the minimum comp threshold (≥ 3 comps), regardless of environment.

---

## D. Test Infrastructure

### D1. `scripts/backtest-comp-engine-v2.ts`

**Full file:** 637 lines (pasted in full above — see source file)

**Inputs:**
- CLI args: `--generation` (default: `'993'`), `--splits` (default: 10), `--seed` (default: `Date.now()`)
- DB: fetches all sold listings for the generation via service-role credentials from `.env.local`

**Outputs:**
- `docs/comp-engine-backtest-{timestamp}.md` — human-readable report with MAPE, coverage, cohort breakdowns by trim/mileage band/decade, top-10 worst outliers, synthetic test results, weights used
- `docs/comp-engine-backtest-{timestamp}.json` — machine-readable version of the same

**Invocation:**
```
set -a && source .env.local && set +a && npx tsx scripts/backtest-comp-engine-v2.ts [--generation 993] [--splits 10] [--seed 42]
```

**Methodology:** 10 random 80/20 train/test splits using seeded PRNG (mulberry32). For each test listing, the engine runs with that listing as subject against the remaining pool. MAPE and P25–P75 coverage computed across all splits. 5 synthetic edge-case tests always run (comp_resistant flag, empty pool, museum mileage, mileage doubling perturbation, separate-market RS trim).

**Does NOT hit the live engine route** — calls `runCompEngineV2()` directly from `lib/comp-engine-v2/engine.ts` with in-memory data. Loads config once via `loadAllConfigs()` then runs entirely in memory.

---

### D2. `scripts/preflight-correlation-analysis.ts`

**Full file:** `scripts/preflight-correlation-analysis.ts` (1,101 lines — see source file)

**Inputs:** DB — fetches all sold 993 listings via service-role credentials.

**Outputs:** `docs/comp-engine-v2-1-preflight.md` — correlation analysis report. Console summary of key metrics.

**Invocation:**
```
set -a && source .env.local && set +a && npx tsx scripts/preflight-correlation-analysis.ts
```

**Methodology:** Computes Pearson r, Spearman ρ, and OLS R² for each factor vs sale price. Reports data quality (population rate per field). Provides rank-order table, per-factor recommendations (lock / adjust / insufficient_data), and caveats section.

---

### D3. Comp Engine Main Entry Point

**File:** `lib/comp-engine-v2/index.ts:97`

```typescript
export async function computeCompsV2(listingId: string): Promise<V2CompsResult>
```

**Single-subject invocation:** Yes. Takes one listing ID, fetches subject and pool from DB, runs the full pipeline, returns `V2CompsResult`. Does not require the backtest harness.

**Called from:**
- `app/api/analyze/route.ts` — via `computeComps(listingId)` wrapper (non-fatal, errors logged but don't block the redirect)
- `scripts/seed-corpus-bat.ts` — post-crawl, runs comps for each seeded listing

**Also exported:** `fetchV2Pool(generationId, excludeListingId)` at `index.ts:28` for standalone pool fetching (used by backtest harness to bypass the DB fetch of the subject).

The **backtest** calls `runCompEngineV2()` directly at `lib/comp-engine-v2/engine.ts` with pre-fetched in-memory data — it bypasses `computeCompsV2()` and the DB subject fetch entirely.

---

### D4. Comp Engine Test File Inventory

All test files in `tests/lib/comp-engine-v2/`:

| File | Lines | Aspect Tested |
|---|---|---|
| `hard-filter.test.ts` | 125 | trim_category exact match, body_style normalization (Cabriolet ↔ Convertible), separate-market gate (RS/GT2 segregation from Carrera pool) |
| `similarity.test.ts` | 167 | scoreComp weighted average, mileage band similarity (ultra_low/low/moderate/high/very_high cross-band penalties), year similarity step function, spec composite (PTS/seats/wheels), SIMILARITY_DROP_THRESHOLD (< 0.4 → dropped) |
| `mileage-cohort.test.ts` | 71 | Museum cohort separation: MUSEUM_THRESHOLD = 1,000 miles; subject < 1k → pool restricted to < 1k; subject ≥ 1k → pool excludes < 1k |
| `aggregation.test.ts` | 125 | Recency weight decay (0–36 months, dropped after 37), weighted fair value (P25/median/P75), confidence score components, high_variance flag `(P75-P25)/median > 0.25`, count-based confidence cap (≤ 4 comps → score capped at 40) |
| `condition-stub.test.ts` | 99 | condition_stub computation: paint score by microns (< 150 → 1.0, 300+ → 0.1), accident history (none → 1.0, major → 0.2), photo count bands, featured listing boost, conditionSimilarity pairwise comparison |

---

*Generated for integration planning. Every answer pinned to file path + line range. "NOT FOUND IN CODEBASE" used where items do not exist.*
