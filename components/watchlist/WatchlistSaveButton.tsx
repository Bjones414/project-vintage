'use client'

// WatchlistSaveButton — toggle-saves a listing to the user's watchlist.
//
// Usage (add to app/(app)/analyze/[id]/page.tsx once the other session is done):
//   import { WatchlistSaveButton } from '@/components/watchlist/WatchlistSaveButton'
//   <WatchlistSaveButton listingId={listing.id} initialSaved={isSaved} />
//
// The parent server component should determine `initialSaved` by checking:
//   const { data: savedRow } = await supabase.from('watchlist')
//     .select('id').eq('listing_id', listing.id).maybeSingle()
//   const isSaved = !!savedRow
import { useState } from 'react'

interface Props {
  listingId: string
  initialSaved?: boolean
}

export function WatchlistSaveButton({ listingId, initialSaved = false }: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (loading) return
    setLoading(true)
    try {
      if (saved) {
        await fetch(`/api/watchlist?listing_id=${listingId}`, { method: 'DELETE' })
        setSaved(false)
      } else {
        const res = await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listing_id: listingId }),
        })
        if (res.ok) setSaved(true)
      }
    } catch {
      // Non-fatal — button reverts to previous state on network error
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? 'Remove from watchlist' : 'Save to watchlist'}
      className="flex items-center gap-1.5 font-sans text-[13px] text-text-tertiary transition-opacity hover:opacity-70 disabled:opacity-40"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.25"
        className="shrink-0"
        aria-hidden="true"
      >
        <path d="M7 1.5L8.6 5.1L12.5 5.7L9.75 8.4L10.4 12.3L7 10.5L3.6 12.3L4.25 8.4L1.5 5.7L5.4 5.1L7 1.5Z" />
      </svg>
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
