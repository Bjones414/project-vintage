import type { ReactNode } from 'react'
import Link from 'next/link'
import type { Tables } from '@/lib/supabase/types'
import type { AnalysisData, ViewerTier } from './types'
import type { CompResultRow } from '@/lib/comp-engine/db-types'
import { formatCents } from '@/lib/utils/currency'
import { monthsAgo } from '@/lib/comp-engine/recency-weight'
import { getValueDrivers } from '@/lib/era-content/generation-content'
import { UNIVERSAL_VALUE_DRIVERS } from '@/lib/era-content/value-drivers-fallback'
import type { ValueDriver } from '@/lib/era-content/generation-content'

// Generations where M96/Mezger (or 9A1/Mezger) coexist, requiring trim-level
// disambiguation before filtering engine-family-specific value drivers.
const MIXED_ENGINE_DRIVER_GENS = new Set(['996.1', '996.2', '997.1', '997.2'])

// Returns a trim-category token used exclusively for value_driver applies_to filtering.
//   'm96'    — M96/M97 Carrera-family trim in a mixed-engine generation
//   'mezger' — Mezger-engined GT or Turbo in 996.1/996.2/997.1/997.2
//   '9a1'    — 9A1 DFI trim in 997.2 (including the 997.2 Turbo/Turbo S)
//   null     — single-engine-family generation or trim undetermined
function deriveMezgerAwareTrimCategory(
  listingTrim: string | null | undefined,
  listingGenerationId: string | null | undefined,
  rawTrimCategory: string | null | undefined,
): string | null {
  const genId = listingGenerationId
  if (!genId || !MIXED_ENGINE_DRIVER_GENS.has(genId)) return rawTrimCategory ?? null
  if (!listingTrim) return rawTrimCategory ?? null
  if (/\b(gt2|gt3)\b/i.test(listingTrim)) return 'mezger'
  if (/\bturbo\b/i.test(listingTrim)) return genId === '997.2' ? '9a1' : 'mezger'
  return genId === '997.2' ? '9a1' : 'm96'
}

type Props = {
  listing?: Tables<'listings'>
  analysisData: AnalysisData | null
  compResult?: CompResultRow | null
  viewerTier: ViewerTier
  listingId: string
  trimCategory?: string | null
  generationId?: string | null
}

function CategoryBadge({ category }: { category: string }) {
  const text =
    category === 'coachbuilt'
      ? 'COACHBUILT — highly individualized car. Comparable sales are limited; each example is unique.'
      : 'LIMITED EDITION — production-limited variant. Comparable sales may be sparse.'
  return (
    <div className="mt-4 border-[0.5px] border-l-[3px] border-border-default border-l-accent-secondary bg-bg-elevated px-4 py-3">
      <p className="font-serif text-[13px] italic text-text-secondary">{text}</p>
    </div>
  )
}

// Extracts the first sentence of a description and guarantees a trailing period.
function firstSentence(s: string): string {
  const stop = s.indexOf('. ')
  if (stop > -1) return s.slice(0, stop + 1)
  return s.endsWith('.') ? s : `${s}.`
}

// Concatenates first sentences from each driver up to maxChars, breaking on sentence boundaries.
function buildDriversParagraph(drivers: ValueDriver[], maxChars = 400): string {
  let result = ''
  for (const driver of drivers) {
    const sentence = firstSentence(driver.description.trim())
    const next = result ? `${result} ${sentence}` : sentence
    if (next.length > maxChars) break
    result = next
  }
  return result
}

function driverApplies(
  driver: ValueDriver,
  trimCategory: string | null | undefined,
  bodyStyle: string | null | undefined,
): boolean {
  const { applies_to } = driver
  if (!applies_to) return true
  if (applies_to.trim_categories && trimCategory) {
    if (!applies_to.trim_categories.includes(trimCategory)) return false
  }
  if (applies_to.body_styles && bodyStyle) {
    const bodyLower = bodyStyle.toLowerCase()
    if (!applies_to.body_styles.some(b => b.toLowerCase() === bodyLower)) return false
  }
  return true
}

