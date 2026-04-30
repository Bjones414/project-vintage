/**
 * SourceMentionsCard — displays source-mention signals on the subject listing analysis page.
 *
 * DISPLAY RULE (enforce in code review):
 *   Never display these signals as Project Vintage assertions.
 *   Always frame as "Source mentions: [signal]" with attribution to the source.
 *   This component only renders on the SUBJECT listing page (the one the user pasted).
 *   Comp listings show only a small icon — they do NOT use this component.
 */
import type { Tables } from '@/lib/supabase/types'

type Props = {
  listing: Tables<'listings'>
}

type Signal = {
  label: string
  source: string | null
}

function parseSourceCitation(citation: string | null): { name: string; url: string | null } {
  if (!citation) return { name: 'source', url: null }
  const idx = citation.indexOf('|')
  if (idx === -1) return { name: citation, url: null }
  return { name: citation.slice(0, idx), url: citation.slice(idx + 1) || null }
}

export function SourceMentionsCard({ listing }: Props) {
  const signals: Signal[] = []

  if (listing.mentioned_repaint) {
    signals.push({ label: 'repaint history', source: listing.mentioned_repaint_source })
  }
  if (listing.mentioned_accident_history) {
    signals.push({ label: 'accident history', source: listing.mentioned_accident_history_source })
  }
  if (listing.mentioned_engine_service) {
    signals.push({ label: 'engine service noted', source: listing.mentioned_engine_service_source })
  }
  if (listing.mentioned_transmission_service) {
    signals.push({ label: 'transmission service noted', source: listing.mentioned_transmission_service_source })
  }
  if (listing.mentioned_matching_numbers) {
    signals.push({ label: 'matching numbers', source: listing.mentioned_matching_numbers_source })
  }
  if (listing.mentioned_modifications) {
    signals.push({ label: 'modifications or non-stock spec', source: listing.mentioned_modifications_source })
  }
  if (listing.mentioned_recent_ppi) {
    signals.push({ label: 'recent pre-purchase inspection', source: listing.mentioned_recent_ppi_source })
  }
  if (listing.mentioned_original_owner) {
    signals.push({ label: 'original or first owner', source: listing.mentioned_original_owner_source })
  }

  if (signals.length === 0) return null

  return (
    <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
        Signals from Source
      </p>
      <ul className="mt-4 space-y-2">
        {signals.map((signal) => {
          const citation = parseSourceCitation(signal.source)
          return (
            <li key={signal.label} className="font-sans text-[13px] text-text-secondary">
              <span className="text-text-tertiary">Source mentions: </span>
              <span>{signal.label}</span>
              {citation.url ? (
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 font-sans text-[11px] text-text-quaternary underline underline-offset-2 hover:text-text-tertiary"
                >
                  [{citation.name}]
                </a>
              ) : (
                <span className="ml-1 font-sans text-[11px] text-text-quaternary">
                  [{citation.name}]
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
