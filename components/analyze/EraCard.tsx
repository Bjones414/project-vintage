'use client'
import { useState } from 'react'
import type React from 'react'
import type { Tables } from '@/lib/supabase/types'
import type { ViewerTier } from './types'
import type { WatchForItem, WatchForSeverity } from '@/lib/defect-catalog/types'
import { getDecadeFallback } from '@/lib/era-content/decade-fallback'
import { getGenerationContent } from '@/lib/era-content/generation-content'
import { formatGenerationDisplay, formatGenerationFull } from '@/lib/era-content/generation-display'

type Props = {
  generation: Tables<'porsche_generations'> | null
  viewerTier: ViewerTier
  watchForItems?: WatchForItem[]
  make?: string | null
  model?: string | null
}

// Porsche models not yet in V1 catalog — full analysis not available.
// Listings still cache as comparable sale data.
const OUT_OF_V1_SCOPE_PORSCHE = new Set([
  '912', '912E', '914', '924', '928', '944', '959', '968',
])

const SEVERITY_PILL: Record<WatchForSeverity, string> = {
  high:     'bg-[#A32D2D]/10 border border-[#A32D2D]/40 text-severity-concern',
  moderate: 'bg-[#BA7517]/10 border border-[#BA7517]/40 text-severity-caution',
  low:      'bg-[#1D9E75]/10 border border-[#1D9E75]/40 text-severity-positive',
}

const SEVERITY_LABEL: Record<WatchForSeverity, string> = {
  high:     'HIGH',
  moderate: 'MEDIUM',
  low:      'LOW',
}

function firstSentence(text: string): string {
  const end = text.search(/\.\s+[A-Z]/)
  if (end !== -1 && end <= 200) return text.slice(0, end + 1)
  if (text.length > 160) return text.slice(0, 160).trimEnd() + '…'
  return text
}

// Splits "value (parenthetical)" into { main, paren } for MSRP styling
function splitParenthetical(value: string): { main: string; paren: string | null } {
  const m = value.match(/^(.+?)\s*(\([^)]+\))\s*$/)
  if (m) return { main: m[1], paren: m[2] }
  return { main: value, paren: null }
}

