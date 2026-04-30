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

const MUSEUM_THRESHOLD = 1000

export function runCompEngineV2(
  subject: V2Subject,
  pool: V2CompCandidate[],        // all candidates for this generation (pre-filtered by recency at fetch time)
  config: EngineConfig,
  asOf: Date = new Date(),
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

  // Stage 1: Hard categorical filters
  const afterHardFilter = applyHardFilters(subject, soldPool, config.taxonomy)

  // Stage 2: Sample-size floor
  if (afterHardFilter.length < 3) {
    return emptyResult('insufficient_comps', 'post_hard_filter_count', {
      comp_count: afterHardFilter.length,
    })
  }

  // Stage 3: Museum mileage cohort separation
  const { pool: afterCohort, isMuseumSubject } = applyCohortSeparation(
    subject.mileage,
    afterHardFilter,
  )

  if (afterCohort.length < 3) {
    return emptyResult('insufficient_comps', 'post_cohort_separation', {
      comp_count: afterCohort.length,
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
    })
  }

  // Stage 5: Recency weighting (drops > 36 months)
  // Build soldAt map from pool
  const soldAtMap = new Map<string, string>(afterCohort.map(c => [c.listing_id, c.sold_at]))
  const afterRecency = applyRecencyWeighting(scored, soldAtMap, asOf)

  if (afterRecency.length < 3) {
    return emptyResult('insufficient_comps', 'post_recency_drop', {
      comp_count: afterRecency.length,
    })
  }

  // Stage 2 continued: low confidence for 3–4 comps
  const lowConfidence = afterRecency.length >= 3 && afterRecency.length <= 4

  // Stage 6: Weighted median + P25/P75
  const fairValue = computeWeightedFairValue(afterRecency)
  if (!fairValue) {
    return emptyResult('insufficient_comps', 'fair_value_computation_failed')
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

  // Verdict (requires subject asking_price — passed as hint; compute from median if not available)
  const verdict = lowConfidence ? 'low_confidence' : null

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
  }
}
