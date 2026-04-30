import Link from 'next/link'
import type { AnalysisData, ViewerTier } from './types'
import type { CompResultRow } from '@/lib/comp-engine/db-types'

type Props = {
  analysisData: AnalysisData | null
  compResult: CompResultRow | null
  viewerTier: ViewerTier
  listingId: string
}

export function VerdictBlock({ analysisData, compResult, viewerTier, listingId }: Props) {
  if (viewerTier === 'anonymous') {
    return (
      <div className="mt-6 border-[0.5px] border-border-default border-l-[3px] border-l-accent-primary bg-bg-surface px-6 py-5">
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
      </div>
    )
  }

  if (!analysisData?.lede) {
    return (
      <div className="mt-6 border-[0.5px] border-border-default border-l-[3px] border-l-accent-primary bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">The verdict</p>
        <p className="mt-3 font-serif text-[22px] leading-[1.3] text-text-primary">Verdict in development.</p>
        <p className="mt-3 font-sans text-[13px] text-text-tertiary">Comp engine launching with full report.</p>
      </div>
    )
  }

  return (
    <div className="mt-6 border-[0.5px] border-border-default border-l-[3px] border-l-accent-primary bg-bg-surface px-6 py-5">
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
            {/* confidence_score (numeric %) intentionally not rendered: framework-now-surface-later */}
          </span>
          {analysisData.methodology && (
            <span className="font-sans text-[13px] text-text-tertiary">&middot; {analysisData.methodology}</span>
          )}
        </div>
      )}
    </div>
  )
}
