import { describe, it, expect } from 'vitest'
import { detectReserveStatus } from '@/lib/listing-parser/bring-a-trailer'

describe('detectReserveStatus', () => {
  it('detects "reserve met" (lowercase)', () => {
    const result = detectReserveStatus('Bid to $48,250 reserve met')
    expect(result.reserve_met).toBe(true)
    expect(result.has_no_reserve).toBe(false)
  })

  it('detects "Reserve Met" (title case)', () => {
    const result = detectReserveStatus('Sold for $102,000 Reserve Met')
    expect(result.reserve_met).toBe(true)
    expect(result.has_no_reserve).toBe(false)
  })

  it('detects "RESERVE MET" (uppercase)', () => {
    const result = detectReserveStatus('RESERVE MET $48,250')
    expect(result.reserve_met).toBe(true)
    expect(result.has_no_reserve).toBe(false)
  })

  it('detects "Reserve Not Met" (title case)', () => {
    const result = detectReserveStatus('Bid to $48,250 Reserve Not Met')
    expect(result.reserve_met).toBe(false)
    expect(result.has_no_reserve).toBe(false)
  })

  it('detects "reserve not met" (lowercase)', () => {
    const result = detectReserveStatus('bid to $48,250 reserve not met')
    expect(result.reserve_met).toBe(false)
    expect(result.has_no_reserve).toBe(false)
  })

  it('"reserve not met" does NOT match as "reserve met"', () => {
    // Ensures "reserve not met" substring check precedes "reserve met"
    const result = detectReserveStatus('reserve not met')
    expect(result.reserve_met).toBe(false)
    expect(result.has_no_reserve).toBe(false)
  })

  it('detects "No Reserve" (title case)', () => {
    const result = detectReserveStatus('Current Bid $48,250 No Reserve')
    expect(result.reserve_met).toBeNull()
    expect(result.has_no_reserve).toBe(true)
  })

  it('detects "no reserve" (lowercase)', () => {
    const result = detectReserveStatus('current bid $48,250 no reserve')
    expect(result.reserve_met).toBeNull()
    expect(result.has_no_reserve).toBe(true)
  })

  it('"Bid To $X" with no reserve language → reserve_met=null, has_no_reserve=false', () => {
    const result = detectReserveStatus('Bid To $48,250')
    expect(result.reserve_met).toBeNull()
    expect(result.has_no_reserve).toBe(false)
  })

  it('empty string → reserve_met=null, has_no_reserve=false', () => {
    const result = detectReserveStatus('')
    expect(result.reserve_met).toBeNull()
    expect(result.has_no_reserve).toBe(false)
  })

  it('unrelated text → reserve_met=null, has_no_reserve=false', () => {
    const result = detectReserveStatus('This 1988 Porsche 930 Turbo has 45,200 miles.')
    expect(result.reserve_met).toBeNull()
    expect(result.has_no_reserve).toBe(false)
  })
})
