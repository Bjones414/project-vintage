import { describe, it, expect } from 'vitest'
import { GENERATION_DEFS, isValidCombination } from '@/lib/porsche/models'

function trimsFor(genId: string): string[] {
  return GENERATION_DEFS.find((g) => g.genId === genId)?.trims ?? []
}

// Regression guard: these trims never existed in the named generation.
// Each test corresponds to a catalog error that was previously present and removed.
describe('catalog regression: erroneous trims absent', () => {
  it('964 does not list Carrera 4S — C4S debuted with the 993', () => {
    expect(trimsFor('964')).not.toContain('Carrera 4S')
    expect(isValidCombination(1991, '911', 'Carrera 4S')).toBe(false)
  })

  it('993 does not list Speedster — only 2 bespoke Exclusiv builds, not a production trim', () => {
    expect(trimsFor('993')).not.toContain('Speedster')
    expect(isValidCombination(1996, '911', 'Speedster')).toBe(false)
  })

  it('996.1 does not list Carrera 4S — C4S came with the 996.2 facelift (MY 2002+)', () => {
    expect(trimsFor('996.1')).not.toContain('Carrera 4S')
    expect(isValidCombination(2000, '911', 'Carrera 4S')).toBe(false)
  })

  it('996.1 does not list Targa — Targa came with the 996.2 facelift (MY 2002+)', () => {
    expect(trimsFor('996.1')).not.toContain('Targa')
    expect(isValidCombination(2000, '911', 'Targa')).toBe(false)
  })

  it('997.1 does not list Turbo S — Turbo S is 997.2 only (MY 2010+)', () => {
    expect(trimsFor('997.1')).not.toContain('Turbo S')
    expect(isValidCombination(2007, '911', 'Turbo S')).toBe(false)
  })

  it('981-cayman does not list GT4 RS — GT4 RS is 982/718 only (~2021+)', () => {
    expect(trimsFor('981-cayman')).not.toContain('GT4 RS')
    expect(isValidCombination(2015, 'Cayman', 'GT4 RS')).toBe(false)
  })
})
