import type { Tables } from '@/lib/supabase/types'
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
    <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">Watch-outs</p>
      <ul className="mt-4 space-y-3">
        {displayed.map((item, idx) => (
          <li key={idx} className="flex gap-3">
            <span
              className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-severity-caution"
              aria-hidden="true"
            />
            <span className="font-sans text-[13px] leading-[1.55] text-text-secondary">{item}</span>
          </li>
        ))}
      </ul>
      {viewerTier === 'anonymous' && hidden > 0 && (
        <p className="mt-3 font-sans text-[13px] text-text-muted">
          +{hidden} more for members
        </p>
      )}
    </div>
  )
}
