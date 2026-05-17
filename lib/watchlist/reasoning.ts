// Template-based reasoning paragraph generator for the watchlist expanded panel.
// Option 1: builds 2-3 sentence narrative from structured comp engine output.
// No AI/LLM required — pure deterministic template composition.

function formatDollars(cents: number): string {
  return '$' + Math.round(cents / 100).toLocaleString('en-US')
}

function formatMonthYear(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export interface ReasoningInput {
  listing: {
    year: number | null
    make: string | null
    model: string | null
    trim: string | null
    listing_status: string | null
    high_bid: number | null    // cents
    final_price: number | null // cents
    auction_ends_at?: string | null  // ISO — used to compute time-remaining in significantly-below copy
  }
  comps: {
    predicted_median: number | null  // cents
    predicted_p25: number | null     // cents
    predicted_p75: number | null     // cents
    comp_count: number
    oldest_comp_date: string | null  // ISO
    verdict: string | null
  }
  topWatchItem?: { title: string } | null
}

export function buildReasoning(input: ReasoningInput, nowMs: number = Date.now()): string {
  const { listing, comps, topWatchItem } = input
  const { predicted_median, predicted_p25, predicted_p75, comp_count, oldest_comp_date, verdict } = comps

  const carLabel =
    [listing.year, listing.make, listing.model, listing.trim].filter(Boolean).join(' ') || 'this car'

  const hasComps =
    comp_count >= 3 &&
    predicted_median !== null &&
    predicted_p25 !== null &&
    predicted_p75 !== null &&
    verdict !== 'insufficient_comps' &&
    verdict !== 'uncomparable'

  if (!hasComps) {
    return (
      `There aren't enough comparable sales to build a confident range for ${carLabel}. ` +
      `Check back as more sales data accumulates.`
    )
  }

  const median = formatDollars(predicted_median!)
  const low    = formatDollars(predicted_p25!)
  const high   = formatDollars(predicted_p75!)
  const since  = oldest_comp_date ? ` since ${formatMonthYear(oldest_comp_date)}` : ''
  const compLine = `based on ${comp_count} comparable sale${comp_count !== 1 ? 's' : ''}${since}`

  const isActive = listing.listing_status !== 'sold' && listing.listing_status !== 'no-sale'
  const sentences: string[] = []

  if (isActive) {
    const bid = listing.high_bid
    const bidStr = bid !== null ? formatDollars(bid) : null

    if (bidStr && bid !== null && predicted_p25 !== null && predicted_p75 !== null) {
      // Significantly below — own template
      if (bid < predicted_p25! * 0.8) {
        const sinceClause = oldest_comp_date ? ` since ${formatMonthYear(oldest_comp_date)}` : ''
        const compPhrase = `Based on ${comp_count} comparable sale${comp_count !== 1 ? 's' : ''}${sinceClause}, we expect this car to sell around ${median}.`

        const endsAtMs = listing.auction_ends_at ? new Date(listing.auction_ends_at).getTime() : null
        const msRemaining = endsAtMs !== null ? endsAtMs - nowMs : null

        if (msRemaining !== null && msRemaining > 0) {
          const hoursRemaining = msRemaining / (3600 * 1000)

          if (hoursRemaining >= 24) {
            const daysRemaining = Math.floor(msRemaining / (24 * 3600 * 1000))
            const dayLabel = daysRemaining === 1 ? '1 day' : `${daysRemaining} days`
            return (
              `Current bid is ${bidStr} with ${dayLabel} remaining. ` +
              `Bidding typically ramps in the final day of auction. ` +
              compPhrase
            )
          }

          const hourLabel =
            hoursRemaining < 1 ? 'less than 1 hour' :
            Math.floor(hoursRemaining) === 1 ? '1 hour' :
            `${Math.floor(hoursRemaining)} hours`
          return `Current bid is ${bidStr} with ${hourLabel} remaining. ${compPhrase}`
        }

        // Fallback: auction_ends_at missing or already past
        return (
          `Current bid is ${bidStr} — well below the expected ${low}–${high} range. ` +
          `Based on ${comp_count} comparable sale${comp_count !== 1 ? 's' : ''}${sinceClause}, ` +
          `we'd expect this car to land closer to ${median}.`
        )
      }

      const position =
        bid > predicted_p75! ? 'above' :
        bid < predicted_p25! ? 'below' :
        'within'
      sentences.push(
        `This ${carLabel} is tracking at ${bidStr} — ${position} the expected ${low}–${high} range, ${compLine}.`
      )
      if (bid > predicted_p75!) {
        sentences.push(
          `The current bid is running above the median of ${median}, which is notable for this spec.`
        )
      } else if (bid < predicted_p25!) {
        const endsAtMs = listing.auction_ends_at ? new Date(listing.auction_ends_at).getTime() : null
        const msRemaining = endsAtMs !== null ? endsAtMs - nowMs : null
        if (msRemaining !== null && msRemaining >= 24 * 3600 * 1000) {
          const daysRemaining = Math.floor(msRemaining / (24 * 3600 * 1000))
          const dayLabel = daysRemaining === 1 ? '1 day' : `${daysRemaining} days`
          sentences.push(
            `With ${dayLabel} remaining, the bid could still move higher before close.`
          )
        } else {
          sentences.push(
            `The current bid is below the expected floor, which may represent value if the car checks out.`
          )
        }
      } else {
        sentences.push(
          `The current bid sits near the median, which is fair for a car with this spec.`
        )
      }
    } else {
      sentences.push(
        `The expected range for this ${carLabel} is ${low}–${high}, ${compLine}.`
      )
      sentences.push(`The median for comparable examples is ${median}.`)
    }
  } else {
    const finalPrice = listing.final_price
    const finalStr   = finalPrice !== null ? formatDollars(finalPrice) : null

    if (finalStr && finalPrice !== null && predicted_p25 !== null && predicted_p75 !== null) {
      const position =
        finalPrice > predicted_p75! ? 'above' :
        finalPrice < predicted_p25! ? 'below' :
        'within'
      sentences.push(
        `This ${carLabel} sold for ${finalStr} — ${position} the expected ${low}–${high} range, ${compLine}.`
      )
    } else {
      sentences.push(
        `The expected range for this ${carLabel} was ${low}–${high}, ${compLine}.`
      )
    }
    sentences.push(`The median for comparable examples was ${median}.`)
  }

  if (topWatchItem && isActive) {
    sentences.push(
      `Watch the ${topWatchItem.title.toLowerCase()} notes before the auction closes.`
    )
  }

  return sentences.join(' ')
}
