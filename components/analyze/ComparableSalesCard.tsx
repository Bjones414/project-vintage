import { Card } from '@/components/ui/card'
import { formatCents } from '@/lib/utils/currency'
import { formatDateShort } from '@/lib/utils/date'
import type { AnalysisData, ComparableSale, ViewerTier } from './types'

type Props = {
  analysisData: AnalysisData | null
  viewerTier: ViewerTier
}

function SaleRow({ sale }: { sale: ComparableSale }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-gray-100 py-2.5 first:border-0 first:pt-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">
          {sale.year} {sale.make} {sale.model}
          {sale.trim ? ` ${sale.trim}` : ''}
        </p>
        <p className="text-xs text-gray-500">
          {sale.mileage != null
            ? `${sale.mileage.toLocaleString()} ${sale.mileage_unit ?? 'mi'}`
            : 'Mileage unknown'}
          {' · '}
          {formatDateShort(sale.sale_date)}
        </p>
      </div>
      <p className="shrink-0 text-sm font-bold text-gray-900">
        {formatCents(sale.final_price_cents)}
      </p>
    </div>
  )
}

export function ComparableSalesCard({ analysisData, viewerTier }: Props) {
  const sales = analysisData?.comparable_sales ?? []
  const total = analysisData?.comps_used ?? sales.length

  if (total === 0 && sales.length === 0) {
    return (
      <Card title="Comparable Sales">
        <p className="text-sm text-gray-500">No comparable sales data available.</p>
      </Card>
    )
  }

  const displayed = viewerTier === 'anonymous' ? sales.slice(0, 1) : sales

  return (
    <Card title="Comparable Sales">
      <p className="mb-3 text-sm text-gray-500">
        {total} comparable sale{total !== 1 ? 's' : ''} found
      </p>
      {displayed.map((sale, idx) => (
        <SaleRow key={sale.listing_id ?? idx} sale={sale} />
      ))}
      {viewerTier === 'anonymous' && total > 1 && (
        <p className="mt-3 text-sm text-gray-400">
          +{total - 1} more sale{total - 1 !== 1 ? 's' : ''} available with a free account
        </p>
      )}
    </Card>
  )
}
