import type { ResearchCompResult } from '@/lib/research/comp-query'
import { formatCents } from '@/lib/utils/currency'
import { formatGenerationLabel } from '@/lib/research/derive-generation'
import { monthsAgo } from '@/lib/comp-engine/recency-weight'

interface Props {
  generationId: string | null
  comps: ResearchCompResult
}

export function InsufficientCompsBlock({ generationId, comps }: Props) {
  const { filteredComps } = comps
  const genLabel = generationId ? formatGenerationLabel(generationId) : null
  const genHref = generationId ? `/generations/${generationId}` : null

  return (
    <div className="mx-auto max-w-[1080px] px-7 pb-7">
      {/* Empty state card — no gold left rule */}
      <div className="border-[0.5px] border-border-default bg-bg-surface px-9 py-8">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
          Subject
        </p>
        <p className="mt-[14px] font-serif text-[22px] leading-[1.3] text-text-primary">
          Not enough comparable sales for this exact configuration yet.
        </p>
        <p className="mt-3 font-serif text-[15px] italic leading-[1.6] text-text-tertiary">
          Foundation data is still building. Try a more common variant
          {genLabel && genHref ? (
            <>
              , or browse the{' '}
              <a href={genHref} className="text-accent-primary hover:underline">
                {genLabel}
              </a>{' '}
              generation page for context.
            </>
          ) : '.'}
        </p>
      </div>

      {/* Few comps that DO exist — disclaimer table */}
      {filteredComps.length > 0 && (
        <div className="mt-6 border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
          <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
            Comparable Sales
          </p>
          <p className="mt-1 font-serif text-[13px] italic text-text-muted">
            {filteredComps.length} sale{filteredComps.length !== 1 ? 's' : ''} match your inputs — not statistically sufficient for a verdict.
          </p>
          <div className="mt-4">
            {filteredComps.map((comp, idx) => {
              const title = [comp.year, comp.make, comp.model, comp.trim].filter(Boolean).join(' ')
              const mo = comp.auction_ends_at ? Math.round(monthsAgo(comp.auction_ends_at)) : null
              const moStr = mo != null ? (mo <= 1 ? '< 1 mo ago' : `${mo} mo ago`) : null
              const mileageStr = comp.mileage != null ? `${comp.mileage.toLocaleString()} mi` : null

              return (
                <div
                  key={comp.id ?? idx}
                  className="flex items-start gap-3 border-t-[0.5px] border-border-subtle py-3 first:border-0 first:pt-0"
                >
                  <span className="shrink-0 font-serif text-[18px] leading-none text-accent-secondary">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-[14px] text-text-primary">
                      {comp.source_url ? (
                        <a href={comp.source_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {title} ↗
                        </a>
                      ) : title}
                    </p>
                    <p className="font-sans text-[12px] text-text-tertiary">
                      {[mileageStr, moStr].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <p className="shrink-0 font-serif text-[15px] text-text-primary">
                    {comp.final_price != null ? formatCents(comp.final_price) : '—'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
