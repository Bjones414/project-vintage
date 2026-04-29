# Comps / Fair Value In-Development Framing — Status Report

**Commit:** 92aca64  
**Date:** 2026-04-29

## What changed

### MetricTiles.tsx
- Fair Value Range tile: shows "In development" (italic, muted, `text-sm italic text-gray-400`) with hint "Comp engine launching with full report" when no fair value data is present. Shows real data when `fair_value_low_cents` / `fair_value_high_cents` are populated (e.g., from fixtures).
- Comps Used tile: same treatment — "In development" with hint. Falls back to the "Sign in to see full comparison" hint for anonymous users when actual comp data IS present.
- `MetricTile` component gained an optional `valueClassName` prop to support varied value styling without breaking the default bold style.

### ComparableSalesCard.tsx
- Empty state (no sales, no total): replaced "No comparable sales data available." with:  
  "Comparable sales engine in development."  
  "Until launch, see the auction page directly for context."

## Tests updated

- `tests/components/analyze/components.test.tsx`: updated `ComparableSalesCard` empty state assertion to check for the new copy (`'Comparable sales engine in development'` and `'see the auction page directly'`).
- Snapshot file regenerated — scenarios A, B, C updated to reflect new "In development" tiles and new ComparableSalesCard empty state copy.

## No new tests

Copy-only change per spec.

## Build / lint / test

All three pass. 244 tests.

## TODOs planted

None.
