# Comp Engine — Overnight Build Summary

**Date:** 2026-04-30  
**Session:** Steps 1–8 of the comp engine overnight build

---

## Commits (this session)

| Commit | Description |
|--------|-------------|
| `feat: add market signal columns, create comp_results table` | Step 1–2: DB schema |
| `feat: comp engine — types, recency weighting, fair value math` | Step 3: core logic |
| `feat: comp engine — selectComps, computeComps orchestrator, 32 tests` | Step 4: engine + tests |
| `feat: wire comp engine to analyze API and analyze page` | Step 5 part A: API integration |
| `feat: surface comp engine in VerdictBlock, MetricTiles, ComparableSalesCard` | Step 5 part B: UI |
| `feat: BaT archive scraper for corpus seeding (step 6)` | Step 6: scraper written |
| `fix: update BaT scraper to use listings-filter REST API` | Step 6 fix: tag pages were 404 |

---

## Corpus stats

| Metric | Value |
|--------|-------|
| Listings seeded (new) | 198 |
| Listings already in DB | 1 |
| Total 993-generation listings | 199 |
| Failed (non-car listing) | 1 (`manuals-15`) |
| computeComps strict tier | 193 |
| computeComps wide tier | 6 |
| computeComps insufficient | 0 |

---

## Step 8 — Success Criterion

**1997 Porsche 911 Turbo** (`86c5d062-e121-4173-bcfa-1983c058c95c`):
- `tier: strict` ✓
- `comp_count: 58` ✓ (≥5 required)
- Fair value: $55,336 – $103,940 – $152,544
- Verdict: "Priced above comparable sales" ($240,000 subject vs. $152,544 high)

---

## What's working

- Full comp engine pipeline: strict/wide/insufficient tier selection, recency weighting, fair value math
- BaT scraper discovers and seeds listings via BaT's listings-filter REST API
- `computeComps` runs automatically on analyze page (post-parse) and in bulk via CLI
- VerdictBlock, MetricTiles, ComparableSalesCard all surface comp data when available
- 32 unit tests covering recency-weight, fair-value, select-comps, VerdictBlock, MetricTiles, ComparableSalesCard

## Known limitations (post-V1 refinements)

- Comp pool doesn't differentiate Turbo from Carrera within the 993 generation — `body_class` only captures coupe/cabriolet/targa, not powertrain variant. A Porsche-specific override (`lib/comp-engine/porsche.ts`) can apply trim weighting later.
- BaT scraper URL discovery switched from tag pages (404) to REST API. The listings-filter API doesn't require auth for unauthenticated reads, but rate-limit behavior is unknown at high volume.
- `generation_id` assignment is currently manual/script-based for seeded listings. Production flow should detect generation from year/model at parse time.

## Not done

All 8 steps are complete. Working tree clean.

---

## Files added/changed

**DB migrations:**
- `supabase/migrations/20260429040000_add_market_signal_columns.sql`
- `supabase/migrations/20260429050000_create_comp_results.sql`
- `supabase/migrations/20260429051000_grant_comp_results_service_role.sql`

**Comp engine:**
- `lib/comp-engine/types.ts`
- `lib/comp-engine/db-types.ts`
- `lib/comp-engine/recency-weight.ts`
- `lib/comp-engine/fair-value.ts`
- `lib/comp-engine/select-comps.ts`
- `lib/comp-engine/index.ts`

**App integration:**
- `app/api/analyze/route.ts` (computeComps post-parse)
- `app/(app)/analyze/[id]/page.tsx` (comp result fetch + comp listings fetch)
- `components/analyze/VerdictBlock.tsx`
- `components/analyze/MetricTiles.tsx`
- `components/analyze/ComparableSalesCard.tsx`

**Scripts:**
- `scripts/seed-corpus-bat.ts`
- `scripts/refresh-comps-993.ts`

**Tests:**
- `tests/lib/comp-engine/recency-weight.test.ts`
- `tests/lib/comp-engine/fair-value.test.ts`
- `tests/lib/comp-engine/select-comps.test.ts`
- `tests/api/analyze.test.ts` (2 new tests)
- `tests/components/analyze/components.test.tsx` (19 new tests)
