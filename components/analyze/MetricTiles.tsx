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
}: {
  label: string
  value: string
  hint?: string
  valueClassName?: string
}) {
  return (
    <div className="border-[0.5px] border-border-default bg-bg-surface px-4 py-[14px]">
      <p className="font-serif text-[10px] uppercase tracking-[0.18em] text-accent-primary">{label}</p>
      <p className={`mt-1 truncate ${valueClassName ?? 'font-serif text-[20px] text-text-primary'}`}>{value}</p>
      {hint && <p className="mt-1 font-sans text-[12px] text-text-muted">{hint}</p>}
    </div>
  )
}

export function MetricTiles({ listing, analysisData, compResult = null, viewerTier }: Props) {
  const currency = listing.currency

  // Bid tile: prefer final_price for sold listings, fall back to high_bid for live
  let bidLabel: string
  let bidCents: number | null
  if (listing.listing_status === 'sold' && listing.final_price != null) {
    bidLabel = 'Sale Price'
    bidCents = listing.final_price
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

  return (
    <div className="mt-6 grid grid-cols-2 gap-[10px] sm:grid-cols-4">
      <MetricTile
        label={bidLabel}
        value={bidCents != null ? formatCents(bidCents, currency) : '—'}
      />
      <MetricTile
        label="Fair Value Range"
        value={fairValueLocked ? signInValue : (fairValueStr ?? 'In development')}
        valueClassName={fairValueLocked ? signInClassName : (fairValueStr == null ? 'font-serif text-[16px] italic text-text-muted' : undefined)}
        hint={!fairValueLocked && fairValueStr == null ? 'Comp engine launching with full report' : undefined}
      />
      <MetricTile
        label="Comps Used"
        value={compsLocked ? signInValue : (compsValue ?? 'In development')}
        valueClassName={compsLocked ? signInClassName : (compsValue == null ? 'font-serif text-[16px] italic text-text-muted' : undefined)}
        hint={!compsLocked && compsValue == null ? 'Comp engine launching with full report' : undefined}
      />
      <MetricTile label="Reserve" value={reserveLabel} valueClassName={reserveClassName} />
    </div>
  )
}
