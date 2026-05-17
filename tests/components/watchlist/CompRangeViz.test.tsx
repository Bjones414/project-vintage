import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { CompRangeViz } from '@/components/watchlist/CompRangeViz'

const BASE_PROPS = {
  p25Cents:       28_000_00,
  medianCents:    32_400_00,
  p75Cents:       36_000_00,
  bidCents:       30_000_00,
  finalPriceCents: null,
  isActive:        true,
}

describe('CompRangeViz', () => {
  it('renders an SVG element', () => {
    const html = renderToString(<CompRangeViz {...BASE_PROPS} />)
    expect(html).toContain('<svg')
  })

  it('renders the range bar rect', () => {
    const html = renderToString(<CompRangeViz {...BASE_PROPS} />)
    expect(html).toContain('<rect')
  })

  it('renders median tick line', () => {
    const html = renderToString(<CompRangeViz {...BASE_PROPS} />)
    // Two line elements: track + median tick; bid also adds a line
    expect(html).toContain('<line')
  })

  it('renders bid marker circle when bidCents is provided', () => {
    const html = renderToString(<CompRangeViz {...BASE_PROPS} />)
    expect(html).toContain('<circle')
  })

  it('does not render bid marker circle when bidCents is null', () => {
    const html = renderToString(<CompRangeViz {...BASE_PROPS} bidCents={null} />)
    expect(html).not.toContain('<circle')
  })

  it('renders "bid" label for active listings', () => {
    const html = renderToString(<CompRangeViz {...BASE_PROPS} />)
    expect(html).toContain('bid')
  })

  it('renders "sold" label for ended listings', () => {
    const html = renderToString(
      <CompRangeViz {...BASE_PROPS} isActive={false} bidCents={null} finalPriceCents={33_000_00} />,
    )
    expect(html).toContain('sold')
  })

  it('handles bid marker outside the range (below p25)', () => {
    // bid far below p25 — should still render without crashing
    const html = renderToString(
      <CompRangeViz {...BASE_PROPS} bidCents={5_000_00} />,
    )
    expect(html).toContain('<svg')
    expect(html).toContain('<circle')
  })

  it('handles bid marker outside the range (above p75)', () => {
    const html = renderToString(
      <CompRangeViz {...BASE_PROPS} bidCents={80_000_00} />,
    )
    expect(html).toContain('<svg')
    expect(html).toContain('<circle')
  })

  it('returns empty string (null render) when all prices are identical', () => {
    // When the entire range collapses to 0, the component short-circuits to avoid NaN geometry
    const html = renderToString(
      <CompRangeViz p25Cents={32_000_00} medianCents={32_000_00} p75Cents={32_000_00} bidCents={null} finalPriceCents={null} isActive={true} />,
    )
    expect(html).toBe('')
  })

  it('renders median label text', () => {
    const html = renderToString(<CompRangeViz {...BASE_PROPS} />)
    expect(html).toContain('median')
  })

  it('renders top label text', () => {
    const html = renderToString(<CompRangeViz {...BASE_PROPS} />)
    expect(html).toContain('top')
  })

  it('renders bid/sold label even when bid is far outside the comp range', () => {
    // Bid well below p25 — label must still appear
    const html = renderToString(
      <CompRangeViz {...BASE_PROPS} bidCents={8_000_00} />,
    )
    expect(html).toContain('bid')
  })

  it('median and top labels are in separate text elements from the bid label', () => {
    const html = renderToString(<CompRangeViz {...BASE_PROPS} />)
    // Each label lives in its own <text> element; split on closing tag to count distinct containers
    const textElements = html.match(/<text[^>]*>[\s\S]*?<\/text>/g) ?? []
    const bidEl     = textElements.find(el => el.includes('bid'))
    const medianEl  = textElements.find(el => el.includes('median'))
    const topEl     = textElements.find(el => el.includes('top'))
    expect(bidEl).toBeDefined()
    expect(medianEl).toBeDefined()
    expect(topEl).toBeDefined()
    // All three must be distinct elements — no two share the same reference
    expect(bidEl).not.toBe(medianEl)
    expect(bidEl).not.toBe(topEl)
    expect(medianEl).not.toBe(topEl)
  })

  it('bid label is above the bar; median and top share the same bottom row', () => {
    const html = renderToString(<CompRangeViz {...BASE_PROPS} />)
    // BID_LABEL_Y=10 (above bar), BOTTOM_LABEL_Y=52 (both median + top on the same line)
    const textElements = html.match(/<text[^>]*>[\s\S]*?<\/text>/g) ?? []
    const bidEl    = textElements.find(el => el.includes('bid'))
    const medianEl = textElements.find(el => el.includes('median'))
    const topEl    = textElements.find(el => el.includes('top'))
    expect(bidEl).toContain('y="10"')
    expect(medianEl).toContain('y="52"')
    expect(topEl).toContain('y="52"')  // same row as median — fixed-column layout
    // Two distinct y-rows: above bar (10) and bottom labels (52)
    const uniqueYRows = new Set([10, 52, 52])
    expect(uniqueYRows.size).toBe(2)
  })

  it('all three labels use textAnchor middle to center on their tick position', () => {
    const html = renderToString(<CompRangeViz {...BASE_PROPS} />)
    const textElements = html.match(/<text[^>]*>[\s\S]*?<\/text>/g) ?? []
    const bidEl    = textElements.find(el => el.includes('bid'))
    const medianEl = textElements.find(el => el.includes('median'))
    const topEl    = textElements.find(el => el.includes('top'))
    expect(bidEl).toContain('middle')
    expect(medianEl).toContain('middle')
    expect(topEl).toContain('middle')
  })

  it('all label x coordinates are clamped within viewBox bounds', () => {
    const html = renderToString(<CompRangeViz {...BASE_PROPS} />)
    const textElements = html.match(/<text[^>]*>[\s\S]*?<\/text>/g) ?? []
    for (const el of textElements) {
      const xMatch = el.match(/\bx="([\d.]+)"/)
      if (xMatch) {
        const x = parseFloat(xMatch[1])
        expect(x).toBeGreaterThanOrEqual(36)   // CLAMP_PAD
        expect(x).toBeLessThanOrEqual(244)      // TOTAL_W - CLAMP_PAD
      }
    }
  })
})
