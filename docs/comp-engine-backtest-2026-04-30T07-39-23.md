# Comp Engine V2 Backtest — 993

**Date:** 2026-04-30  
**Model:** v1.0  
**Generation:** 993  
**Corpus size:** 199 listings  
**Splits:** 10 × 80/20 random  
**Seed:** 1777534762476  
**Elapsed:** 1.2s  

---

## Summary Metrics

| Metric | Value |
|---|---|
| Total predictions | 399 |
| Insufficient / no_comps runs | 1591 (79.9%) |
| MAPE (mean) | 69.2% |
| MAPE (median) | 42.6% |
| Range coverage (P25–P75) | 51.4% |
| Directional bias (% actual > median) | 48.4% |
| Avg comp count | 197.0 |

---

## Top 10 Worst Outliers

| listing_id                           | actual         | predicted      | APE            | in_range | trim     | year   |
|--------------------------------------|----------------|----------------|----------------|----------|----------|--------|
| f5a03a0b-1e69-41fa-9e01-4944b2b3b7f7 | $3,050         | $132,000       | 4227.9%        | no       | null     | 1995   |
| f5a03a0b-1e69-41fa-9e01-4944b2b3b7f7 | $3,050         | $132,000       | 4227.9%        | no       | null     | 1995   |
| c2e12c39-bb92-4571-b21b-fbf56cc8add9 | $47,750        | $137,000       | 186.9%         | no       | null     | 1998   |
| c9daaae2-392b-47ad-81d8-188333ebbd19 | $51,000        | $125,000       | 145.1%         | no       | null     | 1995   |
| c9daaae2-392b-47ad-81d8-188333ebbd19 | $51,000        | $125,000       | 145.1%         | no       | null     | 1995   |
| c9daaae2-392b-47ad-81d8-188333ebbd19 | $51,000        | $125,000       | 145.1%         | no       | null     | 1995   |
| 1424b808-aa89-4550-b78b-5406687dde0e | $55,500        | $132,000       | 137.8%         | no       | null     | 1995   |
| 3ee08fb8-e050-4d46-aa52-56134cb73511 | $51,000        | $120,000       | 135.3%         | no       | null     | 1995   |
| 3ee08fb8-e050-4d46-aa52-56134cb73511 | $51,000        | $120,000       | 135.3%         | no       | null     | 1995   |
| 417b9cb3-cb37-40c9-9c39-86dda43e733f | $58,500        | $136,000       | 132.5%         | no       | null     | 1997   |

---

## Cohort Breakdowns

### By trim_category

| trim_category                  | n        | MAPE       | coverage     |
|--------------------------------|----------|------------|--------------|
| unknown                        | 399      | 69.2%      | 51.4%        |

### By mileage band

| band                           | n        | MAPE       | coverage     |
|--------------------------------|----------|------------|--------------|
| ultra_low                      | 16       | 66.7%      | 12.5%        |
| low                            | 47       | 37.7%      | 44.7%        |
| moderate                       | 217      | 44.1%      | 59.0%        |
| high                           | 85       | 57.4%      | 45.9%        |
| very_high                      | 30       | 59.7%      | 50.0%        |
| unknown                        | 4        | 2135.2%    | 0.0%         |

### By year decade

| decade                         | n        | MAPE       | coverage     |
|--------------------------------|----------|------------|--------------|
| 1990s                          | 399      | 69.2%      | 51.4%        |

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

