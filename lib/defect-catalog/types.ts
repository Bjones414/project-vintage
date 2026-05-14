export type WatchForSeverity = 'high' | 'moderate' | 'low'
export type CatalogSeverity = 'catastrophic' | 'high' | 'moderate' | 'low'

export interface DefectExclude {
  description?: string
  generation?: string[]
  engine_family?: string[]
  year_range?: number[]
  trim_category?: string[]
  body?: string[]
}

export interface DefectApplicability {
  generation?: string[]
  engine_family?: string[]
  year_range?: number[]
  trim_category?: string[]
  body?: string[]
  excludes?: DefectExclude | DefectExclude[]
}

export interface DefectRecord {
  id: string
  flag_title: string
  description: string
  applicability: DefectApplicability
  severity: CatalogSeverity
  editorial_note?: string
  buyer_questions?: string[]
}

export interface WatchForItem {
  title: string
  severity: WatchForSeverity
  description: string
  buyer_check: string | null
  source: 'catalog' | 'recall'
  source_id: string
  relevance_score?: number  // count of applicability fields that matched; higher = more specific
}
