import { describe, it, expect } from 'vitest'
import { buildReasoning } from '@/lib/watchlist/reasoning'

const baseListing = {
  year: 1995,
  make: 'Porsche',
  model: '911',
  trim: 'Carrera',
  listing_status: 'live' as string | null,
  high_bid: 32_000_00,
  final_price: null as number | null,
}

const baseComps = {
  predicted_median: 32_400_00,
  predicted_p25:    28_000_00,
  predicted_p75:    36_000_00,
  comp_count:       12,
  oldest_comp_date: '2025-11-15T12:00:00Z',
  verdict:          'priced_fairly' as string | null,
}

describe('buildReasoning', () => {
  it('returns insufficient-comps message when comp_count is zero', () => {
    const result = buildReasoning({
      listing: baseListing,
      comps: { ...baseComps, comp_count: 0 },
    })
    expect(result).toContain("enough comparable sales")
    expect(result).toContain("1995 Porsche 911 Carrera")
  })

  it('returns insufficient-comps message when verdict is insufficient_comps', () => {
    const result = buildReasoning({
      listing: baseListing,
      comps: { ...baseComps, verdict: 'insufficient_comps' },
    })
    expect(result).toContain("enough comparable sales")
  })

  it('builds active reasoning when bid is within range', () => {
    const result = buildReasoning({ listing: baseListing, comps: baseComps })
    expect(result).toContain('$32,000')   // current bid
    expect(result).toContain('within')
    expect(result).toContain('12 comparable sales')
    expect(result).toContain('November 2025')
  })

  it('flags bid above p75', () => {
    const result = buildReasoning({
      listing: { ...baseListing, high_bid: 40_000_00 },
      comps: baseComps,
    })
    expect(result).toContain('above')
    expect(result).toContain('running above the median')
  })

  it('flags bid below p25 but above the significantly-below threshold', () => {
    // p25 = $28,000; 80% threshold = $22,400; use $25,000 — below floor but not significantly
    const result = buildReasoning({
      listing: { ...baseListing, high_bid: 25_000_00 },
      comps: baseComps,
    })
    expect(result).toContain('below')
    expect(result).toContain('below the expected floor')
  })

  it('appends watch-item sentence for active listing', () => {
    const result = buildReasoning({
      listing: baseListing,
      comps: baseComps,
      topWatchItem: { title: 'IMS bearing' },
    })
    expect(result).toContain('ims bearing')
    expect(result).toContain('auction closes')
  })

  it('does not append watch-item sentence for ended listing', () => {
    const result = buildReasoning({
      listing: { ...baseListing, listing_status: 'sold', high_bid: null, final_price: 32_000_00 },
      comps: baseComps,
      topWatchItem: { title: 'IMS bearing' },
    })
    expect(result).not.toContain('auction closes')
  })

  it('builds ended listing reasoning with final price above range', () => {
    const result = buildReasoning({
      listing: {
        ...baseListing,
        listing_status: 'sold',
        high_bid: null,
        final_price: 40_000_00,
      },
      comps: baseComps,
    })
    expect(result).toContain('sold for')
    expect(result).toContain('above')
    expect(result).toContain('$40,000')
  })

  it('produces a non-empty string for any input', () => {
    const result = buildReasoning({
      listing: { year: null, make: null, model: null, trim: null, listing_status: null, high_bid: null, final_price: null },
      comps: { predicted_median: null, predicted_p25: null, predicted_p75: null, comp_count: 0, oldest_comp_date: null, verdict: null },
    })
    expect(result.length).toBeGreaterThan(0)
  })

  describe('below floor branch (not significantly-below) — time-aware framing', () => {
    // bid $25,000 is below p25 ($28,000) but above 80% threshold ($22,400)
    const fixedNow       = new Date('2026-05-15T12:00:00Z').getTime()
    const sixDaysOut     = '2026-05-21T12:00:00Z'
    const oneDayOut      = '2026-05-16T12:00:00Z' // exactly 24 h → still hedged (> 24h boundary)
    const eighteenHoursOut = '2026-05-16T06:00:00Z'
    const thirtyMinOut   = '2026-05-15T12:30:00Z'
    const pastDate       = '2026-05-10T12:00:00Z'
    const belowBid       = 25_000_00

    it('>24h: produces hedged copy mentioning days remaining', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: belowBid, auction_ends_at: sixDaysOut },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('6 days remaining')
      expect(result).toContain('could still move higher before close')
      expect(result).not.toContain('below the expected floor')
    })

    it('>24h: singular "1 day remaining" form', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: belowBid, auction_ends_at: oneDayOut },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('With 1 day remaining')
      expect(result).not.toContain('1 days')
      expect(result).not.toContain('below the expected floor')
    })

    it('<24h: produces sharp "below the expected floor" copy', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: belowBid, auction_ends_at: eighteenHoursOut },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('below the expected floor')
      expect(result).toContain('may represent value')
      expect(result).not.toContain('days remaining')
    })

    it('< 1h remaining: still uses sharp copy', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: belowBid, auction_ends_at: thirtyMinOut },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('below the expected floor')
      expect(result).not.toContain('days remaining')
    })

    it('null auction_ends_at: falls back to sharp copy', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: belowBid, auction_ends_at: null },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('below the expected floor')
      expect(result).not.toContain('days remaining')
    })

    it('past auction_ends_at: falls back to sharp copy', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: belowBid, auction_ends_at: pastDate },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('below the expected floor')
      expect(result).not.toContain('days remaining')
    })

    it('first sentence still names the car and position regardless of time', () => {
      // sentence 1 is always "This … is tracking at $X — below the expected …"
      for (const endsAt of [sixDaysOut, eighteenHoursOut, null]) {
        const result = buildReasoning({
          listing: { ...baseListing, high_bid: belowBid, auction_ends_at: endsAt },
          comps: baseComps,
        }, fixedNow)
        expect(result).toContain('$25,000')
        expect(result).toContain('below')
      }
    })
  })

  describe('significantly below branch', () => {
    // Fixed reference point for deterministic time-remaining tests
    const fixedNow  = new Date('2026-05-15T12:00:00Z').getTime()
    const sixDaysOut     = '2026-05-21T12:00:00Z'
    const oneDayOut      = '2026-05-16T12:00:00Z' // exactly 24 h → "1 day"
    const eighteenHoursOut = '2026-05-16T06:00:00Z'
    const oneHourOut     = '2026-05-15T13:00:00Z'
    const thirtyMinOut   = '2026-05-15T12:30:00Z'
    const pastDate       = '2026-05-10T12:00:00Z'

    it('triggers when bid is below 80% of p25', () => {
      // p25 = $28,000 → 80% = $22,400 → bid of $16,000 should trigger
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 16_000_00, auction_ends_at: sixDaysOut },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('Current bid is')
      expect(result).toContain('days remaining')
    })

    it('does not trigger when bid is at 80% of p25 (boundary)', () => {
      // p25 = $28,000 → 80% = $22,400 exactly → should NOT trigger significantly-below
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 22_400_00, auction_ends_at: sixDaysOut },
        comps: baseComps,
      }, fixedNow)
      // significantly-below branch must not fire (no ramp copy or "sell around" phrase)
      expect(result).not.toContain('Bidding typically ramps')
      expect(result).not.toContain('sell around')
      // falls into below-floor branch: 6 days out → hedged copy
      expect(result).toContain('6 days remaining')
    })

    it('does not trigger when bid is between p25*0.8 and p25', () => {
      // bid $25,000 is below p25 ($28,000) but above 80% ($22,400) — use below-floor branch
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 25_000_00, auction_ends_at: sixDaysOut },
        comps: baseComps,
      }, fixedNow)
      // significantly-below branch must not fire
      expect(result).not.toContain('Bidding typically ramps')
      expect(result).not.toContain('sell around')
      // below-floor branch: 6 days out → hedged copy
      expect(result).toContain('below')
      expect(result).toContain('6 days remaining')
    })

    it('includes the current bid amount in significantly-below output', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 7_500_00, auction_ends_at: sixDaysOut },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('$7,500')
    })

    it('includes comp count and month/year in significantly-below output', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 10_000_00, auction_ends_at: sixDaysOut },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('12 comparable sale')
      expect(result).toContain('November 2025')
    })

    it('includes the comp median as the sell-around forecast', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 10_000_00, auction_ends_at: sixDaysOut },
        comps: baseComps,
      }, fixedNow)
      // median is $32,400
      expect(result).toContain('$32,400')
      expect(result).toContain('sell around')
    })

    it('works without oldest_comp_date', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 10_000_00, auction_ends_at: null },
        comps: { ...baseComps, oldest_comp_date: null },
      }, fixedNow)
      expect(result).toContain('Current bid is')
      expect(result).not.toContain('since')
    })

    it('does not append watch-item sentence (template is self-contained)', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 10_000_00, auction_ends_at: sixDaysOut },
        comps: baseComps,
        topWatchItem: { title: 'IMS bearing' },
      }, fixedNow)
      expect(result).not.toContain('auction closes')
    })

    // Sub-branch 1: days remaining >= 1
    it('sub-branch 1: produces correct copy with 6 days remaining', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 7_500_00, auction_ends_at: sixDaysOut },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('with 6 days remaining')
      expect(result).toContain('Bidding typically ramps in the final day of auction')
      expect(result).toContain('sell around')
    })

    it('sub-branch 1: "1 day remaining" singular form', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 7_500_00, auction_ends_at: oneDayOut },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('with 1 day remaining')
      expect(result).not.toContain('1 days')
    })

    // Sub-branch 2: hours remaining (< 24 h)
    it('sub-branch 2: produces correct copy with 18 hours remaining', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 7_500_00, auction_ends_at: eighteenHoursOut },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('with 18 hours remaining')
      expect(result).not.toContain('Bidding typically ramps')
      expect(result).toContain('sell around')
    })

    it('sub-branch 2: "1 hour remaining" singular form', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 7_500_00, auction_ends_at: oneHourOut },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('with 1 hour remaining')
      expect(result).not.toContain('1 hours')
    })

    it('sub-branch 2: "less than 1 hour remaining" when under 1 hour left', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 7_500_00, auction_ends_at: thirtyMinOut },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('less than 1 hour remaining')
    })

    // Edge cases
    it('null auction_ends_at: falls back to old "well below" framing', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 7_500_00, auction_ends_at: null },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('well below the expected')
      expect(result).toContain("we'd expect this car to land closer to")
    })

    it('past auction_ends_at: falls back to old "well below" framing', () => {
      const result = buildReasoning({
        listing: { ...baseListing, high_bid: 7_500_00, auction_ends_at: pastDate },
        comps: baseComps,
      }, fixedNow)
      expect(result).toContain('well below the expected')
      expect(result).toContain("we'd expect this car to land closer to")
    })
  })
})
