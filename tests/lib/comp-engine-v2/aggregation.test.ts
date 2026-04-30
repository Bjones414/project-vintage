import { describe, it, expect } from 'vitest'
import {
  recencyWeight,
  computeWeightedFairValue,
  computeConfidence,
  capConfidenceForCount,
} from '@/lib/comp-engine-v2/aggregation'
import type { ScoredComp } from '@/lib/comp-engine-v2/types'

const NOW = new Date('2026-01-01T00:00:00Z')
function daysAgoISO(days: number) {
  return new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000).toISOString()
}

describe('recencyWeight', () => {
  it('0 months → 1.0', () => expect(recencyWeight(NOW.toISOString(), NOW)).toBeCloseTo(1.0))
  it('6 months → 1.0', () => expect(recencyWeight(daysAgoISO(6 * 30.4375), NOW)).toBeCloseTo(1.0))
  it('12 months → 0.8', () => expect(recencyWeight(daysAgoISO(12 * 30.4375), NOW)).toBeCloseTo(0.8))
  it('24 months → 0.6', () => expect(recencyWeight(daysAgoISO(24 * 30.4375), NOW)).toBeCloseTo(0.6))
  it('36 months → 0.4', () => expect(recencyWeight(daysAgoISO(36 * 30.4375), NOW)).toBeCloseTo(0.4))
  it('37 months → 0 (dropped)', () => expect(recencyWeight(daysAgoISO(37 * 30.4375), NOW)).toBe(0))
})

function makeComp(id: string, price: number, similarity: number, recency: number): ScoredComp {
  return {
    listing_id: id,
    price_cents: price,
    similarity_score: similarity,
    recency_weight: recency,
    final_weight: similarity * recency,
    factor_scores: {},
  }
}

describe('computeWeightedFairValue', () => {
  it('returns null for empty comps', () => {
    expect(computeWeightedFairValue([])).toBeNull()
  })

  it('single comp → median=p25=p75=price', () => {
    const result = computeWeightedFairValue([makeComp('c1', 100_000_00, 1.0, 1.0)])
    expect(result?.median_cents).toBe(100_000_00)
    expect(result?.p25_cents).toBe(100_000_00)
    expect(result?.p75_cents).toBe(100_000_00)
  })

  it('equal-weight comps → correct weighted median', () => {
    const comps = [
      makeComp('c1', 80_000_00, 1.0, 1.0),
      makeComp('c2', 100_000_00, 1.0, 1.0),
      makeComp('c3', 120_000_00, 1.0, 1.0),
    ]
    const result = computeWeightedFairValue(comps)
    expect(result?.median_cents).toBe(100_000_00)
  })

  it('high_variance flag when (P75-P25)/median > 0.25', () => {
    // P25=50K, P75=100K, median=75K: (100K-50K)/75K = 0.67 > 0.25 → high_variance
    const comps = [
      makeComp('c1', 50_000_00, 1.0, 1.0),
      makeComp('c2', 75_000_00, 1.0, 1.0),
      makeComp('c3', 100_000_00, 1.0, 1.0),
    ]
    const result = computeWeightedFairValue(comps)
    expect(result?.high_variance).toBe(true)
  })

  it('no high_variance when spread is tight', () => {
    // All same price → spread = 0
    const comps = [
      makeComp('c1', 100_000_00, 1.0, 1.0),
      makeComp('c2', 100_000_00, 1.0, 1.0),
      makeComp('c3', 100_000_00, 1.0, 1.0),
    ]
    const result = computeWeightedFairValue(comps)
    expect(result?.high_variance).toBe(false)
  })

  it('higher-weight comps pull median toward their price', () => {
    // c1 (cheap) has 10x weight of c2/c3 → median pulled toward c1
    const comps = [
      makeComp('c1', 50_000_00, 1.0, 1.0),  // weight=1.0
      makeComp('c2', 200_000_00, 0.1, 1.0), // weight=0.1
      makeComp('c3', 200_000_00, 0.1, 1.0), // weight=0.1
    ]
    const result = computeWeightedFairValue(comps)
    // Total weight=1.2, 50% threshold at 0.6 → c1 at cumulative=1.0 is reached first
    expect(result!.median_cents).toBe(50_000_00)
  })
})

describe('capConfidenceForCount', () => {
  it('3–4 comps → capped at 40', () => {
    expect(capConfidenceForCount(80, 3)).toBe(40)
    expect(capConfidenceForCount(80, 4)).toBe(40)
  })

  it('≥5 comps → not capped', () => {
    expect(capConfidenceForCount(80, 5)).toBe(80)
    expect(capConfidenceForCount(95, 10)).toBe(95)
  })

  it('below cap → unchanged', () => {
    expect(capConfidenceForCount(30, 3)).toBe(30)
  })
})

describe('computeConfidence', () => {
  it('returns 0 for empty comps', () => {
    const { score } = computeConfidence([], null)
    expect(score).toBe(0)
  })

  it('returns 0–100', () => {
    const comps = [
      makeComp('c1', 100_000_00, 0.9, 1.0),
      makeComp('c2', 102_000_00, 0.85, 0.9),
      makeComp('c3', 98_000_00, 0.8, 0.8),
    ]
    const fv = computeWeightedFairValue(comps)!
    const { score } = computeConfidence(comps, fv)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })
})
