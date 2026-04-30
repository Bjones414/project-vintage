import { createClient } from '@supabase/supabase-js'
import type { CompCandidate, SubjectListing } from './types'
import { monthsAgo } from './recency-weight'

// Strict tier: same generation, same body_class (when both known), mileage ±30%, sold ≤24mo
// Wide tier: same generation, any body_class, any mileage, sold ≤36mo
// Both exclude the subject listing itself.

const STRICT_MILEAGE_BAND = 0.30
const STRICT_MAX_MONTHS = 24
const WIDE_MAX_MONTHS = 36
const STRICT_MIN_COUNT = 5
const WIDE_MIN_COUNT = 3

function makeAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// Fetch all listings in the same generation with a final_price, sold, and sold date.
// Returns up to 500 candidates sorted by auction_ends_at desc.
export async function fetchGenerationPool(
  generationId: string,
  excludeListingId: string,
): Promise<CompCandidate[]> {
  const admin = makeAdmin()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from('listings')
    .select(
      'id, year, make, model, trim, mileage, final_price, auction_ends_at, source_url, source_platform, decoded_body_class, generation_id',
    )
    .eq('generation_id', generationId)
    .eq('listing_status', 'sold')
    .not('final_price', 'is', null)
    .not('auction_ends_at', 'is', null)
    .neq('id', excludeListingId)
    .order('auction_ends_at', { ascending: false })
    .limit(500) as { data: Array<{ id: string; year: number | null; make: string | null; model: string | null; trim: string | null; mileage: number | null; final_price: number | null; auction_ends_at: string | null; source_url: string | null; source_platform: string; decoded_body_class: string | null; generation_id: string | null }> | null; error: { message: string } | null }

  if (error) throw new Error(`[comp-engine] fetchGenerationPool error: ${error.message}`)

  const now = new Date()
  return (data ?? [])
    .filter(row => {
      const mo = monthsAgo(row.auction_ends_at!, now)
      return mo <= WIDE_MAX_MONTHS
    })
    .map(row => ({
      listing_id: row.id,
      year: row.year!,
      make: row.make!,
      model: row.model!,
      trim: row.trim ?? null,
      mileage: row.mileage ?? null,
      sold_price_cents: row.final_price!,
      sold_at: row.auction_ends_at!,
      source_url: row.source_url ?? null,
      source_platform: row.source_platform,
      body_class: row.decoded_body_class ?? null,
      generation_id: row.generation_id!,
    }))
}

export interface SelectCompsResult {
  tier: 'strict' | 'wide' | 'insufficient'
  comps: CompCandidate[]
}

export function selectComps(
  subject: SubjectListing,
  pool: CompCandidate[],
  asOf: Date = new Date(),
): SelectCompsResult {
  // Strict tier candidates
  const strictCandidates = pool.filter(c => {
    const mo = monthsAgo(c.sold_at, asOf)
    if (mo > STRICT_MAX_MONTHS) return false
    // Body class match: only enforce when both subject and comp have it
    if (subject.body_class && c.body_class) {
      if (normalizeBodyClass(c.body_class) !== normalizeBodyClass(subject.body_class)) return false
    }
    // Mileage band: only enforce when both have mileage
    if (subject.mileage != null && c.mileage != null) {
      const lo = subject.mileage * (1 - STRICT_MILEAGE_BAND)
      const hi = subject.mileage * (1 + STRICT_MILEAGE_BAND)
      if (c.mileage < lo || c.mileage > hi) return false
    }
    return true
  })

  if (strictCandidates.length >= STRICT_MIN_COUNT) {
    return { tier: 'strict', comps: strictCandidates }
  }

  // Wide fallback: all pool members pass (already filtered to ≤36mo above)
  if (pool.length >= WIDE_MIN_COUNT) {
    return { tier: 'wide', comps: pool }
  }

  return { tier: 'insufficient', comps: pool }
}

function normalizeBodyClass(raw: string): string {
  const s = raw.toLowerCase().trim()
  if (s.includes('convertible') || s.includes('cabriolet') || s.includes('cabrio')) return 'cabriolet'
  if (s.includes('targa')) return 'targa'
  if (s.includes('speedster')) return 'speedster'
  return 'coupe'
}
