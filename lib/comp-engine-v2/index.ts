// ============================================================
// Comp Engine V2 — Public Entry Point
//
// computeCompsV2: production entry point (loads config from DB,
// fetches pool, runs pipeline, logs run).
// ============================================================

import { createClient } from '@supabase/supabase-js'
import type { V2Subject, V2CompCandidate, V2CompsResult } from './types'
import { MODEL_VERSION } from './types'
import { loadEngineConfig } from './config-loader'
import { runCompEngineV2 } from './engine'
import { logCompRun } from './logger'

export type { V2CompsResult, V2Subject, V2CompCandidate, EngineConfig } from './types'
export { runCompEngineV2 } from './engine'
export { loadEngineConfig, loadAllConfigs } from './config-loader'
export { MODEL_VERSION } from './types'

function makeAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// Fetch all sold candidates for a generation (pool for the engine)
export async function fetchV2Pool(
  generationId: string,
  excludeListingId: string,
): Promise<V2CompCandidate[]> {
  const admin = makeAdmin()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any)
    .from('listings')
    .select([
      'id', 'year', 'mileage', 'final_price', 'auction_ends_at', 'generation_id',
      'trim_category', 'decoded_body_class', 'drivetrain',
      'trim_variant', 'market_region', 'is_paint_to_sample', 'seats_type',
      'wheels_factory_correct', 'transmission_variant', 'interior_color_rarity',
      'consignor_type', 'mechanical_remediation_status', 'auction_outcome',
      'paint_meter_max_microns', 'accident_history_stated',
      'listing_photo_count', 'is_featured_listing',
    ].join(', '))
    .eq('generation_id', generationId)
    .eq('listing_status', 'sold')
    .not('final_price', 'is', null)
    .not('auction_ends_at', 'is', null)
    .neq('id', excludeListingId)
    // Pre-filter: only include sold (not no_sale) listings per Stage 9
    .not('auction_outcome', 'eq', 'no_sale_reserve_not_met')
    .order('auction_ends_at', { ascending: false })
    .limit(500) as {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: Array<Record<string, any>> | null
      error: { message: string } | null
    }

  if (error) throw new Error(`[comp-engine-v2] fetchV2Pool error: ${error.message}`)

  const now = new Date()
  const MAX_MONTHS = 36

  return (data ?? [])
    .filter(row => {
      const months = (now.getTime() - new Date(row.auction_ends_at).getTime()) /
        (1000 * 60 * 60 * 24 * 30.4375)
      return months <= MAX_MONTHS
    })
    .map(row => ({
      listing_id: row.id,
      year: row.year,
      mileage: row.mileage,
      final_price_cents: row.final_price,
      sold_at: row.auction_ends_at,
      generation_id: row.generation_id,
      trim_category: row.trim_category,
      body_style: row.decoded_body_class,
      drivetrain: row.drivetrain,
      trim_variant: row.trim_variant,
      market_region: row.market_region,
      is_paint_to_sample: row.is_paint_to_sample,
      seats_type: row.seats_type,
      wheels_factory_correct: row.wheels_factory_correct,
      transmission_variant: row.transmission_variant,
      interior_color_rarity: row.interior_color_rarity,
      consignor_type: row.consignor_type,
      mechanical_remediation_status: row.mechanical_remediation_status,
      paint_meter_max_microns: row.paint_meter_max_microns,
      accident_history_stated: row.accident_history_stated,
      listing_photo_count: row.listing_photo_count,
      is_featured_listing: row.is_featured_listing,
    }))
}

export async function computeCompsV2(listingId: string): Promise<V2CompsResult> {
  const admin = makeAdmin()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: subject, error: subjectError } = await (admin as any)
    .from('listings')
    .select([
      'id', 'year', 'mileage', 'final_price', 'auction_ends_at', 'generation_id',
      'trim_category', 'decoded_body_class', 'drivetrain',
      'trim_variant', 'market_region', 'is_paint_to_sample', 'seats_type',
      'wheels_factory_correct', 'transmission_variant', 'interior_color_rarity',
      'consignor_type', 'mechanical_remediation_status',
      'paint_meter_max_microns', 'accident_history_stated',
      'listing_photo_count', 'is_featured_listing', 'is_comp_resistant',
    ].join(', '))
    .eq('id', listingId)
    .single() as {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: Record<string, any> | null
      error: { message: string } | null
    }

  if (subjectError || !subject) {
    throw new Error(`[comp-engine-v2] listing not found: ${listingId}`)
  }

  const generationId: string = subject.generation_id ?? 'default'
  const config = await loadEngineConfig(generationId)

  const pool = await fetchV2Pool(generationId, listingId)

  const subjectNorm: V2Subject = {
    id: subject.id,
    listing_id: subject.id,
    year: subject.year,
    mileage: subject.mileage,
    final_price_cents: subject.final_price ?? 0,
    sold_at: subject.auction_ends_at ?? '',
    generation_id: subject.generation_id,
    trim_category: subject.trim_category,
    body_style: subject.decoded_body_class,
    drivetrain: subject.drivetrain,
    trim_variant: subject.trim_variant,
    market_region: subject.market_region,
    is_paint_to_sample: subject.is_paint_to_sample,
    seats_type: subject.seats_type,
    wheels_factory_correct: subject.wheels_factory_correct,
    transmission_variant: subject.transmission_variant,
    interior_color_rarity: subject.interior_color_rarity,
    consignor_type: subject.consignor_type,
    mechanical_remediation_status: subject.mechanical_remediation_status,
    paint_meter_max_microns: subject.paint_meter_max_microns,
    accident_history_stated: subject.accident_history_stated,
    listing_photo_count: subject.listing_photo_count,
    is_featured_listing: subject.is_featured_listing,
    is_comp_resistant: subject.is_comp_resistant ?? false,
  }

  const result = runCompEngineV2(subjectNorm, pool, config)

  // Log every run, no exceptions
  await logCompRun(result, subjectNorm)

  return result
}
