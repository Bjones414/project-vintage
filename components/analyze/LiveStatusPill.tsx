'use client'

import { useState, useEffect } from 'react'
import type { Tables } from '@/lib/supabase/types'
import { formatLivePillDate } from '@/lib/utils/date'

type Props = {
  listing: Tables<'listings'>
  now?: Date
}

export function LiveStatusPill({ listing, now: nowProp }: Props) {
  const [pillText, setPillText] = useState<string | null>(() => {
    if (!listing.auction_ends_at) return null
    return nowProp ? formatLivePillDate(listing.auction_ends_at, nowProp) : null
  })

  useEffect(() => {
    if (nowProp || !listing.auction_ends_at) return
    setPillText(formatLivePillDate(listing.auction_ends_at, new Date()))
  }, [nowProp, listing.auction_ends_at])

  if (listing.listing_status !== 'live' || !listing.auction_ends_at || !pillText) return null

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-2.5 py-1 text-xs font-semibold tracking-wide text-white">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-white animate-pulse motion-reduce:animate-none"
      />
      LIVE · {pillText}
    </span>
  )
}
