import type { Tables } from '@/lib/supabase/types'
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

function statusLabel(listing: Tables<'listings'>): string {
  switch (listing.listing_status) {
    case 'sold': return 'Sold'
    case 'no-sale': return 'No Sale'
    default: return 'Ended'
  }
}

export function AnalyzeHeader({ listing, analysisData, now }: Props) {
  const headline = [listing.year, listing.make, listing.model, listing.trim].filter(Boolean).join(' ')

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
      <div className="min-w-0">
        {isLive ? (
          <LiveStatusPill listing={listing} now={now} />
        ) : (
          <span className="inline-flex items-center gap-2">
            <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-text-quaternary" aria-hidden="true" />
            <span className="font-serif text-[11px] uppercase tracking-[0.18em] text-text-quaternary">
              {statusLabel(listing)}
            </span>
          </span>
        )}
        <h1 className="mt-2 font-serif text-h1 text-text-primary">
          {headline}
        </h1>
        {subtitle && (
          <p className="mt-1 font-serif text-[16px] italic leading-[1.65] text-text-tertiary">{subtitle}</p>
        )}
        {compsUsed != null && compsUsed > 0 && (
          <p className="mt-1 font-sans text-[13px] text-text-tertiary">
            {compsUsed} comparable sale{compsUsed !== 1 ? 's' : ''} in dataset
          </p>
        )}
      </div>
      {isLive && listing.auction_ends_at && (
        <div className="shrink-0 text-right font-sans text-[13px] text-text-tertiary">
          <AuctionCountdown endsAt={listing.auction_ends_at} listingId={listing.id} />
        </div>
      )}
    </div>
  )
}
