import type { Json } from '@/lib/supabase/types'

export type { ViewerTier } from '@/lib/auth/viewer-tier'

export type Finding = {
  rule_id: string
  category: 'this_car' | 'worth_asking' | 'watch_closely'
  severity: 'positive' | 'caution' | 'concern'
  title: string
  body: string
  qualifier: string | null
}

export function parseFindings(raw: Json | null | undefined): Finding[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((item): item is Finding => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return false
    const f = item as Record<string, unknown>
    return typeof f.rule_id === 'string' && typeof f.title === 'string' && typeof f.body === 'string'
  })
}

export type ComparableSale = {
  listing_id?: string
  year: number
  make: string
  model: string
  trim?: string | null
  mileage?: number | null
  mileage_unit?: 'mi' | 'km'
  final_price_cents: number
  sale_date: string
  source_platform: string
  source_url?: string | null
}

export type AnalysisData = {
  lede?: string
  secondary_line?: string
  confidence_score?: number
  confidence_label?: 'low' | 'medium' | 'high'
  methodology?: string
  fair_value_low_cents?: number
  fair_value_median_cents?: number
  fair_value_high_cents?: number
  comps_used?: number
  comparable_sales?: ComparableSale[]
}

export function parseAnalysisData(raw: Json | null | undefined): AnalysisData | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  return raw as unknown as AnalysisData
}

export function parseWatchOuts(raw: Json | null | undefined): string[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((item): item is string => typeof item === 'string')
}
