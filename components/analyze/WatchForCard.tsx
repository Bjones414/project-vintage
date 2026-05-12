'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { WatchForItem, WatchForSeverity } from '@/lib/defect-catalog/types'
import { formatGenerationDisplay } from '@/lib/era-content/generation-display'

type Props = {
  items: WatchForItem[]
  generationId?: string | null
}

const SEVERITY_PILL: Record<WatchForSeverity, string> = {
  high:     'bg-[#A32D2D]/10 border border-[#A32D2D]/30 text-severity-concern',
  moderate: 'bg-[#BA7517]/10 border border-[#BA7517]/30 text-severity-caution',
  low:      'bg-[#1D9E75]/10 border border-[#1D9E75]/30 text-severity-positive',
}

const SEVERITY_LABEL: Record<WatchForSeverity, string> = {
  high:     'HIGH',
  moderate: 'MEDIUM',
  low:      'LOW',
}

function firstSentence(text: string): string {
  // Require uppercase after ". " to avoid splitting on abbreviations like "No. 2"
  const end = text.search(/\.\s+[A-Z]/)
  if (end !== -1 && end <= 200) return text.slice(0, end + 1)
  if (text.length > 160) return text.slice(0, 160).trimEnd() + '…'
  return text
}

export function WatchForCard({ items, generationId }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  if (items.length === 0) return null

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const displayItems = items.slice(0, 3)
  const genLabel = generationId ? formatGenerationDisplay(generationId) : null

  return (
    <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
        What to Watch For
      </p>

      <ul className="mt-4 space-y-2">
        {displayItems.map((item) => {
          const isOpen = expanded.has(item.source_id)
          const summary = firstSentence(item.description)
          return (
            <li key={item.source_id} className="border-[0.5px] border-border-default bg-bg-elevated">
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
                onClick={() => toggle(item.source_id)}
                aria-expanded={isOpen}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-serif text-[14px] text-text-primary">{item.title}</span>
                    {item.source === 'recall' && (
                      <span className="border border-amber-400/40 px-1 py-px font-mono text-[9px] uppercase tracking-[0.08em] text-amber-500">
                        Federal Recall
                      </span>
                    )}
                  </div>
                </div>
                <span className={`shrink-0 rounded-sm px-[6px] py-[2px] font-sans text-[9px] font-semibold tracking-[0.06em] ${SEVERITY_PILL[item.severity]}`}>
                  {SEVERITY_LABEL[item.severity]}
                </span>
                <span className="ml-1 shrink-0 font-sans text-[16px] leading-none text-text-quaternary">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div className="border-t-[0.5px] border-border-subtle px-4 pb-4 pt-3">
                  <p className="font-sans text-[13px] leading-[1.6] text-text-secondary">
                    {summary}
                  </p>
                  {item.buyer_check && (
                    <div className="mt-3">
                      <p className="font-sans text-[11px] uppercase tracking-[0.06em] text-text-quaternary">
                        Ask the seller
                      </p>
                      <p className="mt-1 font-sans text-[11px] italic leading-relaxed text-text-tertiary">
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

      {genLabel && (
        <p className="mt-4">
          <Link
            href={`/generations/${generationId}`}
            className="font-serif text-[13px] italic text-accent-primary hover:underline"
          >
            More on the {genLabel} →
          </Link>
        </p>
      )}
    </div>
  )
}
