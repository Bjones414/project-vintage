// ============================================================
// Comp Engine V2 — Main Pipeline Orchestrator
//
// Runs all 9 stages in sequence on a subject against a comp pool.
// Designed to run without DB access when called with pre-loaded
// config (for backtest harness performance).
// ============================================================

import type {
  V2Subject,
  V2CompCandidate,
  V2CompsResult,
  EngineConfig,
  ScoredComp,
  CascadeLevel,
} from './types'
import { applyHardFilters } from './hard-filter'
import { applyCohortSeparation } from './mileage-cohort'
import { applySimilarityScoring } from './similarity'
import {
  applyRecencyWeighting,
  computeWeightedFairValue,
  computeConfidence,
  capConfidenceForCount,
} from './aggregation'
import { buildMethodologyText } from './methodology'
import { selectCascadePool, getCascadeCaveat } from './cascade'

export function runCompEngineV2(
  subject: V2Subject,
  pool: V2CompCandidate[],        // all candidates for this generation (pre-filtered by recency at fetch time)
  config: EngineConfig,
  asOf: Date = new Date(),
  maxMonths: number = 36,
): V2CompsResult {
  const emptyResult = (
    verdict: V2CompsResult['verdict'],
    reason?: string,
    partial?: Partial<V2CompsResult>,
  ): V2CompsResult => ({
    verdict,
    predicted_median: null,
    predicted_p25: null,
    predicted_p75: null,
    confidence_score: null,
    methodology_text: null,
    high_variance: false,
    comp_count: 0,
    comps_used: [],
    comps_failed: [],
    generation_used: config.generationUsed,
    weights_used: config.weights.weights,
    insufficient_reason: reason,
    cascade_level: null,
    cascade_caveat: null,
    ...partial,
  })

  // Stage 2 (pre-check): comp_resistant flag
  if (subject.is_comp_resistant) {
    return emptyResult('uncomparable', 'comp_resistant_flag', {
      comp_count: pool.length,
    })
  }

  // Separate no-sale listings before filtering (Stage 9)
  const comps_failed: V2CompCandidate[] = []
  const soldPool: V2CompCandidate[] = []
  for (const c of pool) {
    // No-sale detection: the pool caller should already exclude no-sale listings,
    // but if auction_outcome is set we can detect them here too.
    // For now: all pool entries passed are treated as sold comps.
    soldPool.push(c)
  }

  // Stage 1: Hard categorical filters (trim isolation + body style + bilateral gate)
  const afterHardFilter = applyHardFilters(subject, soldPool, config.taxonomy)

  // Stage 2: Sample-size floor — use cascade to find the broadest qualifying pool.
  // Sparse-category path (coachbuilt / limited): return raw data points rather than
  // suppressing entirely — these categories are rare by design.
  const isSparseCategory =
    subject.trim_category === 'coachbuilt' || subject.trim_category === 'limited'

  if (isSparseCategory && afterHardFilter.length > 0 && afterHardFilter.length < 3) {
    const sparseComps: ScoredComp[] = afterHardFilter.map(c => ({
      listing_id: c.listing_id,
      price_cents: c.final_price_cents,
      similarity_score: 0,
      recency_weight: 0,
      final_weight: 0,
      factor_scores: {},
    }))
    return emptyResult('insufficient_comps', 'sparse_category', {
      comp_count: afterHardFilter.length,
      comps_used: sparseComps,
      cascade_level: 3,  // hard filter level is equivalent to cascade level 3
      cascade_caveat: null,
    })
  }

  // Cascade: try progressively broader pools until MIN_COMPS is reached.
  // fullPool (soldPool) is passed for Carrera-family expansion at levels 5-6.
  const cascadeResult = selectCascadePool(subject, afterHardFilter, soldPool)

  if (cascadeResult === null || cascadeResult.pool.length === 0) {
    return emptyResult('insufficient_comps', 'post_hard_filter_count', {
      comp_count: afterHardFilter.length,
      cascade_level: null,
      cascade_caveat: null,
    })
  }

  const cascadePool = cascadeResult.pool
  const cascadeLevel: CascadeLevel = cascadeResult.level
  const cascade_caveat = getCascadeCaveat(cascadeLevel, subject.generation_id)

  // Stage 3: Museum mileage cohort separation
  const { pool: afterCohort, isMuseumSubject } = applyCohortSeparation(
    subject.mileage,
    cascadePool,
  )

  if (afterCohort.length < 3) {
    return emptyResult('insufficient_comps', 'post_cohort_separation', {
      comp_count: afterCohort.length,
      cascade_level: cascadeLevel,
      cascade_caveat,
    })
  }

  // Stage 4: Similarity scoring (also drops comps < 0.4 threshold)
  const scored: ScoredComp[] = applySimilarityScoring(
    subject,
    afterCohort,
    config.weights,
    config.bands,
  )

  if (scored.length < 3) {
    return emptyResult('insufficient_comps', 'post_similarity_drop_threshold', {
      comp_count: scored.length,
      cascade_level: cascadeLevel,
      cascade_caveat,
    })
  }

  // Stage 5: Recency weighting (drops > maxMonths)
  // Build soldAt map from pool
  const soldAtMap = new Map<string, string>(afterCohort.map(c => [c.listing_id, c.sold_at]))
  const afterRecency = applyRecencyWeighting(scored, soldAtMap, asOf, maxMonths)

  if (afterRecency.length < 3) {
    return emptyResult('insufficient_comps', 'post_recency_drop', {
      comp_count: afterRecency.length,
      cascade_level: cascadeLevel,
      cascade_caveat,
    })
  }

  // Stage 2 continued: low confidence for 3–4 comps
  const lowConfidence = afterRecency.length >= 3 && afterRecency.length <= 4

  // Stage 6: Weighted median + P25/P75
  const fairValue = computeWeightedFairValue(afterRecency)
  if (!fairValue) {
    return emptyResult('insufficient_comps', 'fair_value_computation_failed', {
      cascade_level: cascadeLevel,
      cascade_caveat,
    })
  }

  // Stage 7: Confidence score
  const { score: rawConfidence } = computeConfidence(afterRecency, fairValue)
  const confidence_score = capConfidenceForCount(rawConfidence, afterRecency.length)

  // Stage 8: Methodology text
  const methodology_text = buildMethodologyText({
    compCount: afterRecency.length,
    generationUsed: config.generationUsed,
    isMuseumCohort: isMuseumSubject,
    highVariance: fairValue.high_variance,
    lowConfidence,
  })

  // Verdict: compare subject final_price against the P25–P75 comp range
  let verdict: V2CompsResult['verdict']
  if (lowConfidence) {
    verdict = 'low_confidence'
  } else if (subject.final_price_cents > 0) {
    if (subject.final_price_cents < fairValue.p25_cents) {
      verdict = 'priced_below'
    } else if (subject.final_price_cents > fairValue.p75_cents) {
      verdict = 'priced_above'
    } else {
      verdict = 'priced_fairly'
    }
  } else {
    verdict = null
  }

  return {
    verdict,
    predicted_median: fairValue.median_cents,
    predicted_p25: fairValue.p25_cents,
    predicted_p75: fairValue.p75_cents,
    confidence_score,
    methodology_text,
    high_variance: fairValue.high_variance,
    comp_count: afterRecency.length,
    comps_used: afterRecency,
    comps_failed,
    generation_used: config.generationUsed,
    weights_used: config.weights.weights,
    cascade_level: cascadeLevel,
    cascade_caveat,
  }
}
