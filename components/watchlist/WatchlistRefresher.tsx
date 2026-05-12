'use client'

// WatchlistRefresher — triggers sequential lazy refresh of stale live listings.
//
// Rendered by the /watchlist server component. It receives only the IDs that are
// stale (cache_status = 'live' AND last_fetched_at older than 1 hour). If there
// are no stale IDs, this component renders null and does nothing.
//
// SAFETY: This component fires exactly once per page load — when the user opens
// their watchlist. It never runs on a schedule or in the background.
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  staleListingIds: string[]
}

export function WatchlistRefresher({ staleListingIds }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'refreshing' | 'done'>('idle')

  useEffect(() => {
    if (staleListingIds.length === 0) return

    let cancelled = false

    async function runRefresh() {
      setStatus('refreshing')
      try {
        await fetch('/api/watchlist/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listing_ids: staleListingIds }),
        })
      } catch {
        // Non-fatal — stale data is acceptable if the refresh fails
      }
      if (!cancelled) {
        setStatus('done')
        // Re-render the page with fresh data from the server
        router.refresh()
      }
    }

    runRefresh()
    return () => {
      cancelled = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Intentionally empty: run once on mount only

  if (staleListingIds.length === 0 || status === 'done') return null

  return (
    <p className="font-sans text-[12px] text-[#8B8880]">
      Checking {staleListingIds.length} listing{staleListingIds.length !== 1 ? 's' : ''} for updates…
    </p>
  )
}
