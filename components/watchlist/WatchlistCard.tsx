// Displays a single saved listing in the watchlist.
// Shows title, status, price (or current bid for live listings), and a remove button.
'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Listing {
  id: string
  year: number | null
  make: string | null
  model: string | null
  trim: string | null
  mileage: number | null
  final_price: number | null
  high_bid: number | null
  listing_status: string | null
  cache_status: string
  last_fetched_at: string | null
  source_platform: string
  source_url: string
}

interface Props {
  listing: Listing
}

function formatPrice(cents: number | null): string {
  if (!cents) return '—'
  return '$' + Math.round(cents / 100).toLocaleString('en-US')
}

function statusLabel(status: string | null): string {
  if (status === 'live') return 'Live'
  if (status === 'sold') return 'Sold'
  if (status === 'no-sale') return 'No Sale'
  return 'Unknown'
}

export function WatchlistCard({ listing }: Props) {
  const [removing, setRemoving] = useState(false)
  const [removed, setRemoved] = useState(false)

  const title = [listing.year, listing.make, listing.model, listing.trim]
    .filter(Boolean)
    .join(' ')

  const displayPrice =
    listing.listing_status === 'live'
      ? formatPrice(listing.high_bid)
      : formatPrice(listing.final_price)

  const priceLabel = listing.listing_status === 'live' ? 'Current bid' : 'Final price'

  async function handleRemove() {
    setRemoving(true)
    try {
      await fetch(`/api/watchlist?listing_id=${listing.id}`, { method: 'DELETE' })
      setRemoved(true)
    } catch {
      setRemoving(false)
    }
  }

  if (removed) return null

  return (
    <div className="flex items-center justify-between gap-4 border-[0.5px] border-[#D4CFC0] bg-[#FDFAF4] px-5 py-4">
      <Link href={`/analyze/${listing.id}`} className="group min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <span className="truncate font-serif text-[16px] text-text-primary group-hover:opacity-70">
            {title || 'Untitled listing'}
          </span>
          <span
            className={[
              'shrink-0 font-sans text-[10px] uppercase tracking-widest',
              listing.listing_status === 'live'
                ? 'text-[#2E7D32]'
                : listing.listing_status === 'sold'
                  ? 'text-text-tertiary'
                  : 'text-text-muted',
            ].join(' ')}
          >
            {statusLabel(listing.listing_status)}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-3 font-sans text-[12px] text-text-muted">
          {listing.mileage != null && (
            <span>{listing.mileage.toLocaleString('en-US')} mi</span>
          )}
          {displayPrice !== '—' && (
            <span>
              {priceLabel}: {displayPrice}
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={handleRemove}
        disabled={removing}
        className="shrink-0 font-sans text-[11px] text-text-muted hover:text-severity-concern disabled:opacity-40"
        aria-label={`Remove ${title} from watchlist`}
      >
        {removing ? 'Removing…' : 'Remove'}
      </button>
    </div>
  )
}