function WatchForSection({ items }: { items: WatchForItem[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const displayItems = items.slice(0, 3)

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="mt-4 border-t-[0.5px] border-border-subtle pt-4">
        <p className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">
          What to Watch For
        </p>
        <ul className="mt-2 divide-y divide-border-subtle">
          {displayItems.map((item) => {
            const isOpen = expanded.has(item.source_id)
            const summary = firstSentence(item.description)
            return (
              <li key={item.source_id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 py-2 text-left"
                  onClick={() => toggle(item.source_id)}
                  aria-expanded={isOpen}
                >
                  {/* Severity pill — 9px Inter 500, 0.12em tracking, 3px 8px padding, 2px radius */}
                  <span
                    className={`shrink-0 rounded-[2px] px-2 py-[3px] font-sans text-[9px] font-medium tracking-[0.12em] ${SEVERITY_PILL[item.severity]}`}
                  >
                    {SEVERITY_LABEL[item.severity]}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      {/* Watch title — 14px serif */}
                      <span className="font-serif text-[14px] text-text-primary">{item.title}</span>
                      {item.source === 'recall' && (
                        // Federal Recall badge — 8.5px Inter, 0.14em, text-quaternary, 0.5px border-default
                        <span className="border-[0.5px] border-border-default px-[7px] py-[3px] font-sans text-[8.5px] tracking-[0.14em] text-text-quaternary">
                          Federal Recall
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expand affordance — 18px serif */}
                  <span className="shrink-0 font-serif text-[18px] leading-none text-text-quaternary">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div
                    className="overflow-hidden pb-2.5 pt-1"
                    style={{
                      animation: 'var(--motion-safe, expand-down 200ms ease)',
                    }}
                  >
                    <p className="font-sans text-[12px] leading-[1.6] text-text-secondary">
                      {summary}
                    </p>
                    {item.buyer_check && (
                      <div className="mt-2">
                        <p className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">
                          Ask the seller
                        </p>
                        <p className="mt-0.5 font-sans text-[11px] italic leading-relaxed text-text-tertiary">
                          {item.buyer_check}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
    </div>
  )
}

export function EraCard({ generation, viewerTier, watchForItems = [], make, model }: Props) {
  // Non-Porsche or out-of-scope Porsche: render limited-support fallback before
  // attempting any generation content. These listings are cached as comp data but
  // no era guide is available.
  if (generation === null) {
    const isPorsche = make?.toLowerCase() === 'porsche'
    const isOutOfScope = isPorsche && model !== null && model !== undefined && OUT_OF_V1_SCOPE_PORSCHE.has(model)

    if (!isPorsche && make) {
      return (
        <div className="flex h-full flex-col border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
          <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">Generation</p>
          <div className="mt-3 border-t-[0.5px] border-border-default" />
          <div className="mt-4">
            <p className="font-serif text-[15px] italic leading-[1.65] text-text-tertiary">
              We don&apos;t currently support {make} for full analysis. Cached as comparable sale data.
            </p>
          </div>
        </div>
      )
    }

    if (isOutOfScope) {
      return (
        <div className="flex h-full flex-col border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
          <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">Generation</p>
          <div className="mt-3 border-t-[0.5px] border-border-default" />
          <div className="mt-4">
            <p className="font-serif text-[15px] italic leading-[1.65] text-text-tertiary">
              Porsche {model} — not yet in V1 catalog. Cached as comparable sale.
            </p>
          </div>
        </div>
      )
    }
  }

  const genLabel = generation?.generation_id
    ? formatGenerationFull(generation.generation_id)
    : 'this generation'
  const sectionLabel = `The ${genLabel} generation`
  const liningNums: React.CSSProperties = { fontVariantNumeric: 'lining-nums', fontFeatureSettings: '"lnum"' }

  const showWatchFor = watchForItems.length > 0

  // Hardcoded 997.2 content — visual UX test ahead of the markdown→DB pipeline (TODO #9)
  if (generation?.generation_id === '997.2') {
    const quickStats: Array<{ label: string; value: string }> = [
      { label: 'Years Produced',   value: '2009–2012' },
      { label: 'Preceded By',      value: '997.1' },
      { label: 'Succeeded By',     value: '991.1' },
      { label: 'Base Engine',      value: '9A1 3.6L / 3.8L DFI' },
      { label: 'Halo Engine',      value: 'Mezger 3.6L / 4.0L' },
      { label: 'Last Mezger Year', value: '2011' },
    ]

    const keyFacts: Array<{ lead: string; body: string }> = [
      { lead: 'No IMS bearing.',    body: '9A1 eliminates the failure mode that defines 997.1 base trims.' },
      { lead: 'Manual now scarce.', body: 'PDK take rates exceeded 70% by MY2010.' },
    ]

    return (
      <div className="flex h-full flex-col border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary" style={liningNums}>{sectionLabel}</p>
        <div className="mt-3 border-t-[0.5px] border-border-default" />

        <div className="mt-4 flex flex-1 flex-col">
          <p className="font-serif text-[15px] italic leading-[1.65] text-text-secondary" style={liningNums}>
            Generation break disguised as a facelift — the all-new 9A1 direct-injection engine, 7-speed PDK transmission, and LED lighting arrived simultaneously, making it mechanically distinct from the 997.1 it superseded.
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
            {quickStats.map(({ label, value }) => (
              <div key={label}>
                <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">{label}</dt>
                <dd className="mt-0.5 font-serif text-[14px] text-text-primary" style={liningNums}>{value}</dd>
              </div>
            ))}
          </dl>

          {viewerTier !== 'anonymous' && (
            <div className="mt-4 space-y-2">
              {keyFacts.map(({ lead, body }) => (
                <p key={lead} className="font-sans text-[13px] leading-[1.5] text-text-secondary" style={liningNums}>
                  <strong className="font-medium text-text-primary">{lead}</strong>{' '}{body}
                </p>
              ))}
            </div>
          )}

          {viewerTier === 'anonymous' && (
            <p className="mt-3 font-sans text-[13px] text-text-muted">
              Full era guide available with a free account.
            </p>
          )}

          {showWatchFor && (
            <WatchForSection items={watchForItems} />
          )}

          <a
            href="/generations/997.2"
            className="mt-auto block w-full cursor-pointer border-t-[0.5px] border-t-accent-primary pt-[14px] pb-[12px] px-[14px] font-serif italic text-[15px] font-medium text-accent-primary bg-[rgba(139,105,20,0.04)] hover:bg-[rgba(139,105,20,0.10)] transition-colors duration-150 focus:outline focus:outline-2 focus:outline-accent-primary focus:outline-offset-2"
          >
            More on the 997.2 →
          </a>
        </div>
      </div>
    )
  }

  if (generation?.content_status !== 'published' || !generation.notes) {
    const decadeFallback = generation?.generation_id
      ? getDecadeFallback(generation.generation_id)
      : null
    const genContent = generation?.generation_id
      ? getGenerationContent(generation.generation_id)
      : null

    // Prefer DB fields → decade-fallback → generation-content (richest available source)
    const introText = decadeFallback?.intro ?? genContent?.intro ?? null

    const bodyStylesDisplay = generation?.body_styles?.length
      ? generation.body_styles.join(', ')
      : (decadeFallback?.body_styles ?? genContent?.body_styles ?? null)

    const rawMsrp = generation?.msrp_launch_usd ?? null
    const msrpParts = rawMsrp ? splitParenthetical(rawMsrp) : null

    const metadataFields = ([
      { label: 'Body styles',    value: bodyStylesDisplay },
      { label: 'Engine',         value: generation?.engine_family ?? decadeFallback?.engine ?? genContent?.engine },
      { label: 'Original MSRP',  value: rawMsrp, msrpParts },
      { label: 'Cooling',        value: generation?.engine_type ?? decadeFallback?.cooling ?? genContent?.cooling },
    ] as Array<{
      label: string
      value: string | null | undefined
      msrpParts?: { main: string; paren: string | null } | null
    }>).filter(
      (f): f is typeof f & { value: string } => f.value != null && f.value !== '',
    )

    const hasAnyContent = introText !== null || metadataFields.length > 0

    return (
      <div className="flex h-full flex-col border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary" style={liningNums}>{sectionLabel}</p>
        <div className="mt-3 border-t-[0.5px] border-border-default" />

        <div className="mt-4 flex flex-1 flex-col">
          {introText && (
            <p className="font-serif text-[15px] italic leading-[1.65] text-text-secondary" style={liningNums}>
              {introText}
            </p>
          )}

          {metadataFields.length > 0 && (
            <div className={introText ? 'mt-4 border-t-[0.5px] border-border-subtle pt-4' : 'mt-4'}>
              <dl className="grid gap-y-3">
                {metadataFields.map(({ label, value, msrpParts: mp }) => (
                  <div key={label}>
                    <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">{label}</dt>
                    <dd className="mt-0.5 font-serif text-[14px] text-text-primary" style={liningNums}>
                      {mp ? (
                        <>
                          {mp.main}
                          {mp.paren && (
                            <span className="ml-1 font-serif text-[13px] italic text-text-tertiary">{mp.paren}</span>
                          )}
                        </>
                      ) : value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {!hasAnyContent && (
            <p className="font-serif text-[15px] italic leading-[1.65] text-text-tertiary">
              Era guide for this generation coming soon.
            </p>
          )}

          {viewerTier === 'anonymous' && hasAnyContent && (
            <p className="mt-3 font-sans text-[13px] text-text-muted">
              Full era guide available with a free account.
            </p>
          )}

          {showWatchFor && (
            <WatchForSection items={watchForItems} />
          )}

          {viewerTier !== 'anonymous' && !!generation?.generation_id && (
            <a
              href={`/generations/${generation.generation_id}`}
              className="mt-auto block w-full cursor-pointer border-t-[0.5px] border-t-accent-primary pt-[14px] pb-[12px] px-[14px] font-serif italic text-[15px] font-medium text-accent-primary bg-[rgba(139,105,20,0.04)] hover:bg-[rgba(139,105,20,0.10)] transition-colors duration-150 focus:outline focus:outline-2 focus:outline-accent-primary focus:outline-offset-2"
            >
              More on the {formatGenerationDisplay(generation.generation_id)} →
            </a>
          )}
        </div>
      </div>
    )
  }

  const paragraphs = generation.notes.split(/\n\n+/).filter(Boolean)
  const displayed =
    viewerTier === 'anonymous' ? paragraphs.slice(0, 1) : paragraphs

  const bodyStylesDisplay = generation.body_styles?.length
    ? generation.body_styles.join(', ')
    : null

  const rawMsrp = generation.msrp_launch_usd ?? null
  const msrpParts = rawMsrp ? splitParenthetical(rawMsrp) : null

  const metadataFields: Array<{
    label: string
    value: string
    msrpParts?: { main: string; paren: string | null } | null
  }> = ([
    { label: 'Body styles',    value: bodyStylesDisplay },
    { label: 'Engine',         value: generation.engine_family },
    { label: 'Original MSRP',  value: rawMsrp, msrpParts },
    { label: 'Cooling',        value: generation.engine_type },
  ] as Array<{
    label: string
    value: string | null | undefined
    msrpParts?: { main: string; paren: string | null } | null
  }>).filter(
    (f): f is typeof f & { value: string } =>
      f.value != null && f.value !== '',
  )

  return (
    <div className="flex h-full flex-col border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary" style={liningNums}>{sectionLabel}</p>
      <div className="mt-3 border-t-[0.5px] border-border-default" />

      <div className="mt-4 flex flex-1 flex-col">
        <div>
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
            <dl className="grid gap-y-3">
              {metadataFields.map(({ label, value, msrpParts: mp }) => (
                <div key={label}>
                  <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">{label}</dt>
                  <dd className="mt-0.5 font-serif text-[14px] text-text-primary">
                    {mp ? (
                      <>
                        {mp.main}
                        {mp.paren && (
                          <span className="ml-1 font-serif text-[13px] italic text-text-tertiary">{mp.paren}</span>
                        )}
                      </>
                    ) : value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {showWatchFor && (
          <WatchForSection items={watchForItems} />
        )}

        {viewerTier !== 'anonymous' && (
          <a
            href={`/generations/${generation.generation_id}`}
            className="mt-auto block w-full cursor-pointer border-t-[0.5px] border-t-accent-primary pt-[14px] pb-[12px] px-[14px] font-serif italic text-[15px] font-medium text-accent-primary bg-[rgba(139,105,20,0.04)] hover:bg-[rgba(139,105,20,0.10)] transition-colors duration-150 focus:outline focus:outline-2 focus:outline-accent-primary focus:outline-offset-2"
          >
            More on the {formatGenerationDisplay(generation.generation_id)} →
          </a>
        )}
      </div>
    </div>
  )
}
