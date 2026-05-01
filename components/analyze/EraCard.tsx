import type React from 'react'
import type { Tables } from '@/lib/supabase/types'
import type { ViewerTier } from './types'

type Props = {
  generation: Tables<'porsche_generations'> | null
  viewerTier: ViewerTier
}

export function EraCard({ generation, viewerTier }: Props) {
  const genLabel = generation?.generation_id ?? 'this generation'
  const sectionLabel = `The ${genLabel} generation`

  // Hardcoded 997.2 content — visual UX test ahead of the markdown→DB pipeline (TODO #9)
  if (generation?.generation_id === '997.2') {
    const paras = [
      'The 997.2 (2009–2012) is a generation break disguised as a facelift. Three things changed at once: the all-new 9A1 direct-injection flat-six replaced the M96/M97, 7-speed PDK dual-clutch replaced Tiptronic S, and LED running lights arrived. For valuation, 997.1 and 997.2 are best treated as separate generations.',
      'The 9A1 eliminates the IMS bearing concern that defines 997.1 base trims. There\'s no intermediate shaft. Base 997.2 Carreras (3.6L) and Carrera S (3.8L) are a clean mechanical step forward.',
      'Halo trims kept the Mezger. The GT3 (2010–2011), GT3 RS (2011), GT3 RS 4.0 (~600 units), GT2 RS (~500 units), and Turbo through MY2010 still use the race-derived flat-six. These are mechanically distinct from 9A1-engined Carreras and trade in a different price tier.',
      'PDK changed buyer behavior. By MY2010, take rates exceeded 70% on Carrera trims. Manual 997.2 cars are increasingly scarce and command rising premiums.',
      'The production-numbered halos worth knowing: Speedster (2011, 356 units), Sport Classic (2010, 250 units), GT3 RS 4.0 (2011, ~600 units, last road-going Mezger NA), GT2 RS (2011, ~500 units).',
    ]
    const displayed = viewerTier === 'anonymous' ? paras.slice(0, 1) : paras
    const liningNums: React.CSSProperties = { fontVariantNumeric: 'lining-nums', fontFeatureSettings: '"lnum"' }
    return (
      <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary" style={liningNums}>{sectionLabel}</p>
        <div className="mt-4">
          {displayed.map((para, idx) => (
            <p key={idx} className={`font-serif text-[15px] italic leading-[1.65] text-text-secondary${idx > 0 ? ' mt-3' : ''}`} style={liningNums}>
              {para}
            </p>
          ))}
          {viewerTier === 'anonymous' && paras.length > 1 && (
            <p className="mt-3 font-sans text-[13px] text-text-muted">
              Full era guide available with a free account.
            </p>
          )}
        </div>
      </div>
    )
  }

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