function ThingsToConsider({
  drivers,
  trimCategory,
  bodyStyle,
}: {
  drivers: ValueDriver[]
  trimCategory?: string | null
  bodyStyle?: string | null
}) {
  const filtered = drivers.filter(d => driverApplies(d, trimCategory, bodyStyle))

  // If filtering leaves fewer than 3 drivers, supplement with universal fallbacks
  // so the paragraph has enough content regardless of trim.
  const driversForParagraph = filtered.length >= 3
    ? filtered
    : [
        ...filtered,
        ...UNIVERSAL_VALUE_DRIVERS.filter(u => !filtered.some(f => f.name === u.name)),
      ]

  const paragraph = buildDriversParagraph(driversForParagraph)
  if (!paragraph) return null
  return (
    <div className="mt-8 lg:mt-0 lg:border-l-[0.5px] lg:border-border-subtle lg:pl-8">
      <p className="mb-3 font-serif text-[11px] uppercase tracking-[0.18em] text-accent-secondary">
        Things to Consider
      </p>
      <p className="font-serif text-[15px] italic leading-[1.65] text-text-secondary">
        {paragraph}
      </p>
    </div>
  )
}

// Outer shell — single column by default; 60/40 two-column grid at lg when rightColumn is present.
function VerdictShell({ children, rightColumn }: { children: ReactNode; rightColumn?: ReactNode }) {
  return (
    <div className="mt-6 border-[0.5px] border-border-default border-l-[3px] border-l-accent-primary bg-bg-surface px-6 py-5">
      {rightColumn ? (
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
          <div>{children}</div>
          {rightColumn}
        </div>
      ) : (
        <div className="max-w-[760px]">{children}</div>
      )}
    </div>
  )
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

// Time-aware bid line for live auctions.
// Suppresses the percentage comparison until the final 24 hours — earlier bids
// on BaT don't reflect final price and would mislead users on multi-day auctions.
function buildBidLine(
  highBid: number,
  median: number,
  currency: string | null | undefined,
  auctionEndsAt: string | null,
): string {
  const bidFormatted = formatCents(highBid, currency ?? undefined)

  if (auctionEndsAt === null) {
    return `Current bid: ${bidFormatted}.`
  }

  const msUntilEnd = new Date(auctionEndsAt).getTime() - Date.now()
  const hoursUntilEnd = msUntilEnd / (1000 * 60 * 60)

  if (msUntilEnd < 0) {
    return `Current bid: ${bidFormatted}. Auction may have ended.`
  }

  if (hoursUntilEnd > 24) {
    return `Current bid: ${bidFormatted}. Bidding typically intensifies in the final 24 hours.`
  }

  // Final 24 hours — show comparison against fair value
  const ratio = highBid / median
  const position =
    ratio < 0.85 ? 'significantly below our estimate' :
    ratio < 0.95 ? 'below our estimate' :
    ratio < 1.05 ? 'in line with our estimate' :
    ratio < 1.15 ? 'above our estimate' :
    'significantly above our estimate'
  return `Current bid: ${bidFormatted} — ${position}`
}

export function VerdictBlock({
  listing,
  analysisData,
  compResult = null,
  viewerTier,
  listingId,
  trimCategory,
  generationId,
}: Props) {
  const showCategoryBadge =
    viewerTier !== 'anonymous' &&
    (trimCategory === 'coachbuilt' || trimCategory === 'limited')

  // Value drivers for the right column — resolved for all authenticated paths.
  const drivers: ValueDriver[] =
    (generationId ? getValueDrivers(generationId) : null) ?? UNIVERSAL_VALUE_DRIVERS

  // Derive a trim category that distinguishes Mezger from M96/9A1 within mixed-engine
  // generations, enabling engine-family-specific value_driver filtering.
  const effectiveTrimCategory = deriveMezgerAwareTrimCategory(
    listing?.trim,
    listing?.generation_id ?? generationId,
    trimCategory,
  )

  const thingsToConsider =
    viewerTier !== 'anonymous' ? (
      <ThingsToConsider
        drivers={drivers}
        trimCategory={effectiveTrimCategory}
        bodyStyle={listing?.body_style}
      />
    ) : undefined

  if (viewerTier === 'anonymous') {
    return (
      <VerdictShell>
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
      </VerdictShell>
    )
  }

  // Status-gated early exits — must precede all content-based checks so stale
  // analysis_data.lede values from old rows can't shadow the listing state.
  if (listing?.listing_status === 'live') {
    const currency = listing.currency
    const hasFairValue =
      compResult != null &&
      compResult.tier !== 'insufficient' &&
      compResult.fair_value_median_cents != null &&
      compResult.fair_value_low_cents != null &&
      compResult.fair_value_high_cents != null

    if (!hasFairValue) {
      return (
        <VerdictShell rightColumn={thingsToConsider}>
          <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">The verdict</p>
          <p className="mt-3 font-serif text-[22px] leading-[1.3] text-text-primary">Comp data still building.</p>
          <p className="mt-2 font-serif text-[14px] italic leading-[1.6] text-text-secondary">Not enough comparable sales for a confident value estimate yet.</p>
        </VerdictShell>
      )
    }

    const median = compResult.fair_value_median_cents!
    const low = compResult.fair_value_low_cents!
    const high = compResult.fair_value_high_cents!
    const count = compResult.comp_count

    const bidLine = listing.high_bid != null
      ? buildBidLine(listing.high_bid, median, currency, listing.auction_ends_at ?? null)
      : null

    return (
      <VerdictShell rightColumn={thingsToConsider}>
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">The verdict</p>
        <p className="mt-3 font-serif text-[22px] leading-[1.3] text-text-primary">
          Estimated fair value: {formatCents(median, currency)}
        </p>
        <p className="mt-2 font-serif text-[14px] italic leading-[1.6] text-text-secondary">
          Based on {count} comparable sale{count !== 1 ? 's' : ''} ({formatCents(low, currency)} – {formatCents(high, currency)})
        </p>
        {bidLine && (
          <p className="mt-1 font-serif text-[14px] italic leading-[1.6] text-text-secondary">
            {bidLine}
          </p>
        )}
      </VerdictShell>
    )
  }

  if (listing?.listing_status === 'no-sale') {
    return (
      <VerdictShell rightColumn={thingsToConsider}>
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">The verdict</p>
        <p className="mt-3 font-serif text-[22px] leading-[1.3] text-text-primary">Auction ended without a sale.</p>
        <p className="mt-3 font-sans text-[13px] text-text-tertiary">Comp range available below for context.</p>
      </VerdictShell>
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
      <VerdictShell rightColumn={thingsToConsider}>
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
        {showCategoryBadge && trimCategory && <CategoryBadge category={trimCategory} />}
      </VerdictShell>
    )
  }

  // Legacy analysisData.lede path (pre-comp-engine or manual overrides)
  if (analysisData?.lede) {
    return (
      <VerdictShell rightColumn={thingsToConsider}>
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
      </VerdictShell>
    )
  }

  // Sold but insufficient comps — corpus still building
  return (
    <VerdictShell rightColumn={thingsToConsider}>
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">The verdict</p>
      <p className="mt-3 font-serif text-[22px] leading-[1.3] text-text-primary">Insufficient comparable data.</p>
      <p className="mt-3 font-sans text-[13px] text-text-tertiary">Not enough comparable sales for this generation/trim yet. Foundation data is still building. Try a more common Porsche (993, 996, 997) or check back as the database grows.</p>
      {showCategoryBadge && trimCategory && <CategoryBadge category={trimCategory} />}
    </VerdictShell>
  )
}
