'use client'
// WatchToggleButton — "Watch this car" / "Watching" toggle for the analyze page action row.
// Spec: default state = secondary button styling; after click = "Watching" with gold border.
// Toggle: clicking "Watching" un-watches and reverts to "Watch this car".

import { useState } from 'react'

interface Props {
  listingId: string
  initialWatched: boolean
}

export function WatchToggleButton({ listingId, initialWatched }: Props) {
  const [watching, setWatching] = useState(initialWatched)
  const [loading, setLoading]   = useState(false)

  async function toggle() {
    if (loading) return
    setLoading(true)
    try {
      if (watching) {
        await fetch(`/api/watchlist?listing_id=${listingId}`, { method: 'DELETE' })
        setWatching(false)
      } else {
        const res = await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listing_id: listingId }),
        })
        if (res.ok) setWatching(true)
      }
    } catch {
      // Non-fatal — button state stays unchanged on network error
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={[
        'inline-flex items-center rounded-button border-[0.5px] px-5 py-[10px]',
        'font-sans text-[13px] font-medium tracking-[0.02em]',
        'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2',
        'disabled:opacity-40',
        watching
          ? 'border-accent-primary bg-transparent text-accent-primary'
          : 'border-accent-primary bg-accent-primary text-bg-canvas hover:opacity-90',
      ].join(' ')}
    >
      {watching ? 'Watching' : 'Watch this car'}
    </button>
  )
}
