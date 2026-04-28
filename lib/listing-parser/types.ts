export type SourcePlatform =
  | 'bring-a-trailer'
  | 'cars-and-bids'
  | 'pcarmarket'
  | 'rm-sothebys'
  | 'gooding'
  | 'mecum'
  | 'collecting-cars'
  | 'hemmings'
  | 'bonhams'
  | 'barrett-jackson'

export interface CanonicalListing {
  source_platform: SourcePlatform
  source_url: string
  source_listing_id: string
  title: string
  year: number | null
  make: string | null
  model: string | null
  trim: string | null
  vin: string | null
  mileage: number | null
  engine: string | null
  transmission: string | null
  exterior_color: string | null
  interior_color: string | null
  sold_price_cents: number | null  // dollars * 100, integer only, never float
  listing_status: 'live' | 'sold' | 'no-sale' | 'unknown'
  bid_count: number | null
  reserve_met: boolean | null
  auction_end_date: string | null  // ISO 8601
  seller_info: Record<string, unknown> | null
  description: string | null
  modification_notes: string | null
  image_urls: string[]
  raw_data: Record<string, unknown>
}

export type ListingParseResult =
  | { success: true; listing: CanonicalListing }
  | { success: false; error: string }

export class PlatformNotSupportedError extends Error {
  constructor(public readonly platform: string) {
    super(`Platform not yet supported: ${platform}`)
    this.name = 'PlatformNotSupportedError'
  }
}
