import type { WatchForItem, WatchForSeverity } from '@/lib/defect-catalog/types'

const SEVERITY_SCORE: Record<WatchForSeverity, number> = {
  high: 10,
  moderate: 5,
  low: 2,
}

function score(item: WatchForItem): number {
  return SEVERITY_SCORE[item.severity] + (item.relevance_score ?? 0)
}

export function selectTopThree(items: WatchForItem[]): WatchForItem[] {
  return [...items].sort((a, b) => score(b) - score(a)).slice(0, 3)
}
