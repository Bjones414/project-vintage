import { describe, it, expect } from 'vitest'
import {
  buildCascadePool,
  selectCascadePool,
  getCascadeCaveat,
  isCarreraFamily,
  CASCADE_MIN_COMPS,
} from '@/lib/comp-engine-v2/cascade'
import type { V2Subject, V2CompCandidate } from '@/lib/comp-engine-v2/types'

function makeSubject(overrides: Partial<V2Subject> = {}): V2Subject {
  return {
    id: 'sub-1', listing_id: 'sub-1', year: 2001, mileage: 50000,
    final_price_cents: 50_000_00, sold_at: '2025-01-01T00:00:00Z',
    generation_id: '996', trim_category: 'carrera_base', body_style: 'Coupe',
    drivetrain: 'RWD', trim_variant: null, market_region: null,
    is_paint_to_sample: null, seats_type: null, wheels_factory_correct: null,
    transmission_variant: 'manual', interior_color_rarity: null,
    consignor_type: null, mechanical_remediation_status: null,
    paint_meter_max_microns: null, accident_history_stated: null,
    listing_photo_count: null, is_featured_listing: null,
    is_comp_resistant: false,
    ...overrides,
  }
}

function makeComp(id: string, overrides: Partial<V2CompCandidate> = {}): V2CompCandidate {
  return {
    listing_id: id, year: 2001, mileage: 50000,
    final_price_cents: 50_000_00, sold_at: '2025-01-01T00:00:00Z',
    generation_id: '996', trim_category: 'carrera_base', body_style: 'Coupe',
    drivetrain: 'RWD', trim_variant: null, market_region: null,
    is_paint_to_sample: null, seats_type: null, wheels_factory_correct: null,
    transmission_variant: 'manual', interior_color_rarity: null,
    consignor_type: null, mechanical_remediation_status: null,
    paint_meter_max_microns: null, accident_history_stated: null,
    listing_photo_count: null, is_featured_listing: null,
    ...overrides,
  }
}

// Build N comps with shared overrides
function comps(n: number, overrides: Partial<V2CompCandidate> = {}): V2CompCandidate[] {
  return Array.from({ length: n }, (_, i) =>
    makeComp(`c${i}`, overrides)
  )
}

describe('isCarreraFamily', () => {
  it('returns true for Carrera variants', () => {
    expect(isCarreraFamily('carrera_base')).toBe(true)
    expect(isCarreraFamily('carrera_4')).toBe(true)
    expect(isCarreraFamily('carrera_s')).toBe(true)
    expect(isCarreraFamily('carrera_4s')).toBe(true)
    expect(isCarreraFamily('gts')).toBe(true)
    expect(isCarreraFamily('carrera_2_narrow')).toBe(true)
    expect(isCarreraFamily('carrera_4_narrow')).toBe(true)
    expect(isCarreraFamily('carrera_s_wide')).toBe(true)
    expect(isCarreraFamily('carrera_4s_wide')).toBe(true)
  })

  it('returns false for Turbo and GT categories', () => {
    expect(isCarreraFamily('turbo_base')).toBe(false)
    expect(isCarreraFamily('turbo_s')).toBe(false)
    expect(isCarreraFamily('gt2')).toBe(false)
    expect(isCarreraFamily('gt2_rs')).toBe(false)
    expect(isCarreraFamily('gt3')).toBe(false)
    expect(isCarreraFamily('gt3_rs')).toBe(false)
  })

  it('returns false for limited and coachbuilt categories', () => {
    expect(isCarreraFamily('limited')).toBe(false)
    expect(isCarreraFamily('coachbuilt')).toBe(false)
    expect(isCarreraFamily('speedster')).toBe(false)
    expect(isCarreraFamily('sport_classic')).toBe(false)
  })

  it('returns false for null', () => {
    expect(isCarreraFamily(null)).toBe(false)
  })
})

describe('buildCascadePool — level 1 (same year + body + transmission)', () => {
  it('filters to same year', () => {
    const subject = makeSubject({ year: 2001, transmission_variant: 'manual' })
    const pool = [
      makeComp('c1', { year: 2001 }),
      makeComp('c2', { year: 2003 }),  // different year
    ]
    const result = buildCascadePool(subject, pool, pool, 1)
    expect(result.map(c => c.listing_id)).toEqual(['c1'])
  })

  it('filters by transmission when both known', () => {
    const subject = makeSubject({ year: 2001, transmission_variant: 'manual' })
    const pool = [
      makeComp('c1', { year: 2001, transmission_variant: 'manual' }),
      makeComp('c2', { year: 2001, transmission_variant: 'pdk' }),
    ]
    const result = buildCascadePool(subject, pool, pool, 1)
    expect(result.map(c => c.listing_id)).toEqual(['c1'])
  })

  it('passes through comp with null transmission (D6 — unknown is not excluded)', () => {
    const subject = makeSubject({ year: 2001, transmission_variant: 'manual' })
    const pool = [
      makeComp('c1', { year: 2001, transmission_variant: null }),
    ]
    const result = buildCascadePool(subject, pool, pool, 1)
    expect(result).toHaveLength(1)
  })

  it('filters by body style', () => {
    const subject = makeSubject({ year: 2001, body_style: 'Coupe' })
    const pool = [
      makeComp('c1', { year: 2001, body_style: 'Coupe' }),
      makeComp('c2', { year: 2001, body_style: 'Cabriolet' }),
    ]
    const result = buildCascadePool(subject, pool, pool, 1)
    expect(result.map(c => c.listing_id)).toEqual(['c1'])
  })
})

