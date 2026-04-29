// POST /api/analyze
// Accepts a listing URL, parses it into a CanonicalListing, upserts to the listings table,
// creates a listing_analyses row, and returns { listingId, listing }.
// Enforces auth — free-tier rate limiting deferred to V1.5.
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { parseListing } from '@/lib/listing-parser'
import { decodeVin } from '@/lib/vin-decode/nhtsa'
import { matchGeneration } from '@/lib/generation-match'
import { runFindingsRules } from '@/lib/findings'

export async function POST(request: NextRequest) {
  // Validate body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be JSON' }, { status: 400 })
  }
  if (typeof body !== 'object' || body === null || !('url' in body)) {
    return NextResponse.json({ error: 'Missing required field: url' }, { status: 400 })
  }
  const { url } = body as Record<string, unknown>
  if (typeof url !== 'string' || url.trim() === '') {
    return NextResponse.json({ error: 'url must be a non-empty string' }, { status: 400 })
  }

  // Check auth
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  // TODO Task 6: When implementing analyze page gates, watch-list limits, and report counters,
  // bypass all gates for users with role IN ('admin', 'beta'). Member accounts get the full
  // V1 free-tier limits.
  // Load the user's profile here: supabase.from('users').select('role, subscription_tier').eq('id', session.user.id).single()

  // Parse listing
  const result = await parseListing(url.trim())
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 422 })
  }

  const { listing } = result

  // Require the fields the DB schema marks NOT NULL before attempting upsert
  if (!listing.make || !listing.model || listing.year === null) {
    return NextResponse.json(
      { error: 'Could not extract required fields (make, model, year) from listing' },
      { status: 422 }
    )
  }

  // Upsert via service-role client (bypasses RLS — writes to listings are service-role only)
  // NOTE: Supabase DB types are a placeholder (Database = unknown) until `supabase gen types`
  // is run against the real project. Casting through unknown here is safe — remove when typed.
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // VIN decode: runs after parse, before upsert. Returns null for pre-1981 chassis
  // (non-17-char VINs), malformed VINs, and NHTSA errors — analyze flow continues
  // regardless. Not moved to a background job yet; awaited in-request per spec.
  const decoded = listing.vin ? await decodeVin(listing.vin) : null

  // Generation matching: uses decoded VIN data + parsed title to assign a
  // porsche_generations.generation_id. Errors or null results do not fail the flow.
  const generationResult = await matchGeneration({
    decoded_year:       decoded?.year         ?? null,
    decoded_make:       decoded?.make         ?? null,
    decoded_model:      decoded?.model        ?? null,
    decoded_body_class: decoded?.body_class   ?? null,
    parsed_title:       listing.title         ?? null,
    parsed_model_family: null,  // Phase 3 BaT parser does not extract model_family yet
  })

  if (generationResult.needs_review) {
    console.warn('[api/analyze] generation match needs review', {
      source_url: listing.source_url,
      input: {
        decoded_year:       decoded?.year         ?? null,
        decoded_make:       decoded?.make         ?? null,
        decoded_model:      decoded?.model        ?? null,
        decoded_body_class: decoded?.body_class   ?? null,
        parsed_title:       listing.title         ?? null,
      },
      result: generationResult,
    })
  }

  // Maps CanonicalListing → listings table columns.
  // Fields with no current DB column (engine, image_urls, bid_count, seller_info,
  // modification_notes, raw_data) are omitted — preserved in CanonicalListing for callers.
  // onConflict: keyed on the unique constraint (source_platform, source_listing_id)
  // from SCHEMA.md. source_url alone does not have a unique index.
  const row = {
    source_platform: listing.source_platform,
    source_url: listing.source_url,
    source_listing_id: listing.source_listing_id,
    make: listing.make,
    model: listing.model,
    year: listing.year,
    trim: listing.trim,
    vin: listing.vin,
    mileage: listing.mileage,
    transmission: listing.transmission,
    exterior_color: listing.exterior_color,
    interior_color: listing.interior_color,
    final_price: listing.sold_price_cents,
    high_bid: listing.high_bid_cents,
    listing_status: listing.listing_status,
    reserve_met: listing.reserve_met,
    has_no_reserve: listing.has_no_reserve,
    ended_date: listing.auction_end_date,
    auction_ends_at: listing.auction_end_date,
    last_verified_at: new Date().toISOString(),
    raw_description: listing.description,
    // Generation match — only written when a non-null generation was resolved, so
    // existing values are not overwritten with null on re-analysis of a listing
    // where generation matching fails (e.g., unsupported marque).
    ...(generationResult.generation_id !== null && {
      generation_id: generationResult.generation_id,
    }),
    // VIN decode fields — only written when decode succeeded; omitted otherwise so
    // existing values (if any) are not overwritten with nulls on re-analysis.
    ...(decoded !== null && {
      decoded_year: decoded.year,
      decoded_make: decoded.make,
      decoded_model: decoded.model,
      decoded_body_class: decoded.body_class,
      decoded_engine: decoded.engine,
      decoded_plant: decoded.plant,
      decoded_transmission: decoded.transmission,
      vin_decode_raw: decoded.raw,
    }),
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upsertResult = await (supabaseAdmin
    .from('listings')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .upsert(row as any, { onConflict: 'source_platform,source_listing_id' })
    .select('id')
    .single() as unknown as Promise<{ data: { id: string } | null; error: { message: string } | null }>)
  const { data: upsertData, error: upsertError } = upsertResult

  if (upsertError || !upsertData) {
    return NextResponse.json(
      { error: `Database error: ${upsertError?.message ?? 'Failed to retrieve listing id after upsert'}` },
      { status: 500 }
    )
  }

  const listingId = upsertData.id

  const findings = runFindingsRules({
    listing,
    generationId: generationResult.generation_id,
  })

  // Record this analysis run. Non-fatal: a failure here does not block the redirect.
  // analysis_data stores parse metadata; comp engine output will enrich this in a later phase.
  const analysisResult = await (supabaseAdmin
    .from('listing_analyses')
    .insert({
      user_id: session.user.id,
      listing_id: listingId,
      source_url: listing.source_url,
      source_platform: listing.source_platform,
      analysis_data: {
        parsed_at: new Date().toISOString(),
        listing_status: listing.listing_status,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      findings: findings as any,
      finding_count: findings.length,
    }) as unknown as Promise<{ error: { message: string } | null }>)
  const { error: analysisError } = analysisResult

  if (analysisError) {
    console.error('[api/analyze] listing_analyses insert failed (non-fatal)', {
      listing_id: listingId,
      error: analysisError.message,
    })
  }

  return NextResponse.json({ listingId, listing }, { status: 200 })
}
