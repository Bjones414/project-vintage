// ============================================================
// Comp Engine V2 — Recency extension and 48-month retry tests
//
// Covers:
//   - recencyWeight: correctly gates on maxMonths param
//   - applyRecencyWeighting: keeps/drops comps at extended window
//   - runCompEngineV2: pool of 37-48 month comps produces results at maxMonths=48
//   - runCompEngineV2: thin 48mo pool still returns insufficient_comps
// ============================================================

import { describe, it, expect } from 'vitest'
import { recencyWeight, applyRecencyWeighting } from '@/lib/comp-engine-v2/aggregation'
import { runCompEngineV2 } from '@/lib/comp-engine-v2/engine'
import { CASCADE_MIN_COMPS } from '@/lib/comp-engine-v2/cascade'
import type { V2Subject, V2CompCandidate, EngineConfig, ScoredComp } from '@/lib/comp-engine-v2/types'

// Fixed reference point so test assertions don't drift over calendar time
const NOW = new Date('2026-05-15T00:00:00Z')

function soldAt(monthsAgo: number): string {
  return new Date(NOW.getTime() - monthsAgo * 30.4375 * 24 * 60 * 60 * 1000).toISOString()
}

// ---------------------------------------------------------------------------
// Minimal EngineConfig for pure engine tests (no DB required)
// ---------------------------------------------------------------------------
const BASE_WEIGHTS: EngineConfig['weights'] = {
  weights: {
    mileage_similarity:            0.25,
    condition_stub:                0.15,
    year_similarity:               0.15,
    trim_variant_match:            0.10,
    market_region_match:           0.05,
    spec_composite:                0.10,
    transmission_variant_match:    0.05,
    color_rarity:                  0.05,
    consignor_tier_match:          0.03,
    mechanical_remediation_status: 0.04,
    drivetrain_match:              0.03,
  },
  generation: '991.2',
}

const BASE_BANDS: EngineConfig['bands'] = [
  { band_name: 'ultra_low', min_miles: 0,      max_miles: 10000 },
  { band_name: 'low',       min_miles: 10001,  max_miles: 30000 },
  { band_name: 'moderate',  min_miles: 30001,  max_miles: 60000 },
  { band_name: 'high',      min_miles: 60001,  max_miles: 100000 },
  { band_name: 'very_high', min_miles: 100001, max_miles: null },
]

const TEST_CONFIG: EngineConfig = {
  weights:        BASE_WEIGHTS,
  bands:          BASE_BANDS,
  taxonomy:       [],
  generationUsed: '991.2',
}

function makeSubject(overrides: Partial<V2Subject> = {}): V2Subject {
  return {
    id: 'sub-1', listing_id: 'sub-1', year: 2019, mileage: 25000,
    final_price_cents: 150_000_00, sold_at: soldAt(1),
    generation_id: '991.2', trim_category: 'gts', body_style: 'Targa',
    drivetrain: 'AWD', trim_variant: null, market_region: 'US',
    is_paint_to_sample: null, seats_type: null, wheels_factory_correct: null,
    transmission_variant: 'pdk', interior_color_rarity: null,
    consignor_type: null, mechanical_remediation_status: null,
    paint_meter_max_microns: null, accident_history_stated: null,
    listing_photo_count: null, is_featured_listing: null,
    is_comp_resistant: false,
    ...overrides,
  }
}

