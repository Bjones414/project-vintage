import { describe, it, expect } from 'vitest'
import {
  computeFreshness,
  computeVerdictPillState,
  formatUpdatedAt,
} from '@/lib/watchlist/state'

// ── computeFreshness ──────────────────────────────────────────────────────────

describe('computeFreshness', () => {
  const now = new Date('2026-05-15T12:00:00Z').getTime()

  it('returns fresh when updated less than 6h ago', () => {
    const updatedAt = new Date(now - 3 * 60 * 60 * 1000).toISOString()
    expect(computeFreshness(updatedAt, null, now)).toBe('fresh')
  })

  it('returns fresh at exactly 0ms ago', () => {
    const updatedAt = new Date(now).toISOString()
    expect(computeFreshness(updatedAt, null, now)).toBe('fresh')
  })

  it('returns stale when updated 6h+ ago with no auction', () => {
    const updatedAt = new Date(now - 7 * 60 * 60 * 1000).toISOString()
    expect(computeFreshness(updatedAt, null, now)).toBe('stale')
  })

  it('returns stale-urgent when stale AND auction ends within 12h', () => {
    const updatedAt   = new Date(now - 7 * 60 * 60 * 1000).toISOString()
    const auctionEnds = new Date(now + 6 * 60 * 60 * 1000).toISOString()
    expect(computeFreshness(updatedAt, auctionEnds, now)).toBe('stale-urgent')
  })

  it('returns stale (not stale-urgent) when auction already ended', () => {
    const updatedAt   = new Date(now - 7 * 60 * 60 * 1000).toISOString()
    const auctionEnds = new Date(now - 1 * 60 * 60 * 1000).toISOString()
    expect(computeFreshness(updatedAt, auctionEnds, now)).toBe('stale')
  })

  it('returns stale when auction >12h away', () => {
    const updatedAt   = new Date(now - 7 * 60 * 60 * 1000).toISOString()
    const auctionEnds = new Date(now + 24 * 60 * 60 * 1000).toISOString()
    expect(computeFreshness(updatedAt, auctionEnds, now)).toBe('stale')
  })
})

// ── computeVerdictPillState ───────────────────────────────────────────────────

describe('computeVerdictPillState', () => {
  const base = {
    listingStatus:   'live' as string | null,
    currentBidCents: 30_000_00,
    finalPriceCents: null as number | null,
    compP25Cents:    28_000_00,
    compP75Cents:    36_000_00,
    compCount:       10,
    verdict:         'priced_fairly' as string | null,
  }

  it('returns tracking-fair when active bid is within range', () => {
    expect(computeVerdictPillState(base)).toBe('tracking-fair')
  })

  it('returns tracking-fair when active bid is below p25', () => {
    expect(computeVerdictPillState({ ...base, currentBidCents: 20_000_00 })).toBe('tracking-fair')
  })

  it('returns tracking-high when active bid exceeds p75', () => {
    expect(computeVerdictPillState({ ...base, currentBidCents: 40_000_00 })).toBe('tracking-high')
  })

  it('returns too-early when no comps', () => {
    expect(computeVerdictPillState({ ...base, compCount: 0, compP25Cents: null, compP75Cents: null })).toBe('too-early')
  })

  it('returns too-early when comp count below threshold', () => {
    expect(computeVerdictPillState({ ...base, compCount: 2 })).toBe('too-early')
  })

  it('returns too-early when verdict is insufficient_comps', () => {
    expect(computeVerdictPillState({ ...base, verdict: 'insufficient_comps' })).toBe('too-early')
  })

  it('returns too-early when no current bid on active listing', () => {
    expect(computeVerdictPillState({ ...base, currentBidCents: null })).toBe('too-early')
  })

  it('returns no-sale for no-sale listings (explicit status)', () => {
    expect(computeVerdictPillState({ ...base, listingStatus: 'no-sale' })).toBe('no-sale')
  })

  it('returns no-sale via Path B: auction ended + no sold price + status not sold', () => {
    const now = new Date('2026-05-15T12:00:00Z').getTime()
    const pastEnd = new Date(now - 60 * 60 * 1000).toISOString()
    expect(computeVerdictPillState({
      ...base,
      listingStatus: 'live',
      currentBidCents: 25_000_00,
      finalPriceCents: null,
      auctionEndsAt: pastEnd,
      nowMs: now,
    })).toBe('no-sale')
  })

  it('does NOT trigger Path B when auction ended but listing is sold (has final price)', () => {
    const now = new Date('2026-05-15T12:00:00Z').getTime()
    const pastEnd = new Date(now - 60 * 60 * 1000).toISOString()
    expect(computeVerdictPillState({
      ...base,
      listingStatus: 'sold',
      finalPriceCents: 32_000_00,
      auctionEndsAt: pastEnd,
      nowMs: now,
    })).toBe('sold-fair')
  })

  it('does NOT trigger Path B when auction has not ended yet', () => {
    const now = new Date('2026-05-15T12:00:00Z').getTime()
    const futureEnd = new Date(now + 60 * 60 * 1000).toISOString()
    expect(computeVerdictPillState({
      ...base,
      currentBidCents: 25_000_00,
      finalPriceCents: null,
      auctionEndsAt: futureEnd,
      nowMs: now,
    })).toBe('tracking-fair')
  })

  it('does NOT trigger Path B when auctionEndsAt is null', () => {
    const now = new Date('2026-05-15T12:00:00Z').getTime()
    expect(computeVerdictPillState({
      ...base,
      currentBidCents: 25_000_00,
      finalPriceCents: null,
      auctionEndsAt: null,
      nowMs: now,
    })).toBe('tracking-fair')
  })

  it('returns sold-above when final price exceeds p75', () => {
    expect(computeVerdictPillState({
      ...base, listingStatus: 'sold', currentBidCents: null,
      finalPriceCents: 40_000_00,
    })).toBe('sold-above')
  })

  it('returns sold-below when final price is below p25', () => {
    expect(computeVerdictPillState({
      ...base, listingStatus: 'sold', currentBidCents: null,
      finalPriceCents: 20_000_00,
    })).toBe('sold-below')
  })

  it('returns sold-fair when final price is within range', () => {
    expect(computeVerdictPillState({
      ...base, listingStatus: 'sold', currentBidCents: null,
      finalPriceCents: 32_000_00,
    })).toBe('sold-fair')
  })
})

