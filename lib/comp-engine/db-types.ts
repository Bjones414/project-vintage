// Shape of a row returned from comp_results table.
// Kept separate so pages can import the type without pulling in DB logic.
export interface CompResultRow {
  id: string
  listing_id: string
  tier: 'strict' | 'wide' | 'insufficient'
  comp_count: number
  fair_value_low_cents: number | null
  fair_value_median_cents: number | null
  fair_value_high_cents: number | null
  most_recent_comp_sold_at: string | null
  oldest_comp_sold_at: string | null
  comp_listing_ids: string[]
  computed_at: string
}
