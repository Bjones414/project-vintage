import type { RuleFn } from '../types'

const SERVICE_RECORD_KEYWORDS = [
  'service record',
  'service records',
  'service history',
  'maintenance record',
  'maintenance records',
  'service booklet',
  'service book',
  'service binder',
  'service file',
  'documented service',
  'dealer service history',
  'factory service',
  'complete service',
  'full service history',
  'service stamps',
  'stamped service',
  'records included',
]

function containsAny(text: string | null, keywords: string[]): boolean {
  if (!text) return false
  const lower = text.toLowerCase()
  return keywords.some((kw) => lower.includes(kw))
}

export const serviceRecords: RuleFn = ({ listing }) => {
  const hasRecords = containsAny(listing.description, SERVICE_RECORD_KEYWORDS)
  if (!hasRecords) return null

  return {
    id: 'service-records',
    rule_id: 'service-records',
    rule_version: '1.0.0',
    source: 'rules-engine',
    category: 'this_car',
    severity: 'positive',
    title: 'Service records documented',
    body: 'The listing mentions service records or documented maintenance history. Ask the seller for copies before purchase.',
    qualifier: null,
  }
}
