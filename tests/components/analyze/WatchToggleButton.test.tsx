import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { WatchToggleButton } from '@/components/analyze/WatchToggleButton'

// WatchToggleButton is a 'use client' component with useState. renderToString captures
// the initial state from props. Toggle interaction requires a full DOM environment.

describe('WatchToggleButton', () => {
  it('renders "Watch this car" when initialWatched is false', () => {
    const html = renderToString(
      <WatchToggleButton listingId="lst-1" initialWatched={false} />,
    )
    expect(html).toContain('Watch this car')
    expect(html).not.toContain('Watching')
  })

  it('renders "Watching" when initialWatched is true', () => {
    const html = renderToString(
      <WatchToggleButton listingId="lst-1" initialWatched={true} />,
    )
    expect(html).toContain('Watching')
    expect(html).not.toContain('Watch this car')
  })

  it('applies gold border when watching', () => {
    const html = renderToString(
      <WatchToggleButton listingId="lst-1" initialWatched={true} />,
    )
    expect(html).toContain('border-accent-primary')
    expect(html).toContain('text-accent-primary')
  })

  it('applies gold fill when not watching', () => {
    const html = renderToString(
      <WatchToggleButton listingId="lst-1" initialWatched={false} />,
    )
    expect(html).toContain('bg-accent-primary')
    expect(html).toContain('text-bg-canvas')
  })

  it('renders a button element', () => {
    const html = renderToString(
      <WatchToggleButton listingId="lst-1" initialWatched={false} />,
    )
    expect(html).toContain('<button')
    expect(html).toContain('type="button"')
  })
})
