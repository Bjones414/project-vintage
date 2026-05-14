import { describe, it, expect } from 'vitest'
import { lookupVariantProduction } from '@/lib/era-content/generation-content'

// ---------------------------------------------------------------------------
// lookupVariantProduction — 996.2 Carrera-family variant data
// ---------------------------------------------------------------------------
// These tests verify that the 7 newly-added Carrera-family production figures
// are correctly returned as tier === 'variant', so the chassis card production
// row renders for these listings.
// Source: Supercar Nostalgia per-variant 996.2 breakdown, cross-checked
// against jtcars.net aggregates. All figures include all transmissions
// (manual + Tiptronic); Porsche did not publish per-transmission splits.
// ---------------------------------------------------------------------------

describe('lookupVariantProduction — 996.2 Carrera family', () => {
  it('Carrera (Coupe) returns tier=variant with 14,629 figure', () => {
    const result = lookupVariantProduction('996.2', 'Carrera')
    expect(result).not.toBeNull()
    expect(result!.tier).toBe('variant')
    expect(result!.figure).toContain('14,629')
    expect(result!.figure).toContain('all transmissions')
    expect(result!.label).toBe('Carrera built')
  })

  it('Carrera Cabriolet returns tier=variant with 14,961 figure', () => {
    // Primary test case — VIN WP0CA299X2S650260 (996.2 Carrera Cabriolet 6-Speed)
    const result = lookupVariantProduction('996.2', 'Carrera Cabriolet')
    expect(result).not.toBeNull()
    expect(result!.tier).toBe('variant')
    expect(result!.figure).toContain('14,961')
    expect(result!.figure).toContain('all transmissions')
    expect(result!.label).toBe('Carrera Cabriolet built')
  })

  it('Carrera 4 (Coupe) returns tier=variant with 3,231 figure', () => {
    const result = lookupVariantProduction('996.2', 'Carrera 4')
    expect(result).not.toBeNull()
    expect(result!.tier).toBe('variant')
    expect(result!.figure).toContain('3,231')
    expect(result!.figure).toContain('all transmissions')
    expect(result!.label).toBe('Carrera 4 built')
  })

  it('Carrera 4 Cabriolet returns tier=variant with 7,155 figure', () => {
    const result = lookupVariantProduction('996.2', 'Carrera 4 Cabriolet')
    expect(result).not.toBeNull()
    expect(result!.tier).toBe('variant')
    expect(result!.figure).toContain('7,155')
    expect(result!.figure).toContain('all transmissions')
    expect(result!.label).toBe('Carrera 4 Cabriolet built')
  })

  it('Targa returns tier=variant with 5,089 figure', () => {
    const result = lookupVariantProduction('996.2', 'Targa')
    expect(result).not.toBeNull()
    expect(result!.tier).toBe('variant')
    expect(result!.figure).toContain('5,089')
    expect(result!.figure).toContain('all transmissions')
    expect(result!.label).toBe('Targa built')
  })

  it('Carrera 4S returns tier=variant with 17,283 Coupe figure', () => {
    const result = lookupVariantProduction('996.2', 'Carrera 4S')
    expect(result).not.toBeNull()
    expect(result!.tier).toBe('variant')
    expect(result!.figure).toContain('17,283')
    expect(result!.figure).toContain('5,757')
    expect(result!.figure).toContain('all transmissions')
    expect(result!.label).toBe('Carrera 4S built')
  })

  it('Carrera 4S Cabriolet matches Carrera 4S by prefix and shows both counts', () => {
    // "Carrera 4S Cabriolet" prefix-matches "Carrera 4S" — shows combined count
    const result = lookupVariantProduction('996.2', 'Carrera 4S Cabriolet')
    expect(result).not.toBeNull()
    expect(result!.tier).toBe('variant')
    expect(result!.figure).toContain('5,757')
  })

  it('null generation returns null', () => {
    expect(lookupVariantProduction(null, 'Carrera Cabriolet')).toBeNull()
  })

  it('null trim on 996.2 falls back to generation tier (not variant)', () => {
    const result = lookupVariantProduction('996.2', null)
    // No variant match possible without trim — falls to generation-level
    expect(result?.tier).not.toBe('variant')
  })

  it('unknown trim on 996.2 prefix-matches the closest variant', () => {
    // "Carrera Cabriolet 6-Speed Manual" should prefix-match "Carrera Cabriolet"
    const result = lookupVariantProduction('996.2', 'Carrera Cabriolet 6-Speed Manual')
    expect(result).not.toBeNull()
    expect(result!.tier).toBe('variant')
    expect(result!.figure).toContain('14,961')
  })
})

// ---------------------------------------------------------------------------
// Regression: non-996.2 generations — production row hides cleanly
// ---------------------------------------------------------------------------
describe('lookupVariantProduction — non-996.2 generations hide cleanly', () => {
  it('993 with trim Carrera does not return 996.2 data', () => {
    const result = lookupVariantProduction('993', 'Carrera')
    // 993 has variant data with production; should return 993 content, not 996.2
    if (result !== null) {
      expect(result.figure).not.toContain('14,629')
    }
  })

  it('unknown generation returns null', () => {
    expect(lookupVariantProduction('9999.x', 'Carrera')).toBeNull()
  })
})
