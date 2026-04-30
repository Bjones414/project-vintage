# Comp Engine Step 4 — Wired into Analyze Flow

**Status:** Complete  
**Date:** 2026-04-29

## What changed

### app/api/analyze/route.ts
- Imports `computeComps` from `@/lib/comp-engine`
- After listing upsert and findings run, calls `computeComps(listingId)` in a try/catch
- Failure is non-fatal: logs error to console, continue to JSON response

### app/(app)/analyze/[id]/page.tsx
- Promise.all expanded to include comp_results fetch (`(supabase as any).from('comp_results')`)
- Most recent comp_results row fetched (ORDER BY computed_at DESC LIMIT 1)
- `compResult: CompResultRow | null` passed to VerdictBlock, MetricTiles, ComparableSalesCard

### components/analyze/VerdictBlock.tsx
- Props extended with `compResult: CompResultRow | null` (UI usage in Step 5)

### components/analyze/MetricTiles.tsx
- Props extended with `compResult: CompResultRow | null` (UI usage in Step 5)

### components/analyze/ComparableSalesCard.tsx
- Props extended with `compResult: CompResultRow | null` and `listing: Tables<'listings'>` (UI usage in Step 5)

### lib/comp-engine/db-types.ts (new)
- `CompResultRow` type matching the comp_results table schema
- Separate file so pages can import the type without loading DB logic

## Tests updated

`tests/api/analyze.test.ts`:
- Added `mockComputeComps` spy (vi.mock('@/lib/comp-engine'))
- 2 new tests: `computeComps called with listing id`, `computeComps failure is non-fatal`
- All 13 tests pass

## Total tests: 295 passing

## Next step

Step 5: UI surfacing of comp data in VerdictBlock, MetricTiles, ComparableSalesCard.
