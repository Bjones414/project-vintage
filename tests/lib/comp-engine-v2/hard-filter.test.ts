import { describe, it, expect } from 'vitest'
import { applyHardFilters } from '@/lib/comp-engine-v2/hard-filter'
import type { V2Subject, V2CompCandidate, TrimTaxonomyEntry } from '@/lib/comp-engine-v2/types'

const taxonomy: TrimTaxonomyEntry[] = [
  { generation: '993', trim_category: 'carrera_2_narrow', is_separate_market: false },
  { generation: '993', trim_category: 'rs_touring', is_separate_market: true },
  { generation: '993', trim_category: 'gt2', is_separate_market: true },
  { generation: '993', trim_category: 'turbo_base', is_separate_market: false },
]

function makeSubject(overrides: Partial<V2Subject> = {}): V2Subject {
  return {
    id: 'sub-1', listing_id: 'sub-1', year: 1997, mileage: 50000,
    final_price_cents: 100_000_00, sold_at: '2025-01-01T00:00:00Z',
    generation_id: '993', trim_category: 'carrera_2_narrow', body_style: 'Coupe',
    drivetrain: 'RWD', trim_variant: null, market_region: null,
    is_paint_to_sample: null, seats_type: null, wheels_factory_correct: null,
    transmission_variant: null, interior_color_rarity: null, consignor_type: null,
    mechanical_remediation_status: null, paint_meter_max_microns: null,
    accident_history_stated: null, listing_photo_count: null, is_featured_listing: null,
    is_comp_resistant: false,
    ...overrides,
  }
}

function makeComp(id: string, overrides: Partial<V2CompCandidate> = {}): V2CompCandidate {
  return {
    listing_id: id, year: 1997, mileage: 50000,
    final_price_cents: 100_000_00, sold_at: '2025-01-01T00:00:00Z',
    generation_id: '993', trim_category: 'carrera_2_narrow', body_style: 'Coupe',
    drivetrain: 'RWD', trim_variant: null, market_region: null,
    is_paint_to_sample: null, seats_type: null, wheels_factory_correct: null,
    transmission_variant: null, interior_color_rarity: null, consignor_type: null,
    mechanical_remediation_status: null, paint_meter_max_microns: null,
    accident_history_stated: null, listing_photo_count: null, is_featured_listing: null,
    ...overrides,
  }
}

describe('hard-filter — trim_category', () => {
  it('passes comps with matching trim_category', () => {
    const subject = makeSubject({ trim_category: 'carrera_2_narrow' })
    const comps = [makeComp('c1', { trim_category: 'carrera_2_narrow' })]
    expect(applyHardFilters(subject, comps, taxonomy)).toHaveLength(1)
  })

  it('drops comps with different trim_category', () => {
    const subject = makeSubject({ trim_category: 'carrera_2_narrow' })
    const comps = [makeComp('c1', { trim_category: 'turbo_base' })]
    expect(applyHardFilters(subject, comps, taxonomy)).toHaveLength(0)
  })

  it('allows all comps when subject trim_category is null (D6)', () => {
    const subject = makeSubject({ trim_category: null })
    const comps = [
      makeComp('c1', { trim_category: 'carrera_2_narrow' }),
      makeComp('c2', { trim_category: 'turbo_base' }),
    ]
    expect(applyHardFilters(subject, comps, taxonomy)).toHaveLength(2)
  })

  it('allows comp when comp trim_category is null (D6)', () => {
    const subject = makeSubject({ trim_category: 'carrera_2_narrow' })
    const comps = [makeComp('c1', { trim_category: null })]
    expect(applyHardFilters(subject, comps, taxonomy)).toHaveLength(1)
  })
})

describe('hard-filter — body_style', () => {
  it('drops cabriolet comps for coupe subject', () => {
    const subject = makeSubject({ body_style: 'Coupe' })
    const comps = [makeComp('c1', { body_style: 'Cabriolet' })]
    expect(applyHardFilters(subject, comps, taxonomy)).toHaveLength(0)
  })

  it('passes coupe comps for coupe subject', () => {
    const subject = makeSubject({ body_style: 'Coupe' })
    const comps = [makeComp('c1', { body_style: 'Coupe' })]
    expect(applyHardFilters(subject, comps, taxonomy)).toHaveLength(1)
  })

  it('normalizes body_style variants (Convertible → cabriolet)', () => {
    const subject = makeSubject({ body_style: 'Cabriolet' })
    const comps = [makeComp('c1', { body_style: 'Convertible' })]
    expect(applyHardFilters(subject, comps, taxonomy)).toHaveLength(1)
  })

  it('skips body_style filter when either is null (D6)', () => {
    const subject = makeSubject({ body_style: null })
    const comps = [makeComp('c1', { body_style: 'Cabriolet' })]
    expect(applyHardFilters(subject, comps, taxonomy)).toHaveLength(1)
  })
})

describe('hard-filter — is_separate_market gate', () => {
  it('RS subject only matches RS comps', () => {
    const subject = makeSubject({ trim_category: 'rs_touring' })
    const comps = [
      makeComp('c1', { trim_category: 'rs_touring' }),
      makeComp('c2', { trim_category: 'carrera_2_narrow' }),
    ]
    const result = applyHardFilters(subject, comps, taxonomy)
    expect(result).toHaveLength(1)
    expect(result[0].listing_id).toBe('c1')
  })

  it('GT2 subject only matches GT2 comps', () => {
    const subject = makeSubject({ trim_category: 'gt2' })
    const comps = [
      makeComp('c1', { trim_category: 'gt2' }),
      makeComp('c2', { trim_category: 'turbo_base' }),
    ]
    const result = applyHardFilters(subject, comps, taxonomy)
    expect(result).toHaveLength(1)
    expect(result[0].listing_id).toBe('c1')
  })

  it('non-separate-market subject allows same trim comps', () => {
    const subject = makeSubject({ trim_category: 'carrera_2_narrow' })
    const comps = [makeComp('c1', { trim_category: 'carrera_2_narrow' })]
    expect(applyHardFilters(subject, comps, taxonomy)).toHaveLength(1)
  })
})
