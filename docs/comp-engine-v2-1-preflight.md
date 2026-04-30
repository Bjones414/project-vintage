# Comp Engine V2.1 Preflight — Corpus Correlation Analysis

Generated 2026-04-30. Read-only analysis — no production code modified.

---

## Summary Finding

**The 993 dev corpus is critically underenriched for V2.1 preflight validation.**

Of the 10 active comp engine factors, only **2** (mileage, year) can be empirically
validated from the current corpus. All other factors have 0/199 records populated.
The V2.1 weight calibration exercise is therefore operating predominantly on
research priors, not corpus evidence. This is expected at this stage but must be
explicitly acknowledged before locking weights.

---

## Phase 1 — Corpus Data Quality

**Generation:** 993 | **Sold records with price:** 199

| Field | Coverage | Note |
|---|---|---|
| year | 199/199 | All records — analysis basis |
| mileage | 197/199 | Strong — primary analysis basis |
| final_price | 199/199 | Complete — filter criterion |
| transmission (raw) | 197/199 | Polluted NHTSA text — normalized for proxy analysis |
| exterior_color | 193/199 | Text only — no structured rarity; proxy analysis possible |
| trim_category | 0/199 | **Cannot control for trim — major analysis gap** |
| market_region | 0/199 | Empty |
| is_paint_to_sample | 0/199 | Empty |
| seats_type | 0/199 | Empty |
| wheels_factory_correct | 0/199 | Empty |
| transmission_variant | 0/199 | Empty (V2 field) |
| interior_color_rarity | 0/199 | Empty |
| consignor_type | 0/199 | Empty |
| paint_meter_max_microns | 0/199 | Empty — condition_stub input |
| accident_history_stated | 0/199 | Empty — condition_stub input |
| listing_photo_count | 0/199 | Empty — condition_stub input |
| is_featured_listing | 0/199 | Empty — condition_stub input |
| mod_status | 0/199 | Empty — V2.1 new factor |

**Implication:** Correlations within trim_category buckets cannot be computed —
all 199 records are in an undifferentiated pool. Analysis proceeds corpus-wide.

---

## Phase 2 — Factor Analysis

### Factor: Mileage (proposed weight 0.300)

| Metric | Value |
|---|---|
| Sample size | 197/199 |
| Pearson r | -0.454 |
| Spearman ρ | -0.533 |
| R² (linear) | 0.207 (20.7% variance explained) |
| Direction | ✓ Negative (as expected) |

**Interpretation:** Correlation matches expected direction and magnitude. Mileage is a genuine price driver in this corpus.

**Critical note:** Without trim_category controls, mileage R² is suppressed. A 3,000-mile
Carrera RS and a 100,000-mile Carrera base are in the same regression, which artificially
weakens the within-trim mileage signal that the comp engine actually uses.

### Factor: Year (proposed weight 0.100)

| Metric | Value |
|---|---|
| Sample size | 199/199 |
| Pearson r | 0.193 |
| Spearman ρ | 0.448 |
| R² (linear) | 0.037 (3.7% variance explained) |
| Direction | Positive (later = higher price) |

**Year-by-year breakdown (993 corpus):**

| Year | n | Avg Sale Price |
|---|---|---|
| 1995 | 53 | $122,893 |
| 1996 | 62 | $171,724 |
| 1997 | 53 | $181,959 |
| 1998 | 31 | $199,442 |

**Interpretation:** Later years command higher prices in this corpus.
The linear R² of 3.7% understates year's contribution because the 993 market
shows a roughly monotone positive relationship (1995 → 1998, newer = more valuable).
The year_similarity scoring function's step-function shape (±1 → 0.85, ±2 → 0.6, etc.)
is appropriate for a generation where year proxies heavily for variant and spec progression.

### Factor: Sub_generation (proposed weight: TBD new factor for V2.1)

**Status: Cannot validate — field not yet in schema.**

Sub_generation has not been added to the listings table or populated in the corpus.
Any weight assigned to this factor is a research prior, not corpus-validated.

**Action required before V2.1 build:** Decide sub_generation taxonomy for 993
(e.g., Carrera 2 / Carrera 4 / Carrera RS / Carrera RS CS / Targa / Speedster / Turbo).
Post-population, validate empirically before the V2.2 weight update.

### Factor: Mod_status_stub (proposed weight: TBD new factor for V2.1)

**Status: Cannot validate — field not populated.**

`mod_status` exists in the schema (0/199 records populated)
but is empty in the current corpus. The research prior for mod discount is strong
(modified 993s trade at significant discounts), but corpus evidence is absent.

