import { describe, it, expect } from 'vitest'
import { selectComps } from '@/lib/comp-engine/select-comps'
import type { CompCandidate, SubjectListing } from '@/lib/comp-engine/types'

// Reference date: 2026-01-01
const NOW = new Date('2026-01-01T00:00:00Z')

function daysAgoISO(days: number): string {
  return new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000).toISOString()
}

function makeCandidate(overrides: Partial<CompCandidate> & { listing_id: string }): CompCandidate {
  return {
    year: 1997,
    make: 'Porsche',
    model: '911',
    trim: 'Turbo',
    mileage: 50000,
    sold_price_cents: 100_000_00,
    sold_at: daysAgoISO(90),
    source_url: null,
    source_platform: 'bring-a-trailer',
    body_class: 'Coupe',
    generation_id: '993',
    ...overrides,
  }
}

function makeSubject(overrides?: Partial<SubjectListing>): SubjectListing {
  return {
    id: 'subject-1',
    generation_id: '993',
    mileage: 50000,
    body_class: 'Coupe',
    sold_at: null,
    ...overrides,
  }
}

// Build a pool of N comps with given overrides
function pool(n: number, overrides?: Partial<CompCandidate>): CompCandidate[] {
  return Array.from({ length: n }, (_, i) =>
    makeCandidate({ listing_id: `comp-${i}`, ...overrides }),
  )
}

describe('selectComps — strict tier', () => {
  it('returns strict when ≥5 comps match within strict criteria', () => {
    const subject = makeSubject()
    const candidates = pool(6)
    const result = selectComps(subject, candidates, NOW)
    expect(result.tier).toBe('strict')
    expect(result.comps.length).toBe(6)
  })

  it('strict requires same body class when both subject and comp have it', () => {
    const subject = makeSubject({ body_class: 'Coupe' })
    const cabCandidates = pool(6, { body_class: 'Cabriolet' })
    // Cabriolets normalize to 'cabriolet', subject normalizes to 'coupe' — no strict match
    const result = selectComps(subject, cabCandidates, NOW)
    expect(result.tier).not.toBe('strict')
  })

  it('strict filters comps outside ±30% mileage band', () => {
    const subject = makeSubject({ mileage: 50000 })
    // mileage at 150% of subject (100k) — outside band
    const highMile = pool(6, { mileage: 100000 })
    const result = selectComps(subject, highMile, NOW)
    expect(result.tier).not.toBe('strict')
  })

  it('strict filters comps older than 24 months', () => {
    const subject = makeSubject()
    // sold 25 months ago
    const old = pool(6, { sold_at: daysAgoISO(25 * 30.4375) })
    const result = selectComps(subject, old, NOW)
    expect(result.tier).not.toBe('strict')
  })

  it('does not enforce body_class when subject body_class is null', () => {
    const subject = makeSubject({ body_class: null })
    const mixedBody = [
      makeCandidate({ listing_id: 'c1', body_class: 'Coupe' }),
      makeCandidate({ listing_id: 'c2', body_class: 'Cabriolet' }),
      makeCandidate({ listing_id: 'c3', body_class: 'Targa' }),
      makeCandidate({ listing_id: 'c4', body_class: null }),
      makeCandidate({ listing_id: 'c5', body_class: 'Coupe' }),
      makeCandidate({ listing_id: 'c6', body_class: 'Coupe' }),
    ]
    const result = selectComps(subject, mixedBody, NOW)
    expect(result.tier).toBe('strict')
    expect(result.comps.length).toBe(6)
  })
})

describe('selectComps — wide tier fallback', () => {
  it('falls back to wide when strict has <5 comps but ≥3 comps exist overall', () => {
    const subject = makeSubject({ mileage: 50000 })
    // 4 comps with matching mileage (strict ≥ 5? no, only 4)
    // but all are within 36 months → wide has 4
    const candidates = pool(4, { sold_at: daysAgoISO(90) })
    const result = selectComps(subject, candidates, NOW)
    expect(result.tier).toBe('wide')
    expect(result.comps.length).toBe(4)
  })

  it('wide tier includes comps up to 36 months (pool pre-filtered)', () => {
    const subject = makeSubject()
    // 3 comps at 30mo (within wide), different mileage / body class
    const wideComps = [
      makeCandidate({ listing_id: 'w1', sold_at: daysAgoISO(30 * 30.4375), mileage: 5000 }),
      makeCandidate({ listing_id: 'w2', sold_at: daysAgoISO(30 * 30.4375), mileage: 200000 }),
      makeCandidate({ listing_id: 'w3', sold_at: daysAgoISO(30 * 30.4375), body_class: 'Cabriolet' }),
    ]
    const result = selectComps(subject, wideComps, NOW)
    expect(result.tier).toBe('wide')
    expect(result.comps.length).toBe(3)
  })
})

describe('selectComps — insufficient', () => {
  it('returns insufficient when pool has <3 comps', () => {
    const subject = makeSubject()
    const result = selectComps(subject, pool(2), NOW)
    expect(result.tier).toBe('insufficient')
  })

  it('returns insufficient for empty pool', () => {
    const result = selectComps(makeSubject(), [], NOW)
    expect(result.tier).toBe('insufficient')
    expect(result.comps.length).toBe(0)
  })

  it('insufficient when subject has no generation_id equivalent scenario: pool is too small', () => {
    const result = selectComps(makeSubject(), pool(1), NOW)
    expect(result.tier).toBe('insufficient')
  })
})

describe('selectComps — edge cases', () => {
  it('single comp: insufficient', () => {
    const result = selectComps(makeSubject(), pool(1), NOW)
    expect(result.tier).toBe('insufficient')
  })

  it('exactly 5 comps for strict: returns strict', () => {
    const result = selectComps(makeSubject(), pool(5), NOW)
    expect(result.tier).toBe('strict')
    expect(result.comps.length).toBe(5)
  })

  it('exactly 3 comps for wide: returns wide', () => {
    const subject = makeSubject({ mileage: 200000 }) // high mileage → strict filters them out
    const comps = pool(3, { mileage: 10000 }) // mileage mismatch → not strict
    const result = selectComps(subject, comps, NOW)
    expect(result.tier).toBe('wide')
  })
})
