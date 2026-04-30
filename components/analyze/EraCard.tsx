import type { Tables } from '@/lib/supabase/types'
import type { ViewerTier } from './types'

type Props = {
  generation: Tables<'porsche_generations'> | null
  viewerTier: ViewerTier
}

export function EraCard({ generation, viewerTier }: Props) {
  const genLabel = generation?.generation_id ?? 'this generation'
  const sectionLabel = `The ${genLabel} era`

  const eraYears = generation?.year_start
    ? generation.year_end
      ? `${generation.year_start}–${generation.year_end}`
      : `${generation.year_start}–`
    : null

  if (generation?.content_status !== 'published' || !generation.notes) {
    return (
      <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">{sectionLabel}</p>
        <p className="mt-4 font-serif text-[15px] italic leading-[1.65] text-text-tertiary">
          Era guide for this generation is in development.
        </p>
      </div>
    )
  }

  const paragraphs = generation.notes.split(/\n\n+/).filter(Boolean)
  const displayed =
    viewerTier === 'anonymous' ? paragraphs.slice(0, 1) : paragraphs

  return (
    <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">{sectionLabel}</p>
      <div className="mt-4">
        {displayed.map((para, idx) => (
          <p
            key={idx}
            className={`font-serif text-[15px] italic leading-[1.65] text-text-secondary${idx > 0 ? ' mt-3' : ''}`}
          >
            {para}
          </p>
        ))}
        {viewerTier === 'anonymous' && paragraphs.length > 1 && (
          <p className="mt-3 font-sans text-[13px] text-text-muted">
            Full era guide available with a free account.
          </p>
        )}
      </div>
      {(generation.engine_type || eraYears) && (
        <div className="mt-4 flex gap-4 border-t-[0.5px] border-border-subtle pt-4">
          {generation.engine_type && (
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">Cooling</p>
              <p className="mt-1 font-serif text-[15px] text-text-primary">{generation.engine_type}</p>
            </div>
          )}
          {eraYears && (
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">Era</p>
              <p className="mt-1 font-serif text-[15px] text-text-primary">{eraYears}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
