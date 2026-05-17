import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { VerdictPill } from '@/components/watchlist/VerdictPill'

describe('VerdictPill', () => {
  it('renders "Tracking fair" with green colors', () => {
    const html = renderToString(<VerdictPill state="tracking-fair" />)
    expect(html).toContain('Tracking fair')
    expect(html).toContain('#E1E8DC')
    expect(html).toContain('#3D5A40')
  })

  it('renders "Tracking high" with coral colors', () => {
    const html = renderToString(<VerdictPill state="tracking-high" />)
    expect(html).toContain('Tracking high')
    expect(html).toContain('#EFD9D2')
    expect(html).toContain('#8C3A28')
  })

  it('renders "Too early to call" with elevated bg', () => {
    const html = renderToString(<VerdictPill state="too-early" />)
    expect(html).toContain('Too early to call')
  })

  it('renders "Sold strong" with coral colors', () => {
    const html = renderToString(<VerdictPill state="sold-above" />)
    expect(html).toContain('Sold strong')
    expect(html).toContain('#EFD9D2')
  })

  it('renders "Sold below" with green colors', () => {
    const html = renderToString(<VerdictPill state="sold-below" />)
    expect(html).toContain('Sold below')
    expect(html).toContain('#E1E8DC')
  })

  it('renders "Sold fair" with neutral styling', () => {
    const html = renderToString(<VerdictPill state="sold-fair" />)
    expect(html).toContain('Sold fair')
  })

  it('renders "No sale" as italic serif (no uppercase class) when no bid provided', () => {
    const html = renderToString(<VerdictPill state="no-sale" />)
    expect(html).toContain('No sale')
    expect(html).toContain('italic')
    expect(html).not.toContain('uppercase')
  })

  it('renders "Bid to $X (no sale)" when noSaleBidFormatted is provided', () => {
    const html = renderToString(<VerdictPill state="no-sale" noSaleBidFormatted="$107,000" />)
    expect(html).toContain('Bid to $107,000 (no sale)')
    expect(html).toContain('italic')
  })

  it('falls back to "No sale" when noSaleBidFormatted is undefined', () => {
    const html = renderToString(<VerdictPill state="no-sale" noSaleBidFormatted={undefined} />)
    expect(html).toContain('No sale')
    expect(html).not.toContain('Bid to')
  })

  it('noSaleBidFormatted is ignored for non-no-sale states', () => {
    const html = renderToString(<VerdictPill state="tracking-fair" noSaleBidFormatted="$107,000" />)
    expect(html).toContain('Tracking fair')
    expect(html).not.toContain('Bid to')
  })

  it('all 7 states render without throwing', () => {
    const states: Parameters<typeof VerdictPill>[0]['state'][] = [
      'tracking-fair', 'tracking-high', 'too-early',
      'sold-above', 'sold-below', 'sold-fair', 'no-sale',
    ]
    for (const state of states) {
      expect(() => renderToString(<VerdictPill state={state} />)).not.toThrow()
    }
  })
})
