// /watchlist — user's saved listings with lazy refresh of stale live entries.
//
// SAFETY: When this page loads, stale live listings (cache_status = 'live' and
// last_fetched_at older than 1 hour) are queued for refresh via WatchlistRefresher.
// The refresh runs sequentially, with 2–3 second delays, triggered only by the
// user loading this page. Not by any cron, webhook, or background job.
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { isStale } from '@/lib/listing-cache'
import { WatchlistRefresher } from '@/components/watchlist/WatchlistRefresher'
import { WatchlistCard } from '@/components/watchlist/WatchlistCard'

export const metadata = { title: 'Watchlist — Project Vintage' }

type WatchlistListing = {
  id: string
  year: number | null
  make: string | null
  model: string | null
  trim: string | null
  mileage: number | null
  final_price: number | null
  high_bid: number | null
  listing_status: string | null
  cache_status: string
  last_fetched_at: string | null
  source_platform: string
  source_url: string
}

type WatchlistRow = {
  id: string
  created_at: string
  listing_id: string
  listings: WatchlistListing
}

export default async function WatchlistPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login?next=/watchlist')
  }

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Load watchlist items with listing data.
  // Service-role client reads listing cache fields without RLS interference.
  const { data: watchlistRows } = await (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabaseAdmin as any)
      .from('watchlist')
      .select(`
        id,
        created_at,
        listing_id,
        listings (
          id,
          year,
          make,
          model,
          trim,
          mileage,
          final_price,
          high_bid,
          listing_status,
          cache_status,
          last_fetched_at,
          source_platform,
          source_url
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false }) as unknown as Promise<{
        data: WatchlistRow[] | null
      }>
  )

  const items: WatchlistRow[] = (watchlistRows ?? []).filter(
    (w): w is WatchlistRow => w.listings != null,
  )

  // Identify stale live listings — these will be refreshed by WatchlistRefresher.
  // We pass only IDs to the client component; it calls /api/watchlist/refresh with them.
  const staleListingIds = items
    .filter(w => w.listings.cache_status === 'live' && isStale(w.listings.last_fetched_at))
    .map(w => w.listings.id)

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
      <div className="mb-6 flex items-baseline gap-4">
        <h1 className="font-serif text-h1 text-text-primary">Watchlist</h1>
        {staleListingIds.length > 0 && (
          // Rendered inline near the heading — disappears after router.refresh() fires
          <WatchlistRefresher staleListingIds={staleListingIds} />
        )}
      </div>

      {items.length === 0 ? (
        <div className="border-[0.5px] border-[#D4CFC0] px-8 py-12 text-center">
          <p className="font-serif text-[15px] italic text-text-tertiary">
            No saved listings yet.
          </p>
          <p className="mt-2 font-sans text-[13px] text-text-muted">
            After analyzing a listing, use the save button to add it here.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block font-sans text-[13px] text-[#8B6914] hover:opacity-70"
          >
            Analyze a listing →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(w => (
            <WatchlistCard key={w.id} listing={w.listings} />
          ))}
        </div>
      )}
    </main>
  )
}
