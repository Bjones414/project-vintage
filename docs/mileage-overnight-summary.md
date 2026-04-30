# Mileage Display — Summary

Completed 2026-04-30. One commit. Working tree clean.

---

## Schema Verification

`listings.mileage` is an integer (nullable). All 208 corpus rows use `mileage_unit = 'mi'` — no km records exist. 206/208 rows have a non-null mileage value (range: 177 mi – 238,000 mi). The comp engine reads directly from `mileage` (confirmed in `lib/comp-engine-v2/types.ts` and `engine.ts`). No schema migration needed.

---

## ChassisIdentityCard Changes

`components/analyze/ChassisIdentityCard.tsx`:

- Added `mileage` field to the `fields` array, positioned after Model Year and before Variant.
- Format: `47,200 mi` — `toLocaleString('en-US')` for the comma separator, hardcoded `mi` suffix.
- Null handling: `—` (em dash) when `listing.mileage` is null. Field always renders (not filtered out like other null fields) because mileage is the highest-weight feature in the comp engine (0.30 for 993).
- No new design tokens — uses the same `font-serif text-[17px] text-text-primary` styling as all adjacent fields.

---

## Comp Component Finding

`ChassisIdentityCard` is used only in `/app/(app)/analyze/[id]/page.tsx` (subject listing display). Comparable sales use `ComparableSalesCard` exclusively — that component was not touched. Comp-level mileage display is a separate question logged in `docs/mileage-decisions.md` (M3).

---

## Test Delta

| Metric | Before | After |
|---|---|---|
| Tests passing | 479 | 482 |
| New tests | — | 4 (mileage formatting, null em dash, position order, thousands separator) |
| Snapshots updated | — | 4 (ChassisIdentityCard, integration scenarios A, B, C) |

---

## Decisions Logged

See `docs/mileage-decisions.md` (M1–M4).

| ID | Decision |
|---|---|
| M1 | Schema field confirmed: `listings.mileage` integer, no migration needed |
| M2 | Mileage always renders — em dash when null, not omitted |
| M3 | ChassisIdentityCard is sole consumer; ComparableSalesCard untouched |
| M4 | `mileage_unit` column ignored for V1; "mi" suffix is hardcoded |

---

## Commit

```
fefa95a  feat: display mileage in ChassisIdentityCard
```
