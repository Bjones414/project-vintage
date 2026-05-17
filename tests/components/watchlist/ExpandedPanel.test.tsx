import { describe, it, expect, vi } from 'vitest'
import { renderToString } from 'react-dom/server'
import { ExpandedPanel } from '@/components/watchlist/ExpandedPanel'
import type { WatchlistRefreshResult } from '@/lib/watchlist/state'

const REFRESH_DATA: WatchlistRefreshResult = {
  current_bid: 30_000_00,
  comp_median: 32_400_00,
  comp_p25: 28_000_00,
  comp_p75: 36_000_00,
  comp_count: 10,
  oldest_comp_date: '2025-01-01T00:00:00Z',
  verdict: 'priced_fairly',
  watch_for_items: [],
  reasoning: 'This 911 Carrera is tracking at $30,000, within the 10 comparable sales range.',
  updated_at: '2026-05-15T10:00:00Z',
}

const LISTING = {
  year: 1995,
  make: 'Porsche',
  model: '911',
  trim: 'Carrera',
  listing_status: 'live',
  high_bid: 30_000_00,
  final_price: null,
  generation_id: null,
}

describe('ExpandedPanel', () => {
  it('"View full analysis →" link points to /analyze/[listingId]', () => {
    const html = renderToString(
      <ExpandedPanel
        listingId="lst-abc"
        listing={LISTING}
        refreshData={REFRESH_DATA}
        generationWatchForItems={[]}
        onCollapse={vi.fn()}
        onRemove={vi.fn()}
      />,
    )
    expect(html).toContain('/analyze/lst-abc')
    expect(html).toContain('View full analysis')
  })

  it('"View full analysis →" is a link (href), not a button', () => {
    const html = renderToString(
      <ExpandedPanel
        listingId="lst-abc"
        listing={LISTING}
        refreshData={REFRESH_DATA}
        generationWatchForItems={[]}
        onCollapse={vi.fn()}
        onRemove={vi.fn()}
      />,
    )
    expect(html).toMatch(/href="\/analyze\/lst-abc"/)
  })

  it('renders reasoning text', () => {
    const html = renderToString(
      <ExpandedPanel
        listingId="lst-abc"
        listing={LISTING}
        refreshData={REFRESH_DATA}
        generationWatchForItems={[]}
        onCollapse={vi.fn()}
        onRemove={vi.fn()}
      />,
    )
    expect(html).toContain('tracking at')
  })

  it('renders "Collapse ↑" button', () => {
    const html = renderToString(
      <ExpandedPanel
        listingId="lst-abc"
        listing={LISTING}
        refreshData={REFRESH_DATA}
        generationWatchForItems={[]}
        onCollapse={vi.fn()}
        onRemove={vi.fn()}
      />,
    )
    expect(html).toContain('Collapse')
  })

  it('renders without crashing for a sold listing', () => {
    expect(() =>
      renderToString(
        <ExpandedPanel
          listingId="lst-abc"
          listing={{ ...LISTING, listing_status: 'sold', final_price: 34_000_00 }}
          refreshData={REFRESH_DATA}
          generationWatchForItems={[]}
          onCollapse={vi.fn()}
          onRemove={vi.fn()}
        />,
      ),
    ).not.toThrow()
  })

  describe('Fix B — Collapse toggle below comp eyebrow, no overlap', () => {
    it('Collapse button is not absolutely positioned', () => {
      const html = renderToString(
        <ExpandedPanel
          listingId="lst-abc"
          listing={LISTING}
          refreshData={REFRESH_DATA}
          generationWatchForItems={[]}
          onCollapse={vi.fn()}
          onRemove={vi.fn()}
        />,
      )
      const collapseButtonMatch = html.match(/<button[^>]*>[\s\S]*?Collapse[\s\S]*?<\/button>/)
      expect(collapseButtonMatch).not.toBeNull()
      expect(collapseButtonMatch![0]).not.toContain('absolute')
    })

    it('Collapse link appears after the comp eyebrow text in DOM order', () => {
      const html = renderToString(
        <ExpandedPanel
          listingId="lst-abc"
          listing={LISTING}
          refreshData={REFRESH_DATA}
          generationWatchForItems={[]}
          onCollapse={vi.fn()}
          onRemove={vi.fn()}
        />,
      )
      const eyebrowIdx = html.indexOf('Comparable sales')
      const collapseIdx = html.indexOf('Collapse')
      expect(eyebrowIdx).toBeGreaterThanOrEqual(0)
      expect(collapseIdx).toBeGreaterThanOrEqual(0)
      expect(collapseIdx).toBeGreaterThan(eyebrowIdx)
    })

    it('renders both comp eyebrow and Collapse button when trim name is long', () => {
      const longTrim = 'Carrera 2 Coupe 5-Speed Matching Numbers Fully Documented'
      const html = renderToString(
        <ExpandedPanel
          listingId="lst-abc"
          listing={{ ...LISTING, trim: longTrim }}
          refreshData={REFRESH_DATA}
          generationWatchForItems={[]}
          onCollapse={vi.fn()}
          onRemove={vi.fn()}
        />,
      )
      expect(html).toContain('Comparable sales')
      expect(html).toContain(longTrim)
      expect(html).toContain('Collapse')
    })
  })

  describe('Fix C — action row anchored to bottom of left column', () => {
    it('left column element has flex flex-col layout class', () => {
      const html = renderToString(
        <ExpandedPanel
          listingId="lst-abc"
          listing={LISTING}
          refreshData={REFRESH_DATA}
          generationWatchForItems={[]}
          onCollapse={vi.fn()}
          onRemove={vi.fn()}
        />,
      )
      expect(html).toContain('flex flex-col')
    })

    it('action row has mt-auto class to anchor to bottom of left column', () => {
      const html = renderToString(
        <ExpandedPanel
          listingId="lst-abc"
          listing={LISTING}
          refreshData={REFRESH_DATA}
          generationWatchForItems={[]}
          onCollapse={vi.fn()}
          onRemove={vi.fn()}
        />,
      )
      expect(html).toContain('mt-auto')
    })

    it('"View full analysis →" and "Remove from watchlist" are both present', () => {
      const html = renderToString(
        <ExpandedPanel
          listingId="lst-abc"
          listing={LISTING}
          refreshData={REFRESH_DATA}
          generationWatchForItems={[]}
          onCollapse={vi.fn()}
          onRemove={vi.fn()}
        />,
      )
      expect(html).toContain('View full analysis')
      expect(html).toContain('Remove from watchlist')
    })
  })

  describe('Fix C — generation-level watch-for fallback', () => {
    const GEN_ITEMS = [
      { title: 'IMS bearing', severity: 'high' as const, description: 'Intermediate shaft bearing failure risk.' },
      { title: 'RMS leak', severity: 'moderate' as const, description: 'Rear main seal oil leak.' },
      { title: 'Coolant pipes', severity: 'moderate' as const, description: 'Plastic coolant pipe degradation.' },
    ]

    it('renders per-listing flags when present, ignoring generation fallback', () => {
      const withFlags = {
        ...REFRESH_DATA,
        watch_for_items: [{ title: 'Listing-specific flag', severity: 'high' as const, description: 'desc' }],
      }
      const html = renderToString(
        <ExpandedPanel
          listingId="lst-abc"
          listing={{ ...LISTING, generation_id: '996.1' }}
          refreshData={withFlags}
          generationWatchForItems={GEN_ITEMS}
          onCollapse={vi.fn()}
          onRemove={vi.fn()}
        />,
      )
      expect(html).toContain('Listing-specific flag')
      expect(html).not.toContain('IMS bearing')
      expect(html).not.toContain('What to watch for')
    })

    it('renders generation-level fallback when no per-listing flags and generation_id is set', () => {
      const html = renderToString(
        <ExpandedPanel
          listingId="lst-abc"
          listing={{ ...LISTING, generation_id: '996.1' }}
          refreshData={{ ...REFRESH_DATA, watch_for_items: [] }}
          generationWatchForItems={GEN_ITEMS}
          onCollapse={vi.fn()}
          onRemove={vi.fn()}
        />,
      )
      expect(html).toContain('IMS bearing')
      expect(html).toContain('What to watch for')
    })

    it('generation fallback header uses the formatted generation display name', () => {
      const html = renderToString(
        <ExpandedPanel
          listingId="lst-abc"
          listing={{ ...LISTING, generation_id: '996.1' }}
          refreshData={{ ...REFRESH_DATA, watch_for_items: [] }}
          generationWatchForItems={GEN_ITEMS}
          onCollapse={vi.fn()}
          onRemove={vi.fn()}
        />,
      )
      // 996.1 has no body-model suffix, so display is '996.1'
      expect(html).toContain('996.1')
      expect(html).toContain('What to watch for in the')
    })

    it('renders nothing in the flags slot when generation_id is null and no per-listing flags', () => {
      const html = renderToString(
        <ExpandedPanel
          listingId="lst-abc"
          listing={{ ...LISTING, generation_id: null }}
          refreshData={{ ...REFRESH_DATA, watch_for_items: [] }}
          generationWatchForItems={[]}
          onCollapse={vi.fn()}
          onRemove={vi.fn()}
        />,
      )
      expect(html).not.toContain('No flags on this listing')
      expect(html).not.toContain('What to watch for')
    })

    it('renders nothing when generationWatchForItems is empty', () => {
      const html = renderToString(
        <ExpandedPanel
          listingId="lst-abc"
          listing={{ ...LISTING, generation_id: '996.1' }}
          refreshData={{ ...REFRESH_DATA, watch_for_items: [] }}
          generationWatchForItems={[]}
          onCollapse={vi.fn()}
          onRemove={vi.fn()}
        />,
      )
      expect(html).not.toContain('What to watch for')
    })

    it('caps generation fallback at 3 items when more are provided', () => {
      const fourItems = [
        ...GEN_ITEMS,
        { title: 'Fourth item', severity: 'low' as const, description: 'Should not appear.' },
      ]
      const html = renderToString(
        <ExpandedPanel
          listingId="lst-abc"
          listing={{ ...LISTING, generation_id: '996.1' }}
          refreshData={{ ...REFRESH_DATA, watch_for_items: [] }}
          generationWatchForItems={fourItems}
          onCollapse={vi.fn()}
          onRemove={vi.fn()}
        />,
      )
      expect(html).not.toContain('Fourth item')
    })
  })
})
