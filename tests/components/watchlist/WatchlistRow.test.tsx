import { describe, it, expect, vi } from 'vitest'
import { renderToString } from 'react-dom/server'
import { WatchlistRow } from '@/components/watchlist/WatchlistRow'
import type { WatchlistRowProps } from '@/components/watchlist/WatchlistRow'

// WatchlistRow is a 'use client' component with useState. renderToString renders the
// initial static state (collapsed). Interactive tests (click → fetch → expand) require
// a full DOM environment and are handled by E2E tests.

const LISTING: WatchlistRowProps['listing'] = {
  year: 1995,
  make: 'Porsche',
  model: '911',
  trim: 'Carrera',
  exterior_color: 'Riviera Blue',
  interior_color: 'Black',
  mileage: 62_000,
  high_bid: 28_000_00,
  final_price: null,
  listing_status: 'live',
  auction_ends_at: null,
  source_url: 'https://bringatrailer.com/listing/test',
  source_platform: 'bring-a-trailer',
  generation_id: null,
}

const BASE_PROPS: WatchlistRowProps = {
  watchlistId: 'wl-1',
  listingId:   'lst-1',
  listing:     LISTING,
  watchedAt:   '2026-05-10T10:00:00Z',
  updatedAt:   '2026-05-10T10:00:00Z',
  initialComp: {
    comp_count:             12,
    fair_value_low_cents:   28_000_00,
    fair_value_median_cents: 32_400_00,
    fair_value_high_cents:  36_000_00,
    verdict:                'priced_fairly',
  },
  generationWatchForItems: [],
}

describe('WatchlistRow — collapsed static render', () => {
  it('renders the listing title', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    expect(html).toContain('1995 Porsche 911 Carrera')
  })

  it('renders exterior/interior color subhead', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    expect(html).toContain('Riviera Blue over Black')
  })

  it('renders mileage in the subhead', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    expect(html).toContain('62,000 mi')
  })

  it('renders "Added" date in meta line', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    expect(html).toContain('Added')
  })

  it('renders "Read the take →" invitation link', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    expect(html).toContain('Read the take →')
  })

  it('renders "Closing soon" invitation for stale-urgent rows', () => {
    const soonEndsAt = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
    const staleUpdatedAt = new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    const html = renderToString(
      <WatchlistRow
        {...BASE_PROPS}
        listing={{ ...LISTING, auction_ends_at: soonEndsAt }}
        updatedAt={staleUpdatedAt}
      />,
    )
    expect(html).toContain('Closing soon')
  })

  it('renders verdict pill inside the row', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    // VerdictPill renders one of the 7 state texts (sold-above now renders "Sold strong")
    expect(html).toMatch(/Tracking fair|Tracking high|Too early to call|Sold strong|Sold below|Sold fair|No sale|Bid to/)
  })

  it('renders countdown for auction with end date', () => {
    const futureDate = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    const html = renderToString(
      <WatchlistRow {...BASE_PROPS} listing={{ ...LISTING, auction_ends_at: futureDate }} />,
    )
    expect(html).toContain('Closes in')
  })

  it('renders "Auction ended" for sold listings', () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const html = renderToString(
      <WatchlistRow
        {...BASE_PROPS}
        listing={{ ...LISTING, listing_status: 'sold', final_price: 32_000_00, auction_ends_at: pastDate }}
      />,
    )
    expect(html).toContain('Auction ended')
  })

  it('renders null for removed items (initial state is not removed)', () => {
    // Cannot test removal interaction without jsdom — just verify it renders
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    expect(html).not.toBe('')
  })

  it('renders a "View on {Source}" link pointing to source_url', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    expect(html).toContain('View on Bring a Trailer →')
    expect(html).toContain('href="https://bringatrailer.com/listing/test"')
  })

  it('"View on {Source}" link opens in a new tab', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    expect(html).toContain('target="_blank"')
  })

  it('"View on {Source}" link has rel="noopener noreferrer"', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('price column shows "Current bid" label for active listing with a bid', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    expect(html).toContain('Current bid')
  })

  it('price column shows "vs expected" sub-line when comp median is available', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    expect(html).toContain('vs expected')
  })

  it('price column shows "Sold for" label for sold listings', () => {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const html = renderToString(
      <WatchlistRow
        {...BASE_PROPS}
        listing={{ ...LISTING, listing_status: 'sold', final_price: 32_000_00, auction_ends_at: pastDate }}
      />,
    )
    expect(html).toContain('Sold for')
  })

  it('no-sale listing shows "High bid" label when a bid is known', () => {
    const html = renderToString(
      <WatchlistRow
        {...BASE_PROPS}
        listing={{ ...LISTING, listing_status: 'no-sale', high_bid: 25_000_00, final_price: null }}
      />,
    )
    expect(html).toContain('High bid')
  })

  it('"Read the take" does not navigate — no href to /analyze/ in collapsed row', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    // "Read the take" is now a button, not a Link. The /analyze/ href only lives inside
    // the expanded panel (which requires user interaction to render).
    expect(html).not.toMatch(/href="\/analyze\/lst-1"/)
  })

  it('renders boxed "+" expand indicator on the row', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    expect(html).toContain('+')
  })

  it('"+" box starts un-rotated on a collapsed row', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    expect(html).toContain('rotate(0deg)')
    expect(html).not.toContain('rotate(45deg)')
  })

  it('"+" box has gold accent border color', () => {
    const html = renderToString(<WatchlistRow {...BASE_PROPS} />)
    expect(html).toContain('var(--accent-primary)')
    expect(html).toContain('border:')
  })

  it('renders without crashing when initialComp is null', () => {
    expect(() =>
      renderToString(<WatchlistRow {...BASE_PROPS} initialComp={null} />),
    ).not.toThrow()
  })
})
