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

const SEVERITY_CHIP: Record<string, string> = {
  positive: 'bg-green-50 text-green-700',
  caution: 'bg-amber-50 text-amber-700',
  concern: 'bg-red-50 text-red-700',
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

  const headline =
    findingCount === 0
      ? 'Continue with the full analysis.'
      : findingCount === 1
        ? 'We found 1 thing you should ask the seller about this car.'
        : `We found ${findingCount} things you should ask the seller about this car.`

  // TODO: /analyze/[id]/full does not exist yet — route will 404 until the full report page is built.
  const fullHref = `/analyze/${listingId}/full`
  const ctaHref = viewerTier === 'anonymous' ? `/signup?next=${fullHref}` : fullHref
  const ctaLabel =
    viewerTier === 'anonymous' ? 'Sign in for the full analysis' : 'Read the full analysis'

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="font-serif text-xl font-semibold text-gray-900">{headline}</h2>

      {findings.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {findings.map((finding) => (
            <div
              key={finding.rule_id}
              className="rounded-md border border-gray-100 bg-gray-50 p-4"
            >
              <span
                className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${SEVERITY_CHIP[finding.severity] ?? SEVERITY_CHIP.caution}`}
              >
                {finding.severity}
              </span>
              <p className="mt-2 text-sm font-medium text-gray-900">{finding.title}</p>
              {/* Body is intentionally blurred — real finding text, obscured for teaser. select-none prevents copy around the blur. */}
              <p className="mt-1 select-none blur-sm text-sm text-gray-600" aria-hidden="true">
                {finding.body}
              </p>
              <p className="mt-2 text-xs text-gray-400">Sign in to read</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-1">
        {ALSO_IN_REPORT.map((item, i) => (
          <Fragment key={item}>
            {i > 0 && (
              <span aria-hidden="true" className="select-none text-xs text-gray-300">·</span>
            )}
            <span className="text-xs text-gray-500">{item}</span>
          </Fragment>
        ))}
      </div>

      <div className="mt-5">
        <Link
          href={ctaHref}
          className="inline-flex items-center rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  )
}
