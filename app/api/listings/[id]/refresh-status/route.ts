// POST /api/listings/[id]/refresh-status
// Re-fetches the listing page at or near T-0 and updates listing_status, final_price,
// and auction_ends_at. Called by the client-side AuctionCountdown component once at T-0.
// No auth required — anonymous clients may call this.
//
// TODO (Task 8): Add per-IP rate limiting before launch. No rate limit middleware
// (Upstash, Vercel, etc.) exists in this repo yet. Without it a client can spam this
// endpoint. One call per listing per session is the intended usage pattern.
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { parseListing } from '@/lib/listing-parser'

const TEN_MINUTES_MS = 10 * 60 * 1000

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // 1. Look up the listing
  const { data: listing, error: lookupError } = await supabaseAdmin
    .from('listings')
    .select('id, source_url, auction_ends_at')
    .eq('id', id)
    .maybeSingle()

  if (lookupError || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  // 2. Guard: only re-fetch at or near T-0 (within 10 minutes of end time)
  if (
    !listing.auction_ends_at ||
    new Date(listing.auction_ends_at).getTime() > Date.now() + TEN_MINUTES_MS
  ) {
    return NextResponse.json(
      { refreshed: false, reason: 'Auction not yet ended or end time unknown' },
      { status: 200 },
    )
  }

  // 3. Re-fetch and re-parse the source page
  const result = await parseListing(listing.source_url)
  if (!result.success) {
    return NextResponse.json(
      { refreshed: false, reason: result.error },
      { status: 200 },
    )
  }

  const { listing: fresh } = result

  // 4. Write fresh status + price + end time, and record this as a verification event
  const { error: updateError } = await supabaseAdmin
    .from('listings')
    .update({
      listing_status: fresh.listing_status,
      final_price: fresh.sold_price_cents,
      auction_ends_at: fresh.auction_end_date,
      last_verified_at: new Date().toISOString(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    .eq('id', id)

  if (updateError) {
    return NextResponse.json(
      { refreshed: false, reason: `Database error: ${updateError.message}` },
      { status: 200 },
    )
  }

  // 5. Return the updated row so the client can reflect the final state immediately
  const { data: updated } = await supabaseAdmin
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  return NextResponse.json({ refreshed: true, listing: updated }, { status: 200 })
}
