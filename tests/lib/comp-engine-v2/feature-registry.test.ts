import { describe, it, expect } from 'vitest'
import {
  getAllFeatures,
  getFeature,
  getRegisteredFeatureNames,
  extractFeatureVector,
} from '@/lib/comp-engine-v2/feature-registry'
import type { V2CompCandidate } from '@/lib/comp-engine-v2/types'

// ---- Helpers ----------------------------------------------------------------

function makeCandidate(
  overrides: Partial<V2CompCandidate> = {},
): V2CompCandidate {
  return {
    listing_id: 'test-1',
    year: 2010,
    mileage: 30000,
    final_price_cents: 10000000,
    sold_at: '2025-06-01T00:00:00Z',
    generation_id: '997.2',
    trim_category: 'carrera_base',
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
    ...overrides,
  }
}

const REFERENCE_DATE = new Date('2026-01-01T00:00:00Z')

// ---- Registry API -----------------------------------------------------------

describe('Feature registry', () => {
  it('has exactly three initial features registered', () => {
    expect(getAllFeatures()).toHaveLength(3)
  })

  it('getRegisteredFeatureNames returns all names', () => {
    const names = getRegisteredFeatureNames()
    expect(names).toContain('mileage_log')
    expect(names).toContain('age_months')
    expect(names).toContain('mileage_log_x_era')
  })

  it('getFeature returns the registered entry', () => {
    const f = getFeature('mileage_log')
    expect(f).toBeDefined()
    expect(f!.name).toBe('mileage_log')
    expect(f!.transformation).toBe('log')
  })

  it('getFeature returns undefined for unknown name', () => {
    expect(getFeature('nonexistent_feature')).toBeUndefined()
  })

  it('getAllFeatures returns a copy (mutation does not affect registry)', () => {
    const arr = getAllFeatures()
    arr.push({} as never)
    expect(getAllFeatures()).toHaveLength(3)
  })
})

// ---- mileage_log extractor --------------------------------------------------

describe('mileage_log feature', () => {
  const f = () => getFeature('mileage_log')!

  it('returns log(mileage)', () => {
    const comp = makeCandidate({ mileage: 30000 })
    expect(f().extractor(comp)).toBeCloseTo(Math.log(30000))
  })

  it('returns null for null mileage', () => {
    const comp = makeCandidate({ mileage: null })
    expect(f().extractor(comp)).toBeNull()
  })

  it('returns null for zero mileage', () => {
    const comp = makeCandidate({ mileage: 0 })
    expect(f().extractor(comp)).toBeNull()
  })

  it('returns null for negative mileage', () => {
    const comp = makeCandidate({ mileage: -100 })
    expect(f().extractor(comp)).toBeNull()
  })

  it('low mileage < high mileage (log preserves order)', () => {
    const low = f().extractor(makeCandidate({ mileage: 5000 }))!
    const high = f().extractor(makeCandidate({ mileage: 100000 }))!
    expect(low).toBeLessThan(high)
  })
})

// ---- age_months extractor ---------------------------------------------------

describe('age_months feature', () => {
  const f = () => getFeature('age_months')!

  it('returns ~6 for a comp sold 6 months before reference', () => {
    const sixMonthsAgo = new Date(REFERENCE_DATE.getTime() - 6 * 30.4375 * 24 * 60 * 60 * 1000)
    const comp = makeCandidate({ sold_at: sixMonthsAgo.toISOString() })
    expect(f().extractor(comp, REFERENCE_DATE)).toBeCloseTo(6, 0)
  })

  it('returns ~12 for a comp sold 12 months before reference', () => {
    const twelveMonthsAgo = new Date(REFERENCE_DATE.getTime() - 12 * 30.4375 * 24 * 60 * 60 * 1000)
    const comp = makeCandidate({ sold_at: twelveMonthsAgo.toISOString() })
    expect(f().extractor(comp, REFERENCE_DATE)).toBeCloseTo(12, 0)
  })

  it('older comp has larger age_months', () => {
    const recentComp = makeCandidate({ sold_at: '2025-06-01T00:00:00Z' })
    const olderComp = makeCandidate({ sold_at: '2024-01-01T00:00:00Z' })
    const recent = f().extractor(recentComp, REFERENCE_DATE)!
    const older = f().extractor(olderComp, REFERENCE_DATE)!
    expect(older).toBeGreaterThan(recent)
  })

  it('returns null for empty sold_at', () => {
    const comp = makeCandidate({ sold_at: '' })
    expect(f().extractor(comp, REFERENCE_DATE)).toBeNull()
  })
})