describe('buildCascadePool — level 2 (adjacent years ±2 + same body)', () => {
  it('includes years within ±2', () => {
    const subject = makeSubject({ year: 2001, body_style: 'Coupe' })
    const pool = [
      makeComp('c1', { year: 1999, body_style: 'Coupe' }), // -2: include
      makeComp('c2', { year: 2000, body_style: 'Coupe' }), // -1: include
      makeComp('c3', { year: 2001, body_style: 'Coupe' }), // 0: include
      makeComp('c4', { year: 2003, body_style: 'Coupe' }), // +2: include
      makeComp('c5', { year: 2004, body_style: 'Coupe' }), // +3: exclude
    ]
    const result = buildCascadePool(subject, pool, pool, 2)
    expect(result.map(c => c.listing_id)).toEqual(['c1', 'c2', 'c3', 'c4'])
  })

  it('still enforces body style at level 2', () => {
    const subject = makeSubject({ year: 2001, body_style: 'Coupe' })
    const pool = [
      makeComp('c1', { year: 2001, body_style: 'Coupe' }),
      makeComp('c2', { year: 2001, body_style: 'Cabriolet' }),
    ]
    const result = buildCascadePool(subject, pool, pool, 2)
    expect(result.map(c => c.listing_id)).toEqual(['c1'])
  })
})

describe('buildCascadePool — level 3 (full generation, same body)', () => {
  it('includes all years but only same body', () => {
    const subject = makeSubject({ year: 2001, body_style: 'Coupe' })
    const pool = [
      makeComp('c1', { year: 1999, body_style: 'Coupe' }),
      makeComp('c2', { year: 2004, body_style: 'Coupe' }),
      makeComp('c3', { year: 2001, body_style: 'Cabriolet' }),  // different body: exclude
    ]
    const result = buildCascadePool(subject, pool, pool, 3)
    expect(result.map(c => c.listing_id)).toEqual(['c1', 'c2'])
  })
})

describe('buildCascadePool — level 4 (full generation, any body)', () => {
  it('returns entire hard-filtered pool regardless of body', () => {
    const subject = makeSubject({ year: 2001, body_style: 'Coupe' })
    const pool = [
      makeComp('c1', { body_style: 'Coupe' }),
      makeComp('c2', { body_style: 'Cabriolet' }),
      makeComp('c3', { body_style: 'Targa' }),
    ]
    const result = buildCascadePool(subject, pool, pool, 4)
    expect(result).toHaveLength(3)
  })
})

describe('buildCascadePool — level 5/6 (Carrera family expansion)', () => {
  it('expands to Carrera family trims when subject is Carrera-family', () => {
    const subject = makeSubject({ trim_category: 'carrera_base' })
    const hardFiltered = comps(2, { trim_category: 'carrera_base' })  // only 2: too few
    const fullPool = [
      ...hardFiltered,
      makeComp('extra1', { trim_category: 'carrera_4' }),   // Carrera family → include
      makeComp('extra2', { trim_category: 'carrera_s' }),   // Carrera family → include
      makeComp('extra3', { trim_category: 'turbo_base' }),  // NOT Carrera family → exclude
      makeComp('extra4', { trim_category: 'gt3' }),          // NOT Carrera family → exclude
    ]
    const result = buildCascadePool(subject, hardFiltered, fullPool, 5)
    expect(result.map(c => c.trim_category)).not.toContain('turbo_base')
    expect(result.map(c => c.trim_category)).not.toContain('gt3')
    expect(result.length).toBe(4)  // 2 carrera_base + carrera_4 + carrera_s
  })

  it('does NOT expand beyond hard-filtered pool for non-Carrera subjects', () => {
    const subject = makeSubject({ trim_category: 'turbo_base' })
    const hardFiltered = comps(2, { trim_category: 'turbo_base' })
    const fullPool = [
      ...hardFiltered,
      makeComp('extra1', { trim_category: 'carrera_base' }),
    ]
    const result = buildCascadePool(subject, hardFiltered, fullPool, 5)
    // Should NOT expand to carrera_base — Turbo stays in Turbo market
    expect(result.map(c => c.trim_category)).not.toContain('carrera_base')
    expect(result).toHaveLength(2)
  })

  it('GT3 subject does NOT expand to Carrera family at level 5', () => {
    const subject = makeSubject({ trim_category: 'gt3' })
    const hardFiltered = comps(1, { trim_category: 'gt3' })
    const fullPool = [
      ...hardFiltered,
      makeComp('extra1', { trim_category: 'carrera_base' }),
      makeComp('extra2', { trim_category: 'carrera_s' }),
    ]
    const result = buildCascadePool(subject, hardFiltered, fullPool, 5)
    expect(result.map(c => c.trim_category)).not.toContain('carrera_base')
    expect(result).toHaveLength(1)
  })
})

