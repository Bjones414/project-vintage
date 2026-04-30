import { Fragment } from 'react'
import Link from 'next/link'
import type { Tables } from '@/lib/supabase/types'
import type { ViewerTier } from './types'
import { parseFindings } from './types'

type Props = {
  analysisRow: Tables<'listing_analyses'> | null
  listingId: string
  viewerTier: ViewerTier
}

const SEVERITY_DOT: Record<string, string> = {
  positive: 'bg-severity-positive',
  caution: 'bg-severity-caution',
  concern: 'bg-severity-concern',
}

const ALSO_IN_REPORT = [
  'Numbered findings list with full detail',
  'Generation deep-dive',
  'Full vehicle data',
  'Color rarity context',
  'Comp set with recency weighting',
]

export function TeaserBlock({ analysisRow, listingId, viewerTier }: Props) {
  const findings = parseFindings(analysisRow?.findings ?? null).slice(0, 3)
  const findingCount = analysisRow?.finding_count ?? 0

  const headlineCount =
    findingCount === 0
      ? null
      : findingCount === 1
        ? '1 thing'
        : `${findingCount} things`

  // TODO: /analyze/[id]/full does not exist yet — route will 404 until the full report page is built.
  const fullHref = `/analyze/${listingId}/full`
  const ctaHref = viewerTier === 'anonymous' ? `/signup?next=${fullHref}` : fullHref
  const ctaLabel =
    viewerTier === 'anonymous' ? 'Sign in for the full analysis' : 'Read the full analysis'

  return (
    <div className="mt-6 border-[0.5px] border-border-default border-t-[3px] border-t-accent-primary bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">The full analysis</p>
      <h2 className="mt-3 font-serif text-[22px] leading-[1.3] text-text-primary">
        {headlineCount === null
          ? 'Continue with the full analysis.'
          : <>We found <span className="text-accent-primary">{headlineCount}</span> you should ask the seller about this car.</>
        }
      </h2>

      {findings.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {findings.map((finding) => (
            <div
              key={finding.rule_id}
              className="border-[0.5px] border-border-default bg-bg-surface p-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-[5px] w-[5px] shrink-0 rounded-full ${SEVERITY_DOT[finding.severity] ?? SEVERITY_DOT.caution}`}
                  aria-hidden="true"
                />
                <span className="font-serif text-[11px] uppercase tracking-[0.18em] text-text-quaternary">
                  {finding.severity}
                </span>
              </div>
              <p className="mt-2 font-serif text-[14px] text-text-primary">{finding.title}</p>
              {/* Body is intentionally blurred — real finding text, obscured for teaser. select-none prevents copy around the blur. */}
              <p className="mt-1 select-none blur-[2.5px] font-sans text-[13px] text-text-tertiary" aria-hidden="true">
                {finding.body}
              </p>
              <p className="mt-2 font-sans text-[12px] text-text-muted">Sign in to read</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 border-t-[0.5px] border-border-subtle bg-bg-elevated px-0 py-3">
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
          {ALSO_IN_REPORT.map((item, i) => (
            <Fragment key={item}>
              {i > 0 && (
                <span aria-hidden="true" className="select-none font-sans text-[12px] text-text-muted">·</span>
              )}
              <span className="font-sans text-[12px] text-text-tertiary">{item}</span>
            </Fragment>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <Link
          href={ctaHref}
          className="inline-flex items-center rounded-button bg-text-primary px-5 py-[10px] font-sans text-[13px] font-medium tracking-[0.02em] text-bg-canvas hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2"
        >
          {ctaLabel} →
        </Link>
      </div>
    </div>
  )
}
