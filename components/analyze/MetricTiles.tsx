import type { Tables } from '@/lib/supabase/types'
import { formatCents } from '@/lib/utils/currency'
import type { AnalysisData, ViewerTier } from './types'
import type { CompResultRow } from '@/lib/comp-engine/db-types'
import { monthsAgo } from '@/lib/comp-engine/recency-weight'

type Props = {
  listing: Tables<'listings'>
  analysisData: AnalysisData | null
  compResult?: CompResultRow | null
  viewerTier: ViewerTier
}

function MetricTile({
  label,
  value,
  hint,
  valueClassName,
  href,
}: {
  label: string
  value: string
  hint?: string
  valueClassName?: string
  href?: string
}) {
  const sharedClass = 'border-[0.5px] border-border-default bg-bg-surface px-4 py-[14px]'
  // When used as a link, add group so child can respond to hover
  const valueClass = href && !valueClassName
    ? 'mt-1 truncate font-serif text-[20px] text-text-primary transition-colors group-hover:text-accent-primary'
    : `mt-1 truncate ${valueClassName ?? 'font-serif text-[20px] text-text-primary'}`

  const inner = (
    <>
      <p className="font-serif text-[10px] uppercase tracking-[0.18em] text-accent-primary">{label}</p>
      <p className={valueClass}>{value}</p>
      {hint && <p className="mt-1 font-sans text-[12px] text-text-muted">{hint}</p>}
    </>
  )

  if (href) {
    return (
      <a href={href} className={`group block cursor-pointer ${sharedClass}`}>
        {inner}
      </a>
    )
  }
  return <div className={sharedClass}>{inner}</div>
}

export function MetricTiles({ listing, analysisData, compResult = null, viewerTier }: Props) {
  const currency = listing.currency

  // Bid tile: sold → Sale Price; no-sale → Final Bid; live → Current Bid
  let bidLabel: string
  let bidCents: number | null
  if (listing.listing_status === 'sold' && listing.final_price != null) {
    bidLabel = 'Sale Price'
    bidCents = listing.final_price
  } else if (listing.listing_status === 'no-sale' && listing.high_bid != null) {
    bidLabel = 'Final Bid'
    bidCents = listing.high_bid
  } else if (listing.high_bid != null) {
    bidLabel = 'Current Bid'
    bidCents = listing.high_bid
  } else {
    bidLabel = listing.listing_status === 'live' ? 'Current Bid' : 'Sale Price'
    bidCents = null
  }

  // Prefer comp-engine data; fall back to legacy analysisData fields
  const fairValueStr =
    compResult?.fair_value_low_cents != null && compResult?.fair_value_high_cents != null
      ? `${formatCents(compResult.fair_value_low_cents, currency)} – ${formatCents(compResult.fair_value_high_cents, currency)}`
      : analysisData?.fair_value_low_cents != null && analysisData?.fair_value_high_cents != null
        ? `${formatCents(analysisData.fair_value_low_cents, currency)} – ${formatCents(analysisData.fair_value_high_cents, currency)}`
        : null

  const compMostRecentMonths =
    compResult?.most_recent_comp_sold_at != null
      ? Math.round(monthsAgo(compResult.most_recent_comp_sold_at))
      : null

  const compsValue: string | null =
    compResult != null && compResult.tier !== 'insufficient'
      ? compMostRecentMonths != null
        ? `${compResult.comp_count} comps · ${compMostRecentMonths} mo ago`
        : `${compResult.comp_count} comps`
      : analysisData?.comps_used != null
        ? String(analysisData.comps_used)
        : null

  // Reserve tile: "No Reserve" when has_no_reserve, otherwise met/not met/unknown
  let reserveLabel: string
  let reserveClassName: string | undefined
  if (listing.has_no_reserve) {
    reserveLabel = 'No Reserve'
    reserveClassName = 'font-serif text-[20px] text-accent-primary'
  } else if (listing.reserve_met === true) {
    reserveLabel = 'Reserve Met'
    reserveClassName = undefined
  } else if (listing.reserve_met === false) {
    reserveLabel = 'Reserve Not Met'
    reserveClassName = undefined
  } else {
    reserveLabel = '—'
    reserveClassName = undefined
  }

  const signInValue = 'Sign in to see'
  const signInClassName = 'font-serif text-[16px] italic text-text-muted'

  const fairValueLocked = viewerTier === 'anonymous'
  const compsLocked = viewerTier === 'anonymous'

  function unavailableHint(): string {
    if (listing.listing_status === 'live') {
      return 'Auction in progress. Final comp analysis runs when sale completes.'
    }
    if (listing.listing_status === 'no_sale') {
      return 'Auction ended without a sale. Comp range available below for context.'
    }
    return 'Not enough comparable sales for this generation/trim yet. Foundation data is still building.'
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-[10px] sm:grid-cols-4">
      <MetricTile
        label={bidLabel}
        value={bidCents != null ? formatCents(bidCents, currency) : '—'}
      />
      <MetricTile
        label="Fair Value Range"
        value={fairValueLocked ? signInValue : (fairValueStr ?? '—')}
        valueClassName={fairValueLocked ? signInClassName : (fairValueStr == null ? 'font-serif text-[20px] text-text-quaternary' : undefined)}
        hint={!fairValueLocked && fairValueStr == null ? unavailableHint() : undefined}
      />
      <MetricTile
        label="Comps Used"
        value={compsLocked ? signInValue : (compsValue ?? '—')}
        valueClassName={compsLocked ? signInClassName : (compsValue == null ? 'font-serif text-[20px] text-text-quaternary' : undefined)}
        hint={!compsLocked && compsValue == null ? unavailableHint() : undefined}
        href={!compsLocked && compsValue != null ? '#comparable-sales' : undefined}
      />
      <MetricTile label="Reserve" value={reserveLabel} valueClassName={reserveClassName} />
    </div>
  )
}
