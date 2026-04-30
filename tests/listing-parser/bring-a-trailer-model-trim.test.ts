import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { splitModelTrim } from '@/lib/listing-parser/bring-a-trailer'

describe('splitModelTrim', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  // --- Known Porsche models ---

  it('"911 Targa 4S" → model "911", trim "Targa 4S"', () => {
    expect(splitModelTrim('911 Targa 4S')).toEqual({ model: '911', trim: 'Targa 4S' })
  })

  it('"911 Carrera 4S Cabriolet" → model "911", trim "Carrera 4S Cabriolet"', () => {
    expect(splitModelTrim('911 Carrera 4S Cabriolet')).toEqual({ model: '911', trim: 'Carrera 4S Cabriolet' })
  })

  it('"718 Cayman GT4 RS Weissach Package" → model "718 Cayman", trim "GT4 RS Weissach Package"', () => {
    expect(splitModelTrim('718 Cayman GT4 RS Weissach Package')).toEqual({ model: '718 Cayman', trim: 'GT4 RS Weissach Package' })
  })

  it('"718 Boxster GTS 4.0" → model "718 Boxster", trim "GTS 4.0"', () => {
    expect(splitModelTrim('718 Boxster GTS 4.0')).toEqual({ model: '718 Boxster', trim: 'GTS 4.0' })
  })

  it('"Cayman GT4" (981 era) → model "Cayman", trim "GT4"', () => {
    expect(splitModelTrim('Cayman GT4')).toEqual({ model: 'Cayman', trim: 'GT4' })
  })

  it('"Cayman R" → model "Cayman", trim "R"', () => {
    expect(splitModelTrim('Cayman R')).toEqual({ model: 'Cayman', trim: 'R' })
  })

  it('"918 Spyder" → model "918 Spyder", trim null (exact match, no remainder)', () => {
    expect(splitModelTrim('918 Spyder')).toEqual({ model: '918 Spyder', trim: null })
  })

  it('"918 Spyder Weissach Package" → model "918 Spyder", trim "Weissach Package"', () => {
    expect(splitModelTrim('918 Spyder Weissach Package')).toEqual({ model: '918 Spyder', trim: 'Weissach Package' })
  })

  it('"Carrera GT" → model "Carrera GT", trim null (exact match)', () => {
    expect(splitModelTrim('Carrera GT')).toEqual({ model: 'Carrera GT', trim: null })
  })

  it('"928 GTS" → model "928", trim "GTS"', () => {
    expect(splitModelTrim('928 GTS')).toEqual({ model: '928', trim: 'GTS' })
  })

  it('"944 Turbo S" → model "944", trim "Turbo S"', () => {
    expect(splitModelTrim('944 Turbo S')).toEqual({ model: '944', trim: 'Turbo S' })
  })

  it('"912E" exact match → model "912E", trim null', () => {
    expect(splitModelTrim('912E')).toEqual({ model: '912E', trim: null })
  })

  it('"911" exact match → model "911", trim null', () => {
    expect(splitModelTrim('911')).toEqual({ model: '911', trim: null })
  })

  // --- Prefix priority: multi-word beats single-word ---

  it('"718 Cayman" beats plain "Cayman" — model is "718 Cayman" not "Cayman"', () => {
    const result = splitModelTrim('718 Cayman GT4')
    expect(result.model).toBe('718 Cayman')
    expect(result.trim).toBe('GT4')
  })

  it('"918 Spyder" beats any hypothetical plain "918" — model is "918 Spyder"', () => {
    const result = splitModelTrim('918 Spyder')
    expect(result.model).toBe('918 Spyder')
    expect(result.trim).toBeNull()
  })

  // --- Unrecognized strings ---

  it('unrecognized "Junior K9 Roadster" → model null, trim null, warning logged', () => {
    const result = splitModelTrim('Junior K9 Roadster')
    expect(result).toEqual({ model: null, trim: null })
    expect(warnSpy).toHaveBeenCalledOnce()
    expect(warnSpy.mock.calls[0][0]).toContain('Junior K9 Roadster')
  })

  it('unrecognized "Martin Vantage Roadster" → null, null', () => {
    expect(splitModelTrim('Martin Vantage Roadster')).toEqual({ model: null, trim: null })
  })

  it('"718 Macan" (not a real model) → null, null, warning logged', () => {
    const result = splitModelTrim('718 Macan')
    expect(result).toEqual({ model: null, trim: null })
    expect(warnSpy).toHaveBeenCalledOnce()
  })

  // --- No partial-word prefix bleeding ---

  it('"9110 Race Car" does not match "911" prefix — null, null', () => {
    // "9110" starts with "911" as a substring but "911" + " " test fails here
    // because "9110" !== "911" and "9110" does not start with "911 "
    const result = splitModelTrim('9110 Race Car')
    expect(result).toEqual({ model: null, trim: null })
  })
})
