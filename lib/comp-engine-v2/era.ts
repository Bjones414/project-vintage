// ============================================================
// Comp Engine V2 — Era Taxonomy
//
// Maps generation_id (and optionally trim_category) to one of four
// collector-market eras. Era is the authority for:
//   - mileage_log_x_era interaction term in Ridge regression
//   - future era-level prior segmentation (Session 2)
//
// Throws on unknown generation_id so mismatches are caught at
// test time, not silently dropped from the design matrix.
// ============================================================

export type Era = 'air_cooled' | 'water_cooled_na' | 'water_cooled_gt' | 'modern_turbo'

// GT/RS trim categories within water-cooled generations warrant a separate era
// because their mileage-price relationship differs from Carrera variants.
// Air-cooled GT2/RS are still air_cooled; 992 GT3 is modern_turbo.
const GT_TRIM_CATEGORIES = new Set([
  'gt2', 'gt2_rs', 'gt2_evo',
  'gt3', 'gt3_rs',
  'r', 'st',
  'rs_lightweight', 'rs_america', 'rs_touring', 'rs_clubsport', 'rs_club',
  'sport_classic',
  'cayman_gt4', 'cayman_gt4_rs',
  'boxster_gt4', 'boxster_gt4_rs',
])

const GENERATION_ERA: Record<string, Era> = {
  // Air-cooled 911 (1965–1998)
  'pre-964':          'air_cooled',
  '964':              'air_cooled',
  '993':              'air_cooled',

  // Water-cooled naturally-aspirated 911 (1999–2018)
  '996.1':            'water_cooled_na',
  '996.2':            'water_cooled_na',
  '997.1':            'water_cooled_na',
  '997.2':            'water_cooled_na',
  '991.1':            'water_cooled_na',
  '991.2':            'water_cooled_na',

  // Boxster / Cayman — water-cooled NA sports platform
  '986':              'water_cooled_na',
  '987.1-boxster':    'water_cooled_na',
  '987.2-boxster':    'water_cooled_na',
  '981-boxster':      'water_cooled_na',
  '982-boxster':      'water_cooled_na',   // 718 Boxster (turbo-4, but same NA market tier)
  '987.1-cayman':     'water_cooled_na',
  '987.2-cayman':     'water_cooled_na',
  '981-cayman':       'water_cooled_na',
  '982-cayman':       'water_cooled_na',   // 718 Cayman (turbo-4, same NA market tier)

  // Modern turbocharged 911 (2019+)
  '992.1':            'modern_turbo',
  '992.2':            'modern_turbo',

  // Cayenne — always turbocharged SUV
  'cayenne-i':        'modern_turbo',
  'cayenne-ii':       'modern_turbo',
  'cayenne-iii':      'modern_turbo',

  // Macan
  'macan-i':          'modern_turbo',
  'macan-ii':         'modern_turbo',

  // Panamera
  'panamera-i':       'modern_turbo',
  'panamera-ii':      'modern_turbo',

  // Taycan (electric; shares modern_turbo market tier)
  'taycan-i':         'modern_turbo',
}

// Water-cooled generations where GT/RS trim categories should be promoted
// to water_cooled_gt. Air-cooled and modern_turbo GT variants stay in their
// base era (e.g., 993 GT2 = air_cooled, 992 GT3 = modern_turbo).
const WATER_COOLED_NA_GENERATIONS = new Set([
  '996.1', '996.2', '997.1', '997.2', '991.1', '991.2',
  '986', '987.1-boxster', '987.2-boxster', '981-boxster', '982-boxster',
  '987.1-cayman', '987.2-cayman', '981-cayman', '982-cayman',
])

/**
 * Map a generation_id (+ optional trim_category) to a collector-market era.
 * Throws for unrecognised generation_id values so gaps are caught at startup.
 */
export function getEra(generationId: string, trimCategory?: string | null): Era {
  const base = GENERATION_ERA[generationId]
  if (base === undefined) {
    throw new Error(
      `[era] Unknown generation_id: "${generationId}". Add it to GENERATION_ERA in era.ts.`,
    )
  }
  if (
    base === 'water_cooled_na' &&
    WATER_COOLED_NA_GENERATIONS.has(generationId) &&
    trimCategory != null &&
    GT_TRIM_CATEGORIES.has(trimCategory)
  ) {
    return 'water_cooled_gt'
  }
  return base
}

// Ordinal encoding used for the mileage_log_x_era interaction term.
// Lower ordinal = earlier / less turbocharged era.
export const ERA_ORDINAL: Record<Era, number> = {
  air_cooled:       0,
  water_cooled_na:  1,
  water_cooled_gt:  2,
  modern_turbo:     3,
}
