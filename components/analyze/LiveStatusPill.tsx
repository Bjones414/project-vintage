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
    <span className="inline-flex items-center gap-2 font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
      <span
        aria-hidden="true"
        className="h-[5px] w-[5px] shrink-0 rounded-full bg-severity-positive animate-pulse motion-reduce:animate-none"
      />
      LIVE · {pillText}
    </span>
  )
}
