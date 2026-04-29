import type { Json } from '@/lib/supabase/types'
import type { CanonicalListing } from '@/lib/listing-parser/types'

export type FindingSeverity = 'positive' | 'caution' | 'concern'
export type FindingCategory = 'this_car' | 'worth_asking' | 'watch_closely'

export type Finding = {
  id: string
  rule_id: string
  rule_version: string
  source: string
  category: FindingCategory
  severity: FindingSeverity
  title: string
  body: string
  qualifier: string | null
}

export type RuleInput = {
  listing: CanonicalListing
  generationId: string | null
}

export type RuleFn = (input: RuleInput) => Finding | null

export function parseFindings(raw: Json | null | undefined): Finding[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((item): item is Finding => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return false
    const f = item as Record<string, unknown>
    return (
      typeof f.rule_id === 'string' &&
      typeof f.title === 'string' &&
      typeof f.body === 'string' &&
      typeof f.severity === 'string'
    )
  })
}
