import type { Tables } from '@/lib/supabase/types'
import { Card } from '@/components/ui/card'
import type { ViewerTier } from './types'

type Props = {
  generation: Tables<'porsche_generations'> | null
  editorial: Tables<'generation_editorial'> | null
  viewerTier: ViewerTier
}

export function EraCard({ generation, editorial, viewerTier }: Props) {
  const genLabel = generation?.generation_id ?? 'this generation'
  const title = `The ${genLabel} era`

  if (!editorial) {
    return (
      <Card title={title}>
        <p className="text-sm text-gray-500">
          Era guide for this generation is in development.
        </p>
      </Card>
    )
  }

  const summary = editorial.summary ?? ''
  const paragraphs = summary.split(/\n\n+/).filter(Boolean)
  const displayed =
    viewerTier === 'anonymous' ? paragraphs.slice(0, 1) : paragraphs

  return (
    <Card title={title}>
      {displayed.map((para, idx) => (
        <p
          key={idx}
          className={`text-sm leading-relaxed text-gray-700${idx > 0 ? ' mt-3' : ''}`}
        >
          {para}
        </p>
      ))}
      {viewerTier === 'anonymous' && paragraphs.length > 1 && (
        <p className="mt-3 text-sm text-gray-400">
          Full era guide available with a free account.
        </p>
      )}
    </Card>
  )
}
