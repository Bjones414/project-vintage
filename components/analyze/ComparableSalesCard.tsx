import { formatCents } from '@/lib/utils/currency'
import { formatDateShort } from '@/lib/utils/date'
import type { AnalysisData, ComparableSale, ViewerTier } from './types'
import type { CompResultRow } from '@/lib/comp-engine/db-types'
import { monthsAgo } from '@/lib/comp-engine/recency-weight'

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
}

type Props = {
  analysisData: AnalysisData | null
  compResult?: CompResultRow | null
  compListings?: CompListing[]
  viewerTier: ViewerTier
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

export function ComparableSalesCard({ analysisData, compResult, compListings, viewerTier }: Props) {
  // Comp engine data path
  if (compResult && compResult.tier !== 'insufficient' && compListings && compListings.length > 0) {
    const displayed = viewerTier === 'anonymous' ? compListings.slice(0, 1) : compListings
    const hiddenCount = viewerTier === 'anonymous' ? compResult.comp_count - 1 : 0

    return (
      <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">Comparable Sales</p>
        <p className="mt-1 font-sans text-[13px] text-text-tertiary">
          {compResult.comp_count} comparable sale{compResult.comp_count !== 1 ? 's' : ''} found
          {compResult.tier === 'wide' && (
            <span className="ml-1 font-serif italic text-text-muted">· wide criteria</span>
          )}
        </p>
        <div className="mt-4">
          {displayed.map((comp, idx) => (
            <CompRow key={comp.id} comp={comp} idx={idx} />
          ))}
        </div>
        {hiddenCount > 0 && (
          <p className="mt-3 font-sans text-[13px] text-text-muted">
            +{hiddenCount} more sale{hiddenCount !== 1 ? 's' : ''} available with a free account
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

  return (
    <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">Comparable Sales</p>
      <p className="mt-1 font-sans text-[13px] text-text-tertiary">
        {total} comparable sale{total !== 1 ? 's' : ''} found
      </p>
      <div className="mt-4">
        {displayed.map((sale, idx) => (
          <LegacySaleRow key={sale.listing_id ?? idx} sale={sale} />
        ))}
      </div>
      {viewerTier === 'anonymous' && total > 1 && (
        <p className="mt-3 font-sans text-[13px] text-text-muted">
          +{total - 1} more sale{total - 1 !== 1 ? 's' : ''} available with a free account
        </p>
      )}
    </div>
  )
}
