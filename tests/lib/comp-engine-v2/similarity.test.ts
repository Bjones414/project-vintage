import { describe, it, expect } from 'vitest'
import {
  getBand,
  mileageSimilarity,
  yearSimilarity,
  specCompositeSimilarity,
  applySimilarityScoring,
  SIMILARITY_DROP_THRESHOLD,
} from '@/lib/comp-engine-v2/similarity'
import type { MileageBand, GenerationWeights, V2Subject, V2CompCandidate } from '@/lib/comp-engine-v2/types'

const bands993: MileageBand[] = [
  { band_name: 'ultra_low', min_miles: 1000, max_miles: 5000 },
  { band_name: 'low',       min_miles: 5000,  max_miles: 25000 },
  { band_name: 'moderate',  min_miles: 25000, max_miles: 75000 },
  { band_name: 'high',      min_miles: 75000, max_miles: 125000 },
  { band_name: 'very_high', min_miles: 125000, max_miles: null },
]

const weightsAllMileage: GenerationWeights = {
  generation: '993',
  weights: {
    mileage_similarity: 1.0,
    condition_stub: 0, year_similarity: 0, trim_variant_match: 0,
    market_region_match: 0, spec_composite: 0, transmission_variant_match: 0,
    color_rarity: 0, consignor_tier_match: 0, mechanical_remediation_status: 0,
  },
}

describe('getBand', () => {
  it('maps 2500 → ultra_low', () => expect(getBand(2500, bands993)).toBe('ultra_low'))
  it('maps 10000 → low',      () => expect(getBand(10000, bands993)).toBe('low'))
  it('maps 50000 → moderate', () => expect(getBand(50000, bands993)).toBe('moderate'))
  it('maps 100000 → high',    () => expect(getBand(100000, bands993)).toBe('high'))
  it('maps 200000 → very_high', () => expect(getBand(200000, bands993)).toBe('very_high'))
  it('null → null', () => expect(getBand(null, bands993)).toBeNull())
  it('boundary 5000 → low (min_miles inclusive)', () => expect(getBand(5000, bands993)).toBe('low'))
  it('boundary 25000 → moderate', () => expect(getBand(25000, bands993)).toBe('moderate'))
})

describe('mileageSimilarity — same band', () => {
  it.each([
    ['ultra_low', 2500, 3000, 1.0],
    ['low',      10000, 15000, 1.0],
    ['moderate', 40000, 60000, 1.0],
    ['high',     90000, 110000, 1.0],
  ])('%s band → 1.0', (_, a, b, expected) => {
    expect(mileageSimilarity(a, b, bands993)).toBe(expected)
  })
})

describe('mileageSimilarity — cross-band', () => {
  it('ultra_low × low → 0.4',   () => expect(mileageSimilarity(2500, 10000, bands993)).toBe(0.4))
  it('low × moderate → 0.6',   () => expect(mileageSimilarity(10000, 50000, bands993)).toBe(0.6))
  it('ultra_low × moderate → 0.0', () => expect(mileageSimilarity(2500, 50000, bands993)).toBe(0.0))
  it('moderate × very_high → 0.3', () => expect(mileageSimilarity(50000, 200000, bands993)).toBe(0.3))
  it('null subject → 0.5 (unknown)', () => expect(mileageSimilarity(null, 50000, bands993)).toBe(0.5))
})

describe('yearSimilarity', () => {
  it('same year → 1.0',  () => expect(yearSimilarity(1997, 1997)).toBe(1.0))
  it('±1 year → 0.85',  () => expect(yearSimilarity(1997, 1996)).toBe(0.85))
  it('±2 years → 0.6',  () => expect(yearSimilarity(1997, 1995)).toBe(0.6))
  it('±3 years → 0.4',  () => expect(yearSimilarity(1997, 1994)).toBe(0.4))
  it('±4 years → 0.0',  () => expect(yearSimilarity(1997, 1993)).toBe(0.0))
})

