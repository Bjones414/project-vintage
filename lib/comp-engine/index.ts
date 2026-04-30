import { createClient } from '@supabase/supabase-js'
import type { CompResult } from './types'
import { fetchGenerationPool, selectComps } from './select-comps'
import { recencyWeight } from './recency-weight'
import { computeFairValue } from './fair-value'

export type { CompResult, CompTier, FairValueRange, CompCandidate } from './types'
export { recencyWeight, monthsAgo } from './recency-weight'
export { computeFairValue } from './fair-value'
export { fetchGenerationPool, selectComps } from './select-comps'

function makeAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function computeComps(listingId: string): Promise<CompResult> {
  const admin = makeAdmin()

  // Fetch subject listing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: subject, error: subjectError } = await (admin as any)
    .from('listings')
    .select('id, generation_id, mileage, decoded_body_class, auction_ends_at')
    .eq('id', listingId)
    .single() as { data: { id: string; generation_id: string | null; mileage: number | null; decoded_body_class: string | null; auction_ends_at: string | null } | null; error: { message: string } | null }

  if (subjectError || !subject) {
    throw new Error(`[comp-engine] listing not found: ${listingId}`)
  }

  if (!subject.generation_id) {
    const result: CompResult = {
      listing_id: listingId,
      tier: 'insufficient',
      comp_count: 0,
      fair_value: null,
      most_recent_comp_sold_at: null,
      oldest_comp_sold_at: null,
      comp_listing_ids: [],
    }
    await persistCompResult(admin, result)
    return result
  }

  const subjectNorm = {
    id: subject.id,
    generation_id: subject.generation_id,
    mileage: subject.mileage ?? null,
    body_class: subject.decoded_body_class ?? null,
    sold_at: subject.auction_ends_at ?? null,
  }

  const pool = await fetchGenerationPool(subject.generation_id, listingId)
  const { tier, comps } = selectComps(subjectNorm, pool)

  if (tier === 'insufficient' || comps.length === 0) {
    const result: CompResult = {
      listing_id: listingId,
      tier: 'insufficient',
      comp_count: comps.length,
      fair_value: null,
      most_recent_comp_sold_at: comps[0]?.sold_at ?? null,
      oldest_comp_sold_at: comps.at(-1)?.sold_at ?? null,
      comp_listing_ids: comps.map(c => c.listing_id),
    }
    await persistCompResult(admin, result)
    return result
  }

  const asOf = new Date()
  const weighted = comps.map(c => ({
    price_cents: c.sold_price_cents,
    weight: recencyWeight(c.sold_at, asOf),
  }))

  const fair_value = computeFairValue(weighted)

  const sorted = [...comps].sort(
    (a, b) => new Date(b.sold_at).getTime() - new Date(a.sold_at).getTime(),
  )

  const result: CompResult = {
    listing_id: listingId,
    tier,
    comp_count: comps.length,
    fair_value,
    most_recent_comp_sold_at: sorted[0]?.sold_at ?? null,
    oldest_comp_sold_at: sorted.at(-1)?.sold_at ?? null,
    comp_listing_ids: comps.map(c => c.listing_id),
  }

  await persistCompResult(admin, result)
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function persistCompResult(admin: ReturnType<typeof createClient<any>>, result: CompResult): Promise<void> {
  const { error } = await (admin as any).from('comp_results').insert({
    listing_id: result.listing_id,
    tier: result.tier,
    comp_count: result.comp_count,
    fair_value_low_cents: result.fair_value?.low_cents ?? null,
    fair_value_median_cents: result.fair_value?.median_cents ?? null,
    fair_value_high_cents: result.fair_value?.high_cents ?? null,
    most_recent_comp_sold_at: result.most_recent_comp_sold_at,
    oldest_comp_sold_at: result.oldest_comp_sold_at,
    comp_listing_ids: result.comp_listing_ids,
  })

  if (error) {
    console.error('[comp-engine] failed to persist comp_result', {
      listing_id: result.listing_id,
      error: error.message,
    })
  }
}
