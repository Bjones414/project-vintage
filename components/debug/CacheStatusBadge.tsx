'use client'

// CacheStatusBadge — floating dev-only indicator showing listing cache state.
//
// Renders nothing in production. In development, shows a small badge in the
// bottom-right corner with cache_status, last_fetched_at, and listing_status.
//
// Usage (add to app/(app)/analyze/[id]/page.tsx once the other session is done):
//   import { CacheStatusBadge } from '@/components/debug/CacheStatusBadge'
//   <CacheStatusBadge listingId={listing.id} />
//
// No layout impact — fixed positioning, z-index 50, pointer-events-none.
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface CacheData {
  cache_status: string
  last_fetched_at: string | null
  listing_status: string | null
}

interface Props {
  listingId?: string
}

export function CacheStatusBadge({ listingId }: Props) {
  const params = useParams()
  const id = listingId ?? (typeof params?.id === 'string' ? params.id : null)

  const [data, setData] = useState<CacheData | null>(null)
  const [cached, setCached] = useState<boolean | null>(null)

  useEffect(() => {
    if (!id) return
    // Read whether this page load was a cache hit from the URL (analyze-url.ts
    // appends ?cached=1 for cache hits — see FOR USER TO REVIEW in session notes)
    const url = new URL(window.location.href)
    setCached(url.searchParams.get('_cache') === '1')

    fetch(`/api/debug/listing-cache?id=${id}`)
      .then(r => r.ok ? r.json() : null)
      .then((d: CacheData | null) => setData(d))
      .catch(() => null)
  }, [id])

  // Strip at build time — Next.js replaces process.env.NODE_ENV at build time
  if (process.env.NODE_ENV !== 'development') return null
  if (!data) return null

  const ageMs = data.last_fetched_at
    ? Date.now() - new Date(data.last_fetched_at).getTime()
    : null
  const ageStr = ageMs != null
    ? ageMs < 60_000
      ? `${Math.round(ageMs / 1000)}s ago`
      : ageMs < 3_600_000
        ? `${Math.round(ageMs / 60_000)}m ago`
        : `${Math.round(ageMs / 3_600_000)}h ago`
    : 'never'

  const isPermanent = data.cache_status === 'permanent'
  const isStale = data.cache_status === 'live' && ageMs != null && ageMs > 3_600_000

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-50 select-none"
      aria-hidden="true"
    >
      <div className="border border-gray-300 bg-white/90 px-2 py-1.5 text-[10px] text-gray-500 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <span
            className={[
              'h-1.5 w-1.5 rounded-full',
              isPermanent ? 'bg-gray-400' : isStale ? 'bg-amber-400' : 'bg-green-400',
            ].join(' ')}
          />
          <span className="font-mono font-medium">
            {cached === true ? 'cache hit' : cached === false ? 'fresh fetch' : data.cache_status}
          </span>
        </div>
        <div className="mt-0.5 font-mono text-gray-400">
          fetched: {ageStr}
          {isPermanent && ' · permanent'}
          {isStale && ' · stale'}
        </div>
      </div>
    </div>
  )
}
