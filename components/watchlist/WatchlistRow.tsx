'use client'
// WatchlistRow — collapsed row + click-to-expand interaction for /watchlist.
//
// COMPLIANCE: The refresh (POST /api/watchlist/[listingId]/refresh) fires ONLY when the user
// explicitly clicks a collapsed row. No refresh on page mount, no background polling.
// This is enforced by the click handler guard and the absence of any useEffect that calls
// the refresh endpoint.
//
// Collapse paths: (1) clicking the expanded row again, (2) "Collapse ↑" link in the panel.

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { PLATFORM_NAMES } from '@/lib/utils/platforms'
import {
  computeFreshness,
  computeVerdictPillState,
  formatUpdatedAt,
  isOlderThan12h,
  type WatchlistRefreshResult,
} from '@/lib/watchlist/state'
import { VerdictPill } from './VerdictPill'
import { ExpandedPanel } from './ExpandedPanel'

export interface WatchlistRowProps {
  watchlistId: string
  listingId: string
  listing: {
    year: number | null
    make: string | null
    model: string | null
    trim: string | null
    exterior_color: string | null
    interior_color: string | null
    mileage: number | null
    high_bid: number | null
    final_price: number | null
    listing_status: string | null
    auction_ends_at: string | null
    source_url: string
    source_platform: string
    generation_id: string | null
  }
  watchedAt: string
  updatedAt: string
  initialComp: {
    comp_count: number
    fair_value_low_cents: number | null
    fair_value_median_cents: number | null
    fair_value_high_cents: number | null
    verdict?: string | null
  } | null
  generationWatchForItems: Array<{
    title: string
    severity: 'high' | 'moderate' | 'low'
    description: string
  }>
}

type FetchState = 'idle' | 'fetching' | 'done' | 'error'

