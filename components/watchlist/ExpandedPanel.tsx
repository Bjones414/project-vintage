'use client'
// ExpandedPanel — the analysis panel that appears inline below a WatchlistRow after the user
// clicks to expand. Always freshly fetched — never rendered from stale server data.
//
// COMPLIANCE: rendered only after a user-triggered row click + API call. Never shown on
// page mount. No background fetching.

import Link from 'next/link'
import { useState } from 'react'
import type { WatchlistRefreshResult } from '@/lib/watchlist/state'
import { formatGenerationDisplay } from '@/lib/era-content/generation-display'
import { CompRangeViz } from './CompRangeViz'

interface ListingSummary {
  year: number | null
  make: string | null
  model: string | null
  trim: string | null
  listing_status: string | null
  high_bid: number | null
  final_price: number | null
  generation_id: string | null
}

type WatchItem = {
  title: string
  severity: 'high' | 'moderate' | 'low'
  description: string
}

interface Props {
  listingId: string
  listing: ListingSummary
  refreshData: WatchlistRefreshResult
  generationWatchForItems: WatchItem[]
  onCollapse: () => void
  onRemove: () => void
}

const SEVERITY_STYLE: Record<string, { bg: string; color: string }> = {
  high:     { bg: '#EFD9D2', color: '#8C3A28' },
  moderate: { bg: 'var(--bg-elevated)', color: 'var(--text-tertiary)' },
  low:      { bg: 'var(--bg-elevated)', color: 'var(--text-tertiary)' },
}

function boldifyText(text: string): React.ReactNode {
  return text.split(/(\$[\d,]+(?:k)?|\d+[\s]+comparable)/g).map((part, i) => {
    const isBold = /^\$[\d,]+k?$/.test(part) || /^\d+\s+comparable/.test(part)
    return isBold
      ? <strong key={i} className="font-medium text-text-primary">{part}</strong>
      : <span key={i}>{part}</span>
  })
}

export function ExpandedPanel({ listingId, listing, refreshData, generationWatchForItems, onCollapse, onRemove }: Props) {
  const [removing, setRemoving] = useState(false)

  const carLabel = [listing.year, listing.make, listing.model, listing.trim]
    .filter(Boolean)
    .join(' ')

  const isActive = listing.listing_status !== 'sold' && listing.listing_status !== 'no-sale'
  const hasComps = refreshData.comp_count >= 3 && refreshData.comp_median !== null

  async function handleRemove() {
    if (removing) return
    setRemoving(true)
    try {
      await fetch(`/api/watchlist?listing_id=${listingId}`, { method: 'DELETE' })
      onRemove()
    } catch {
      setRemoving(false)
    }
  }

  return (
    <div className="border-t-[0.5px] border-border-default">
      {/* Two-column grid: analysis left, comp viz right */}
      <div
        className="grid gap-[56px] pb-8 pt-7 pr-6"
        style={{ gridTemplateColumns: '1fr 340px' }}
      >
        {/* ── Left column ── */}
        <div className="flex flex-col">
          {/* "The take" eyebrow */}
          <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.18em] text-accent-primary">
            The take
            <span className="mx-1 tracking-normal text-text-tertiary">·</span>
            <span className="font-serif text-[10px] normal-case italic tracking-normal text-text-tertiary">
              for the {carLabel} above
            </span>
          </p>

          {/* Reasoning paragraph */}
          <p className="font-serif text-[16px] leading-[1.7] text-text-secondary">
            {boldifyText(refreshData.reasoning)}
          </p>

          {/* Comp basis line */}
          {hasComps && (
            <p className="mt-3 font-serif text-[13px] italic text-text-tertiary">
              Based on {refreshData.comp_count} comparable sale{refreshData.comp_count !== 1 ? 's' : ''}
              {refreshData.oldest_comp_date
                ? ` since ${new Date(refreshData.oldest_comp_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                : ''
              }…
            </p>
          )}

          {/* Footer — mt-auto anchors this to the bottom of the left flex column */}
          <div className="mt-auto flex items-center justify-between pt-6">
            <Link
              href={`/analyze/${listingId}`}
              className="font-serif text-[13px] italic text-accent-primary underline decoration-[0.5px] underline-offset-2 hover:opacity-70"
            >
              View full analysis →
            </Link>
            <button
              type="button"
              onClick={handleRemove}
              disabled={removing}
              className="font-serif text-[13px] italic text-text-tertiary underline decoration-dotted underline-offset-2 hover:text-severity-concern disabled:opacity-40"
            >
              {removing ? 'Removing…' : 'Remove from watchlist'}
            </button>
          </div>
        </div>

        {/* ── Right column ── */}
        <div>
          {/* Comp eyebrow + Collapse — stacked so they can never share a horizontal row */}
          <div className="mb-3 flex flex-col gap-1">
            <p className="font-sans text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
              Comparable sales
              {refreshData.comp_count > 0 && (
                <> · {refreshData.comp_count} {listing.trim || listing.model || ''}</>
              )}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onCollapse}
                className="font-serif text-[13px] italic text-text-tertiary underline decoration-[0.5px] underline-offset-2 hover:text-accent-primary"
              >
                Collapse ↑
              </button>
            </div>
          </div>

          {/* Comp range visualization */}
          {hasComps && refreshData.comp_p25 !== null && refreshData.comp_p75 !== null ? (
            <div className="mb-4">
              <CompRangeViz
                p25Cents={refreshData.comp_p25}
                medianCents={refreshData.comp_median!}
                p75Cents={refreshData.comp_p75}
                bidCents={refreshData.current_bid}
                finalPriceCents={listing.final_price}
                isActive={isActive}
              />
            </div>
          ) : (
            <p className="mb-4 font-serif text-[13px] italic text-text-tertiary">
              Not enough comparable sales to generate a range.
            </p>
          )}

          {/* Hairline rule */}
          <div className="mb-4 border-t-[0.5px] border-border-subtle" />

          {/* Watch-for items: per-listing flags, or generation-level fallback */}
          {refreshData.watch_for_items.length > 0 ? (
            <div className="space-y-3">
              {refreshData.watch_for_items.map((item, i) => {
                const style = SEVERITY_STYLE[item.severity] ?? SEVERITY_STYLE.moderate
                return (
                  <div key={i} className="flex items-start gap-2">
                    <span
                      className="mt-[2px] shrink-0 rounded-[2px] px-[6px] py-[2px] font-sans text-[9px] uppercase tracking-[0.06em]"
                      style={{ backgroundColor: style.bg, color: style.color }}
                    >
                      {item.severity}
                    </span>
                    <span className="font-serif text-[13px] text-text-secondary">{item.title}</span>
                  </div>
                )
              })}
            </div>
          ) : listing.generation_id && generationWatchForItems.length > 0 ? (
            <div>
              <p className="mb-2 font-serif text-[12px] italic text-text-tertiary">
                What to watch for in the {formatGenerationDisplay(listing.generation_id)}
              </p>
              <div className="space-y-3">
                {generationWatchForItems.slice(0, 3).map((item, i) => {
                  const style = SEVERITY_STYLE[item.severity] ?? SEVERITY_STYLE.moderate
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span
                        className="mt-[2px] shrink-0 rounded-[2px] px-[6px] py-[2px] font-sans text-[9px] uppercase tracking-[0.06em]"
                        style={{ backgroundColor: style.bg, color: style.color }}
                      >
                        {item.severity}
                      </span>
                      <span className="font-serif text-[13px] text-text-secondary">{item.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
