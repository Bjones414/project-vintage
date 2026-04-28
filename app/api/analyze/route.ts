// POST /api/analyze
// Accepts a listing URL, parses it into a CanonicalListing, upserts to the listings table,
// and returns the result. Enforces auth — free-tier rate limiting deferred to V1.5.
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { parseListing } from '@/lib/listing-parser'

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

  // Maps CanonicalListing → listings table columns.
  // Fields with no current DB column (engine, image_urls, bid_count, seller_info,
  // modification_notes, raw_data) are omitted — preserved in CanonicalListing for callers.
  // NOTE: onConflict: 'source_url' requires CREATE UNIQUE INDEX listings_source_url_idx
  // ON listings(source_url) — add in the next migration.
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
    listing_status: listing.listing_status,
    reserve_met: listing.reserve_met,
    ended_date: listing.auction_end_date,
    raw_description: listing.description,
  }

  const { error: upsertError } = await supabaseAdmin
    .from('listings')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .upsert(row as any, { onConflict: 'source_url' })

  if (upsertError) {
    return NextResponse.json(
      { error: `Database error: ${upsertError.message}` },
      { status: 500 }
    )
  }

  return NextResponse.json({ listing }, { status: 200 })
}
