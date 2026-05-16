// /watchlist — user's watched listings with click-to-expand-to-refresh per row.
//
// COMPLIANCE: no bulk refresh on page mount, no background polling.
// The page reads stored data (watchlist rows + latest comp_results) and renders
// collapsed WatchlistRow components. Analysis refresh fires only when the user
// explicitly clicks a row. See WatchlistRow and /api/watchlist/[listingId]/refresh.
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { matchDefects } from '@/lib/originality'
import { selectTopThree } from '@/lib/watch-for/select-top-three'
import { filterGenerationItems } from '@/lib/watch-for/filter-generation-items'
import { WatchlistRow } from '@/components/watchlist/WatchlistRow'
import { EmptyState } from '@/components/watchlist/EmptyState'

export const metadata = { title: 'Watchlist — Project Vintage' }

type WatchlistListing = {
  id: string
  year: number | null
  make: string | null
  model: string | null
  trim: string | null
  exterior_color: string | null
  interior_color: string | null
  mileage: number | null
  high_bid: number | null
  final_price: number | null
  listing_status: string | null
  auction_ends_at: string | null
  source_url: string
  source_platform: string
  generation_id: string | null
}

type WatchlistRowData = {
  id: string
  listing_id: string
  created_at: string
  updated_at: string
  listings: WatchlistListing
}

type CompResultData = {
  listing_id: string
  comp_count: number
  fair_value_low_cents: number | null
  fair_value_median_cents: number | null
  fair_value_high_cents: number | null
  computed_at: string
}

export default async function WatchlistPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login?next=/watchlist')
  }

  const supabaseAdmin = createAdminClient()

  // Load watchlist rows with listing data (service-role to bypass RLS on listings)
  const { data: watchlistRows, error: watchlistError } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabaseAdmin as any)
      .from('watchlist')
      .select(`
        id,
        listing_id,
        created_at,
        updated_at,
        listings (
          id,
          year,
          make,
          model,
          trim,
          exterior_color,
          interior_color,
          mileage,
          high_bid,
          final_price,
          listing_status,
          auction_ends_at,
          source_url,
          source_platform,
          generation_id
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false }) as unknown as Promise<{
        data: WatchlistRowData[] | null
        error: { message: string } | null
      }>
  )
  console.log('[DEBUG watchlist page]', { userId: session.user.id, count: watchlistRows?.length ?? 0, error: watchlistError?.message ?? null })

  const items = (watchlistRows ?? []).filter(
    (w): w is WatchlistRowData => w.listings != null,
  )

  // Pre-compute generation-level watch-for items for each listing using the defect catalog.
  // Used as a fallback in ExpandedPanel when a listing has no per-listing analysis flags.
  // matchDefects is synchronous and the catalog is cached after first load.
  const generationWatchForItemsMap = new Map<string, Array<{ title: string; severity: 'high' | 'moderate' | 'low'; description: string }>>()
  for (const item of items) {
    const genId = item.listings.generation_id
    if (genId && !generationWatchForItemsMap.has(genId)) {
      generationWatchForItemsMap.set(
        genId,
        selectTopThree(filterGenerationItems(matchDefects({ generation_id: genId, engine_family: null, year: null, mileage: null })))
          .map(w => ({ title: w.title, severity: w.severity, description: w.description })),
      )
    }
  }

  // Load latest comp_results for all watched listings (one per listing)
  // Used for initial verdict pill state — no analysis is re-run on page load.
  const listingIds = items.map((w) => w.listing_id)

  const compResultsMap = new Map<string, CompResultData>()
  if (listingIds.length > 0) {
    const { data: compRows } = await (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabaseAdmin as any)
        .from('comp_results')
        .select(
          'listing_id, comp_count, fair_value_low_cents, fair_value_median_cents, fair_value_high_cents, computed_at',
        )
        .in('listing_id', listingIds)
        .order('computed_at', { ascending: false }) as unknown as Promise<{
          data: CompResultData[] | null
        }>
    )
    for (const row of compRows ?? []) {
      if (!compResultsMap.has(row.listing_id)) {
        compResultsMap.set(row.listing_id, row)
      }
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
      {/* Page chrome */}
      <div className="mb-12 flex items-start justify-between">
        <div>
          {/* Eyebrow */}
          <p
            className="mb-3 font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary"
            style={{ fontWeight: 500 }}
          >
            The watchlist
          </p>
          {/* Headline */}
          <h1
            className="font-serif text-[42px] text-text-primary"
            style={{ lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: 400 }}
          >
            What you&rsquo;re watching.
          </h1>
          {/* Dek */}
          <p
            className="mt-3 max-w-[520px] font-serif text-[17px] italic text-text-secondary"
            style={{ lineHeight: '1.55' }}
          >
            The cars you&rsquo;re keeping an eye on. We&rsquo;ll surface what moves on each one back on your home.
          </p>
        </div>

        {/* Secondary link — aligned with chrome */}
        <Link
          href="/analyze"
          className="mt-1 shrink-0 font-serif text-[14px] italic text-accent-primary underline decoration-[0.5px] underline-offset-2 hover:opacity-70"
        >
          Analyze a new listing →
        </Link>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          {items.map((w) => (
            <WatchlistRow
              key={w.id}
              watchlistId={w.id}
              listingId={w.listing_id}
              listing={w.listings}
              watchedAt={w.created_at}
              updatedAt={w.updated_at}
              initialComp={compResultsMap.get(w.listing_id) ?? null}
              generationWatchForItems={generationWatchForItemsMap.get(w.listings.generation_id ?? '') ?? []}
            />
          ))}
        </div>
      )}
    </main>
  )
}
