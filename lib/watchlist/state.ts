// Watchlist row state classification and verdict pill logic.
// Pure functions — no DB access. Safe to import in both server and client components.

export type RowFreshness = 'fresh' | 'stale' | 'stale-urgent'

export type VerdictPillState =
  | 'tracking-fair'
  | 'tracking-high'
  | 'too-early'
  | 'sold-above'
  | 'sold-below'
  | 'sold-fair'
  | 'no-sale'

const SIX_HOURS_MS   = 6  * 60 * 60 * 1000
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000

// Classify row freshness based on watchlist.updated_at and the auction end time.
export function computeFreshness(
  updatedAt: string,
  auctionEndsAt: string | null,
  nowMs: number = Date.now(),
): RowFreshness {
  const ageMs = nowMs - new Date(updatedAt).getTime()

  if (ageMs < SIX_HOURS_MS) return 'fresh'

  if (auctionEndsAt) {
    const msUntilEnd = new Date(auctionEndsAt).getTime() - nowMs
    if (msUntilEnd > 0 && msUntilEnd < TWELVE_HOURS_MS) {
      return 'stale-urgent'
    }
  }

  return 'stale'
}

export interface VerdictPillInput {
  listingStatus: string | null
  currentBidCents: number | null
  finalPriceCents: number | null
  compP25Cents: number | null
  compP75Cents: number | null
  compCount: number
  verdict: string | null
  auctionEndsAt?: string | null
  nowMs?: number
}

// Derive the 7-state verdict pill from listing + comp data.
export function computeVerdictPillState(params: VerdictPillInput): VerdictPillState {
  const { listingStatus, currentBidCents, finalPriceCents, compP25Cents, compP75Cents, compCount, verdict, auctionEndsAt, nowMs = Date.now() } = params

  if (listingStatus === 'no-sale') return 'no-sale'

  // Path B: parser doesn't always set no-sale status — detect from auction_ends_at in past + no sold price
  if (
    listingStatus !== 'sold' &&
    finalPriceCents === null &&
    auctionEndsAt &&
    new Date(auctionEndsAt).getTime() < nowMs
  ) return 'no-sale'

  const hasComps =
    compCount >= 3 &&
    compP25Cents !== null &&
    compP75Cents !== null &&
    verdict !== 'insufficient_comps' &&
    verdict !== 'uncomparable'

  if (!hasComps) return 'too-early'

  const isEnded = listingStatus === 'sold'

  if (isEnded) {
    const price = finalPriceCents ?? 0
    if (price > compP75Cents!) return 'sold-above'
    if (price < compP25Cents!) return 'sold-below'
    return 'sold-fair'
  }

  // Active listing — bid below range counts as "tracking fair" (buyer-favorable, not a concern)
  const bid = currentBidCents
  if (!bid) return 'too-early'
  if (bid > compP75Cents!) return 'tracking-high'
  return 'tracking-fair'
}

// Shared type for data returned by POST /api/watchlist/[listingId]/refresh
export interface WatchlistRefreshResult {
  current_bid: number | null       // cents
  comp_median: number | null       // cents
  comp_p25: number | null          // cents
  comp_p75: number | null          // cents
  comp_count: number
  oldest_comp_date: string | null  // ISO — earliest sold_at among comps used
  verdict: string | null
  watch_for_items: Array<{
    title: string
    severity: 'high' | 'moderate' | 'low'
    description: string
  }>
  reasoning: string
  updated_at: string               // ISO — new watchlist.updated_at after the run
}

// Format "Updated Xh ago" label from watchlist.updated_at
export function formatUpdatedAt(updatedAt: string, nowMs: number = Date.now()): string {
  const msAgo = nowMs - new Date(updatedAt).getTime()
  const minutesAgo = Math.floor(msAgo / (60 * 1000))
  const hoursAgo   = Math.floor(msAgo / (60 * 60 * 1000))
  const daysAgo    = Math.floor(hoursAgo / 24)

  if (minutesAgo < 2)  return 'Updated just now'
  if (hoursAgo < 1)    return `Updated ${minutesAgo}m ago`
  if (hoursAgo === 1)  return 'Updated 1h ago'
  if (hoursAgo < 24)   return `Updated ${hoursAgo}h ago`
  if (daysAgo === 1)   return 'Updated 1d ago'
  return `Updated ${daysAgo}d ago`
}
