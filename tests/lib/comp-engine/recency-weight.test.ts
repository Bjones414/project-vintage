import { describe, it, expect } from 'vitest'
import { recencyWeight, monthsAgo } from '@/lib/comp-engine/recency-weight'

// Pin a reference date for deterministic tests
const NOW = new Date('2026-01-01T00:00:00Z')

function daysAgo(days: number): string {
  return new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000).toISOString()
}

function monthsAgoDate(months: number): string {
  return new Date(NOW.getTime() - months * 30.4375 * 24 * 60 * 60 * 1000).toISOString()
}

describe('recencyWeight', () => {
  it('returns 1.0 at 0 months (current)', () => {
    expect(recencyWeight(NOW.toISOString(), NOW)).toBeCloseTo(1.0, 5)
  })

  it('returns 1.0 at 3 months (within 0–6 band)', () => {
    expect(recencyWeight(monthsAgoDate(3), NOW)).toBeCloseTo(1.0, 5)
  })

  it('returns 1.0 at exactly 6 months', () => {
    expect(recencyWeight(monthsAgoDate(6), NOW)).toBeCloseTo(1.0, 5)
  })

  it('returns 0.9 at 9 months (midpoint 6–12 band)', () => {
    // 9mo is halfway between 6 and 12; weight = 1.0 + 0.5*(0.8-1.0) = 0.9
    const w = recencyWeight(monthsAgoDate(9), NOW)
    expect(w).toBeCloseTo(0.9, 4)
  })

  it('returns 0.8 at exactly 12 months', () => {
    expect(recencyWeight(monthsAgoDate(12), NOW)).toBeCloseTo(0.8, 4)
  })

  it('returns 0.7 at 18 months (midpoint 12–24 band)', () => {
    // 18mo is halfway between 12 and 24; weight = 0.8 + 0.5*(0.6-0.8) = 0.7
    const w = recencyWeight(monthsAgoDate(18), NOW)
    expect(w).toBeCloseTo(0.7, 4)
  })

  it('returns 0.6 at exactly 24 months', () => {
    expect(recencyWeight(monthsAgoDate(24), NOW)).toBeCloseTo(0.6, 4)
  })

  it('returns 0.5 at 30 months (midpoint 24–36 band)', () => {
    // 30mo: halfway between 24 and 36; weight = 0.6 + 0.5*(0.4-0.6) = 0.5
    const w = recencyWeight(monthsAgoDate(30), NOW)
    expect(w).toBeCloseTo(0.5, 4)
  })

  it('returns 0.4 at exactly 36 months', () => {
    expect(recencyWeight(monthsAgoDate(36), NOW)).toBeCloseTo(0.4, 4)
  })

  it('returns 0 at 37 months (beyond cutoff)', () => {
    expect(recencyWeight(monthsAgoDate(37), NOW)).toBe(0)
  })

  it('returns 1.0 for a future date (sold_at in future)', () => {
    const future = new Date(NOW.getTime() + 1000).toISOString()
    expect(recencyWeight(future, NOW)).toBe(1.0)
  })
})

describe('monthsAgo', () => {
  it('returns ~0 for a date just now', () => {
    expect(monthsAgo(NOW.toISOString(), NOW)).toBeCloseTo(0, 2)
  })

  it('returns ~12 for a date 1 year ago', () => {
    const oneYearAgo = new Date(NOW.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString()
    expect(monthsAgo(oneYearAgo, NOW)).toBeCloseTo(11.98, 0)
  })
})
