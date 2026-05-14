import { dataCaptureEnabled } from './config'
import type { CanonicalListing } from '@/lib/listing-parser/types'

export interface ListingCaptureInput {
  listing: CanonicalListing
  listingId: string | null
  analyzeRunId: string | null
  generationId: string | null
  generationNeedsReview: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function writeListingCapture(supabaseAdmin: any, input: ListingCaptureInput): Promise<void> {
  if (!dataCaptureEnabled) return

  const { listing, listingId, analyzeRunId, generationId, generationNeedsReview } = input

  await supabaseAdmin.from('listing_captures').insert({
    analyze_run_id: analyzeRunId,
    listing_id: listingId,
    source_platform: listing.source_platform,
    source_url: listing.source_url,
    source_listing_id: listing.source_listing_id,
    raw_title: listing.title ?? null,
    raw_description: listing.description ?? null,
    structured_data: {
      year: listing.year,
      make: listing.make,
      model: listing.model,
      trim: listing.trim,
      mileage: listing.mileage,
      transmission: listing.transmission,
      engine: listing.engine,
      listing_status: listing.listing_status,
      generation_id: generationId,
      generation_needs_review: generationNeedsReview,
    },
    capture_version: 'v1',
  })
}
