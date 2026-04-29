import Link from 'next/link'
import type { AnalysisData, ViewerTier } from './types'

type Props = {
  analysisData: AnalysisData | null
  viewerTier: ViewerTier
  listingId: string
}

const CONFIDENCE_COLORS: Record<'low' | 'medium' | 'high', string> = {
  low: 'text-amber-600',
  medium: 'text-yellow-600',
  high: 'text-green-700',
}

export function VerdictBlock({ analysisData, viewerTier, listingId }: Props) {
  if (viewerTier === 'anonymous') {
    return (
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <p className="font-serif text-lg leading-relaxed text-gray-900">
          Sign in to see the verdict on this car.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Free account. Full verdict, comparable sales, and generation context — no credit card required.
        </p>
        <div className="mt-4 border-t border-gray-100 pt-4">
          <Link
            href={`/signup?next=/analyze/${listingId}`}
            className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
          >
            Unlock — it&apos;s free
          </Link>
        </div>
      </div>
    )
  }

  // free and pro: render the verdict if a lede exists
  if (!analysisData?.lede) return null

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
      <p className="font-serif text-lg leading-relaxed text-gray-900">{analysisData.lede}</p>
      {analysisData.secondary_line && (
        <p className="mt-2 text-sm text-gray-600">{analysisData.secondary_line}</p>
      )}
      <div className="mt-4 border-t border-gray-100 pt-4">
        {analysisData.confidence_label && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-sm font-medium text-gray-700">Confidence:</span>
            <span
              className={`text-sm font-semibold capitalize ${CONFIDENCE_COLORS[analysisData.confidence_label]}`}
            >
              {analysisData.confidence_label}
              {/* confidence_score (numeric %) intentionally not rendered: framework-now-surface-later */}
            </span>
            {analysisData.methodology && (
              <span className="text-sm text-gray-500">&middot; {analysisData.methodology}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
