import type { Tables } from '@/lib/supabase/types'
import { formatCents } from '@/lib/utils/currency'
import type { AnalysisData, ViewerTier } from './types'

type Props = {
  listing: Tables<'listings'>
  analysisData: AnalysisData | null
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
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-1 truncate ${valueClassName ?? 'text-xl font-bold text-gray-900'}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

export function MetricTiles({ listing, analysisData, viewerTier }: Props) {
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

  const fairValueStr =
    analysisData?.fair_value_low_cents != null &&
    analysisData?.fair_value_high_cents != null
      ? `${formatCents(analysisData.fair_value_low_cents, currency)} – ${formatCents(analysisData.fair_value_high_cents, currency)}`
      : null

  const compsValue =
    analysisData?.comps_used != null ? String(analysisData.comps_used) : null

  // Reserve tile: "No Reserve" when has_no_reserve, otherwise met/not met/unknown
  let reserveLabel: string
  let reserveClassName: string | undefined
  if (listing.has_no_reserve) {
    reserveLabel = 'No Reserve'
    reserveClassName = 'text-xl font-bold text-amber-600'
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

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <MetricTile
        label={bidLabel}
        value={bidCents != null ? formatCents(bidCents, currency) : '—'}
      />
      <MetricTile
        label="Fair Value Range"
        value={fairValueStr ?? 'In development'}
        valueClassName={fairValueStr == null ? 'text-sm italic text-gray-400' : undefined}
        hint={fairValueStr == null ? 'Comp engine launching with full report' : undefined}
      />
      <MetricTile
        label="Comps Used"
        value={compsValue ?? 'In development'}
        valueClassName={compsValue == null ? 'text-sm italic text-gray-400' : undefined}
        hint={
          compsValue == null
            ? 'Comp engine launching with full report'
            : viewerTier === 'anonymous'
              ? 'Sign in to see full comparison'
              : undefined
        }
      />
      <MetricTile label="Reserve" value={reserveLabel} valueClassName={reserveClassName} />
    </div>
  )
}
