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
  locked,
}: {
  label: string
  value: string
  locked?: boolean
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 truncate text-xl font-bold text-gray-900">
        {locked ? (
          <span className="text-sm font-normal text-gray-400">Free account</span>
        ) : (
          value
        )}
      </p>
    </div>
  )
}

export function MetricTiles({ listing, analysisData, viewerTier }: Props) {
  const isLive = listing.listing_status === 'live'
  const bidCents = isLive ? listing.high_bid : listing.final_price
  const currency = listing.currency

  const fairValueStr =
    analysisData?.fair_value_low_cents != null &&
    analysisData?.fair_value_high_cents != null
      ? `${formatCents(analysisData.fair_value_low_cents, currency)} – ${formatCents(analysisData.fair_value_high_cents, currency)}`
      : '—'

  const reserveLabel =
    listing.reserve_met === true
      ? 'Met'
      : listing.reserve_met === false
        ? 'Not met'
        : '—'

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <MetricTile
        label={isLive ? 'Current Bid' : 'Sale Price'}
        value={bidCents != null ? formatCents(bidCents, currency) : '—'}
      />
      <MetricTile label="Fair Value Range" value={fairValueStr} />
      <MetricTile
        label="Comps Used"
        value={
          analysisData?.comps_used != null ? String(analysisData.comps_used) : '—'
        }
        locked={viewerTier === 'anonymous'}
      />
      <MetricTile label="Reserve" value={reserveLabel} />
    </div>
  )
}
