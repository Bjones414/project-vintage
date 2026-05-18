// ============================================================
// Comp Engine V2 — Stages 5-7: Recency, Aggregation, Confidence
//
// Stage 5: Recency weighting (reuses V1 breakpoints from spec).
// Stage 6: Weighted median + P25/P75 + high_variance flag.
//          V2: computeRidgeFairValue adds adaptive Ridge regression
//              with prior blending as primary estimator.
// Stage 7: Confidence score 0-100 (computed, not surfaced in V1 UI).
// ============================================================

import type { ScoredComp, FairValueV2, ConfidenceComponents, V2CompCandidate, GenerationPrior } from './types'
import { getAllFeatures, extractFeatureVector } from './feature-registry'
import { fitRidge, predictRidge, computeResiduals } from './ridge'
import { adaptiveAlpha, blendWithPrior } from './prior-blend'

// ---- Stage 5: Recency -----------------------------------------------

const RECENCY_BREAKPOINTS: [number, number][] = [
  [0, 1.0],
  [6, 1.0],
  [12, 0.8],
  [24, 0.6],
  [36, 0.4],
]

export function recencyWeight(soldAt: string, asOf: Date = new Date(), maxMonths: number = 36): number {
  const months = (asOf.getTime() - new Date(soldAt).getTime()) / (1000 * 60 * 60 * 24 * 30.4375)
  if (months > maxMonths) return 0
  if (months <= 0) return 1.0
  for (let i = 1; i < RECENCY_BREAKPOINTS.length; i++) {
    const [m0, w0] = RECENCY_BREAKPOINTS[i - 1]
    const [m1, w1] = RECENCY_BREAKPOINTS[i]
    if (months <= m1) {
      const t = (months - m0) / (m1 - m0)
      return w0 + t * (w1 - w0)
    }
  }
  return 0.4
}

// Drop comps sold > maxMonths ago (recency weight = 0)
export function applyRecencyWeighting(comps: ScoredComp[], soldAts: Map<string, string>, asOf: Date = new Date(), maxMonths: number = 36): ScoredComp[] {
  return comps
    .map(c => {
      const soldAt = soldAts.get(c.listing_id) ?? ''
      const rw = recencyWeight(soldAt, asOf, maxMonths)
      return { ...c, recency_weight: rw, final_weight: c.similarity_score * rw }
    })
    .filter(c => c.final_weight > 0)
}

// ---- Stage 6: Weighted median + P25/P75 ----------------------------------

function weightedPercentile(
  items: Array<{ value: number; weight: number }>,
  p: number,
): number {
  if (items.length === 0) return 0
  const sorted = [...items].sort((a, b) => a.value - b.value)
  const totalWeight = sorted.reduce((s, x) => s + x.weight, 0)
  if (totalWeight === 0) return 0
  const target = p * totalWeight
  let cumulative = 0
  for (const item of sorted) {
    cumulative += item.weight
    if (cumulative >= target) return item.value
  }
  return sorted[sorted.length - 1].value
}

export function computeWeightedFairValue(comps: ScoredComp[]): FairValueV2 | null {
  if (comps.length === 0) return null
  const items = comps.map(c => ({ value: c.price_cents, weight: c.final_weight }))
  const median_cents = Math.round(weightedPercentile(items, 0.5))
  const p25_cents    = Math.round(weightedPercentile(items, 0.25))
  const p75_cents    = Math.round(weightedPercentile(items, 0.75))
  const high_variance = median_cents > 0 && (p75_cents - p25_cents) / median_cents > 0.25
  return { median_cents, p25_cents, p75_cents, high_variance }
}

// ---- Stage 7: Confidence Score 0-100 -------------------------------------

function effectiveSampleSize(comps: ScoredComp[]): number {
  const sumW = comps.reduce((s, c) => s + c.final_weight, 0)
  const sumW2 = comps.reduce((s, c) => s + c.final_weight ** 2, 0)
  return sumW2 > 0 ? (sumW ** 2) / sumW2 : 0
}

export function computeConfidence(
  comps: ScoredComp[],
  fairValue: FairValueV2 | null,
): { score: number; components: ConfidenceComponents } {
  if (comps.length === 0 || fairValue === null) {
    return { score: 0, components: { sample_size: 0, iqr_tightness: 0, recency: 0, best_similarity: 0 } }
  }

  // Component 1: effective sample size (0–1, normalized to max 20 useful comps)
  const ess = Math.min(effectiveSampleSize(comps), 20) / 20

  // Component 2: IQR tightness — lower IQR/median = higher confidence
  const iqrRatio = fairValue.median_cents > 0
    ? (fairValue.p75_cents - fairValue.p25_cents) / fairValue.median_cents
    : 1
  // Clamp: ratio 0 → 1.0, ratio 0.5+ → 0.0, linear between
  const iqr_tightness = Math.max(0, 1 - iqrRatio / 0.5)

  // Component 3: recency of best comp (best = highest similarity_score)
  const bestComp = comps.reduce((best, c) => c.similarity_score > best.similarity_score ? c : best, comps[0])
  const recency = bestComp.recency_weight

  // Component 4: best similarity score (already 0–1)
  const best_similarity = bestComp.similarity_score

  // Weighted composite per spec
  const raw = 0.35 * ess + 0.25 * iqr_tightness + 0.20 * recency + 0.20 * best_similarity
  const score = Math.round(Math.min(100, Math.max(0, raw * 100)))

  return {
    score,
    components: { sample_size: ess, iqr_tightness, recency, best_similarity },
  }
}