### Factor: Condition stub (proposed weight 0.150)

**Status: Cannot compute — all four inputs are 0/199 populated.**

The condition_stub formula is:
`paint_score × 0.4 + accident_score × 0.3 + photo_score × 0.2 + featured_score × 0.1`

| Input | Coverage |
|---|---|
| paint_meter_max_microns | 0/199 |
| accident_history_stated | 0/199 |
| listing_photo_count | 0/199 |
| is_featured_listing | 0/199 |

**This is the most critical data gap.** Condition at 0.150 weight is the second-largest
factor in the 993 config and cannot be validated at all from current data.
The weight is a research prior only. V2.1 builds condition_stub as a new factor;
it should be treated as experimental until the corpus is populated.

### Factor: Trim variant (proposed weight 0.100)

**Status: Cannot validate — trim_category and trim_variant are 0/199 populated.**

The comp engine uses trim_category as a hard filter, so within-trim comparisons
are the core analysis unit. Without trim_category data, no within-trim analysis
is possible. This is the largest structural gap in the corpus.

### Factor: Market region (proposed weight 0.100)

**Status: Cannot validate — market_region is 0/199 populated.**

Corpus is BaT-only. BaT is a predominantly US market. Even if market_region were
populated, variance would be near-zero in this corpus.

### Factor: Spec composite (proposed weight 0.100)

**Status: Cannot validate — all three inputs are 0/199 populated.**

Composite = PTS (0.40) + seats_type (0.30) + wheels_factory_correct (0.30)

| Input | Coverage |
|---|---|
| is_paint_to_sample | 0/199 |
| seats_type | 0/199 |
| wheels_factory_correct | 0/199 |

### Factor: Transmission variant (proposed weight 0.050)

**Status: V2 field (transmission_variant) empty; proxy analysis via raw NHTSA field.**

The raw `transmission` field is populated (197/199) but contains
polluted NHTSA text (e.g., "Automatic Climate Control", "Owner's Manual & Tool Kit").
After normalizing to manual/tiptronic/unknown:

| Transmission | n | Avg Sale Price |
|---|---|---|
| Manual (normalized) | 160 | $157,032 |
| Tiptronic (normalized) | 10 | $71,865 |
| Unknown / unclassified | 29 | — |

**Manual commands a +119% premium over Tiptronic in this corpus** (n=160 vs n=10).
This directionally supports the transmission_variant factor, but the 0.050 weight
may understate the actual price impact of this factor in the 993 market.

### Factor: Color rarity (proposed weight 0.050)

**Status: interior_color_rarity is 0/199 populated. Proxy analysis via exterior_color frequency.**

Proxy methodology: colors appearing in ≤3 records are treated as "rare"; colors
appearing in ≥4 records are treated as "common". This is a rough approximation.

| Group | n colors | n records | Avg Price |
|---|---|---|---|
| Common (≥4 records) | 11 | 168 | $153,797 |
| Rare (≤3 records) | 20 | 25 | $297,235 |

Rare-color proxy premium: **+93%** vs common colors.

**Caution:** This proxy conflates low-count colors with genuinely rare colors.
Some low-count colors are merely regional or uncommon in this BaT sample, not
intrinsically rare. The result is directional only.

### Factor: Consignor tier (proposed weight 0.050)

**Status: consignor_type is 0/199 populated. Cannot validate.**

