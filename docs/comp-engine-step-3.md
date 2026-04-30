# Comp Engine Step 3 — Core Logic

**Status:** Complete  
**Date:** 2026-04-29

## Files created / modified

```
lib/comp-engine/
  types.ts          — CompTier, FairValueRange, CompCandidate, CompResult, SubjectListing
  recency-weight.ts — recencyWeight(soldAt, asOf) → weight 0-1 via linear interpolation
  fair-value.ts     — computeFairValue(weighted[]) → FairValueRange | null
  select-comps.ts   — fetchGenerationPool() + selectComps() → strict/wide/insufficient
  index.ts          — computeComps(listingId) orchestrator, persists to comp_results
  default.ts        — replaced stub (was 3-line comment)
  porsche.ts        — stub unchanged
```

## Tier logic

- **Strict**: same generation, same body_class (when both known), mileage ±30%, sold ≤24mo, requires ≥5 comps
- **Wide**: same generation, any body_class/mileage, sold ≤36mo, requires ≥3 comps
- **Insufficient**: pool < 3

## Recency weights

| Months | Weight |
|--------|--------|
| 0–6    | 1.0    |
| 6–12   | 1.0→0.8 (linear) |
| 12–24  | 0.8→0.6 (linear) |
| 24–36  | 0.6→0.4 (linear) |
| >36    | 0 (dropped) |

## Tests

34 unit tests across 3 files:
- `recency-weight.test.ts` — boundary values at 0, 6, 12, 24, 36mo
- `fair-value.test.ts` — empty, single comp, two equal-weight, weighted pull, negative clamp
- `select-comps.test.ts` — strict criteria, wide fallback, insufficient, edge cases

## Note on types

Supabase generated types don't include `comp_results` (Database = unknown in existing codebase). Used `as any` casts with explicit type assertions — same pattern as `app/api/analyze/route.ts`.

## Test count

293 total, 0 failures.

## Next step

Step 4: Wire comp engine into analyze flow.
