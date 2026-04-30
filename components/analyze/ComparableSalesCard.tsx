import { formatCents } from '@/lib/utils/currency'
import { formatDateShort } from '@/lib/utils/date'
import type { AnalysisData, ComparableSale, ViewerTier } from './types'
import type { CompResultRow } from '@/lib/comp-engine/db-types'
import type { Tables } from '@/lib/supabase/types'

type Props = {
  analysisData: AnalysisData | null
  compResult: CompResultRow | null
  listing: Tables<'listings'>
  viewerTier: ViewerTier
}

function SaleRow({ sale }: { sale: ComparableSale }) {
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

export function ComparableSalesCard({ analysisData, compResult: _compResult, listing: _listing, viewerTier }: Props) {
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
          <SaleRow key={sale.listing_id ?? idx} sale={sale} />
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
