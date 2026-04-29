import type { Tables } from '@/lib/supabase/types'
import { Badge } from '@/components/ui/badge'
import { formatAuctionEndTime } from '@/lib/utils/date'
import type { AnalysisData, ViewerTier } from './types'

type Props = {
  listing: Tables<'listings'>
  analysisData: AnalysisData | null
  viewerTier: ViewerTier
}

function statusBadge(listing: Tables<'listings'>): {
  label: string
  variant: 'success' | 'neutral' | 'warning' | 'danger'
} {
  switch (listing.listing_status) {
    case 'live':
      return { label: 'Live Auction', variant: 'success' }
    case 'sold':
      return { label: 'Sold', variant: 'neutral' }
    case 'no-sale':
      return { label: 'No Sale', variant: 'warning' }
    default:
      return { label: 'Ended', variant: 'neutral' }
  }
}

export function AnalyzeHeader({ listing, analysisData }: Props) {
  const title = [listing.year, listing.make, listing.model, listing.trim]
    .filter(Boolean)
    .join(' ')

  const { label, variant } = statusBadge(listing)
  const compsUsed = analysisData?.comps_used

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <Badge variant={variant}>{label}</Badge>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {compsUsed != null && compsUsed > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            {compsUsed} comparable sale{compsUsed !== 1 ? 's' : ''} in dataset
          </p>
        )}
      </div>
      {listing.auction_ends_at && (
        <div className="text-sm text-gray-500 sm:text-right">
          <span className="font-medium text-gray-700">
            {listing.listing_status === 'live' ? 'Ends' : 'Ended'}
          </span>{' '}
          {/* TODO: Task 6b — replace static time with <AuctionCountdown endsAt={listing.auction_ends_at} /> */}
          {formatAuctionEndTime(listing.auction_ends_at)}
        </div>
      )}
    </div>
  )
}
