/**
 * Listing cache system.
 *
 * SAFETY PRINCIPLE: Every fetch from a source platform (BaT, RM, Cars & Bids, etc.)
 * is triggered by a direct user action — never by a background job, scheduled task,
 * or automated refresh.
 *
 * - When a user pastes a URL, we may fetch.
 * - When a user loads an analyze page with a stale live listing, we may fetch.
 * - When a user loads their watchlist page with stale live listings, we may fetch
 *   (sequentially with delays).
 *
 * We never:
 * - Run scheduled refreshes via cron
 * - Refresh listings in the background
 * - Refresh listings on app startup
 * - Refresh listings via webhooks
 * - Refresh listings in parallel (batch operations are always sequential with delays)
 *
 * This keeps source platform traffic identical to legitimate user browsing patterns
 * and prevents IP-level rate limit triggers (Cloudflare on BaT, etc.).
 */

/** A live listing older than this is re-fetched on the next user-triggered view. */
export const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

/**
 * Returns true if last_fetched_at is null (never fetched) or older than CACHE_TTL_MS.
 * Callers checking 'permanent' listings should not call this — permanent rows are never stale.
 */
export function isStale(lastFetchedAt: string | null): boolean {
  if (lastFetchedAt === null) return true
  return Date.now() - new Date(lastFetchedAt).getTime() > CACHE_TTL_MS
}

/**
 * Returns true if the listing should be re-fetched from the source platform.
 *
 * Rules:
 *   'permanent' → never re-fetch (sold/no-sale state is final)
 *   'live' + fresh → serve from cache
 *   'live' + stale → trigger a fresh fetch
 */
export function shouldRefetch(row: {
  cache_status: string
  last_fetched_at: string | null
}): boolean {
  if (row.cache_status === 'permanent') return false
  return isStale(row.last_fetched_at)
}

/**
 * Maps a listing's live status to the appropriate cache_status value.
 * Sold and no-sale listings are permanently cached — their state is final.
 * Once a listing is promoted to 'permanent', it must never be downgraded.
 */
export function toCacheStatus(listingStatus: string): 'live' | 'permanent' {
  return listingStatus === 'sold' || listingStatus === 'no-sale' ? 'permanent' : 'live'
}

/**
 * Returns a random delay in ms between sequential batch refresh requests.
 * Jitter prevents synchronized bursts if multiple users trigger batch refreshes simultaneously.
 *
 * SAFETY: Every caller that loops over multiple listings MUST await this between
 * requests. Never use Promise.all or parallel fetches for batch refresh operations.
 */
export function batchRefreshDelayMs(): number {
  return 2000 + Math.random() * 1000 // 2–3 seconds
}
