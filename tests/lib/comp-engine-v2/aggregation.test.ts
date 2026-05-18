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

// ---- computeRidgeFairValue integration tests --------------------------------

import { computeRidgeFairValue } from '@/lib/comp-engine-v2/aggregation'
import type { V2CompCandidate } from '@/lib/comp-engine-v2/types'

function makeCandidate(
  id: string,
  mileage: number,
  priceCents: number,
  soldAt: string,
  generation_id = '997.2',
  trim_category = 'carrera_base',
): V2CompCandidate {
  return {
    listing_id: id,
    year: 2010,
    mileage,
    final_price_cents: priceCents,
    sold_at: soldAt,
    generation_id,
    trim_category,
    body_style: 'coupe',
    drivetrain: 'rwd',
    trim_variant: null,
    market_region: null,
    is_paint_to_sample: null,
    seats_type: null,
    wheels_factory_correct: null,
    transmission_variant: null,
    interior_color_rarity: null,
    consignor_type: null,
    mechanical_remediation_status: null,
    paint_meter_max_microns: null,
    accident_history_stated: null,
    listing_photo_count: null,
    is_featured_listing: null,
  }
}

const RIDGE_NOW = new Date('2026-01-01T00:00:00Z')

// Five 997.2 comps with monotone mileage-price relationship
const RIDGE_COMPS: ScoredComp[] = [
  { listing_id: 'r1', price_cents: 14_000_000, similarity_score: 0.9, recency_weight: 1.0, final_weight: 0.9, factor_scores: {} },
  { listing_id: 'r2', price_cents: 12_000_000, similarity_score: 0.9, recency_weight: 1.0, final_weight: 0.9, factor_scores: {} },
  { listing_id: 'r3', price_cents: 10_000_000, similarity_score: 0.9, recency_weight: 0.9, final_weight: 0.81, factor_scores: {} },
  { listing_id: 'r4', price_cents:  8_500_000, similarity_score: 0.8, recency_weight: 0.8, final_weight: 0.64, factor_scores: {} },
  { listing_id: 'r5', price_cents:  7_000_000, similarity_score: 0.8, recency_weight: 0.8, final_weight: 0.64, factor_scores: {} },
]

const RIDGE_CANDIDATES = new Map<string, V2CompCandidate>([
  ['r1', makeCandidate('r1', 10_000, 14_000_000, '2025-07-01T00:00:00Z')],
  ['r2', makeCandidate('r2', 25_000, 12_000_000, '2025-01-01T00:00:00Z')],
  ['r3', makeCandidate('r3', 50_000, 10_000_000, '2024-07-01T00:00:00Z')],
  ['r4', makeCandidate('r4', 80_000,  8_500_000, '2024-01-01T00:00:00Z')],
  ['r5', makeCandidate('r5', 120_000, 7_000_000, '2023-07-01T00:00:00Z')],
])

const RIDGE_SUBJECT = makeCandidate('subject', 40_000, 11_000_000, '2025-06-01T00:00:00Z')

describe('computeRidgeFairValue', () => {
  it('returns non-null result for well-formed comps', () => {
    const result = computeRidgeFairValue(
      RIDGE_SUBJECT, RIDGE_COMPS, RIDGE_CANDIDATES, null, 50, RIDGE_NOW,
    )
    expect(result).not.toBeNull()
  })

  it('fair value median is a positive number', () => {
    const result = computeRidgeFairValue(
      RIDGE_SUBJECT, RIDGE_COMPS, RIDGE_CANDIDATES, null, 50, RIDGE_NOW,
    )!
    expect(result.fairValue.median_cents).toBeGreaterThan(0)
  })

  it('P25 ≤ median ≤ P75', () => {
    const result = computeRidgeFairValue(
      RIDGE_SUBJECT, RIDGE_COMPS, RIDGE_CANDIDATES, null, 50, RIDGE_NOW,
    )!
    expect(result.fairValue.p25_cents).toBeLessThanOrEqual(result.fairValue.median_cents)
    expect(result.fairValue.median_cents).toBeLessThanOrEqual(result.fairValue.p75_cents)
  })

  it('returns null when comps < (features + 1) — underdetermined system', () => {
    // 3 features + intercept = 4 required. 3 comps → underdetermined → null.
    const threeComps = RIDGE_COMPS.slice(0, 3)
    const threeMap = new Map<string, V2CompCandidate>(
      Array.from(RIDGE_CANDIDATES.entries()).slice(0, 3),
    )
    const result = computeRidgeFairValue(
      RIDGE_SUBJECT, threeComps, threeMap, null, 50, RIDGE_NOW,
    )
    expect(result).toBeNull()
  })

  it('feature contributions include all three registered features', () => {
    const result = computeRidgeFairValue(
      RIDGE_SUBJECT, RIDGE_COMPS, RIDGE_CANDIDATES, null, 50, RIDGE_NOW,
    )!
    const keys = Object.keys(result.featureContributions)
    expect(keys).toContain('mileage_log')
    expect(keys).toContain('age_months')
    expect(keys).toContain('mileage_log_x_era')
  })

  it('feature contributions values are numbers', () => {
    const result = computeRidgeFairValue(
      RIDGE_SUBJECT, RIDGE_COMPS, RIDGE_CANDIDATES, null, 50, RIDGE_NOW,
    )!
    for (const [, v] of Object.entries(result.featureContributions)) {
      expect(typeof v).toBe('number')
      expect(isNaN(v)).toBe(false)
    }
  })

  it('blends toward prior when prior is provided', () => {
    const prior = {
      generation_id: '997.2',
      median_cents: 20_000_000,  // $200K prior (much higher than training data ~$7K-$14K)
      sample_size: 200,
      computed_at: '2026-01-01T00:00:00Z',
    }
    // With a high prior, the blended result should be higher than regression-only.
    // All 5 comps → 4-9 comp tier → 60% regression, 40% prior.
    const withPrior = computeRidgeFairValue(
      RIDGE_SUBJECT, RIDGE_COMPS, RIDGE_CANDIDATES, prior, 50, RIDGE_NOW,
    )!
    const withoutPrior = computeRidgeFairValue(
      RIDGE_SUBJECT, RIDGE_COMPS, RIDGE_CANDIDATES, null, 50, RIDGE_NOW,
    )!
    expect(withPrior).not.toBeNull()
    expect(withoutPrior).not.toBeNull()
    // With a $200K prior blended in at 40%, prediction should be higher than regression-only
    expect(withPrior.fairValue.median_cents).toBeGreaterThan(
      withoutPrior.fairValue.median_cents,
    )
  })
})