function makeComp(id: string, soldMonthsAgo: number, overrides: Partial<V2CompCandidate> = {}): V2CompCandidate {
  return {
    listing_id: id, year: 2019, mileage: 25000,
    final_price_cents: 148_000_00, sold_at: soldAt(soldMonthsAgo),
    generation_id: '991.2', trim_category: 'gts', body_style: 'Targa',
    drivetrain: 'AWD', trim_variant: null, market_region: 'US',
    is_paint_to_sample: null, seats_type: null, wheels_factory_correct: null,
    transmission_variant: 'pdk', interior_color_rarity: null,
    consignor_type: null, mechanical_remediation_status: null,
    paint_meter_max_microns: null, accident_history_stated: null,
    listing_photo_count: null, is_featured_listing: null,
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// recencyWeight — maxMonths parameterization
// ---------------------------------------------------------------------------
describe('recencyWeight with maxMonths', () => {
  it('returns 0 for a 37-month-old comp at the default 36-month window', () => {
    expect(recencyWeight(soldAt(37), NOW, 36)).toBe(0)
  })

  it('returns > 0 for a 37-month-old comp at the extended 48-month window', () => {
    const weight = recencyWeight(soldAt(37), NOW, 48)
    expect(weight).toBeGreaterThan(0)
  })

  it('returns 0 for a 49-month-old comp even at the 48-month window (hard cap)', () => {
    expect(recencyWeight(soldAt(49), NOW, 48)).toBe(0)
  })

  it('returns 0.4 for a 40-month-old comp at 48mo (falls through to last breakpoint)', () => {
    // months=40 exceeds all RECENCY_BREAKPOINTS endpoints; falls through to return 0.4
    expect(recencyWeight(soldAt(40), NOW, 48)).toBeCloseTo(0.4, 5)
  })
})

// ---------------------------------------------------------------------------
// applyRecencyWeighting — pool filtering at extended window
// ---------------------------------------------------------------------------
describe('applyRecencyWeighting with maxMonths', () => {
  function makeScoredComp(id: string, monthsAgo: number): ScoredComp {
    return {
      listing_id: id,
      price_cents: 148_000_00,
      similarity_score: 0.8,
      recency_weight: 0,
      final_weight: 0,
      factor_scores: {},
    }
  }

  it('drops a 37-month-old comp at the 36-month window', () => {
    const comp = makeScoredComp('c1', 37)
    const soldAts = new Map([['c1', soldAt(37)]])
    const result = applyRecencyWeighting([comp], soldAts, NOW, 36)
    expect(result).toHaveLength(0)
  })

  it('keeps a 37-month-old comp at the 48-month window', () => {
    const comp = makeScoredComp('c1', 37)
    const soldAts = new Map([['c1', soldAt(37)]])
    const result = applyRecencyWeighting([comp], soldAts, NOW, 48)
    expect(result).toHaveLength(1)
    expect(result[0].recency_weight).toBeGreaterThan(0)
  })

  it('drops a 49-month-old comp even at the 48-month window', () => {
    const comp = makeScoredComp('c1', 49)
    const soldAts = new Map([['c1', soldAt(49)]])
    const result = applyRecencyWeighting([comp], soldAts, NOW, 48)
    expect(result).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// runCompEngineV2 — 48-month retry scenario
// ---------------------------------------------------------------------------
describe('cascade retry at 48-month window', () => {
  const subject = makeSubject()

  it(`finds ≥ ${CASCADE_MIN_COMPS} comps when given a pool of ${CASCADE_MIN_COMPS + 2} comps sold 37–43 months ago and maxMonths=48`, () => {
    // All comps are 37-43 months old — they would be dropped at 36mo but kept at 48mo.
    const pool48 = Array.from({ length: CASCADE_MIN_COMPS + 2 }, (_, i) =>
      makeComp(`c${i}`, 37 + i)
    )
    const result = runCompEngineV2(subject, pool48, TEST_CONFIG, NOW, 48)
    // Should produce a result rather than insufficient_comps
    expect(result.verdict).not.toBe('insufficient_comps')
    expect(result.comp_count).toBeGreaterThanOrEqual(CASCADE_MIN_COMPS - 2) // after cohort/similarity stages
  })

  it('still returns insufficient_comps when the 48mo pool has only 2 comps (hard floor)', () => {
    // Only 2 comps available even at 48 months — should not cascade further
    const thinPool = [
      makeComp('c0', 38),
      makeComp('c1', 42),
    ]
    const result = runCompEngineV2(subject, thinPool, TEST_CONFIG, NOW, 48)
    expect(result.verdict).toBe('insufficient_comps')
  })

  it('the same 2-comp pool returns insufficient_comps at the default 36mo window too (baseline)', () => {
    const thinPool36 = [
      makeComp('c0', 20),
      makeComp('c1', 25),
    ]
    const result = runCompEngineV2(subject, thinPool36, TEST_CONFIG, NOW, 36)
    expect(result.verdict).toBe('insufficient_comps')
  })
})
