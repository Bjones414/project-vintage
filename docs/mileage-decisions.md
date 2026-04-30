# Mileage Display — Decisions Log

## M1 — Schema field confirmed: `mileage` integer on `listings`

`listings.mileage` is an integer (nullable). All 208 corpus rows use `mileage_unit = 'mi'` (no km records exist). 206/208 rows have a non-null mileage value (range: 177–238,000 mi).

The comp engine reads `mileage` directly (confirmed in `lib/comp-engine-v2/types.ts` and `engine.ts`). No migration needed. Proceeding to display work only.

## M2 — Mileage always rendered (em dash when null)

Mileage is the highest-weight feature in the comp engine (0.30 for 993 generation). Omitting it entirely when null would create a confusing gap. Decision: always render the Mileage field; show `—` (em dash) when `listing.mileage` is null.

This differs from the existing null-filter pattern (which omits null fields entirely). Special-cased via a pre-computed string (`'—'` instead of null) so the field always passes the `present` filter.

## M3 — ChassisIdentityCard is the only consumer; no comp component impact

`ChassisIdentityCard` is used only on the analysis page (`/analyze/[id]`). Comparable sales comps use `ComparableSalesCard` exclusively — that component is untouched per spec.

## M4 — mileage_unit column ignored for V1

All 208 records have `mileage_unit = 'mi'`. Per spec: US-only, no km handling, no market_region branching. The `mileage_unit` column is not read by the display component — the "mi" suffix is hardcoded. If/when km support is needed, this is the field to read.