describe('selectCascadePool', () => {
  it('returns level 1 when enough same-year/body/transmission comps exist', () => {
    const subject = makeSubject({ year: 2001, body_style: 'Coupe', transmission_variant: 'manual' })
    const hardFiltered = comps(CASCADE_MIN_COMPS, {
      year: 2001, body_style: 'Coupe', transmission_variant: 'manual',
    })
    const result = selectCascadePool(subject, hardFiltered, hardFiltered)
    expect(result?.level).toBe(1)
  })

  it('falls through to level 2 when level 1 has < MIN_COMPS', () => {
    const subject = makeSubject({ year: 2001, body_style: 'Coupe', transmission_variant: 'manual' })
    // Only 2 comps match same-year — not enough for level 1
    // All 5 are within ±2 years — enough for level 2
    const hardFiltered = [
      ...comps(2, { year: 2001, body_style: 'Coupe', transmission_variant: 'manual' }),
      ...comps(3, { year: 2002, body_style: 'Coupe' }),  // year+1, passes level 2
    ]
    const result = selectCascadePool(subject, hardFiltered, hardFiltered)
    expect(result?.level).toBe(2)
    expect(result?.pool.length).toBeGreaterThanOrEqual(CASCADE_MIN_COMPS)
  })

  it('cascades to level 5 for Carrera subject when levels 1-4 are sparse', () => {
    const subject = makeSubject({ trim_category: 'carrera_base' })
    // Only 2 comps in hard-filtered pool — levels 1-4 all fail
    const hardFiltered = comps(2, { trim_category: 'carrera_base' })
    // Full pool includes Carrera family with enough comps
    const fullPool = [
      ...hardFiltered,
      ...comps(CASCADE_MIN_COMPS - 1, { trim_category: 'carrera_4' }),
    ]
    const result = selectCascadePool(subject, hardFiltered, fullPool)
    expect(result?.level).toBe(5)
  })

  it('returns null when no level yields any comps', () => {
    const subject = makeSubject({ trim_category: 'carrera_base' })
    const result = selectCascadePool(subject, [], [])
    expect(result).toBeNull()
  })

  it('Turbo subject does not cascade past level 4', () => {
    const subject = makeSubject({ trim_category: 'turbo_base' })
    const hardFiltered = comps(2, { trim_category: 'turbo_base' })
    // Full pool has Carrera comps that could theoretically fill the pool
    const fullPool = [
      ...hardFiltered,
      ...comps(10, { trim_category: 'carrera_base' }),
    ]
    const result = selectCascadePool(subject, hardFiltered, fullPool)
    // Should use level 4 (max for non-Carrera), NOT expand to Carrera
    if (result) {
      expect(result.level).toBeLessThanOrEqual(4)
      const turboCats = result.pool.map(c => c.trim_category)
      expect(turboCats).not.toContain('carrera_base')
    }
  })

  it('GT2 never comps with Carrera', () => {
    const subject = makeSubject({ trim_category: 'gt2' })
    const hardFiltered = comps(1, { trim_category: 'gt2' })
    const fullPool = [
      ...hardFiltered,
      ...comps(10, { trim_category: 'carrera_base' }),
      ...comps(10, { trim_category: 'turbo_base' }),
    ]
    const result = selectCascadePool(subject, hardFiltered, fullPool)
    if (result) {
      const cats = result.pool.map(c => c.trim_category)
      expect(cats).not.toContain('carrera_base')
      expect(cats).not.toContain('turbo_base')
    }
  })
})

describe('getCascadeCaveat', () => {
  it('returns null for levels 1-2', () => {
    expect(getCascadeCaveat(1, '996')).toBeNull()
    expect(getCascadeCaveat(2, '996')).toBeNull()
  })

  it('returns a string for levels 3-6', () => {
    expect(getCascadeCaveat(3, '996')).toBeTypeOf('string')
    expect(getCascadeCaveat(4, '996')).toBeTypeOf('string')
    expect(getCascadeCaveat(5, '996')).toBeTypeOf('string')
    expect(getCascadeCaveat(6, '996')).toBeTypeOf('string')
  })

  it('returns null for null level', () => {
    expect(getCascadeCaveat(null, '996')).toBeNull()
  })

  it('includes generation id in caveat text', () => {
    const caveat = getCascadeCaveat(5, '991.1')
    expect(caveat).toContain('991.1')
  })
})
