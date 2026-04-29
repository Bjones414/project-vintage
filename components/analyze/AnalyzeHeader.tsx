import type { Tables } from '@/lib/supabase/types'
import { Badge } from '@/components/ui/badge'
import { AuctionCountdown } from './AuctionCountdown'
import { LiveStatusPill } from './LiveStatusPill'
import type { AnalysisData, ViewerTier } from './types'

type Props = {
  listing: Tables<'listings'>
  analysisData: AnalysisData | null
  viewerTier: ViewerTier
  /** Injectable for deterministic tests of the live status pill date formatting. */
  now?: Date
}

function statusBadge(listing: Tables<'listings'>): {
  label: string
  variant: 'success' | 'neutral' | 'warning' | 'danger'
} {
  switch (listing.listing_status) {
    case 'sold':
      return { label: 'Sold', variant: 'neutral' }
    case 'no-sale':
      return { label: 'No Sale', variant: 'warning' }
    default:
      return { label: 'Ended', variant: 'neutral' }
  }
}

export function AnalyzeHeader({ listing, analysisData, now }: Props) {
  const headline = [listing.year, listing.model, listing.trim].filter(Boolean).join(' ')

  const colorSegment = listing.exterior_color
    ? listing.interior_color
      ? `${listing.exterior_color} over ${listing.interior_color}`
      : listing.exterior_color
    : null

  const mileageUnit = listing.mileage_unit === 'mi' ? 'miles' : listing.mileage_unit
  const mileageSegment =
    listing.mileage != null ? `${listing.mileage.toLocaleString()} ${mileageUnit}` : null

  const subtitleParts = [
    colorSegment,
    listing.transmission ?? null,
    listing.generation ?? null,
    mileageSegment,
  ].filter((s): s is string => s != null)

  const subtitle = subtitleParts.join(' · ')
  const compsUsed = analysisData?.comps_used
  const isLive = listing.listing_status === 'live'

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {isLive ? (
          <LiveStatusPill listing={listing} now={now} />
        ) : (
          <Badge variant={statusBadge(listing).variant}>{statusBadge(listing).label}</Badge>
        )}
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-gray-900">
          {headline}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm italic text-gray-500">{subtitle}</p>
        )}
        {compsUsed != null && compsUsed > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            {compsUsed} comparable sale{compsUsed !== 1 ? 's' : ''} in dataset
          </p>
        )}
      </div>
      {listing.auction_ends_at && (
        <div className="text-sm sm:text-right">
          <AuctionCountdown endsAt={listing.auction_ends_at} listingId={listing.id} />
        </div>
      )}
    </div>
  )
}
