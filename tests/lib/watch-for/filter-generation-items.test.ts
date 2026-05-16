import { describe, it, expect } from 'vitest'
import { filterGenerationItems, MAX_GENERATION_TITLE_CHARS } from '@/lib/watch-for/filter-generation-items'
import type { WatchForItem } from '@/lib/defect-catalog/types'

function item(title: string, severity: 'high' | 'moderate' | 'low'): WatchForItem {
  return { title, severity, description: 'desc', buyer_check: null, source: 'catalog', source_id: 'test' }
}

const LONG_TITLE = '996/997/986/987 lower control arm — thrust-arm bushing wear and integrated ball-joint failure'
const SHORT_HIGH = 'Cylinder bore scoring'         // 21 chars, HIGH
const MODERATE_SHORT = 'RMS leak'                  // 8 chars, MODERATE
const LOW_SHORT = 'Door alignment'                 // 14 chars, LOW
const EXACTLY_35 = 'A'.repeat(35)                 // boundary: included
const EXACTLY_36 = 'A'.repeat(36)                 // boundary: excluded

describe('filterGenerationItems', () => {
  it('returns empty array for empty input', () => {
    expect(filterGenerationItems([])).toEqual([])
  })

  it('excludes MODERATE items regardless of title length', () => {
    expect(filterGenerationItems([item(MODERATE_SHORT, 'moderate')])).toEqual([])
  })

  it('excludes LOW items regardless of title length', () => {
    expect(filterGenerationItems([item(LOW_SHORT, 'low')])).toEqual([])
  })

  it('includes HIGH items whose title fits within MAX_GENERATION_TITLE_CHARS', () => {
    const result = filterGenerationItems([item(SHORT_HIGH, 'high')])
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe(SHORT_HIGH)
  })

  it(`"Cylinder bore scoring" (21 chars, HIGH) is included`, () => {
    expect(filterGenerationItems([item('Cylinder bore scoring', 'high')])).toHaveLength(1)
  })

  it(`"IMS bearing" (11 chars, HIGH) is included`, () => {
    expect(filterGenerationItems([item('IMS bearing', 'high')])).toHaveLength(1)
  })

  it(`the long control arm item (${LONG_TITLE.length} chars, HIGH) is excluded`, () => {
    expect(filterGenerationItems([item(LONG_TITLE, 'high')])).toHaveLength(0)
  })

  it(`title at exactly ${MAX_GENERATION_TITLE_CHARS} chars is included (boundary)`, () => {
    expect(filterGenerationItems([item(EXACTLY_35, 'high')])).toHaveLength(1)
  })

  it(`title at exactly ${MAX_GENERATION_TITLE_CHARS + 1} chars is excluded (boundary)`, () => {
    expect(filterGenerationItems([item(EXACTLY_36, 'high')])).toHaveLength(0)
  })

  it('excludes MODERATE/LOW even when they would rank higher than HIGH by relevance_score', () => {
    const highScoreModerate = { ...item('Short moderate', 'moderate' as const), relevance_score: 99 }
    const lowScoreHigh = { ...item('Short high', 'high' as const), relevance_score: 0 }
    const result = filterGenerationItems([highScoreModerate, lowScoreHigh])
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Short high')
  })

  it('returns [] when all HIGH items have titles exceeding the character limit', () => {
    const result = filterGenerationItems([
      item(LONG_TITLE, 'high'),
      item('A'.repeat(50), 'high'),
    ])
    expect(result).toHaveLength(0)
  })

  it('passes through multiple qualifying HIGH items', () => {
    const result = filterGenerationItems([
      item('Cylinder bore scoring', 'high'),
      item('IMS bearing', 'high'),
      item(LONG_TITLE, 'high'),        // excluded: too long
      item(MODERATE_SHORT, 'moderate'), // excluded: wrong severity
    ])
    expect(result).toHaveLength(2)
    expect(result.map(r => r.title)).toEqual(['Cylinder bore scoring', 'IMS bearing'])
  })
})
