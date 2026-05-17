// POST /api/watchlist/[listingId]/refresh
//
// Per-listing analysis refresh for the watchlist expanded-panel interaction.
// Called when the user clicks a collapsed WatchlistRow — never called on page
// mount, never called on a schedule, never called from background code.
//
// What it does:
//   1. Auth + ownership check (user must have the listing in their watchlist)
//   2. Re-fetches live data from source platform if the listing is stale (same TTL as /analyze)
//   3. Re-runs computeCompsV2 against the current comp pool
//   4. Reads the latest listing_analyses.findings for watch-for items
//   5. Builds a template-based reasoning paragraph
//   6. Updates watchlist.updated_at = now() for freshness tracking
//   7. Returns all data needed to render the expanded panel
//
// SAFETY: This endpoint is called exclusively from WatchlistRow.handleRowClick(),
// which only fires on an explicit user click event. No bulk invocation is possible
// from the watchlist page — each call is scoped to a single listingId.
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { computeCompsV2 } from '@/lib/comp-engine-v2'
import { buildReasoning } from '@/lib/watchlist/reasoning'
import { parseListing } from '@/lib/listing-parser'
import { shouldRefetch, toCacheStatus } from '@/lib/listing-cache'

type FindingItem = {
  rule_id: string
  category: string
  severity: 'positive' | 'caution' | 'concern'
  title: string
  body: string
  qualifier: string | null
}

const FINDING_SEVERITY_MAP: Record<FindingItem['severity'], 'high' | 'moderate' | 'low'> = {
  concern: 'high',
  caution: 'moderate',
  positive: 'low',
}

