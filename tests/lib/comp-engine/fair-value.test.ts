import { describe, it, expect } from 'vitest'
import { computeFairValue } from '@/lib/comp-engine/fair-value'

describe('computeFairValue', () => {
  it('returns null for empty array', () => {
    expect(computeFairValue([])).toBeNull()
  })

  it('returns null when total weight is 0', () => {
    expect(computeFairValue([{ price_cents: 100_000_00, weight: 0 }])).toBeNull()
  })

  it('single comp: median equals the price, std dev 0, low === high === median', () => {
    const result = computeFairValue([{ price_cents: 100_000_00, weight: 1.0 }])
    expect(result).not.toBeNull()
    expect(result!.median_cents).toBe(100_000_00)
    expect(result!.low_cents).toBe(100_000_00)
    expect(result!.high_cents).toBe(100_000_00)
  })

  it('two equal-weight comps: median is average, range is ±std dev', () => {
    // prices: 80k and 120k → mean 100k, variance = 0.5*(400M + 400M) = 400M, std = 20k
    const result = computeFairValue([
      { price_cents: 80_000_00, weight: 1.0 },
      { price_cents: 120_000_00, weight: 1.0 },
    ])
    expect(result).not.toBeNull()
    expect(result!.median_cents).toBe(100_000_00)
    expect(result!.low_cents).toBe(80_000_00)
    expect(result!.high_cents).toBe(120_000_00)
  })

  it('higher weight pulls median toward that price', () => {
    // 100k at weight 3, 200k at weight 1 → mean = (300k+200k)/4 = 125k
    const result = computeFairValue([
      { price_cents: 100_000_00, weight: 3.0 },
      { price_cents: 200_000_00, weight: 1.0 },
    ])
    expect(result).not.toBeNull()
    expect(result!.median_cents).toBe(125_000_00)
  })

  it('low_cents is clamped to 0 (never negative)', () => {
    // two prices with huge spread: 1k and 1M, equal weight
    const result = computeFairValue([
      { price_cents: 1_00, weight: 1.0 },
      { price_cents: 1_000_000_00, weight: 1.0 },
    ])
    expect(result).not.toBeNull()
    expect(result!.low_cents).toBeGreaterThanOrEqual(0)
  })

  it('ten comps spanning 10x range produces a valid range', () => {
    const prices = [50, 60, 70, 80, 90, 100, 200, 300, 400, 500].map(k => ({
      price_cents: k * 1000_00,
      weight: 1.0,
    }))
    const result = computeFairValue(prices)
    expect(result).not.toBeNull()
    expect(result!.low_cents).toBeGreaterThanOrEqual(0)
    expect(result!.high_cents).toBeGreaterThan(result!.median_cents)
    expect(result!.median_cents).toBeGreaterThan(result!.low_cents)
  })

  it('all-old comps at weight 0.4 still produces a result', () => {
    const result = computeFairValue([
      { price_cents: 100_000_00, weight: 0.4 },
      { price_cents: 110_000_00, weight: 0.4 },
      { price_cents: 120_000_00, weight: 0.4 },
    ])
    expect(result).not.toBeNull()
    expect(result!.median_cents).toBeCloseTo(110_000_00, -2)
  })
})
