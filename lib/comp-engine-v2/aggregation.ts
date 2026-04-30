// ============================================================
// Comp Engine V2 — Stages 5-7: Recency, Aggregation, Confidence
//
// Stage 5: Recency weighting (reuses V1 breakpoints from spec).
// Stage 6: Weighted median + P25/P75 + high_variance flag.
// Stage 7: Confidence score 0-100 (computed, not surfaced in V1 UI).
// ============================================================

import type { ScoredComp, FairValueV2, ConfidenceComponents } from './types'

// ---- Stage 5: Recency -----------------------------------------------

const RECENCY_BREAKPOINTS: [number, number][] = [
  [0, 1.0],
  [6, 1.0],
  [12, 0.8],
  [24, 0.6],
  [36, 0.4],
]

export function recencyWeight(soldAt: string, asOf: Date = new Date()): number {
  const months = (asOf.getTime() - new Date(soldAt).getTime()) / (1000 * 60 * 60 * 24 * 30.4375)
  if (months > 36) return 0
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

// Drop comps sold > 36 months ago (recency weight = 0)
export function applyRecencyWeighting(comps: ScoredComp[], soldAts: Map<string, string>, asOf: Date = new Date()): ScoredComp[] {
  return comps
    .map(c => {
      const soldAt = soldAts.get(c.listing_id) ?? ''
      const rw = recencyWeight(soldAt, asOf)
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
