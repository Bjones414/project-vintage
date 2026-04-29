import type { AnalysisData, ViewerTier } from './types'

type Props = {
  analysisData: AnalysisData | null
  viewerTier: ViewerTier
}

const CONFIDENCE_COLORS: Record<'low' | 'medium' | 'high', string> = {
  low: 'text-amber-600',
  medium: 'text-yellow-600',
  high: 'text-green-700',
}

export function VerdictBlock({ analysisData, viewerTier }: Props) {
  if (!analysisData?.lede) return null

  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
      <p className="font-serif text-lg leading-relaxed text-gray-900">{analysisData.lede}</p>
      {analysisData.secondary_line && (
        <p className="mt-2 text-sm text-gray-600">{analysisData.secondary_line}</p>
      )}
      <div className="mt-4 border-t border-gray-100 pt-4">
        {viewerTier === 'anonymous' ? (
          <p className="text-sm text-gray-500">
            Confidence and methodology available with a free account.
          </p>
        ) : (
          analysisData.confidence_label && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-sm font-medium text-gray-700">Confidence:</span>
              <span
                className={`text-sm font-semibold capitalize ${CONFIDENCE_COLORS[analysisData.confidence_label]}`}
              >
                {analysisData.confidence_label}
                {analysisData.confidence_score != null
                  ? ` (${analysisData.confidence_score}%)`
                  : ''}
              </span>
              {analysisData.methodology && (
                <span className="text-sm text-gray-500">&middot; {analysisData.methodology}</span>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}
