import type { Tables } from '@/lib/supabase/types'
import type { ViewerTier } from './types'

type Props = {
  generation: Tables<'porsche_generations'> | null
  viewerTier: ViewerTier
}

export function EraCard({ generation, viewerTier }: Props) {
  const genLabel = generation?.generation_id ?? 'this generation'
  const sectionLabel = `The ${genLabel} generation`

  if (generation?.content_status !== 'published' || !generation.notes) {
    return (
      <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary" style={{ fontVariantNumeric: 'lining-nums', fontFeatureSettings: '"lnum"' }}>{sectionLabel}</p>
        <p className="mt-4 font-serif text-[15px] italic leading-[1.65] text-text-tertiary">
          Guide for this generation is in development.
        </p>
      </div>
    )
  }

  const paragraphs = generation.notes.split(/\n\n+/).filter(Boolean)
  const displayed =
    viewerTier === 'anonymous' ? paragraphs.slice(0, 1) : paragraphs

  const bodyStylesDisplay = generation.body_styles?.length
    ? generation.body_styles.join(', ')
    : null

  const metadataFields: Array<{ label: string; value: string }> = ([
    { label: 'Production', value: generation.production_years },
    { label: 'Body styles', value: bodyStylesDisplay },
    { label: 'Engine', value: generation.engine_family },
    { label: 'Original MSRP', value: generation.msrp_launch_usd },
    { label: 'Units produced', value: generation.units_produced },
    { label: 'Cooling', value: generation.engine_type },
  ] as Array<{ label: string; value: string | null | undefined }>).filter(
    (f): f is { label: string; value: string } =>
      f.value != null && f.value !== '',
  )

  return (
    <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary" style={{ fontVariantNumeric: 'lining-nums', fontFeatureSettings: '"lnum"' }}>{sectionLabel}</p>
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
      {metadataFields.length > 0 && (
        <div className="mt-4 border-t-[0.5px] border-border-subtle pt-4">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {metadataFields.map(({ label, value }) => (
              <div key={label}>
                <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">{label}</dt>
                <dd className="mt-1 font-serif text-[14px] text-text-primary">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}
