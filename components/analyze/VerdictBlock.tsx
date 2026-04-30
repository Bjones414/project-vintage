import Link from 'next/link'
import type { Tables } from '@/lib/supabase/types'
import type { AnalysisData, ViewerTier } from './types'
import type { CompResultRow } from '@/lib/comp-engine/db-types'
import { formatCents } from '@/lib/utils/currency'
import { monthsAgo } from '@/lib/comp-engine/recency-weight'

type Props = {
  listing?: Tables<'listings'>
  analysisData: AnalysisData | null
  compResult?: CompResultRow | null
  viewerTier: ViewerTier
  listingId: string
}

function compVerdictText(
  subjectCents: number,
  low: number,
  high: number,
): 'below' | 'within' | 'above' {
  if (subjectCents < low) return 'below'
  if (subjectCents > high) return 'above'
  return 'within'
}

export function VerdictBlock({ listing, analysisData, compResult = null, viewerTier, listingId }: Props) {
  if (viewerTier === 'anonymous') {
    return (
      <div className="mt-6 border-[0.5px] border-border-default border-l-[3px] border-l-accent-primary bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">The verdict</p>
        <p className="mt-3 font-serif text-[22px] leading-[1.3] text-text-primary">
          Sign in to see the verdict on this car.
        </p>
        <p className="mt-3 font-serif text-[15px] italic leading-[1.65] text-text-tertiary">
          Free account. Full verdict, comparable sales, and generation context — no credit card required.
        </p>
        <div className="mt-5">
          <Link
            href={`/signup?next=/analyze/${listingId}`}
            className="inline-flex items-center rounded-button bg-text-primary px-5 py-[10px] font-sans text-[13px] font-medium tracking-[0.02em] text-bg-canvas hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2"
          >
            Unlock — it&apos;s free
          </Link>
        </div>
      </div>
    )
  }

  // Comp-engine verdict: available when tier is strict or wide and fair value is set
  if (
    listing &&
    compResult &&
    compResult.tier !== 'insufficient' &&
    compResult.fair_value_low_cents != null &&
    compResult.fair_value_high_cents != null
  ) {
    const currency = listing.currency
    const low = compResult.fair_value_low_cents
    const high = compResult.fair_value_high_cents
    const median = compResult.fair_value_median_cents ?? Math.round((low + high) / 2)

    // Subject price: sold > high_bid > asking_price
    const subjectCents =
      listing.final_price ??
      listing.high_bid ??
      listing.asking_price ??
      null

    const position = subjectCents != null ? compVerdictText(subjectCents, low, high) : null

    const headlines: Record<NonNullable<typeof position>, string> = {
      below: 'Priced below comparable sales.',
      within: 'Priced at fair value.',
      above: 'Priced above comparable sales.',
    }

    const headline = position ? headlines[position] : 'Fair value assessed.'

    const rangeStr = `${formatCents(low, currency)} – ${formatCents(high, currency)}`
    const subjectStr = subjectCents != null ? formatCents(subjectCents, currency) : null
    const subHead = subjectStr
      ? `Subject at ${subjectStr}, comparable range ${rangeStr} based on ${compResult.comp_count} comp${compResult.comp_count !== 1 ? 's' : ''}.`
      : `Comparable range ${rangeStr} based on ${compResult.comp_count} comp${compResult.comp_count !== 1 ? 's' : ''}.`

    const mostRecentMonths = compResult.most_recent_comp_sold_at
      ? Math.round(monthsAgo(compResult.most_recent_comp_sold_at))
      : null
    const recencyLine = mostRecentMonths != null
      ? mostRecentMonths <= 1
        ? 'Most recent comp sold within the last month.'
        : `Most recent comp sold ${mostRecentMonths} month${mostRecentMonths !== 1 ? 's' : ''} ago.`
      : null

    return (
      <div className="mt-6 border-[0.5px] border-border-default border-l-[3px] border-l-accent-primary bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">The verdict</p>
        <p className="mt-3 font-serif text-[22px] leading-[1.3] text-text-primary">{headline}</p>
        <p className="mt-2 font-sans text-[13px] text-text-secondary">{subHead}</p>
        {recencyLine && (
          <p className="mt-1 font-sans text-[13px] text-text-tertiary">{recencyLine}</p>
        )}
        {compResult.tier === 'wide' && (
          <p className="mt-3 font-serif text-[13px] italic text-text-muted">
            Wide-criteria comps used due to limited matches.
          </p>
        )}
        <div className="mt-3 border-t-[0.5px] border-border-subtle pt-3">
          <span className="font-sans text-[12px] text-text-quaternary">
            Fair value midpoint: {formatCents(median, currency)}
          </span>
        </div>
      </div>
    )
  }

  // Legacy analysisData.lede path (pre-comp-engine or manual overrides)
  if (analysisData?.lede) {
    return (
      <div className="mt-6 border-[0.5px] border-border-default border-l-[3px] border-l-accent-primary bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">The verdict</p>
        <p className="mt-3 font-serif text-[22px] leading-[1.3] text-text-primary">{analysisData.lede}</p>
        {analysisData.secondary_line && (
          <p className="mt-3 font-serif text-[15px] italic leading-[1.65] text-text-tertiary">{analysisData.secondary_line}</p>
        )}
        {analysisData.confidence_label && (
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t-[0.5px] border-border-subtle pt-4">
            <span className="font-sans text-[13px] text-text-tertiary">Confidence:</span>
            <span className="font-sans text-[13px] capitalize text-text-secondary">
              {analysisData.confidence_label}
            </span>
            {analysisData.methodology && (
              <span className="font-sans text-[13px] text-text-tertiary">&middot; {analysisData.methodology}</span>
            )}
          </div>
        )}
      </div>
    )
  }

  // Insufficient tier or no comp data yet
  return (
    <div className="mt-6 border-[0.5px] border-border-default border-l-[3px] border-l-accent-primary bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">The verdict</p>
      <p className="mt-3 font-serif text-[22px] leading-[1.3] text-text-primary">Verdict in development.</p>
      <p className="mt-3 font-sans text-[13px] text-text-tertiary">Comp engine launching with full report.</p>
    </div>
  )
}
