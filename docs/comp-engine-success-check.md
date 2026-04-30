# Comp Engine — Step 8 Success Check

**Date:** 2026-04-30  
**Listing:** 1997 Porsche 911 Turbo (id: `86c5d062-e121-4173-bcfa-1983c058c95c`)

## Result

| Field | Value |
|-------|-------|
| `tier` | `strict` ✓ |
| `comp_count` | 58 ✓ (≥5 threshold) |
| `fair_value_low_cents` | $55,336 |
| `fair_value_median_cents` | $103,940 |
| `fair_value_high_cents` | $152,544 |
| `most_recent_comp_sold_at` | 2026-04-29 |
| `oldest_comp_sold_at` | 2025-01-30 |

## Subject listing

- Year: 1997, Make: Porsche, Model: 911 Turbo
- Mileage: 101,000
- Final price: $240,000
- generation_id: 993

## Verdict

"Priced above comparable sales." (subject $240,000 > fair value high $152,544)

## Notes

The comp pool correctly reaches strict tier with 58 comps. The wide fair value range (large std dev) reflects that the 993 generation includes everything from base Carrera (~$55k) to Turbo ($200k+). A future Porsche-specific refinement could weight trim similarity (Turbo vs. Carrera) to tighten the range. The engine is working correctly per V1 spec.

## Corpus stats

| Metric | Value |
|--------|-------|
| Total listings | 206 |
| 993-generation listings | 199 |
| Strict tier | 193 |
| Wide tier | 6 |
| Insufficient | 0 |
