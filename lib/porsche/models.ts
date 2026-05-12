// Generation definitions — single source of truth for valid year/model/trim combinations.
// Helper functions below derive all filtering logic from this data so adding or changing
// a generation automatically updates model availability, trim lists, and validation.

const PRESENT = new Date().getFullYear() + 1

export type GenerationDef = {
  genId: string
  model: string
  yearStart: number
  yearEnd: number  // use PRESENT for ongoing generations
  trims: string[]
}

export const GENERATION_DEFS: GenerationDef[] = [
  // ── 911 ──────────────────────────────────────────────────────────────────────
  {
    genId: 'pre-964', model: '911', yearStart: 1965, yearEnd: 1988,
    trims: ['Carrera', 'Carrera RS', 'Carrera 3.2', 'Targa', 'Turbo', 'Turbo 3.3', 'SC', 'Speedster'],
  },
  {
    genId: '964', model: '911', yearStart: 1989, yearEnd: 1993,
    trims: ['Carrera 2', 'Carrera 4', 'Carrera 4S', 'Turbo', 'Turbo 3.3', 'RS', 'RS America', 'Speedster', 'Targa'],
  },
  {
    genId: '993', model: '911', yearStart: 1994, yearEnd: 1998,
    trims: ['Carrera', 'Carrera S', 'Carrera 4', 'Carrera 4S', 'Targa', 'Turbo', 'Turbo S', 'GT2', 'RS'],
  },
  {
    genId: '996.1', model: '911', yearStart: 1999, yearEnd: 2001,
    trims: ['Carrera', 'Carrera 4', 'Carrera 4S', 'Turbo', 'GT3'],
  },
  {
    genId: '996.2', model: '911', yearStart: 2002, yearEnd: 2004,
    trims: ['Carrera', 'Carrera S', 'Carrera 4', 'Carrera 4S', 'Targa', 'Turbo', 'Turbo S', 'GT3', 'GT3 RS', 'GT2'],
  },
  {
    genId: '997.1', model: '911', yearStart: 2005, yearEnd: 2008,
    trims: ['Carrera', 'Carrera S', 'Carrera 4', 'Carrera 4S', 'Targa 4', 'Targa 4S', 'Turbo', 'Turbo S', 'GT3', 'GT3 RS', 'GT2'],
  },
  {
    genId: '997.2', model: '911', yearStart: 2009, yearEnd: 2012,
    trims: ['Carrera', 'Carrera S', 'Carrera 4', 'Carrera 4S', 'Carrera GTS', 'Carrera 4 GTS', 'Targa 4', 'Targa 4S', 'Turbo', 'Turbo S', 'GT3', 'GT3 RS', 'GT2 RS', 'R'],
  },
  {
    genId: '991.1', model: '911', yearStart: 2012, yearEnd: 2015,
    trims: ['Carrera', 'Carrera S', 'Carrera 4', 'Carrera 4S', 'Carrera GTS', 'Carrera 4 GTS', 'Targa 4', 'Targa 4S', 'Turbo', 'Turbo S', 'GT3', 'GT3 RS'],
  },
  {
    genId: '991.2', model: '911', yearStart: 2016, yearEnd: 2018,
    trims: ['Carrera', 'Carrera S', 'Carrera 4', 'Carrera 4S', 'Carrera GTS', 'Carrera 4 GTS', 'Targa 4', 'Targa 4S', 'Turbo', 'Turbo S', 'GT3', 'GT3 RS', 'GT2 RS', 'R'],
  },
  {
    genId: '992.1', model: '911', yearStart: 2019, yearEnd: 2023,
    trims: ['Carrera', 'Carrera S', 'Carrera 4', 'Carrera 4S', 'Carrera GTS', 'Carrera 4 GTS', 'Targa 4', 'Targa 4S', 'Turbo', 'Turbo S', 'GT3', 'GT3 RS'],
  },
  {
    genId: '992.2', model: '911', yearStart: 2024, yearEnd: PRESENT,
    trims: ['Carrera', 'Carrera S', 'Carrera 4', 'Carrera 4S', 'Carrera GTS', 'Carrera 4 GTS', 'Targa 4', 'Targa 4S', 'Turbo', 'Turbo S', 'GT3', 'GT3 RS'],
  },

  // ── Boxster ───────────────────────────────────────────────────────────────────
  {
    genId: '986', model: 'Boxster', yearStart: 1997, yearEnd: 2004,
    trims: ['Base', 'S'],
  },
  {
    genId: '987.1-boxster', model: 'Boxster', yearStart: 2005, yearEnd: 2008,
    trims: ['Base', 'S'],
  },
  {
    genId: '987.2-boxster', model: 'Boxster', yearStart: 2009, yearEnd: 2011,
    trims: ['Base', 'S', 'Spyder'],
  },
  {
    genId: '981-boxster', model: 'Boxster', yearStart: 2012, yearEnd: 2016,
    trims: ['Base', 'S', 'GTS', 'Spyder'],
  },

  // ── 718 Boxster ───────────────────────────────────────────────────────────────
  {
    genId: '982-boxster', model: '718 Boxster', yearStart: 2017, yearEnd: PRESENT,
    trims: ['Base', 'S', 'GTS 4.0', 'Spyder'],
  },

  // ── Cayman ────────────────────────────────────────────────────────────────────
  {
    genId: '987.1-cayman', model: 'Cayman', yearStart: 2006, yearEnd: 2008,
    trims: ['Base', 'S'],
  },
  {
    genId: '987.2-cayman', model: 'Cayman', yearStart: 2009, yearEnd: 2012,
    trims: ['Base', 'S', 'R'],
  },
  {
    genId: '981-cayman', model: 'Cayman', yearStart: 2013, yearEnd: 2016,
    trims: ['Base', 'S', 'GTS', 'GT4', 'GT4 RS'],
  },

  // ── 718 Cayman ────────────────────────────────────────────────────────────────
  {
    genId: '982-cayman', model: '718 Cayman', yearStart: 2017, yearEnd: PRESENT,
    trims: ['Base', 'S', 'GTS 4.0', 'GT4', 'GT4 RS'],
  },

  // ── Cayenne ───────────────────────────────────────────────────────────────────
  {
    genId: 'cayenne-i', model: 'Cayenne', yearStart: 2003, yearEnd: 2010,
    trims: ['Base', 'S', 'GTS', 'Turbo', 'Turbo S'],
  },
  {
    genId: 'cayenne-ii', model: 'Cayenne', yearStart: 2011, yearEnd: 2017,
    trims: ['Base', 'S', 'GTS', 'Turbo', 'Turbo S', 'E-Hybrid', 'Turbo S E-Hybrid'],
  },
  {
    genId: 'cayenne-iii', model: 'Cayenne', yearStart: 2018, yearEnd: PRESENT,
    trims: ['Base', 'S', 'GTS', 'Turbo', 'Turbo S', 'E-Hybrid', 'Turbo S E-Hybrid', 'Coupé', 'Turbo Coupé'],
  },

  // ── Macan ─────────────────────────────────────────────────────────────────────
  {
    genId: 'macan-i', model: 'Macan', yearStart: 2014, yearEnd: 2021,
    trims: ['Base', 'S', 'GTS', 'Turbo'],
  },
  {
    genId: 'macan-ii', model: 'Macan', yearStart: 2022, yearEnd: PRESENT,
    trims: ['Base', 'S', 'GTS', 'Turbo'],
  },

  // ── Panamera ──────────────────────────────────────────────────────────────────
  {
    genId: 'panamera-i', model: 'Panamera', yearStart: 2010, yearEnd: 2016,
    trims: ['Base', '4', '4S', 'GTS', 'Turbo', 'Turbo S', '4 E-Hybrid', 'Turbo S E-Hybrid'],
  },
  {
    genId: 'panamera-ii', model: 'Panamera', yearStart: 2017, yearEnd: PRESENT,
    trims: ['Base', '4', '4S', 'GTS', 'Turbo', 'Turbo S', '4 E-Hybrid', 'Turbo S E-Hybrid'],
  },

  // ── Taycan ────────────────────────────────────────────────────────────────────
  {
    genId: 'taycan-i', model: 'Taycan', yearStart: 2020, yearEnd: PRESENT,
    trims: ['Base', '4S', 'GTS', 'Turbo', 'Turbo S', 'Cross Turismo', 'Sport Turismo'],
  },
]

