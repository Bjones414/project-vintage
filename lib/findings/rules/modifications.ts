import type { RuleFn } from '../types'

const MODIFICATION_KEYWORDS = [
  'modified',
  'modification',
  'aftermarket',
  'engine swap',
  'suspension upgrade',
  'coilover',
  'lowered',
  'widebody',
  'performance exhaust',
  'intake upgrade',
  'chip tuned',
  'ecu tune',
  'stage 2',
  'stage 3',
  'big brake kit',
  'rebuilt engine',
  'engine rebuild',
  'head rebuild',
  'stroker',
  'turbo kit',
  'supercharged',
  'roll cage',
  'race prep',
  'track car',
  'track prep',
]

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Leading \b prevents "unmodified" matching "modified"; no trailing boundary so
// "coilovers" still matches "coilover".
function containsAny(text: string | null, keywords: string[]): boolean {
  if (!text) return false
  const lower = text.toLowerCase()
  return keywords.some((kw) => new RegExp(`\\b${escapeRegex(kw)}`).test(lower))
}

export const modifications: RuleFn = ({ listing }) => {
  const descriptionHasMods = containsAny(listing.description, MODIFICATION_KEYWORDS)
  const notesHasMods =
    listing.modification_notes !== null && listing.modification_notes.trim().length > 0

  if (descriptionHasMods || notesHasMods) {
    return {
      id: 'modifications',
      rule_id: 'modifications',
      rule_version: '1.0.0',
      source: 'rules-engine',
      category: 'worth_asking',
      severity: 'caution',
      title: 'Modifications noted in listing',
      body: 'The listing references modifications or aftermarket parts. Confirm the full extent of changes with the seller and assess any impact on value, warranty, or insurance.',
      qualifier: null,
    }
  }

  return {
    id: 'modifications',
    rule_id: 'modifications',
    rule_version: '1.0.0',
    source: 'rules-engine',
    category: 'this_car',
    severity: 'positive',
    title: 'No modifications reported',
    body: 'No modifications or aftermarket parts are mentioned in the listing. Confirm originality with the seller and inspect in person.',
    qualifier: null,
  }
}