function formatCountdown(auctionEndsAt: string | null, listingStatus: string | null): string | null {
  if (!auctionEndsAt) return null

  const isEnded = listingStatus === 'sold' || listingStatus === 'no-sale'
  const endDate = new Date(auctionEndsAt)

  if (isEnded) {
    return `Auction ended ${endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
  }

  const msRemaining = endDate.getTime() - Date.now()
  if (msRemaining <= 0) {
    return `Auction ended ${endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
  }

  const hoursRemaining = Math.floor(msRemaining / (1000 * 60 * 60))
  const daysRemaining  = Math.floor(hoursRemaining / 24)

  if (daysRemaining >= 2) return `Closes in ${daysRemaining} days`
  if (hoursRemaining >= 24) return `Closes in ${hoursRemaining}h`
  return `Closes in ${hoursRemaining}h`
}

function formatPrice(cents: number | null): string {
  if (!cents) return '—'
  return '$' + Math.round(cents / 100).toLocaleString('en-US')
}

function formatAdded(createdAt: string): string {
  return `Added ${new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

export function WatchlistRow({
  listingId,
  listing,
  watchedAt,
  updatedAt: initialUpdatedAt,
  initialComp,
  generationWatchForItems,
}: WatchlistRowProps) {
  const [expanded,       setExpanded]       = useState(false)
  const [fetchState,     setFetchState]      = useState<FetchState>('idle')
  const [refreshData,    setRefreshData]     = useState<WatchlistRefreshResult | null>(null)
  const [currentUpdatedAt, setCurrentUpdatedAt] = useState(initialUpdatedAt)
  const [removed,        setRemoved]         = useState(false)

  if (removed) return null

  const freshness  = computeFreshness(currentUpdatedAt, listing.auction_ends_at)
  const isStale12h = isOlderThan12h(currentUpdatedAt)
  const isFetching = fetchState === 'fetching'

  // Verdict pill — use fresh refresh data when available, else fall back to stored comp_results
  const comp = refreshData
    ? {
        comp_count: refreshData.comp_count,
        p25: refreshData.comp_p25,
        p75: refreshData.comp_p75,
        verdict: refreshData.verdict,
      }
    : {
        comp_count: initialComp?.comp_count ?? 0,
        p25: initialComp?.fair_value_low_cents ?? null,
        p75: initialComp?.fair_value_high_cents ?? null,
        verdict: initialComp?.verdict ?? null,
      }

  const pillState = computeVerdictPillState({
    listingStatus:   listing.listing_status,
    currentBidCents: refreshData ? refreshData.current_bid : listing.high_bid,
    finalPriceCents: listing.final_price,
    compP25Cents:    comp.p25,
    compP75Cents:    comp.p75,
    compCount:       comp.comp_count,
    verdict:         comp.verdict,
    auctionEndsAt:   listing.auction_ends_at,
  })

  // Right-column display price
  const isActive  = listing.listing_status !== 'sold' && listing.listing_status !== 'no-sale'
  const isEnded   = listing.listing_status === 'sold'
  const compMedian = refreshData?.comp_median ?? initialComp?.fair_value_median_cents ?? null

  const currentBid = refreshData?.current_bid ?? listing.high_bid

  // Current bid is the actionable number — display it large; expected is the reference below.
  // For sold rows the final price is primary; for ended-but-no-sale show the high bid if known.
  const displayPrice = isEnded
    ? formatPrice(listing.final_price)
    : currentBid
    ? formatPrice(currentBid)
    : formatPrice(compMedian)

  const priceLabel = isEnded
    ? 'Sold for'
    : currentBid
    ? (isActive ? 'Current bid' : 'High bid')
    : 'Expected'

  const subPrice = compMedian && (isEnded || currentBid !== null)
    ? `vs expected ${formatPrice(compMedian)}`
    : null

  // Countdown
  const countdownText = formatCountdown(listing.auction_ends_at, listing.listing_status)
  const msUntilEnd = listing.auction_ends_at
    ? new Date(listing.auction_ends_at).getTime() - Date.now()
    : Infinity
  const isUrgentCountdown = isActive && msUntilEnd > 0 && msUntilEnd < 24 * 60 * 60 * 1000

  // For no-sale rows: pass the high bid to the pill so it can render "Bid to $X (no sale)".
  const noSaleBidFormatted = pillState === 'no-sale' && currentBid ? formatPrice(currentBid) : undefined

  // Updated-at label
  const updatedLabel = isFetching
    ? 'Fetching latest…'
    : formatUpdatedAt(currentUpdatedAt)

  const updatedLabelClass = isFetching
    ? 'font-serif italic text-accent-primary'
    : isStale12h
    ? 'font-medium text-text-secondary'
    : freshness === 'stale' || freshness === 'stale-urgent'
    ? 'text-text-tertiary'
    : 'text-text-quaternary'

  // Invitation link copy (shown in meta line)
  const invitationCopy = freshness === 'stale-urgent'
    ? 'Closing soon — read the take →'
    : 'Read the take →'
  const invitationClass = freshness === 'stale-urgent'
    ? 'font-medium'
    : ''

  // Subhead
  const subhead = [
    listing.exterior_color && listing.interior_color
      ? `${listing.exterior_color} over ${listing.interior_color}`
      : listing.exterior_color || null,
    listing.mileage != null ? `${listing.mileage.toLocaleString('en-US')} mi` : null,
  ]
    .filter(Boolean)
    .join(', ')

  // Title
  const title = [listing.year, listing.make, listing.model, listing.trim]
    .filter(Boolean)
    .join(' ') || 'Untitled listing'

  const sourceName = PLATFORM_NAMES[listing.source_platform] ?? listing.source_platform

  // Left-border state
  const hasBorder = expanded || freshness === 'stale-urgent'
  const borderClass = hasBorder
    ? freshness === 'stale-urgent'
      ? 'border-l-2 border-accent-primary'
      : 'border-l border-accent-primary'
    : ''

  async function handleRowClick() {
    if (isFetching) return

    // Click on expanded row → collapse
    if (expanded) {
      setExpanded(false)
      return
    }

    // Click on collapsed row → fetch + expand
    // COMPLIANCE: this is the ONLY place the refresh endpoint is called — user action only
    setFetchState('fetching')
    try {
      const res = await fetch(`/api/watchlist/${listingId}/refresh`, { method: 'POST' })
      if (!res.ok) {
        setFetchState('error')
        return
      }
      const data = (await res.json()) as WatchlistRefreshResult
      setRefreshData(data)
      setCurrentUpdatedAt(data.updated_at)
      setFetchState('done')
      setExpanded(true)
    } catch {
      setFetchState('error')
    }
  }

  return (
    <div className={cn('border-b-[0.5px] border-border-subtle', borderClass, isStale12h && !expanded ? 'opacity-60' : '')}>
      {/* Collapsed row — the click target */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div
        onClick={handleRowClick}
        className={cn(
          'cursor-pointer select-none transition-colors hover:bg-[rgba(139,105,20,0.04)]',
          hasBorder ? 'pl-[22px]' : '',
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleRowClick() } }}
        aria-expanded={expanded}
      >
        <div
          className="grid items-center gap-[40px] py-[26px] pr-6"
          style={{ gridTemplateColumns: '1fr auto 200px auto' }}
        >
          {/* Left column: title, subhead, meta */}
          <div className="min-w-0">
            <p className="font-serif text-[20px] text-text-primary">{title}</p>
            {subhead && (
              <p className="mt-0.5 font-serif text-[14px] italic text-text-tertiary">{subhead}</p>
            )}
            <div className="mt-2 flex flex-wrap items-baseline gap-[14px]">
              <span className="font-sans text-[10px] text-text-quaternary">
                {formatAdded(watchedAt)}
              </span>
              <span className={cn('font-sans text-[10px]', updatedLabelClass)}>
                {updatedLabel}
              </span>
              {/* Invitation button — triggers expand, does NOT navigate */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); void handleRowClick() }}
                className={cn(
                  'font-serif text-[13px] italic text-accent-primary underline decoration-[0.5px] underline-offset-2 hover:opacity-70',
                  invitationClass,
                )}
              >
                {invitationCopy}
              </button>
              {/* Source listing link — opens original auction page in new tab */}
              <a
                href={listing.source_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="font-serif text-[13px] italic text-text-tertiary underline decoration-[0.5px] underline-offset-2 hover:opacity-70"
              >
                {`View on ${sourceName} →`}
              </a>
            </div>
          </div>

          {/* Middle column: verdict pill */}
          <div className="flex justify-center">
            <VerdictPill state={pillState} noSaleBidFormatted={noSaleBidFormatted} />
          </div>

          {/* Right column: countdown, price label, price, subprice */}
          <div className="text-right">
            {countdownText && (
              <p className={cn(
                'font-serif text-[14px] italic',
                isEnded
                  ? 'text-text-quaternary'
                  : isUrgentCountdown
                  ? 'text-severity-concern'
                  : 'text-accent-primary',
              )}>
                {countdownText}
              </p>
            )}
            <p className="mt-0.5 font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">
              {priceLabel}
            </p>
            <p className="font-serif text-[22px] text-text-primary">{displayPrice}</p>
            {subPrice && (
              <p className="font-serif text-[13px] italic text-text-tertiary">{subPrice}</p>
            )}
          </div>

          {/* Expand indicator — "+" rotates 45° to "×" when expanded */}
          <div className="flex items-center self-center">
            <span
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                border: '0.5px solid var(--accent-primary)',
                borderRadius: '2px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '15px',
                color: 'var(--accent-primary)',
                userSelect: 'none',
                transform: expanded ? 'rotate(45deg)' : 'rotate(0deg)',
                transition: 'transform 200ms ease-in-out',
              }}
            >
              +
            </span>
          </div>
        </div>
      </div>

      {/* Expanded panel — rendered only after a successful user-triggered refresh */}
      {expanded && refreshData && (
        <div className={cn(hasBorder ? 'pl-[22px]' : '')}>
          <ExpandedPanel
            listingId={listingId}
            listing={listing}
            refreshData={refreshData}
            generationWatchForItems={generationWatchForItems}
            onCollapse={() => setExpanded(false)}
            onRemove={() => setRemoved(true)}
          />
        </div>
      )}
    </div>
  )
}
