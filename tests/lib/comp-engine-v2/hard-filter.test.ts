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

  it('allows non-halo comps when subject trim_category is null (D6)', () => {
    // D6: when subject has no known trim_category, non-ALWAYS_SEPARATE_MARKET comps
    // are allowed through. ALWAYS_SEPARATE_MARKET comps (turbo, GT3, etc.) are still
    // blocked bilaterally regardless of subject trim_category.
    const subject = makeSubject({ trim_category: null })
    const comps = [
      makeComp('c1', { trim_category: 'carrera_2_narrow' }),  // non-ALWAYS_SEPARATE_MARKET: passes
      makeComp('c2', { trim_category: 'carrera_4_narrow' }),  // non-ALWAYS_SEPARATE_MARKET: passes
    ]
    expect(applyHardFilters(subject, comps, taxonomy)).toHaveLength(2)
  })

  it('D6 does NOT allow ALWAYS_SEPARATE_MARKET comps even when subject trim_category is null', () => {
    // turbo_base is in ALWAYS_SEPARATE_MARKET — blocked bilaterally regardless of D6.
    const subject = makeSubject({ trim_category: null })
    const comps = [makeComp('turbo', { trim_category: 'turbo_base' })]
    expect(applyHardFilters(subject, comps, taxonomy)).toHaveLength(0)
  })

  it('drops comp when comp trim_category is null and subject has a known category', () => {
    // Null-category comps are NOT safe defaults when the subject's category is known.
    // D6 (passthrough) only fires when the SUBJECT itself has no known trim_category.
    const subject = makeSubject({ trim_category: 'carrera_2_narrow' })
    const comps = [makeComp('c1', { trim_category: null })]
    expect(applyHardFilters(subject, comps, taxonomy)).toHaveLength(0)
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

describe('hard-filter — ALWAYS_SEPARATE_MARKET expanded set', () => {
  // These tests verify that halo/performance categories are bilaterally isolated
  // regardless of taxonomy DB contents (belt-and-suspenders).

  const emptyTaxonomy: TrimTaxonomyEntry[] = []

  it('Turbo comp does not bleed into Carrera subject with null trim_category (D6 guard)', () => {
    // Subject has no trim_category (D6 fires) — but Turbo comp should STILL be blocked
    // by the bilateral ALWAYS_SEPARATE_MARKET gate.
    const subject = makeSubject({ trim_category: null })
    const comps = [
      makeComp('turbo-comp', { trim_category: 'turbo_base' }),
      makeComp('carrera-comp', { trim_category: 'carrera_2_narrow' }),
    ]
    const result = applyHardFilters(subject, comps, emptyTaxonomy)
    const ids = result.map(c => c.listing_id)
    expect(ids).not.toContain('turbo-comp')
  })

  it('Turbo S comp blocked from Carrera subject regardless of taxonomy', () => {
    const subject = makeSubject({ trim_category: null })
    const comps = [makeComp('ts', { trim_category: 'turbo_s' })]
    expect(applyHardFilters(subject, comps, emptyTaxonomy)).toHaveLength(0)
  })

  it('GT3 comp blocked from Carrera subject', () => {
    const subject = makeSubject({ trim_category: null })
    const comps = [makeComp('gt3', { trim_category: 'gt3' })]
    expect(applyHardFilters(subject, comps, emptyTaxonomy)).toHaveLength(0)
  })

  it('GT3 RS comp blocked from Carrera subject', () => {
    const subject = makeSubject({ trim_category: null })
    const comps = [makeComp('gt3rs', { trim_category: 'gt3_rs' })]
    expect(applyHardFilters(subject, comps, emptyTaxonomy)).toHaveLength(0)
  })

  it('GT2 comp blocked from Carrera subject', () => {
    const subject = makeSubject({ trim_category: null })
    const comps = [makeComp('gt2', { trim_category: 'gt2' })]
    expect(applyHardFilters(subject, comps, emptyTaxonomy)).toHaveLength(0)
  })

  it('GT2 RS comp blocked from Carrera subject', () => {
    const subject = makeSubject({ trim_category: null })
    const comps = [makeComp('gt2rs', { trim_category: 'gt2_rs' })]
    expect(applyHardFilters(subject, comps, emptyTaxonomy)).toHaveLength(0)
  })

  it('Cayman GT4 comp blocked from base Cayman subject', () => {
    const subject = makeSubject({ trim_category: null })
    const comps = [makeComp('gt4', { trim_category: 'cayman_gt4' })]
    expect(applyHardFilters(subject, comps, emptyTaxonomy)).toHaveLength(0)
  })

  it('Boxster Spyder comp blocked from base Boxster subject', () => {
    const subject = makeSubject({ trim_category: null })
    const comps = [makeComp('spyder', { trim_category: 'boxster_spyder' })]
    expect(applyHardFilters(subject, comps, emptyTaxonomy)).toHaveLength(0)
  })

  it('RS Touring comp blocked from Carrera subject', () => {
    const subject = makeSubject({ trim_category: null })
    const comps = [makeComp('rs', { trim_category: 'rs_touring' })]
    expect(applyHardFilters(subject, comps, emptyTaxonomy)).toHaveLength(0)
  })

  it('Turbo subject does not receive Carrera comps when its own trim_category is known', () => {
    const subject = makeSubject({ trim_category: 'turbo_base' })
    const comps = [
      makeComp('carrera', { trim_category: 'carrera_2_narrow' }),
      makeComp('turbo2', { trim_category: 'turbo_base' }),
    ]
    const result = applyHardFilters(subject, comps, emptyTaxonomy)
    expect(result.map(c => c.listing_id)).toEqual(['turbo2'])
  })

  it('Turbo subject with null trim_category — Carrera comps are NOT blocked (D6 allows them through)', () => {
    // This is the EXPECTED behavior under D6: when neither subject NOR comp has a
    // known trim_category, we cannot apply the filter. The ALWAYS_SEPARATE_MARKET gate
    // only runs on comp.trim_category, so a Carrera comp with null trim_category passes.
    // This scenario represents un-categorized data in the DB, not a code bug.
    const subject = makeSubject({ trim_category: null })
    const comps = [makeComp('carrera-null', { trim_category: null })]
    const result = applyHardFilters(subject, comps, emptyTaxonomy)
    expect(result).toHaveLength(1)  // null trim_category cannot be blocked
  })
})
