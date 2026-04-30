import { describe, it, expect } from 'vitest'
import { applyCohortSeparation, MUSEUM_THRESHOLD } from '@/lib/comp-engine-v2/mileage-cohort'
import type { V2CompCandidate } from '@/lib/comp-engine-v2/types'

function makeComp(id: string, mileage: number | null): V2CompCandidate {
  return {
    listing_id: id, year: 1997, mileage,
    final_price_cents: 100_000_00, sold_at: '2025-01-01T00:00:00Z',
    generation_id: '993', trim_category: null, body_style: null, drivetrain: null,
    trim_variant: null, market_region: null, is_paint_to_sample: null,
    seats_type: null, wheels_factory_correct: null, transmission_variant: null,
    interior_color_rarity: null, consignor_type: null, mechanical_remediation_status: null,
    paint_meter_max_microns: null, accident_history_stated: null,
    listing_photo_count: null, is_featured_listing: null,
  }
}

const pool = [
  makeComp('museum-1', 500),
  makeComp('museum-2', 999),
  makeComp('normal-1', 1000),
  makeComp('normal-2', 50000),
  makeComp('null-mileage', null),
]

describe('mileage cohort — museum subject (<1000 miles)', () => {
  it('restricts pool to other museum comps', () => {
    const { pool: result, isMuseumSubject } = applyCohortSeparation(500, pool)
    expect(isMuseumSubject).toBe(true)
    expect(result.map(c => c.listing_id)).toEqual(['museum-1', 'museum-2'])
  })

  it('subject at exactly 999 is museum', () => {
    const { isMuseumSubject } = applyCohortSeparation(999, pool)
    expect(isMuseumSubject).toBe(true)
  })
})

describe('mileage cohort — normal subject (>=1000 miles)', () => {
  it('excludes museum comps from pool', () => {
    const { pool: result, isMuseumSubject } = applyCohortSeparation(50000, pool)
    expect(isMuseumSubject).toBe(false)
    expect(result.map(c => c.listing_id)).not.toContain('museum-1')
    expect(result.map(c => c.listing_id)).not.toContain('museum-2')
  })

  it('includes null-mileage comps in normal pool', () => {
    const { pool: result } = applyCohortSeparation(50000, pool)
    expect(result.map(c => c.listing_id)).toContain('null-mileage')
  })

  it('subject at exactly 1000 is not museum', () => {
    const { isMuseumSubject } = applyCohortSeparation(1000, pool)
    expect(isMuseumSubject).toBe(false)
  })
})

describe('mileage cohort — null subject mileage', () => {
  it('returns full pool without separation', () => {
    const { pool: result, isMuseumSubject } = applyCohortSeparation(null, pool)
    expect(isMuseumSubject).toBe(false)
    expect(result).toHaveLength(pool.length)
  })
})

describe('MUSEUM_THRESHOLD constant', () => {
  it('is 1000', () => {
    expect(MUSEUM_THRESHOLD).toBe(1000)
  })
})
