// Tests for matchesExclude and matchDefects — covers BUGs 1–4 from s11 audit:
//   BUG 1 — body filter (positive applicability + exclude)
//   BUG 2 — trim_category exclude
//   BUG 3/4 — generation key fan-out (g-series-2.7, 911-sc, 911-3.2-carrera, 911-f-body)
// These tests use inline catalog entries (bypassing the file system) to
// isolate the logic from catalog content changes.

import { describe, it, expect, vi } from 'vitest'
import type { ListingContext } from '@/lib/originality'

// We test the internals by patching the catalog loader, then calling matchDefects.
// The trim_category exclusion bug: matchesExclude never checked exclude.trim_category,
// so DMF wear was incorrectly flagged on 964/993 Turbo listings.

// Inline test catalog entry that mirrors aircooled_964_993_dmf_wear
const DMF_WEAR_RECORD = {
  id: 'test_dmf_wear',
  flag_title: 'Dual-mass flywheel wear',
  description: 'Applies to N/A 964/993; excludes Turbo variants.',
  severity: 'moderate',
  applicability: {
    generation: ['964', '993'],
    year_range: [1989, 1998],
    trim_category: ['964_C2', '964_C4', '993_C2'],
    excludes: {
      description: 'Turbo variants use different flywheel.',
      trim_category: ['964_Turbo', '993_Turbo', '993_Turbo_S', '993_GT2'],
    },
  },
}

// Inline entry with engine_family exclude (to confirm it still works alongside trim_category)
const BORE_SCORING_RECORD = {
  id: 'test_bore_scoring',
  flag_title: 'Cylinder bore scoring',
  description: 'Mezger and 9A1 engines are immune.',
  severity: 'catastrophic',
  applicability: {
    generation: ['996', '997'],
    excludes: {
      description: 'Mezger-engined cars are not subject to this failure.',
      engine_family: ['Mezger'],
    },
  },
}

// Inline entry with combined generation + trim_category exclude
const VARIOCAM_PAD_RECORD = {
  id: 'test_variocam_pad',
  flag_title: 'Variocam tensioner pad wear',
  description: 'Affects 5-chain engines only.',
  severity: 'moderate',
  applicability: {
    generation: ['996'],
    excludes: {
      description: '996.2 and post-2002 Boxster moved to 3-chain architecture.',
      year_range: [2002, 2008],
      trim_category: ['Carrera_3_6'],
    },
  },
}

// BUG 1: body positive filter — Targa-roof record must fire only on Targa listings.
const TARGA_ROOF_RECORD = {
  id: 'test_targa_roof',
  flag_title: 'Targa roof seal failure',
  description: 'Applies only to Targa body style.',
  severity: 'moderate',
  applicability: {
    generation: ['993', '964'],
    body: ['Targa'],
  },
}

// BUG 1: body exclude — convertible-top record must not fire on coupes/targas.
const CABRIOLET_TOP_RECORD = {
  id: 'test_cabriolet_top',
  flag_title: 'Convertible top hydraulic leak',
  description: 'Applies to Cabriolet only.',
  severity: 'low',
  applicability: {
    generation: ['993', '997'],
    excludes: {
      description: 'Does not apply to hard-top variants.',
      body: ['Coupe', 'Targa'],
    },
  },
}

// BUG 3/4: records using post-split generation keys must match the correct DB IDs.
const G_SERIES_CHAIN_RECORD = {
  id: 'test_pre84_chain',
  flag_title: 'Pre-1984 chain tensioner',
  description: 'Applies to F-body and early G-body.',
  severity: 'catastrophic',
  applicability: {
    generation: ['911-f-body', 'g-series-2.7', '911-sc', '911-3.2-carrera', '930'],
    year_range: [1965, 1983],
  },
}

vi.mock('@/lib/defect-catalog/parser', () => ({
  loadDefectCatalog: () => [
    DMF_WEAR_RECORD,
    BORE_SCORING_RECORD,
    VARIOCAM_PAD_RECORD,
    TARGA_ROOF_RECORD,
    CABRIOLET_TOP_RECORD,
    G_SERIES_CHAIN_RECORD,
  ],
}))

