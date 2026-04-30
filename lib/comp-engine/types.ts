export type CompTier = 'strict' | 'wide' | 'insufficient'

export interface FairValueRange {
  low_cents: number
  median_cents: number
  high_cents: number
}

export interface CompCandidate {
  listing_id: string
  year: number
  make: string
  model: string
  trim: string | null
  mileage: number | null
  sold_price_cents: number
  sold_at: string // ISO 8601
  source_url: string | null
  source_platform: string
  body_class: string | null
  generation_id: string
}

export interface CompResult {
  listing_id: string
  tier: CompTier
  comp_count: number
  fair_value: FairValueRange | null
  most_recent_comp_sold_at: string | null
  oldest_comp_sold_at: string | null
  comp_listing_ids: string[]
}

export interface SubjectListing {
  id: string
  generation_id: string
  mileage: number | null
  body_class: string | null
  sold_at: string | null
}