describe('specCompositeSimilarity', () => {
  function makeSubject(pts: boolean | null, seats: string | null, wheels: boolean | null): V2Subject {
    return {
      id: 's', listing_id: 's', year: 1997, mileage: 50000,
      final_price_cents: 0, sold_at: '', generation_id: '993',
      trim_category: null, body_style: null, drivetrain: null, trim_variant: null,
      market_region: null, is_paint_to_sample: pts, seats_type: seats,
      wheels_factory_correct: wheels, transmission_variant: null,
      interior_color_rarity: null, consignor_type: null,
      mechanical_remediation_status: null, paint_meter_max_microns: null,
      accident_history_stated: null, listing_photo_count: null,
      is_featured_listing: null, is_comp_resistant: false,
    }
  }

  function makeComp(pts: boolean | null, seats: string | null, wheels: boolean | null): V2CompCandidate {
    return {
      listing_id: 'c', year: 1997, mileage: 50000,
      final_price_cents: 0, sold_at: '', generation_id: '993',
      trim_category: null, body_style: null, drivetrain: null, trim_variant: null,
      market_region: null, is_paint_to_sample: pts, seats_type: seats,
      wheels_factory_correct: wheels, transmission_variant: null,
      interior_color_rarity: null, consignor_type: null,
      mechanical_remediation_status: null, paint_meter_max_microns: null,
      accident_history_stated: null, listing_photo_count: null, is_featured_listing: null,
    }
  }

  it('all match → 1.0', () => {
    expect(specCompositeSimilarity(
      makeSubject(true, 'sport', true),
      makeComp(true, 'sport', true),
    )).toBe(1.0)
  })

  it('all null → 0.5 (all unknown)', () => {
    expect(specCompositeSimilarity(
      makeSubject(null, null, null),
      makeComp(null, null, null),
    )).toBeCloseTo(0.5)
  })

  it('PTS mismatch drops spec_composite (PTS weight = 0.40)', () => {
    // PTS: 0.40 * 0.0 (mismatch) + seats: 0.30 * 1.0 (match) + wheels: 0.30 * 1.0 (match) = 0.60
    expect(specCompositeSimilarity(
      makeSubject(true, 'sport', true),
      makeComp(false, 'sport', true),
    )).toBeCloseTo(0.60)
  })
})

describe('applySimilarityScoring — drop threshold', () => {
  it(`drops comps below ${SIMILARITY_DROP_THRESHOLD} similarity`, () => {
    // With weight=1 on mileage, ultra_low vs very_high = 0.0 < 0.4 → dropped
    const subject: V2Subject = {
      id: 's', listing_id: 's', year: 1997, mileage: 2500,
      final_price_cents: 0, sold_at: '', generation_id: '993',
      trim_category: null, body_style: null, drivetrain: null, trim_variant: null,
      market_region: null, is_paint_to_sample: null, seats_type: null,
      wheels_factory_correct: null, transmission_variant: null, interior_color_rarity: null,
      consignor_type: null, mechanical_remediation_status: null, paint_meter_max_microns: null,
      accident_history_stated: null, listing_photo_count: null, is_featured_listing: null,
      is_comp_resistant: false,
    }
    const comp: V2CompCandidate = {
      listing_id: 'c', year: 1997, mileage: 200000,  // very_high vs ultra_low → 0.0
      final_price_cents: 100_000_00, sold_at: '',
      generation_id: '993', trim_category: null, body_style: null, drivetrain: null,
      trim_variant: null, market_region: null, is_paint_to_sample: null, seats_type: null,
      wheels_factory_correct: null, transmission_variant: null, interior_color_rarity: null,
      consignor_type: null, mechanical_remediation_status: null, paint_meter_max_microns: null,
      accident_history_stated: null, listing_photo_count: null, is_featured_listing: null,
    }
    expect(applySimilarityScoring(subject, [comp], weightsAllMileage, bands993)).toHaveLength(0)
  })

  it('keeps comps at or above threshold', () => {
    const subject: V2Subject = {
      id: 's', listing_id: 's', year: 1997, mileage: 50000,
      final_price_cents: 0, sold_at: '', generation_id: '993',
      trim_category: null, body_style: null, drivetrain: null, trim_variant: null,
      market_region: null, is_paint_to_sample: null, seats_type: null,
      wheels_factory_correct: null, transmission_variant: null, interior_color_rarity: null,
      consignor_type: null, mechanical_remediation_status: null, paint_meter_max_microns: null,
      accident_history_stated: null, listing_photo_count: null, is_featured_listing: null,
      is_comp_resistant: false,
    }
    const comp: V2CompCandidate = {
      listing_id: 'c', year: 1997, mileage: 50000,  // moderate vs moderate → 1.0
      final_price_cents: 100_000_00, sold_at: '',
      generation_id: '993', trim_category: null, body_style: null, drivetrain: null,
      trim_variant: null, market_region: null, is_paint_to_sample: null, seats_type: null,
      wheels_factory_correct: null, transmission_variant: null, interior_color_rarity: null,
      consignor_type: null, mechanical_remediation_status: null, paint_meter_max_microns: null,
      accident_history_stated: null, listing_photo_count: null, is_featured_listing: null,
    }
    expect(applySimilarityScoring(subject, [comp], weightsAllMileage, bands993)).toHaveLength(1)
  })
})
