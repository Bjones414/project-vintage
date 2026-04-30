# Comp Engine Step 5 — UI Surfacing

**Status:** Complete  
**Date:** 2026-04-29

## What changed

### components/analyze/VerdictBlock.tsx
- New comp engine verdict path: fires when `listing && compResult && tier !== 'insufficient' && fair_value_low/high not null`
- Verdict headline: "Priced below comparable sales." / "Priced at fair value." / "Priced above comparable sales."
- Subhead: `Subject at $[X], comparable range $[low]-$[high] based on [N] comps.`
- Recency line: "Most recent comp sold [N] months ago."
- Wide tier: italic muted note "Wide-criteria comps used due to limited matches."
- Insufficient tier / no compResult: falls to "Verdict in development." existing state
- Legacy `analysisData.lede` path preserved
- All props optional (listing, compResult) for backward compat with existing tests

### components/analyze/MetricTiles.tsx
- Fair Value Range tile: prefers `compResult.fair_value_low/high_cents` over `analysisData` fallback
- Comps Used tile: shows `[N] comps · [Mo] mo ago` when compResult.tier !== 'insufficient'
- Anonymous tier: "Sign in to see" still shown regardless of comp data

### components/analyze/ComparableSalesCard.tsx (full rewrite)
- Comp engine path: numbered editorial list (01, 02, ...) for top 5 comp listings
- Each row: `[Year] [Model] · [Mi] mi · [N mo ago] · $[price]` with BaT link when available
- Anonymous: 1 comp shown, `+[N-1] more sales available with a free account`
- Wide tier: shows "· wide criteria" next to count
- Insufficient tier: "Not enough comparable sales in our corpus for this specification."
- Legacy `analysisData.comparable_sales` path preserved

### app/(app)/analyze/[id]/page.tsx
- Second-pass fetch: when `compResult` has comp_listing_ids, fetches top 5 by `auction_ends_at desc`
- Passes `compListings` to `ComparableSalesCard`

## Tests

19 new tests across 3 describe blocks (VerdictBlock/MetricTiles/ComparableSalesCard comp data). Snapshots regenerated implicitly (no changes to existing rendering paths).

## Total tests: 308 passing

## Next step

Step 6: BaT archive scraper for corpus seeding.
