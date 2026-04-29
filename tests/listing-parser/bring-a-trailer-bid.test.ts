import { describe, it, expect } from 'vitest'
import { extractCurrentBid } from '@/lib/listing-parser/bring-a-trailer'

describe('extractCurrentBid', () => {
  it('parses "Current Bid $48,250" → 4825000 cents', () => {
    expect(extractCurrentBid('Current Bid $48,250')).toBe(4825000)
  })

  it('parses "Current Bid: $48,250" (with colon) → 4825000 cents', () => {
    expect(extractCurrentBid('Current Bid: $48,250')).toBe(4825000)
  })

  it('parses "Current Bid: USD 48,250" (USD prefix, no $) → 4825000 cents', () => {
    expect(extractCurrentBid('Current Bid: USD 48,250')).toBe(4825000)
  })

  it('parses "Current Bid: USD $48,250" (USD prefix and $) → 4825000 cents', () => {
    expect(extractCurrentBid('Current Bid: USD $48,250')).toBe(4825000)
  })

  it('parses $1,250,000 (seven-figure with commas) → 125000000 cents', () => {
    expect(extractCurrentBid('Current Bid $1,250,000')).toBe(125000000)
  })

  it('parses "$48,250.00" (with cents suffix) → 4825000 cents', () => {
    expect(extractCurrentBid('Current Bid $48,250.00')).toBe(4825000)
  })

  it('handles surrounding whitespace and newlines', () => {
    expect(extractCurrentBid('\n  Current Bid:\n  $48,250  \n')).toBe(4825000)
  })

  it('"Bid To $48,250" (no-sale pattern) → null', () => {
    expect(extractCurrentBid('Bid To $48,250')).toBeNull()
  })

  it('"Sold for $48,250" → null', () => {
    expect(extractCurrentBid('Sold for $48,250')).toBeNull()
  })

  it('empty string → null', () => {
    expect(extractCurrentBid('')).toBeNull()
  })

  it('no bid text at all → null', () => {
    expect(extractCurrentBid('This 1988 Porsche 930 Turbo has 45,200 miles.')).toBeNull()
  })
})
