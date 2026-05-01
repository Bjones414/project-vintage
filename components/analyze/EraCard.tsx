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
    const liningNums: React.CSSProperties = { fontVariantNumeric: 'lining-nums', fontFeatureSettings: '"lnum"' }

    const quickStats: Array<{ label: string; value: string }> = [
      { label: 'Years Produced',   value: '2009–2012' },
      { label: 'Preceded By',      value: '997.1' },
      { label: 'Succeeded By',     value: '991.1' },
      { label: 'Base Engine',      value: '9A1 3.6L / 3.8L DFI' },
      { label: 'Halo Engine',      value: 'Mezger 3.6L / 4.0L' },
      { label: 'Last Mezger Year', value: '2011' },
    ]

    const keyFacts: Array<{ lead: string; body: string }> = [
      { lead: 'No IMS bearing.',        body: '9A1 eliminates the failure mode that defines 997.1 base trims.' },
      { lead: 'Manual now scarce.',     body: 'PDK take rates exceeded 70% by MY2010.' },
      { lead: 'Halo Mezger continued.', body: 'GT3, GT3 RS, GT3 RS 4.0, GT2 RS retain the race-derived flat-six.' },
    ]

    return (
      <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary" style={liningNums}>{sectionLabel}</p>

        {/* Summary */}
        <p className="mt-4 font-serif text-[15px] italic leading-[1.65] text-text-secondary" style={liningNums}>
          Generation break disguised as a facelift — the all-new 9A1 direct-injection engine, 7-speed PDK transmission, and LED lighting arrived simultaneously, making it mechanically distinct from the 997.1 it superseded.
        </p>

        {/* Quick stats — mirrors Chassis Identity card label/value styling */}
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
          {quickStats.map(({ label, value }) => (
            <div key={label}>
              <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">{label}</dt>
              <dd className="mt-0.5 font-serif text-[14px] text-text-primary" style={liningNums}>{value}</dd>
            </div>
          ))}
        </dl>

        {/* Authenticated-only: key facts + halo footnote + read more */}
        {viewerTier !== 'anonymous' && (
          <>
            <div className="mt-4 space-y-2">
              {keyFacts.map(({ lead, body }) => (
                <p key={lead} className="font-sans text-[13px] leading-[1.5] text-text-secondary" style={liningNums}>
                  <strong className="font-medium text-text-primary">{lead}</strong>{' '}{body}
                </p>
              ))}
            </div>
            <p className="mt-3 font-serif text-[13px] italic leading-[1.55] text-text-tertiary" style={liningNums}>
              Limited halo runs: Speedster (356 units), Sport Classic (250), GT3 RS 4.0 (~600, last road-going Mezger), GT2 RS (~500).
            </p>
            <a
              href="/generations/997-2"
              className="mt-4 block font-sans text-[13px] text-accent-primary hover:opacity-70"
            >
              Read more →
            </a>
          </>
        )}

        {viewerTier === 'anonymous' && (
          <p className="mt-3 font-sans text-[13px] text-text-muted">
            Full era guide available with a free account.
          </p>
        )}
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
