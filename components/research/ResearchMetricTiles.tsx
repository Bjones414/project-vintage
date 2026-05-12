import type { ResearchRecord } from '@/lib/research/types'
import type { ResearchCompResult } from '@/lib/research/comp-query'
import { formatCents } from '@/lib/utils/currency'

interface Props {
  record: ResearchRecord
  comps: ResearchCompResult
}

function MetricTile({
  label,
  value,
  hint,
  href,
  valueClassName,
}: {
  label: string
  value: string
  hint?: string
  href?: string
  valueClassName?: string
}) {
  const sharedClass = 'border-[0.5px] border-border-default bg-bg-surface px-4 py-[14px]'
  const valueClass = href
    ? 'mt-1 truncate font-serif text-[20px] text-text-primary transition-colors group-hover:text-accent-primary'
    : `mt-1 truncate font-serif text-[20px] ${valueClassName ?? 'text-text-primary'}`

  const inner = (
    <>
      <p className="font-serif text-[10px] uppercase tracking-[0.18em] text-accent-primary">{label}</p>
      <p className={valueClass}>{value}</p>
      {hint && <p className="mt-1 font-sans text-[12px] text-text-muted">{hint}</p>}
    </>
  )

  if (href) {
    return (
      <a href={href} className={`group block cursor-pointer ${sharedClass}`}>
        {inner}
      </a>
    )
  }
  return <div className={sharedClass}>{inner}</div>
}

export function ResearchMetricTiles({ record, comps }: Props) {
  const { p25, p75, median, count, isMileageFiltered } = comps
  const showAskingTile = record.asking_price_cents != null

  const fairValueStr =
    p25 != null && p75 != null
      ? `${formatCents(p25)} – ${formatCents(p75)}`
      : '—'

  const medianStr = median != null ? formatCents(median) : '—'

  const compsHint = isMileageFiltered ? 'Mileage-filtered' : undefined

  const cols = showAskingTile ? 4 : 3

  return (
    <div
      className="mx-auto max-w-[1080px] px-7 pb-7"
      style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '10px' }}
    >
      <MetricTile
        label="Fair Value Range"
        value={fairValueStr}
        valueClassName={p25 == null ? 'font-serif text-[20px] text-text-quaternary' : undefined}
      />
      <MetricTile
        label="Median Sale"
        value={medianStr}
        valueClassName={median == null ? 'font-serif text-[20px] text-text-quaternary' : undefined}
      />
      <MetricTile
        label="Comps Used"
        value={count > 0 ? `${count} comps ↓` : '—'}
        href={count > 0 ? '#comparable-sales' : undefined}
        hint={compsHint}
      />
      {showAskingTile && (
        <MetricTile
          label="Asking Price"
          value={formatCents(record.asking_price_cents!)}
        />
      )}
    </div>
  )
}