function makeAdmin() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(
  _request: NextRequest,
  { params }: { params: { listingId: string } },
) {
  const { listingId } = params

  if (!listingId) {
    return NextResponse.json({ error: 'Missing listingId' }, { status: 400 })
  }

  // Auth check
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const supabaseAdmin = makeAdmin()

  // Ownership check: listing must be in this user's watchlist
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: watchlistRow } = await (supabaseAdmin as any)
    .from('watchlist')
    .select('id')
    .eq('user_id', user.id)
    .eq('listing_id', listingId)
    .maybeSingle() as { data: { id: string } | null }

  if (!watchlistRow) {
    return NextResponse.json({ error: 'Listing not found in watchlist' }, { status: 404 })
  }

  // Fetch the listing for reasoning context (high_bid, final_price, listing_status, etc.)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: listing, error: listingError } = await (supabaseAdmin as any)
    .from('listings')
    .select('id, year, make, model, trim, high_bid, final_price, listing_status, auction_ends_at, mileage, exterior_color, source_url, cache_status, last_fetched_at')
    .eq('id', listingId)
    .single() as {
      data: {
        id: string
        year: number | null
        make: string | null
        model: string | null
        trim: string | null
        high_bid: number | null
        final_price: number | null
        listing_status: string | null
        auction_ends_at: string | null
        mileage: number | null
        exterior_color: string | null
        source_url: string
        cache_status: string
        last_fetched_at: string | null
      } | null
      error: { message: string } | null
    }

  if (listingError || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  // Re-fetch from source platform if the listing is live and the cache is stale.
  // Mirrors the same TTL logic used by /analyze and the batch watchlist refresher.
  let activeBid    = listing.high_bid
  let activeStatus = listing.listing_status
  let activeFinal  = listing.final_price

  if (shouldRefetch({ cache_status: listing.cache_status, last_fetched_at: listing.last_fetched_at })) {
    try {
      const fetchResult = await parseListing(listing.source_url)
      if (fetchResult.success) {
        const fresh = fetchResult.listing
        activeBid    = fresh.high_bid_cents
        activeStatus = fresh.listing_status
        activeFinal  = fresh.sold_price_cents ?? null

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabaseAdmin as any)
          .from('listings')
          .update({
            listing_status:   fresh.listing_status,
            final_price:      fresh.sold_price_cents,
            high_bid:         fresh.high_bid_cents,
            auction_ends_at:  fresh.auction_end_date,
            last_verified_at: new Date().toISOString(),
            last_fetched_at:  new Date().toISOString(),
            cache_status:     toCacheStatus(fresh.listing_status),
          })
          .eq('id', listingId)
      }
    } catch (e) {
      // Non-fatal — fall back to cached values so the panel still renders
      console.error('[watchlist per-listing refresh] parseListing failed:', e instanceof Error ? e.message : String(e))
    }
  }

  // Re-run comp engine against current pool
  let compsResult = null
  try {
    compsResult = await computeCompsV2(listingId)
  } catch (e) {
    // Non-fatal — return empty comps rather than a 500 so the panel still renders
    console.error('[watchlist refresh] computeCompsV2 failed:', e instanceof Error ? e.message : String(e))
  }

  // Resolve oldest comp date from the comp listing IDs
  let oldestCompDate: string | null = null
  if (compsResult && compsResult.comps_used.length > 0) {
    const compIds = compsResult.comps_used.map((c) => c.listing_id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: compDates } = await (supabaseAdmin as any)
      .from('listings')
      .select('auction_ends_at')
      .in('id', compIds)
      .not('auction_ends_at', 'is', null)
      .order('auction_ends_at', { ascending: true })
      .limit(1) as { data: Array<{ auction_ends_at: string }> | null }
    oldestCompDate = compDates?.[0]?.auction_ends_at ?? null
  }

  // Fetch latest findings from listing_analyses for watch-for items
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: analysisRow } = await (supabaseAdmin as any)
    .from('listing_analyses')
    .select('findings')
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle() as { data: { findings: FindingItem[] } | null }

  const rawFindings: FindingItem[] = Array.isArray(analysisRow?.findings)
    ? (analysisRow!.findings as FindingItem[])
    : []

  // Map findings to watch-for items (concern > caution; exclude positive)
  const watchForItems = rawFindings
    .filter((f) => f.severity === 'concern' || f.severity === 'caution')
    .sort((a, b) => {
      const order = { concern: 0, caution: 1, positive: 2 }
      return order[a.severity] - order[b.severity]
    })
    .slice(0, 3)
    .map((f) => ({
      title: f.title,
      severity: FINDING_SEVERITY_MAP[f.severity],
      description: f.body,
    }))

  // Build template reasoning paragraph using live values (post-fetch if applicable)
  const reasoning = buildReasoning({
    listing: {
      year: listing.year,
      make: listing.make,
      model: listing.model,
      trim: listing.trim,
      listing_status: activeStatus,
      high_bid:       activeBid,
      final_price:    activeFinal,
    },
    comps: {
      predicted_median: compsResult?.predicted_median ?? null,
      predicted_p25:    compsResult?.predicted_p25    ?? null,
      predicted_p75:    compsResult?.predicted_p75    ?? null,
      comp_count:       compsResult?.comp_count        ?? 0,
      oldest_comp_date: oldestCompDate,
      verdict:          compsResult?.verdict           ?? null,
    },
    topWatchItem: watchForItems[0] ?? null,
  })

  // Update watchlist.updated_at for freshness tracking
  // The trigger fires on UPDATE and sets updated_at = now(), but we set it explicitly
  // here so the response value matches what was written.
  const updatedAt = new Date().toISOString()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabaseAdmin as any)
    .from('watchlist')
    .update({ updated_at: updatedAt })
    .eq('user_id', user.id)
    .eq('listing_id', listingId)

  return NextResponse.json({
    current_bid:      activeBid,
    comp_median:      compsResult?.predicted_median ?? null,
    comp_p25:         compsResult?.predicted_p25    ?? null,
    comp_p75:         compsResult?.predicted_p75    ?? null,
    comp_count:       compsResult?.comp_count        ?? 0,
    oldest_comp_date: oldestCompDate,
    verdict:          compsResult?.verdict           ?? null,
    watch_for_items:  watchForItems,
    reasoning,
    updated_at:       updatedAt,
  }, { status: 200 })
}
