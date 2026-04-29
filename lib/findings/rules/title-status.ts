import type { RuleFn } from '../types'

// Full phrases only — avoids false positives like "no salvage title" matching on "salvage"
const TITLE_CONCERN_PHRASES = [
  'salvage title',
  'rebuilt title',
  'flood title',
  'lemon law title',
  'branded title',
  'reconstructed title',
  'flood damage',
  'total loss',
  'frame damage',
  'structural damage',
]

function containsAny(text: string | null, phrases: string[]): boolean {
  if (!text) return false
  const lower = text.toLowerCase()
  return phrases.some((p) => lower.includes(p))
}

export const titleStatus: RuleFn = ({ listing }) => {
  const hasConcern =
    containsAny(listing.description, TITLE_CONCERN_PHRASES) ||
    containsAny(listing.title, TITLE_CONCERN_PHRASES)

  if (!hasConcern) return null

  return {
    id: 'title-status',
    rule_id: 'title-status',
    rule_version: '1.0.0',
    source: 'rules-engine',
    category: 'watch_closely',
    severity: 'concern',
    title: 'Title or damage concern detected',
    body: 'The listing contains language associated with a branded title, prior damage, or total-loss history. Obtain a full vehicle history report and have the car independently inspected before bidding.',
    qualifier: null,
  }
}
