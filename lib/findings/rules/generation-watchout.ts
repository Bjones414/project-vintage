// TODO: When non-Porsche marques ship, this rule needs a marque dispatch —
// extract the era-specific concerns into a config keyed by (marque, generation_code).
import type { RuleFn } from '../types'

// 996.1, 996.2, and 997.1 carry pre-DFI M96/M97 engines with the IMS bearing failure mode.
// 997.2 introduced DFI and eliminated the IMS design; 998+ generations are unaffected.
// Generation IDs match the porsche_generations table format (e.g. '996.1', not '996').
const IMS_AT_RISK_GENERATION_IDS = new Set(['996.1', '996.2', '997.1'])

const IMS_ADDRESSED_KEYWORDS = [
  'ims retrofit',
  'ims bearing replaced',
  'ims replaced',
  'ims done',
  'ims update',
  'ims service',
  'ln engineering',
  'bearing updated',
  'bearing replaced',
  'ims complete',
]

function containsAny(text: string | null, keywords: string[]): boolean {
  if (!text) return false
  const lower = text.toLowerCase()
  return keywords.some((kw) => lower.includes(kw))
}

export const generationWatchout: RuleFn = ({ listing, generationId }) => {
  if (!generationId || !IMS_AT_RISK_GENERATION_IDS.has(generationId)) return null

  const imsAddressed = containsAny(listing.description, IMS_ADDRESSED_KEYWORDS)

  if (imsAddressed) {
    return {
      id: 'generation-watchout',
      rule_id: 'generation-watchout',
      rule_version: '1.0.0',
      source: 'rules-engine',
      category: 'this_car',
      severity: 'positive',
      title: 'IMS retrofit documented',
      body: 'The listing mentions the IMS bearing has been addressed. Confirm the specific retrofit kit used (LN Engineering or equivalent) and ask for documentation.',
      qualifier: 'IMS bearing',
    }
  }

  return {
    id: 'generation-watchout',
    rule_id: 'generation-watchout',
    rule_version: '1.0.0',
    source: 'rules-engine',
    category: 'watch_closely',
    severity: 'caution',
    title: 'Ask about the IMS bearing',
    body: 'This generation carries a known risk of intermediate shaft (IMS) bearing failure. Ask the seller whether the IMS has been retrofitted and request documentation. Budget for the repair if it has not been done.',
    qualifier: 'IMS bearing',
  }
}
