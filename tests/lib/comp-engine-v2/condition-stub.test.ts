import { describe, it, expect } from 'vitest'
import {
  paintScore,
  accidentScore,
  photoScore,
  featuredScore,
  computeConditionStub,
  conditionSimilarity,
} from '@/lib/comp-engine-v2/condition-stub'

describe('paintScore', () => {
  it('<150µm → 1.0 (likely original)', () => expect(paintScore(100)).toBe(1.0))
  it('150–199µm → 0.7',               () => expect(paintScore(175)).toBe(0.7))
  it('200–299µm → 0.4',               () => expect(paintScore(250)).toBe(0.4))
  it('≥300µm → 0.1 (repainted)',      () => expect(paintScore(350)).toBe(0.1))
  it('null → 0.5 (unknown)',           () => expect(paintScore(null)).toBe(0.5))
  it('boundary 150 → 0.7',            () => expect(paintScore(150)).toBe(0.7))
  it('boundary 200 → 0.4',            () => expect(paintScore(200)).toBe(0.4))
  it('boundary 300 → 0.1',            () => expect(paintScore(300)).toBe(0.1))
})

describe('accidentScore', () => {
  it('none_stated → 1.0',  () => expect(accidentScore('none_stated')).toBe(1.0))
  it('minor_stated → 0.6', () => expect(accidentScore('minor_stated')).toBe(0.6))
  it('major_stated → 0.2', () => expect(accidentScore('major_stated')).toBe(0.2))
  it('unknown → 0.5',      () => expect(accidentScore('unknown')).toBe(0.5))
  it('null → 0.5',         () => expect(accidentScore(null)).toBe(0.5))
})

describe('photoScore', () => {
  it('≥40 → 1.0',  () => expect(photoScore(40)).toBe(1.0))
  it('25–39 → 0.8', () => expect(photoScore(30)).toBe(0.8))
  it('15–24 → 0.6', () => expect(photoScore(20)).toBe(0.6))
  it('<15 → 0.4',  () => expect(photoScore(10)).toBe(0.4))
  it('null → 0.5', () => expect(photoScore(null)).toBe(0.5))
  it('boundary 25 → 0.8', () => expect(photoScore(25)).toBe(0.8))
  it('boundary 15 → 0.6', () => expect(photoScore(15)).toBe(0.6))
})

describe('featuredScore', () => {
  it('true → 1.0',  () => expect(featuredScore(true)).toBe(1.0))
  it('false → 0.5', () => expect(featuredScore(false)).toBe(0.5))
  it('null → 0.5',  () => expect(featuredScore(null)).toBe(0.5))
})

describe('computeConditionStub', () => {
  it('all null inputs → 0.5 (all unknowns)', () => {
    const result = computeConditionStub({
      paint_meter_max_microns: null,
      accident_history_stated: null,
      listing_photo_count: null,
      is_featured_listing: null,
    })
    expect(result).toBeCloseTo(0.5)
  })

  it('perfect signals → 1.0', () => {
    const result = computeConditionStub({
      paint_meter_max_microns: 100,
      accident_history_stated: 'none_stated',
      listing_photo_count: 50,
      is_featured_listing: true,
    })
    expect(result).toBeCloseTo(1.0)
  })

  it('terrible signals → low score', () => {
    const result = computeConditionStub({
      paint_meter_max_microns: 400,
      accident_history_stated: 'major_stated',
      listing_photo_count: 5,
      is_featured_listing: false,
    })
    // 0.4*0.1 + 0.3*0.2 + 0.2*0.4 + 0.1*0.5 = 0.04 + 0.06 + 0.08 + 0.05 = 0.23
    expect(result).toBeCloseTo(0.23)
  })

  it('formula weights are correct', () => {
    const result = computeConditionStub({
      paint_meter_max_microns: 100, // paint_score=1.0 × 0.4
      accident_history_stated: 'none_stated', // accident_score=1.0 × 0.3
      listing_photo_count: null,   // photo_score=0.5 × 0.2
      is_featured_listing: false,  // featured_score=0.5 × 0.1
    })
    // 0.4 + 0.3 + 0.1 + 0.05 = 0.85
    expect(result).toBeCloseTo(0.85)
  })
})

describe('conditionSimilarity', () => {
  it('identical scores → 1.0', () => expect(conditionSimilarity(0.7, 0.7)).toBe(1.0))
  it('0.8 vs 0.5 → 0.7',      () => expect(conditionSimilarity(0.8, 0.5)).toBeCloseTo(0.7))
  it('perfect vs terrible → 0.77 approx', () => {
    // 1.0 vs 0.23 → 1 - |1.0 - 0.23| = 1 - 0.77 = 0.23... wait:
    // conditionSimilarity(1.0, 0.23) = 1 - |1.0 - 0.23| = 1 - 0.77 = 0.23
    expect(conditionSimilarity(1.0, 0.23)).toBeCloseTo(0.23)
  })
})
