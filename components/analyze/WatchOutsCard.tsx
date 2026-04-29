import type { Tables } from '@/lib/supabase/types'
import { Card } from '@/components/ui/card'
import { parseWatchOuts } from './types'
import type { ViewerTier } from './types'

type Props = {
  editorial: Tables<'generation_editorial'> | null
  viewerTier: ViewerTier
}

export function WatchOutsCard({ editorial, viewerTier }: Props) {
  const watchOuts = parseWatchOuts(editorial?.watch_outs)

  if (watchOuts.length === 0) return null

  const displayed =
    viewerTier === 'anonymous' ? watchOuts.slice(0, 1) : watchOuts
  const hidden = watchOuts.length - displayed.length

  return (
    <Card title="Watch-outs">
      <ul className="space-y-2">
        {displayed.map((item, idx) => (
          <li key={idx} className="flex gap-2 text-sm text-gray-700">
            <span className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true">
              &#9888;
            </span>
            {item}
          </li>
        ))}
      </ul>
      {viewerTier === 'anonymous' && hidden > 0 && (
        <p className="mt-3 text-sm text-gray-400">
          +{hidden} more for members
        </p>
      )}
    </Card>
  )
}