// Import via static import — vitest hoists vi.mock() calls before imports,
// so the mock is active when @/lib/originality loads the catalog parser.
import { matchDefects } from '@/lib/originality'

describe('matchDefects — trim_category exclude', () => {
  it('flags DMF wear on a 993 Carrera (no exclusion applies)', () => {
    const ctx: ListingContext = {
      generation_id: '993',
      engine_family: null,
      year: 1996,
      mileage: 50000,
      trim: 'Carrera 2',
      trim_category: '993_C2',
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_dmf_wear')).toBe(true)
  })

  it('does NOT flag DMF wear on a 993 Turbo (trim_category exclude fires)', () => {
    const ctx: ListingContext = {
      generation_id: '993',
      engine_family: null,
      year: 1996,
      mileage: 50000,
      trim: 'Turbo',
      trim_category: '993_Turbo',
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_dmf_wear')).toBe(false)
  })

  it('does NOT flag DMF wear on a 993 Turbo S (trim_category exclude fires)', () => {
    const ctx: ListingContext = {
      generation_id: '993',
      engine_family: null,
      year: 1997,
      mileage: 30000,
      trim: 'Turbo S',
      trim_category: '993_Turbo_S',
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_dmf_wear')).toBe(false)
  })

  it('does NOT flag DMF wear on a 993 GT2 (trim_category exclude fires)', () => {
    const ctx: ListingContext = {
      generation_id: '993',
      engine_family: null,
      year: 1996,
      mileage: 20000,
      trim: 'GT2',
      trim_category: '993_GT2',
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_dmf_wear')).toBe(false)
  })

  it('does NOT flag DMF wear on a 964 Turbo', () => {
    const ctx: ListingContext = {
      generation_id: '964',
      engine_family: null,
      year: 1993,
      mileage: 40000,
      trim: 'Turbo',
      trim_category: '964_Turbo',
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_dmf_wear')).toBe(false)
  })

  it('conservatively flags DMF wear when trim_category is null (cannot verify exclusion)', () => {
    // When trim_category is null on the context, the exclude criterion is
    // unverifiable, so it conservatively does NOT trigger the exclusion.
    // This avoids false negatives (missing a real defect).
    const ctx: ListingContext = {
      generation_id: '993',
      engine_family: null,
      year: 1996,
      mileage: 50000,
      trim: 'Turbo',
      trim_category: null,  // DB trim_category not set — cannot verify
    }
    const items = matchDefects(ctx)
    // DMF will be flagged because we can't verify the exclusion without trim_category
    expect(items.some(i => i.source_id === 'test_dmf_wear')).toBe(true)
  })
})

describe('matchDefects — engine_family exclude (existing behavior, regression check)', () => {
  it('flags bore scoring on 996 Carrera with no engine family known', () => {
    const ctx: ListingContext = {
      generation_id: '996',
      engine_family: null,
      year: 2001,
      mileage: 60000,
      trim: 'Carrera',
      trim_category: 'carrera_base',
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_bore_scoring')).toBe(true)
  })

  it('does NOT flag bore scoring when engine_family is Mezger', () => {
    const ctx: ListingContext = {
      generation_id: '996',
      engine_family: 'Mezger',
      year: 2002,
      mileage: 30000,
      trim: 'GT3',
      trim_category: 'gt3',
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_bore_scoring')).toBe(false)
  })
})

describe('matchDefects — combined year_range + trim_category exclude', () => {
  it('flags Variocam pad wear on 996 MY1999 (year not in exclude range)', () => {
    const ctx: ListingContext = {
      generation_id: '996',
      engine_family: null,
      year: 1999,
      mileage: 70000,
      trim: 'Carrera',
      trim_category: 'carrera_base',
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_variocam_pad')).toBe(true)
  })

  it('does NOT flag Variocam pad wear when year AND trim_category both match exclude', () => {
    const ctx: ListingContext = {
      generation_id: '996',
      engine_family: null,
      year: 2003,
      mileage: 40000,
      trim: 'Carrera',
      trim_category: 'Carrera_3_6',
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_variocam_pad')).toBe(false)
  })
})

describe('matchDefects — BUG 1: body positive filter', () => {
  it('flags Targa roof seal on a 993 Targa (body matches)', () => {
    const ctx: ListingContext = {
      generation_id: '993',
      engine_family: null,
      year: 1996,
      mileage: 40000,
      trim: 'Targa',
      trim_category: '993_Targa',
      body_style: 'Targa',
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_targa_roof')).toBe(true)
  })

  it('does NOT flag Targa roof seal on a 993 Coupe (body mismatch)', () => {
    const ctx: ListingContext = {
      generation_id: '993',
      engine_family: null,
      year: 1996,
      mileage: 40000,
      trim: 'Carrera 2',
      trim_category: '993_C2',
      body_style: 'Coupe',
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_targa_roof')).toBe(false)
  })

  it('conservatively flags Targa roof seal when body_style is null (cannot verify)', () => {
    const ctx: ListingContext = {
      generation_id: '993',
      engine_family: null,
      year: 1996,
      mileage: 40000,
      trim_category: null,
      body_style: null,
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_targa_roof')).toBe(true)
  })
})

describe('matchDefects — BUG 1: body exclude', () => {
  it('flags convertible top leak on a 993 Cabriolet (no body exclusion applies)', () => {
    const ctx: ListingContext = {
      generation_id: '993',
      engine_family: null,
      year: 1996,
      mileage: 40000,
      trim_category: '993_C2',
      body_style: 'Cabriolet',
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_cabriolet_top')).toBe(true)
  })

  it('does NOT flag convertible top leak on a 993 Coupe (body exclude fires)', () => {
    const ctx: ListingContext = {
      generation_id: '993',
      engine_family: null,
      year: 1996,
      mileage: 40000,
      trim_category: '993_C2',
      body_style: 'Coupe',
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_cabriolet_top')).toBe(false)
  })

  it('does NOT flag convertible top leak on a 993 Targa (body exclude fires)', () => {
    const ctx: ListingContext = {
      generation_id: '993',
      engine_family: null,
      year: 1996,
      mileage: 40000,
      trim_category: '993_Targa',
      body_style: 'Targa',
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_cabriolet_top')).toBe(false)
  })

  it('conservatively flags convertible top leak when body_style is null', () => {
    const ctx: ListingContext = {
      generation_id: '993',
      engine_family: null,
      year: 1996,
      mileage: 40000,
      trim_category: null,
      body_style: null,
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_cabriolet_top')).toBe(true)
  })
})

describe('matchDefects — BUG 3/4: post-split generation key matching', () => {
  it('flags chain tensioner on a g-series-2.7 listing (1976)', () => {
    const ctx: ListingContext = {
      generation_id: 'g-series-2.7',
      engine_family: null,
      year: 1976,
      mileage: 80000,
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_pre84_chain')).toBe(true)
  })

  it('flags chain tensioner on a 911-sc listing (1980)', () => {
    const ctx: ListingContext = {
      generation_id: '911-sc',
      engine_family: null,
      year: 1980,
      mileage: 90000,
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_pre84_chain')).toBe(true)
  })

  it('flags chain tensioner on a 911-f-body listing (1971)', () => {
    const ctx: ListingContext = {
      generation_id: '911-f-body',
      engine_family: null,
      year: 1971,
      mileage: 100000,
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_pre84_chain')).toBe(true)
  })

  it('does NOT flag chain tensioner on a 964 listing (wrong generation)', () => {
    const ctx: ListingContext = {
      generation_id: '964',
      engine_family: null,
      year: 1990,
      mileage: 60000,
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_pre84_chain')).toBe(false)
  })

  it('does NOT flag chain tensioner on a 911-3.2-carrera outside year_range (1986)', () => {
    const ctx: ListingContext = {
      generation_id: '911-3.2-carrera',
      engine_family: null,
      year: 1986,
      mileage: 70000,
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_pre84_chain')).toBe(false)
  })

  it('does NOT flag chain tensioner on a 930 listing outside year_range (1986)', () => {
    const ctx: ListingContext = {
      generation_id: '930',
      engine_family: null,
      year: 1986,
      mileage: 50000,
    }
    const items = matchDefects(ctx)
    expect(items.some(i => i.source_id === 'test_pre84_chain')).toBe(false)
  })
})
