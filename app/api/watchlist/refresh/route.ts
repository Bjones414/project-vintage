// POST /api/watchlist/refresh
// Re-fetches stale live listings from the user's watchlist — one at a time, with delays.
//
// SAFETY PRINCIPLE: This endpoint is called exclusively when a user loads their watchlist
// page. It is never called on a schedule, never called in the background, and never
// called automatically. If a user never opens their watchlist, these listings never refresh.
//
// Batch behavior:
//   - Fetches are sequential — never parallel. Promise.all is intentionally absent.
//   - A 2–3 second random delay separates each fetch (batchRefreshDelayMs).
//   - This mimics normal browsing and avoids rate-limit triggers on source platforms.
//
// Authorization: caller must own all requested listing_ids (validated against their watchlist).
// Unknown or unowned IDs are silently skipped.
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { parseListing } from '@/lib/listing-parser'
import { shouldRefetch, toCacheStatus, batchRefreshDelayMs } from '@/lib/listing-cache'

type ListingRow = {
  id: string
  source_url: string
  cache_status: string
  last_fetched_at: string | null
  listing_status: string | null
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be JSON' }, { status: 400 })
  }
  const { listing_ids } = (body ?? {}) as Record<string, unknown>
  if (!Array.isArray(listing_ids) || listing_ids.length === 0) {
    return NextResponse.json({ refreshed: 0, promoted: 0, errors: [] }, { status: 200 })
  }
  const requestedIds = listing_ids.filter((id): id is string => typeof id === 'string')
  if (requestedIds.length === 0) {
    return NextResponse.json({ refreshed: 0, promoted: 0, errors: [] }, { status: 200 })
  }

  // Verify ownership: only refresh listings the user has saved.
  const { data: ownedItems } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from('watchlist')
      .select('listing_id')
      .in('listing_id', requestedIds) as unknown as Promise<{
        data: Array<{ listing_id: string }> | null
      }>
  )

  const ownedIds = new Set((ownedItems ?? []).map(w => w.listing_id))
  const safeIds = requestedIds.filter(id => ownedIds.has(id))

  if (safeIds.length === 0) {
    return NextResponse.json({ refreshed: 0, promoted: 0, errors: [] }, { status: 200 })
  }

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data: listingRows } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabaseAdmin as any)
      .from('listings')
      .select('id, source_url, cache_status, last_fetched_at, listing_status')
      .in('id', safeIds) as unknown as Promise<{
        data: ListingRow[] | null
      }>
  )

  const rows = listingRows ?? []

  let refreshedCount = 0
  let promotedCount = 0
  const errors: string[] = []

  // Sequential refresh with delay between each request.
  // DO NOT convert this to Promise.all or any parallel form.
  // Sequential + random delay = indistinguishable from normal user browsing behavior.
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]

    // Double-check staleness — another user action may have already refreshed this
    if (!shouldRefetch(row)) continue

    // Delay before every fetch after the first, to avoid consecutive requests
    if (i > 0) {
      await new Promise<void>(resolve => setTimeout(resolve, batchRefreshDelayMs()))
    }

    const result = await parseListing(row.source_url)
    if (!result.success) {
      errors.push(`${row.id}: ${result.error}`)
      continue
    }

    const { listing } = result
    const wasLive = row.listing_status === 'live'
    const nowPermanent =
      listing.listing_status === 'sold' || listing.listing_status === 'no-sale'

    // Update status, price, bid, and cache metadata.
    // Full re-analysis (VIN decode, findings, comps) is not re-run here — watchlist
    // refresh is a status + price check. Full analysis runs when the user re-pastes the URL.
    const { error: updateError } = await (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabaseAdmin as any)
        .from('listings')
        .update({
          listing_status: listing.listing_status,
          final_price: listing.sold_price_cents,
          high_bid: listing.high_bid_cents,
          auction_ends_at: listing.auction_end_date,
          last_verified_at: new Date().toISOString(),
          last_fetched_at: new Date().toISOString(),
          // Status promotion: once sold/no-sale, the listing is permanently cached.
          // This is a one-way transition — permanent listings are never downgraded.
          cache_status: toCacheStatus(listing.listing_status),
        })
        .eq('id', row.id) as unknown as Promise<{
          error: { message: string } | null
        }>
    )

    if (updateError) {
      errors.push(`${row.id}: database error — ${updateError.message}`)
      continue
    }

    refreshedCount++
    if (wasLive && nowPermanent) {
      promotedCount++
    }
  }

  return NextResponse.json(
    { refreshed: refreshedCount, promoted: promotedCount, errors },
    { status: 200 },
  )
}
