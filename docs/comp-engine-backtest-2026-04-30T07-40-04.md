# Comp Engine V2 Backtest — 993

**Date:** 2026-04-30  
**Model:** v1.0  
**Generation:** 993  
**Corpus size:** 199 listings  
**Splits:** 10 × 80/20 random  
**Seed:** 42  
**Elapsed:** 0.5s  

---

## Summary Metrics

| Metric | Value |
|---|---|
| Total predictions | 397 |
| Insufficient / no_comps runs | 3 / 400 (0.8%) |
| MAPE (mean) | 60.8% |
| MAPE (median) | 43.6% |
| Range coverage (P25–P75) | 50.9% |
| Directional bias (% actual > median) | 50.9% |
| Avg comp count | 197.0 |

---

## Top 10 Worst Outliers

| listing_id                           | actual         | predicted      | APE            | in_range | trim     | year   |
|--------------------------------------|----------------|----------------|----------------|----------|----------|--------|
| f5a03a0b-1e69-41fa-9e01-4944b2b3b7f7 | $3,050         | $132,000       | 4227.9%        | no       | null     | 1995   |
| c2e12c39-bb92-4571-b21b-fbf56cc8add9 | $47,750        | $137,000       | 186.9%         | no       | null     | 1998   |
| c2e12c39-bb92-4571-b21b-fbf56cc8add9 | $47,750        | $137,000       | 186.9%         | no       | null     | 1998   |
| 169b5e1f-08c0-4e33-8b7e-d381d2ca4695 | $54,000        | $132,000       | 144.4%         | no       | null     | 1995   |
| 169b5e1f-08c0-4e33-8b7e-d381d2ca4695 | $54,000        | $132,000       | 144.4%         | no       | null     | 1995   |
| 1424b808-aa89-4550-b78b-5406687dde0e | $55,500        | $132,000       | 137.8%         | no       | null     | 1995   |
| 1424b808-aa89-4550-b78b-5406687dde0e | $55,500        | $132,000       | 137.8%         | no       | null     | 1995   |
| 1424b808-aa89-4550-b78b-5406687dde0e | $55,500        | $132,000       | 137.8%         | no       | null     | 1995   |
| 1424b808-aa89-4550-b78b-5406687dde0e | $55,500        | $132,000       | 137.8%         | no       | null     | 1995   |
| 3708939f-c05e-41e5-9fd7-5a1196d261fe | $53,000        | $125,000       | 135.8%         | no       | null     | 1995   |

---

## Cohort Breakdowns

### By trim_category

| trim_category                  | n        | MAPE       | coverage     |
|--------------------------------|----------|------------|--------------|
| unknown                        | 397      | 60.8%      | 50.9%        |

### By mileage band

| band                           | n        | MAPE       | coverage     |
|--------------------------------|----------|------------|--------------|
| ultra_low                      | 12       | 59.0%      | 25.0%        |
| low                            | 31       | 31.7%      | 45.2%        |
| moderate                       | 243      | 51.9%      | 52.7%        |
| high                           | 91       | 52.2%      | 50.5%        |
| very_high                      | 17       | 46.9%      | 64.7%        |
| unknown                        | 3        | 1437.7%    | 0.0%         |

### By year decade

| decade                         | n        | MAPE       | coverage     |
|--------------------------------|----------|------------|--------------|
| 1990s                          | 397      | 60.8%      | 50.9%        |

---

## Synthetic Edge-Case Tests

| test                                     | verdict              | note             |
|------------------------------------------|----------------------|------------------|
| comp_resistant_flag                      | uncomparable         | PASS             |
| empty_pool                               | insufficient_comps   | PASS             |
| museum_subject_mileage_500               | insufficient_comps   | comp_count=1 (museum cohort separation applied) |
| mileage_doubled_perturbation             | null                 | median shift: -1.6% |

---

## Weights Used (993)

- `mileage_similarity`: 0.3
- `condition_stub`: 0.15
- `year_similarity`: 0.1
- `trim_variant_match`: 0.1
- `market_region_match`: 0.1
- `spec_composite`: 0.1
- `transmission_variant_match`: 0.05
- `color_rarity`: 0.05
- `consignor_tier_match`: 0.05
- `mechanical_remediation_status`: 0

