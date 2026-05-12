import Link from 'next/link'
import type { ResearchRecord } from '@/lib/research/types'
import { formatCents } from '@/lib/utils/currency'

interface Props {
  record: ResearchRecord
  researchId: string
}

function Dot() {
  return (
    <span
      className="mx-2 inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-accent-secondary align-middle"
      aria-hidden="true"
    />
  )
}

export function ChipBar({ record, researchId }: Props) {
  const { year, model, trim, mileage, asking_price_cents } = record

  const segments: React.ReactNode[] = [`${year} Porsche ${model} ${trim}`.trim()]

  if (mileage != null) {
    segments.push(<>{mileage.toLocaleString('en-US')} mi</>)
  }

  if (asking_price_cents != null) {
    segments.push(<>{formatCents(asking_price_cents)} asking</>)
  }

  return (
    <div className="flex items-center justify-between border-b-[0.5px] border-border-default bg-bg-elevated px-7 py-4">
      {/* Left: label + identity + edit */}
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="shrink-0 font-sans text-[10px] uppercase tracking-[0.18em] text-accent-primary">
          Researching
        </span>
        <span className="font-serif text-[14px] text-text-primary">
          {segments.map((seg, i) => (
            <span key={i}>
              {i > 0 && <Dot />}
              {seg}
            </span>
          ))}
        </span>
        <Link
          href={`/research?prefill=${researchId}`}
          className="font-serif text-[13px] italic text-accent-primary hover:opacity-70"
        >
          Edit →
        </Link>
      </div>

      {/* Right: new search */}
      <Link
        href="/research"
        className="ml-6 shrink-0 font-serif text-[13px] italic text-text-tertiary hover:opacity-70"
      >
        New search →
      </Link>
    </div>
  )
}