All 199 records originate from Bring a Trailer. Consignor-tier variance is zero
in a single-platform corpus. This factor cannot be empirically validated until
multi-platform data (RM Sotheby's, Gooding, etc.) is ingested.

---

## Phase 3 — Rank-Order Summary Table

Sorted by empirical R² (descending). Factors with no empirical data appear last.

| Rank | Factor | Proposed Weight | Empirical R² | Pearson r | Direction Match | Assessment |
|---|---|---|---|---|---|---|
| 1 | Mileage | 0.300 | 20.7% | -0.454 | ✓ | calibrated |
| 2 | Year | 0.100 | 3.7% | 0.193 | ✓ | very weak — corpus shows U-shape not monotone |
| 3 | Condition stub | 0.150 | — | — | — | Cannot compute — all inputs null |
| 4 | Trim variant | 0.100 | — | — | — | Cannot compute — trim_category not populated |
| 5 | Market region | 0.100 | — | — | — | Cannot compute — market_region not populated |
| 6 | Spec composite | 0.100 | — | — | — | Cannot compute — PTS/seats/wheels all null |
| 7 | Transmission variant | 0.050 | — | — | — | Proxy analysis only (see below) |
| 8 | Color rarity | 0.050 | — | — | — | Proxy analysis only (see below) |
| 9 | Consignor tier | 0.050 | — | — | — | Cannot compute — consignor_type not populated |
| 10 | Sub_generation | 0.000 | — | — | — | Not yet added — V2.1 new factor |
| 11 | Mod_status_stub | 0.000 | — | — | — | Not populated — V2.1 new factor |
| 12 | Mechanical remediation | 0.000 | — | — | — | Weight 0 intentional for 993 |

**Rank divergence note:** Only 2 of 9 active factors
have empirical R² values. Meaningful rank comparison between weight-order and
evidence-order is not possible given the data gap. Flag for V2.2 post-enrichment.

---

## Phase 4 — Recommendations

### Mileage (0.300)

**Lock proposed weight.** Pearson r = -0.454, Spearman ρ = -0.533. Direction is correct (negative). R² = 20.7% corpus-wide, likely higher within trim buckets. The weakness is the absence of trim controls, not a mileage signal problem.

### Year (0.100)

**Lock proposed weight.** The 993 corpus shows a clear upward price gradient
from 1995 → 1998 ($122,893 → $199,442).
Later 993s command premiums for later RS variants, C4S, and Turbo evolution.
The step-function scoring approach is appropriate.

### Condition stub (0.150)

**Insufficient data.** No inputs are populated. The 0.150 weight is a research prior.
V2.1 should build the condition_stub infrastructure but treat its outputs as
experimental. Do not rely on condition_stub for pricing decisions until validated.
**This is the highest-risk weight in the entire config — it cannot be validated
and it carries the second-highest weight.**

### Trim variant (0.100)

**Insufficient data.** trim_category population is a prerequisite for all
within-trim analysis. This is the highest-priority corpus enrichment task.

### Market region (0.100)

**Insufficient data.** BaT-only corpus with zero market_region population.
Consider reducing weight for V2.1 until multi-platform data is available.

### Spec composite (0.100)

**Insufficient data.** All inputs empty. Keep as research prior — PTS, sport
seats, and factory wheels are well-established value drivers in collector
markets even without corpus confirmation.

### Transmission variant (0.050)

**Consider adjusting upward.** Proxy analysis shows manual commands a ~119%
premium over Tiptronic in the 993 corpus (n=160 vs n=10).
A 119% price delta is a large effect; 0.050 may understate this factor.
However, the proxy data uses raw NHTSA text — defer weight adjustment until
transmission_variant is cleanly populated.

### Color rarity (0.050)

**Insufficient data.** Proxy analysis is too noisy to support a weight change.
Lock at 0.050 as research prior.

### Consignor tier (0.050)

**Consider dropping or zeroing for V2.1.** This factor has zero empirical basis
in a BaT-only corpus. It cannot be validated until multi-platform data arrives.
Keeping it at 0.050 means it silently penalizes non-BaT comps without evidence.

### Sub_generation (new factor, weight TBD)

**Research prior — no empirical basis available.** Define taxonomy and populate
before assigning weight. The 993 sub_generation signal is intuitively strong
(RS vs Carrera vs Turbo is the largest price divider in the corpus), but this
is currently handled by trim_category hard-filtering, not by similarity scoring.

### Mod_status_stub (new factor, weight TBD)

**Research prior — no empirical basis.** Modified 993s are known to trade at
discounts. Assign a moderate weight (0.075–0.10) and validate post-enrichment.

---

## Phase 5 — Caveats

1. **Corpus size and composition:** 199 records, BaT-only, 993 generation only.
   Findings do not generalize to other platforms, other generations, or international markets.

2. **No trim controls:** The inability to group by trim_category is the largest
   structural weakness in this analysis. All factor correlations are suppressed
   by cross-trim variance. Reported R² values understate true within-trim signal.

3. **Sub_generation and mod_status_stub:** These proposed V2.1 factors cannot be
   validated from current corpus data. Any weights assigned are research priors only.

4. **Condition_stub unvalidated:** This is the highest-risk item. It carries the
   second-largest weight (0.150) but has zero corpus validation. Build it in V2.1
   but treat outputs as experimental.

5. **Correlation ≠ causation:** This analysis checks direction and magnitude of
   bivariate correlations, not causal structure. We are sanity-checking whether
   factors move with price in the expected direction, not building a hedonic model.

6. **Re-validate after V2.1 build:** All weight recommendations here should be
   re-examined after the V2.1 backtest runs on the enriched corpus.

---

*Generated by `scripts/preflight-correlation-analysis.ts`*