// Cap confidence for low comp counts (Stage 2 rule)
export function capConfidenceForCount(score: number, compCount: number): number {
  if (compCount >= 3 && compCount <= 4) return Math.min(score, 40)
  return score
}

// ---- Ridge V2: Stage 6 alternative estimator --------------------------------

// Base regularisation strength. Adaptive alpha scales this by (k / poolSize).
const BASE_RIDGE_ALPHA = 1.0

export interface RidgeFairValueResult {
  fairValue: FairValueV2
  /** Per-feature contribution to log(price). Key = feature name. */
  featureContributions: Record<string, number>
}

/**
 * Compute fair value via adaptive Ridge regression + prior blending.
 *
 * Uses all features registered in the feature registry. Comps where
 * any feature is null are silently dropped from the design matrix.
 * Returns null when fewer than 3 comps have complete feature data,
 * or when the Ridge solve fails (singular matrix) — engine.ts falls
 * back to computeWeightedFairValue in that case.
 *
 * subject      — the listing being analysed (for point prediction)
 * comps        — scored comps after recency weighting
 * candidateMap — listing_id → V2CompCandidate for feature extraction
 * prior        — generation-level median prior (null until Session 2 seeding)
 * poolSize     — total generation pool size (for adaptive alpha)
 * referenceDate — anchor date for age_months feature
 */
export function computeRidgeFairValue(
  subject: V2CompCandidate,
  comps: ScoredComp[],
  candidateMap: Map<string, V2CompCandidate>,
  prior: GenerationPrior | null,
  poolSize: number,
  referenceDate: Date = new Date(),
): RidgeFairValueResult | null {
  const features = getAllFeatures()
  if (features.length === 0) return null

  // Feature names including intercept for contribution labelling
  const featureNames = ['intercept', ...features.map(f => f.name)]

  // Build design matrix rows and log-price targets
  const xRows: number[][] = []
  const yVals: number[] = []

  for (const comp of comps) {
    const candidate = candidateMap.get(comp.listing_id)
    if (!candidate) continue

    const featureVec = extractFeatureVector(candidate, features, referenceDate)
    if (featureVec === null) continue  // missing data — skip comp

    if (comp.price_cents <= 0) continue
    xRows.push([1, ...featureVec])    // prepend intercept
    yVals.push(Math.log(comp.price_cents))
  }

  // Require at least as many observations as features (including intercept column)
  // to avoid an underdetermined system. Ridge regularisation handles the n≈p case.
  const minComps = features.length + 1
  if (xRows.length < minComps) return null

  const k = xRows.length
  const alpha = adaptiveAlpha(BASE_RIDGE_ALPHA, k, poolSize)
  const fit = fitRidge(xRows, yVals, alpha)
  if (!fit) return null

  // Extract subject feature vector
  const subjectFeatureVec = extractFeatureVector(subject, features, referenceDate)
  if (subjectFeatureVec === null) return null

  const xSubject = [1, ...subjectFeatureVec]
  const predResult = predictRidge(xSubject, fit, featureNames)

  // Blend with generation-level prior (null → regression only, with console.warn)
  const blendedMedianCents = blendWithPrior(
    predResult.predictedCents,
    prior,
    k,
  )

  // P25/P75 from in-sample residuals distribution
  const sortedResiduals = computeResiduals(xRows, yVals, fit, featureNames)
  const n = sortedResiduals.length
  const eps25 = sortedResiduals[Math.max(0, Math.floor(n * 0.25) - 1)] ?? 0
  const eps75 = sortedResiduals[Math.min(n - 1, Math.floor(n * 0.75))] ?? 0

  const logMedian = Math.log(blendedMedianCents)
  const p25Cents  = Math.round(Math.exp(logMedian + eps25))
  const p75Cents  = Math.round(Math.exp(logMedian + eps75))
  const highVariance = blendedMedianCents > 0 &&
    (p75Cents - p25Cents) / blendedMedianCents > 0.25

  // Build feature contribution map (non-intercept log-price contributions)
  const featureContributions: Record<string, number> = {}
  for (const c of predResult.featureContributions) {
    if (c.featureName === 'intercept') continue
    featureContributions[c.featureName] = c.contributionLogPrice
  }

  // Console-log the contribution record for observability (persisted logging: Session 3)
  console.log('[ridge-v2] feature contributions', JSON.stringify({
    pool_size: poolSize,
    k,
    alpha: alpha.toFixed(4),
    predicted_cents: Math.round(blendedMedianCents),
    contributions: featureContributions,
  }))

  return {
    fairValue: {
      median_cents: Math.round(blendedMedianCents),
      p25_cents:    Math.max(1, p25Cents),
      p75_cents:    p75Cents,
      high_variance: highVariance,
    },
    featureContributions,
  }
}