// ─── Derived helpers ──────────────────────────────────────────────────────────

// Stable ordered list of all models (preserves insertion order from GENERATION_DEFS)
export const ALL_MODELS: string[] = Array.from(new Set(GENERATION_DEFS.map((g) => g.model)))

export function generationsForYear(year: number): GenerationDef[] {
  return GENERATION_DEFS.filter((g) => year >= g.yearStart && year <= g.yearEnd)
}

export function validModelsForYear(year: number): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const g of GENERATION_DEFS) {
    if (year >= g.yearStart && year <= g.yearEnd && !seen.has(g.model)) {
      seen.add(g.model)
      result.push(g.model)
    }
  }
  return result
}

export function validTrimsForModelYear(model: string, year: number): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const g of GENERATION_DEFS) {
    if (g.model === model && year >= g.yearStart && year <= g.yearEnd) {
      for (const t of g.trims) {
        if (!seen.has(t)) { seen.add(t); result.push(t) }
      }
    }
  }
  return result
}

export function allTrimsForModel(model: string): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const g of GENERATION_DEFS) {
    if (g.model === model) {
      for (const t of g.trims) {
        if (!seen.has(t)) { seen.add(t); result.push(t) }
      }
    }
  }
  return result
}

export function isValidCombination(year: number, model: string, trim: string): boolean {
  const trims = validTrimsForModelYear(model, year)
  return trims.includes(trim)
}

// Returns the year range a model is active (for server-side messaging)
export function modelYearRange(model: string): { start: number; end: number } | null {
  const gens = GENERATION_DEFS.filter((g) => g.model === model)
  if (gens.length === 0) return null
  return {
    start: Math.min(...gens.map((g) => g.yearStart)),
    end: Math.max(...gens.map((g) => g.yearEnd)),
  }
}
