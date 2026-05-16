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
})
