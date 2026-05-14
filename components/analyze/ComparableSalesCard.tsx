'use client'
import { useState } from 'react'
import { formatCents } from '@/lib/utils/currency'
import { formatDateShort } from '@/lib/utils/date'
import type { AnalysisData, ComparableSale, ViewerTier } from './types'
import type { CompResultRow } from '@/lib/comp-engine/db-types'
import { monthsAgo } from '@/lib/comp-engine/recency-weight'

const PREVIEW_COUNT = 5
const EXPANDED_MAX = 10

type CompListing = {
  id: string
  year: number | null
  make: string | null
  model: string | null
  trim: string | null
  mileage: number | null
  final_price: number | null
  auction_ends_at: string | null
  source_url: string | null
  source_platform: string
  source_publication: string | null
}

const SPARSE_CATEGORIES = new Set(['coachbuilt', 'limited'])

type Props = {
  analysisData: AnalysisData | null
  compResult?: CompResultRow | null
  compListings?: CompListing[]
  viewerTier: ViewerTier
  trimCategory?: string | null
  matchingMode?: 'strict' | 'broad'
  disclaimer?: boolean
  cascadeCaveat?: string | null
}

function CompRow({ comp, idx }: { comp: CompListing; idx: number }) {
  const numStr = String(idx + 1).padStart(2, '0')
  const mo = comp.auction_ends_at ? Math.round(monthsAgo(comp.auction_ends_at)) : null
  const moStr = mo != null ? (mo <= 1 ? '< 1 mo ago' : `${mo} mo ago`) : null
  const mileageStr = comp.mileage != null ? `${comp.mileage.toLocaleString()} mi` : null

  const title = [comp.year, comp.make, comp.model, comp.trim].filter(Boolean).join(' ')

  return (
    <div className="flex items-start gap-3 border-t-[0.5px] border-border-subtle py-3 first:border-0 first:pt-0">
      <span className="shrink-0 font-serif text-[18px] leading-none text-accent-secondary">
        {numStr}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-serif text-[14px] text-text-primary">
          {comp.source_url ? (
            <a
              href={comp.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {title} ↗
            </a>
          ) : (
            title
          )}
        </p>
        <p className="font-sans text-[12px] text-text-tertiary">
          {[mileageStr, moStr].filter(Boolean).join(' · ')}
        </p>
        {/* Source attribution — every comp must cite its source per data policy */}
        {(comp.source_publication ?? comp.source_platform) && (
          <p className="font-sans text-[11px] text-text-quaternary">
            Source:{' '}
            {comp.source_url ? (
              <a
                href={comp.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-text-tertiary"
              >
                {comp.source_publication ?? comp.source_platform}
              </a>
            ) : (
              (comp.source_publication ?? comp.source_platform)
            )}
          </p>
        )}
      </div>
      <p className="shrink-0 font-serif text-[15px] text-text-primary">
        {comp.final_price != null ? formatCents(comp.final_price) : '—'}
      </p>
    </div>
  )
}

function LegacySaleRow({ sale }: { sale: ComparableSale }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t-[0.5px] border-border-subtle py-3 first:border-0 first:pt-0">
      <div className="min-w-0">
        <p className="truncate font-serif text-[15px] text-text-primary">
          {sale.year} {sale.make} {sale.model}
          {sale.trim ? ` ${sale.trim}` : ''}
        </p>
        <p className="font-sans text-[12px] text-text-tertiary">
          {sale.mileage != null
            ? `${sale.mileage.toLocaleString()} ${sale.mileage_unit ?? 'mi'}`
            : 'Mileage unknown'}
          {' · '}
          {formatDateShort(sale.sale_date)}
        </p>
      </div>
      <p className="shrink-0 font-serif text-[15px] text-text-primary">
        {formatCents(sale.final_price_cents)}
      </p>
    </div>
  )
}

function ExpandLink({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <p className="mt-4">
      <button
        type="button"
        onClick={onToggle}
        className="font-serif text-[13px] italic text-accent-primary hover:underline"
      >
        {expanded ? 'Collapse ↑' : 'Show top 10 →'}
      </button>
    </p>
  )
}

export function ComparableSalesCard({ analysisData, compResult, compListings, viewerTier, trimCategory, matchingMode, disclaimer, cascadeCaveat }: Props) {
  const [expanded, setExpanded] = useState(false)

  // Sparse-category path: coachbuilt/limited with fewer than 3 comps.
  // Show individual data points without a fair value range.
  if (
    compResult?.tier === 'insufficient' &&
    trimCategory && SPARSE_CATEGORIES.has(trimCategory) &&
    compListings && compListings.length > 0
  ) {
    const label = trimCategory === 'coachbuilt' ? 'Coachbuilt' : 'Limited Edition'
    const shownCount = expanded ? Math.min(compListings.length, EXPANDED_MAX) : Math.min(compListings.length, PREVIEW_COUNT)
    const hasMore = compListings.length > PREVIEW_COUNT
    return (
      <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">Comparable Sales</p>
        <p className="mt-1 font-sans text-[13px] text-text-tertiary">
          {compListings.length} comparable sale{compListings.length !== 1 ? 's' : ''} found · {label}
        </p>
        <p className="mt-3 font-serif text-[14px] italic leading-[1.6] text-text-secondary">
          Comparable sales data is limited for this configuration. See comp list below for individual data points.
        </p>
        <div className="mt-4">
          {compListings.map((comp, idx) =>
            idx < shownCount ? <CompRow key={comp.id} comp={comp} idx={idx} /> : null
          )}
        </div>
        {hasMore && (
          <ExpandLink expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
        )}
      </div>
    )
  }

  // Comp engine data path
  if (compResult && compResult.tier !== 'insufficient' && compListings && compListings.length > 0) {
    const displayed = viewerTier === 'anonymous' ? compListings.slice(0, 1) : compListings
    const hiddenCount = viewerTier === 'anonymous' ? compResult.comp_count - 1 : 0
    const shownCount = expanded ? Math.min(displayed.length, EXPANDED_MAX) : PREVIEW_COUNT
    const hasMore = displayed.length > PREVIEW_COUNT
    // Caption shown when expanded and there are comps beyond the 10-comp page cap
    const overflowCount = compResult.comp_count > EXPANDED_MAX ? compResult.comp_count : 0

    return (
      <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">Comparable Sales</p>
        <p className="mt-1 font-sans text-[13px] text-text-tertiary">
          {compResult.comp_count} comparable sale{compResult.comp_count !== 1 ? 's' : ''} found
          {compResult.tier === 'wide' && (
            <span className="ml-1 font-serif italic text-text-muted">· wide criteria</span>
          )}
          {matchingMode === 'broad' && (
            <span className="ml-1 font-serif italic text-text-muted">· all mileage range</span>
          )}
        </p>
        {disclaimer && (
          <p className="mt-2 font-serif text-[13px] italic text-text-muted">
            Comps span all mileages — provide a mileage for filtered results.
          </p>
        )}
        {cascadeCaveat && (
          <p className="mt-2 font-serif text-[13px] italic text-text-muted">
            {cascadeCaveat}
          </p>
        )}
        <div className="mt-4">
          {displayed.map((comp, idx) =>
            idx < shownCount ? <CompRow key={comp.id} comp={comp} idx={idx} /> : null
          )}
        </div>
        {hiddenCount > 0 && (
          <p className="mt-3 font-sans text-[13px] text-text-muted">
            +{hiddenCount} more sale{hiddenCount !== 1 ? 's' : ''} available with a free account
          </p>
        )}
        {hasMore && (
          <ExpandLink expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
        )}
        {/* TODO: replace href with /analyze/[id]/full once full-report page exists */}
        {expanded && overflowCount > 0 && (
          <p className="mt-3 font-serif text-[13px] italic leading-[1.5] text-text-tertiary">
            Showing {EXPANDED_MAX} of {overflowCount} comps ·{' '}
            <a href="#" className="hover:underline">Full report shows all →</a>
          </p>
        )}
      </div>
    )
  }

  // Insufficient tier: honest empty state
  if (compResult && compResult.tier === 'insufficient') {
    return (
      <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">Comparable Sales</p>
        <p className="mt-4 font-serif text-[15px] italic leading-[1.65] text-text-secondary">
          Not enough comparable sales in our corpus for this specification.
        </p>
        <p className="mt-2 font-serif text-[15px] italic leading-[1.65] text-text-tertiary">
          Until our corpus grows, see the auction page directly for context.
        </p>
      </div>
    )
  }

  // Legacy analysisData path
  const sales = analysisData?.comparable_sales ?? []
  const total = analysisData?.comps_used ?? sales.length
  const hasMore = sales.length > PREVIEW_COUNT

  if (total === 0 && sales.length === 0) {
    return (
      <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">Comparable Sales</p>
        <p className="mt-4 font-serif text-[15px] italic leading-[1.65] text-text-secondary">Comparable sales engine in development.</p>
        <p className="mt-2 font-serif text-[15px] italic leading-[1.65] text-text-tertiary">
          Until launch, see the auction page directly for context.
        </p>
      </div>
    )
  }

  const displayed = viewerTier === 'anonymous' ? sales.slice(0, 1) : sales
  const shownCount = expanded ? Math.min(displayed.length, EXPANDED_MAX) : PREVIEW_COUNT

  return (
    <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">Comparable Sales</p>
      <p className="mt-1 font-sans text-[13px] text-text-tertiary">
        {total} comparable sale{total !== 1 ? 's' : ''} found
      </p>
      <div className="mt-4">
        {displayed.map((sale, idx) =>
          idx < shownCount ? (
            <LegacySaleRow key={sale.listing_id ?? idx} sale={sale} />
          ) : null
        )}
      </div>
      {viewerTier === 'anonymous' && total > 1 && (
        <p className="mt-3 font-sans text-[13px] text-text-muted">
          +{total - 1} more sale{total - 1 !== 1 ? 's' : ''} available with a free account
        </p>
      )}
      {viewerTier !== 'anonymous' && hasMore && (
        <ExpandLink expanded={expanded} onToggle={() => setExpanded((v) => !v)} />
      )}
    </div>
  )
}
