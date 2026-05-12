import type { ResearchRecord } from '@/lib/research/types'
import type { ResearchCompResult } from '@/lib/research/comp-query'
import { formatCents } from '@/lib/utils/currency'

interface Props {
  record: ResearchRecord
  comps: ResearchCompResult
}

// ─── Adaptive label + headline logic ──────────────────────────────────────────

type VerdictMode = 'asking+mileage' | 'asking-only' | 'mileage-only' | 'neither'

function resolveMode(record: ResearchRecord): VerdictMode {
  const hasMileage = record.mileage != null
  const hasAsking = record.asking_price_cents != null
  if (hasMileage && hasAsking) return 'asking+mileage'
  if (hasAsking) return 'asking-only'
  if (hasMileage) return 'mileage-only'
  return 'neither'
}

function verdictPosition(
  askingCents: number,
  midpoint: number,
): 'fair' | 'above' | 'below' {
  if (askingCents > midpoint * 1.1) return 'above'
  if (askingCents < midpoint * 0.9) return 'below'
  return 'fair'
}

const SECTION_LABEL: Record<VerdictMode, string> = {
  'asking+mileage': 'Market Position · Asking vs. Comps',
  'asking-only':    'Market Position · Asking vs. Comps',
  'mileage-only':   'Market Range · This Configuration',
  'neither':        'Aggregate Market · This Configuration',
}

// ─── ResearchedBadge ──────────────────────────────────────────────────────────

function ResearchedBadge() {
  return (
    <div
      className="mb-4 inline-flex items-center gap-[7px] px-[11px] py-[5px]"
      style={{ backgroundColor: 'var(--bg-elevated)' }}
    >
      <span
        className="h-[5px] w-[5px] shrink-0 rounded-full"
        style={{ backgroundColor: 'var(--text-secondary)' }}
        aria-hidden="true"
      />
      <span
        className="font-serif text-[10px] uppercase tracking-[0.18em] text-text-tertiary"
        style={{ fontVariant: 'small-caps' }}
      >
        Researched · not a live listing
      </span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ResearchVerdictBlock({ record, comps }: Props) {
  const { midpoint, p25, p75, count, isMileageFiltered } = comps
  const mode = resolveMode(record)
  const askingCents = record.asking_price_cents
  const subjectMileage = record.mileage

  const label = SECTION_LABEL[mode]

  let headline: string
  let body: string

  const rangeStr =
    p25 != null && p75 != null
      ? `${formatCents(p25)} – ${formatCents(p75)}`
      : midpoint != null
      ? `around ${formatCents(midpoint)}`
      : null

  if ((mode === 'asking+mileage' || mode === 'asking-only') && askingCents != null && midpoint != null) {
    const pos = verdictPosition(askingCents, midpoint)
    const posLabel: Record<typeof pos, string> = {
      fair:  'Asking price sits at fair value.',
      above: 'Asking price sits above comparable sales.',
      below: 'Asking price sits below comparable sales.',
    }
    headline = posLabel[pos]

    const askingStr = formatCents(askingCents)
    const baseBody = rangeStr
      ? `${askingStr} asking against a comp range of ${rangeStr}, based on ${count} sale${count !== 1 ? 's' : ''}.`
      : `Based on ${count} comparable sale${count !== 1 ? 's' : ''}.`

    if (mode === 'asking-only') {
      body = baseBody + ' Mileage not provided — range reflects all available comps.'
    } else {
      body = baseBody + (isMileageFiltered
        ? ` Comps filtered within 25% of ${subjectMileage!.toLocaleString()} mi.`
        : '')
    }
  } else if (mode === 'mileage-only') {
    headline = 'Recent sales suggest a market range for this car.'
    body = rangeStr
      ? `Comp range ${rangeStr} across ${count} sale${count !== 1 ? 's' : ''}.${isMileageFiltered ? ` Filtered within 25% of ${subjectMileage!.toLocaleString()} mi.` : ''}`
      : `Based on ${count} comparable sale${count !== 1 ? 's' : ''}.`
  } else {
    headline = 'Recent market context for this configuration.'
    body = rangeStr
      ? `Comp range ${rangeStr} across ${count} sale${count !== 1 ? 's' : ''} — all mileages.`
      : `Based on ${count} comparable sale${count !== 1 ? 's' : ''}.`
  }

  const midpointStr = midpoint != null ? formatCents(midpoint) : '—'

  return (
    <div
      id="verdict"
      className="mx-auto max-w-[1080px] px-7 pb-7"
    >
      <div
        className="border-[0.5px] border-border-default bg-bg-surface px-9 py-7"
        style={{ borderLeft: '3px solid var(--accent-primary)' }}
      >
        <div className="max-w-[760px]">
          <ResearchedBadge />

          <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
            {label}
          </p>

          <p className="mt-3 font-serif text-[22px] leading-[1.3] text-text-primary">
            {headline}
          </p>

          <p className="mt-3 font-serif text-[15px] leading-[1.6] text-text-tertiary">
            {body}
          </p>

          <div className="my-5 border-t-[0.5px] border-border-subtle" />

          <p className="font-sans text-[11px] uppercase tracking-[0.04em] text-text-quaternary">
            Fair Value Midpoint ·{' '}
            <span className="font-serif text-[13px] normal-case italic text-text-primary">
              {midpointStr}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