// ── computeVerdictPillState — final-day suppression ───────────────────────────

describe('computeVerdictPillState — final-day suppression', () => {
  const now = new Date('2026-05-15T12:00:00Z').getTime()

  // Base with sparse comps (count 2 < threshold of 3, but p25/p75 present)
  const sparseBase = {
    listingStatus:   'live' as string | null,
    currentBidCents: 30_000_00,
    finalPriceCents: null as number | null,
    compP25Cents:    28_000_00,
    compP75Cents:    36_000_00,
    compCount:       2,
    verdict:         'priced_fairly' as string | null,
  }

  it('returns a real verdict (not too-early) when hoursRemaining = 23 and comps are sparse', () => {
    const auctionEndsAt = new Date(now + 23 * 60 * 60 * 1000).toISOString()
    expect(computeVerdictPillState({ ...sparseBase, auctionEndsAt, nowMs: now })).not.toBe('too-early')
  })

  it('returns tracking-fair when hoursRemaining = 23 and bid is within range (sparse comps)', () => {
    const auctionEndsAt = new Date(now + 23 * 60 * 60 * 1000).toISOString()
    expect(computeVerdictPillState({ ...sparseBase, auctionEndsAt, nowMs: now })).toBe('tracking-fair')
  })

  it('returns tracking-high when hoursRemaining = 23 and bid exceeds p75 (sparse comps)', () => {
    const auctionEndsAt = new Date(now + 23 * 60 * 60 * 1000).toISOString()
    expect(computeVerdictPillState({
      ...sparseBase, currentBidCents: 40_000_00, auctionEndsAt, nowMs: now,
    })).toBe('tracking-high')
  })

  it('returns too-early when hoursRemaining = 25 and comps are sparse', () => {
    const auctionEndsAt = new Date(now + 25 * 60 * 60 * 1000).toISOString()
    expect(computeVerdictPillState({ ...sparseBase, auctionEndsAt, nowMs: now })).toBe('too-early')
  })

  it('returns a real verdict in the final 30 minutes with thin comps', () => {
    const auctionEndsAt = new Date(now + 0.5 * 60 * 60 * 1000).toISOString()
    expect(computeVerdictPillState({ ...sparseBase, auctionEndsAt, nowMs: now })).not.toBe('too-early')
  })

  it('returns tracking-fair when final day + no current bid (not too-early)', () => {
    const auctionEndsAt = new Date(now + 12 * 60 * 60 * 1000).toISOString()
    expect(computeVerdictPillState({
      ...sparseBase, currentBidCents: null, auctionEndsAt, nowMs: now,
    })).toBe('tracking-fair')
  })

  it('always returns too-early when verdict is insufficient_comps, even in final day', () => {
    const auctionEndsAt = new Date(now + 12 * 60 * 60 * 1000).toISOString()
    expect(computeVerdictPillState({
      ...sparseBase,
      compCount: 0, compP25Cents: null, compP75Cents: null,
      verdict: 'insufficient_comps', auctionEndsAt, nowMs: now,
    })).toBe('too-early')
  })
})

// ── formatUpdatedAt ───────────────────────────────────────────────────────────

describe('formatUpdatedAt', () => {
  const now = new Date('2026-05-15T12:00:00Z').getTime()

  it('shows "just now" within 2 minutes', () => {
    const ts = new Date(now - 60 * 1000).toISOString()
    expect(formatUpdatedAt(ts, now)).toBe('Updated just now')
  })

  it('shows minutes ago', () => {
    const ts = new Date(now - 5 * 60 * 1000).toISOString()
    expect(formatUpdatedAt(ts, now)).toBe('Updated 5m ago')
  })

  it('shows hours ago', () => {
    const ts = new Date(now - 3 * 60 * 60 * 1000).toISOString()
    expect(formatUpdatedAt(ts, now)).toBe('Updated 3h ago')
  })

  it('shows days ago', () => {
    const ts = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString()
    expect(formatUpdatedAt(ts, now)).toBe('Updated 2d ago')
  })
})