// ---- mileage_log_x_era extractor -------------------------------------------

describe('mileage_log_x_era feature', () => {
  const f = () => getFeature('mileage_log_x_era')!

  it('returns 0 for air_cooled era (ordinal=0)', () => {
    const comp = makeCandidate({ mileage: 50000, generation_id: '993' })
    expect(f().extractor(comp)).toBe(0)
  })

  it('returns log(mileage) × 1 for water_cooled_na', () => {
    const comp = makeCandidate({ mileage: 50000, generation_id: '997.2', trim_category: 'carrera_base' })
    expect(f().extractor(comp)).toBeCloseTo(Math.log(50000) * 1)
  })

  it('returns log(mileage) × 2 for water_cooled_gt (gt3 trim)', () => {
    const comp = makeCandidate({ mileage: 10000, generation_id: '997.2', trim_category: 'gt3' })
    expect(f().extractor(comp)).toBeCloseTo(Math.log(10000) * 2)
  })

  it('returns log(mileage) × 3 for modern_turbo', () => {
    const comp = makeCandidate({ mileage: 20000, generation_id: '992.1' })
    expect(f().extractor(comp)).toBeCloseTo(Math.log(20000) * 3)
  })

  it('returns null for null mileage', () => {
    const comp = makeCandidate({ mileage: null, generation_id: '997.2' })
    expect(f().extractor(comp)).toBeNull()
  })

  it('returns null for null generation_id', () => {
    const comp = makeCandidate({ mileage: 30000, generation_id: null })
    expect(f().extractor(comp)).toBeNull()
  })

  it('returns null for unknown generation_id (getEra throws → caught → null)', () => {
    const comp = makeCandidate({ mileage: 30000, generation_id: 'totally-unknown-gen' })
    expect(f().extractor(comp)).toBeNull()
  })
})

// ---- extractFeatureVector ---------------------------------------------------

describe('extractFeatureVector', () => {
  const features = getAllFeatures()

  it('returns array of length 3 for a valid comp', () => {
    const comp = makeCandidate({ mileage: 30000, generation_id: '997.2', sold_at: '2025-01-01T00:00:00Z' })
    const vec = extractFeatureVector(comp, features, REFERENCE_DATE)
    expect(vec).not.toBeNull()
    expect(vec!).toHaveLength(3)
  })

  it('returns null when mileage is null (blocks mileage_log + interaction)', () => {
    const comp = makeCandidate({ mileage: null })
    expect(extractFeatureVector(comp, features, REFERENCE_DATE)).toBeNull()
  })

  it('returns null when generation_id is null (blocks interaction)', () => {
    const comp = makeCandidate({ mileage: 30000, generation_id: null })
    expect(extractFeatureVector(comp, features, REFERENCE_DATE)).toBeNull()
  })

  it('feature values match individual extractor calls', () => {
    const comp = makeCandidate({ mileage: 45000, generation_id: '991.2', sold_at: '2025-06-01T00:00:00Z' })
    const vec = extractFeatureVector(comp, features, REFERENCE_DATE)!
    expect(vec[0]).toBeCloseTo(Math.log(45000))
    expect(vec[1]).toBeGreaterThan(0)  // age in months
    expect(vec[2]).toBeCloseTo(Math.log(45000) * 1)  // 991.2 = water_cooled_na, ordinal=1
  })
})
