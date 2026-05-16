import type { WatchForItem } from '@/lib/defect-catalog/types'

// Conservative threshold for ~270px column at 14-15px serif.
// Items exceeding this will wrap to a second line in the expanded panel.
export const MAX_GENERATION_TITLE_CHARS = 35

// Applied to the generation-level fallback only (not per-listing flags).
// Keeps HIGH severity items whose titles fit on a single line in the panel.
export function filterGenerationItems(items: WatchForItem[]): WatchForItem[] {
  return items.filter(
    item => item.severity === 'high' && item.title.length <= MAX_GENERATION_TITLE_CHARS,
  )
}
