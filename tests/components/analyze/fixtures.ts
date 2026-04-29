import type { Tables } from '@/lib/supabase/types'
import type { AnalysisData } from '@/components/analyze/types'
import type { Json } from '@/lib/supabase/types'

// ---------------------------------------------------------------------------
// Fixture: 2024 Porsche 718 Cayman GT4 RS
// Represents a sold BaT listing — Phase 3/4 canonical schema shape.
// ---------------------------------------------------------------------------
export const GT4_RS_LISTING: Tables<'listings'> = {
  id: 'fixture-gt4rs-001',
  source_platform: 'bring-a-trailer',
  source_url: 'https://bringatrailer.com/listing/2024-porsche-718-cayman-gt4-rs',
  source_listing_id: '180001',
  vin: 'WP0AC2A84RS270001',
  make: 'Porsche',
  model: '718 Cayman',
  generation: '718',
  generation_id: '982-cayman',
  trim: 'GT4 RS',
  body_style: 'Coupe',
  year: 2024,
  mileage: 847,
  mileage_unit: 'mi',
  transmission: 'PDK',
  drivetrain: 'RWD',
  engine_displacement_cc: 3996,
  exterior_color: 'Shark Blue',
  exterior_color_code: 'M5N',
  interior_color: 'Black',
  interior_material: null,
  options: ['Front Axle Lift System', 'Club Sport Package', 'Weissach Package'],
  modifications: [],
  high_bid: 21500000,
  final_price: 22000000,
  asking_price: null,
  reserve_met: true,
  currency: 'USD',
  listing_status: 'sold',
  status: 'sold',
  listed_date: '2024-09-01',
  ended_date: '2024-09-08',
  auction_ends_at: '2024-09-08T20:00:00.000Z',
  decoded_year: 2024,
  decoded_make: 'PORSCHE',
  decoded_model: '718 Cayman',
  decoded_body_class: 'Coupe',
  decoded_engine: '4.0L H-6',
  decoded_plant: 'Zuffenhausen',
  decoded_transmission: 'Automatic',
  service_history_present: true,
  ownership_count: 1,
  raw_description: null,
  raw_html_snapshot_key: null,
  last_verified_at: null,
  vin_decode_raw: null,
  created_at: '2024-09-01T00:00:00.000Z',
  updated_at: '2024-09-08T20:00:00.000Z',
}

// ---------------------------------------------------------------------------
// Fixture: 1988 Porsche 930 Turbo (3.3)
// Represents an air-cooled sold BaT listing — Phase 3/4 canonical schema shape.
// ---------------------------------------------------------------------------
export const TURBO_930_LISTING: Tables<'listings'> = {
  id: 'fixture-930-001',
  source_platform: 'bring-a-trailer',
  source_url: 'https://bringatrailer.com/listing/1988-porsche-930-turbo',
  source_listing_id: '180002',
  vin: 'WP0EB0918JS857501',
  make: 'Porsche',
  model: '911',
  generation: '930',
  generation_id: '930',
  trim: 'Turbo',
  body_style: 'Coupe',
  year: 1988,
  mileage: 45200,
  mileage_unit: 'mi',
  transmission: 'Manual',
  drivetrain: 'RWD',
  engine_displacement_cc: 3299,
  exterior_color: 'Guards Red',
  exterior_color_code: 'G1',
  interior_color: 'Black',
  interior_material: 'Leather',
  options: ['Sunroof', 'Whale Tail Spoiler'],
  modifications: [],
  high_bid: 17500000,
  final_price: 18000000,
  asking_price: null,
  reserve_met: true,
  currency: 'USD',
  listing_status: 'sold',
  status: 'sold',
  listed_date: '2024-08-15',
  ended_date: '2024-08-22',
  auction_ends_at: '2024-08-22T19:00:00.000Z',
  decoded_year: 1988,
  decoded_make: 'PORSCHE',
  decoded_model: '911',
  decoded_body_class: 'Coupe',
  decoded_engine: '3.3L H-6 Turbo',
  decoded_plant: 'Zuffenhausen',
  decoded_transmission: 'Manual',
  service_history_present: true,
  ownership_count: 3,
  raw_description: null,
  raw_html_snapshot_key: null,
  last_verified_at: null,
  vin_decode_raw: null,
  created_at: '2024-08-15T00:00:00.000Z',
  updated_at: '2024-08-22T19:00:00.000Z',
}

// ---------------------------------------------------------------------------
// Fixture: porsche_generations rows
// ---------------------------------------------------------------------------
export const GENERATION_982_CAYMAN: Tables<'porsche_generations'> = {
  generation_id: '982-cayman',
  model: 'Cayman',
  model_family: '718',
  year_start: 2017,
  year_end: null,
  body_styles: ['Coupe'],
  engine_type: 'Water-cooled',
  content_status: null,
  notes: 'The 982 generation introduced turbocharged flat-four power to the Cayman lineup, with GT4 variants retaining natural aspiration.',
  notes_full: null,
  hero_image_url: null,
  hero_image_caption: null,
  hero_image_license: null,
  common_issues: [],
  period_reviews: [],
  production_count: null,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

export const GENERATION_930: Tables<'porsche_generations'> = {
  generation_id: '930',
  model: '911',
  model_family: '911',
  year_start: 1975,
  year_end: 1989,
  body_styles: ['Coupe', 'Cabriolet', 'Targa'],
  engine_type: 'Air-cooled',
  content_status: null,
  notes: 'The 930 Turbo was the first turbocharged production Porsche, powered by a 3.3-litre air-cooled flat-six.',
  notes_full: null,
  hero_image_url: null,
  hero_image_caption: null,
  hero_image_license: null,
  common_issues: [],
  period_reviews: [],
  production_count: null,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

export const GENERATION_993_PUBLISHED: Tables<'porsche_generations'> = {
  generation_id: '993',
  model: '911',
  model_family: '911',
  year_start: 1994,
  year_end: 1998,
  body_styles: ['Coupe', 'Cabriolet', 'Targa'],
  engine_type: 'Air-cooled',
  content_status: 'published',
  notes: 'The 993 was the last air-cooled 911, regarded by many collectors as the purest expression of the original formula.' +
    '\n\n' +
    'Production ended in 1998 when the water-cooled 996 replaced it, making the 993 the definitive air-cooled collector car to many enthusiasts.' +
    '\n\n' +
    'The Carrera RS 3.8 and Turbo S variants command the strongest premiums among the 993 family.',
  notes_full: null,
  hero_image_url: null,
  hero_image_caption: null,
  hero_image_license: null,
  common_issues: [],
  period_reviews: [],
  production_count: null,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

// ---------------------------------------------------------------------------
// Fixture: generation_editorial rows (content_status = 'verified')
// ---------------------------------------------------------------------------
export const EDITORIAL_982_CAYMAN_VERIFIED: Tables<'generation_editorial'> = {
  id: 'fixture-editorial-982-cayman',
  generation_id: '982-cayman',
  content_status: 'verified',
  summary:
    'The 982-generation 718 Cayman arrived in 2017 as a significant step forward for Porsche\'s mid-engine two-seater.' +
    '\n\n' +
    'While the turbocharged flat-four engine proved controversial among driving purists, the GT4 and GT4 RS variants retained naturally aspirated flat-six power from the motorsport programme, widely regarded as the high point of modern road-going purity.' +
    '\n\n' +
    'The GT4 RS (2022–) replaced the PDK-optional GT4 with a motorsport-derived 9,000 rpm unit producing 500 horsepower — the highest specific output of any naturally aspirated Porsche road car.',
  watch_outs: [
    'Check for clutch wear on standard GT4 models — the manual gearbox has a narrow friction point window',
    'Coolant leak from water pump — documented on early 982 turbocharged cars under 40,000 miles',
    'Verify GT4 RS software version for early throttle map calibration issues',
    'Inspect front splitter and undertray for road damage — GT4 RS ground clearance is minimal',
  ],
  color_context:
    'Shark Blue (M5N) is a Paint to Sample colour introduced for the 982 generation, produced in limited numbers.',
  notable_variants: ['GT4', 'GT4 RS', 'Spyder', 'GTS 4.0'],
  production_notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-06-01T00:00:00.000Z',
}

export const EDITORIAL_930_VERIFIED: Tables<'generation_editorial'> = {
  id: 'fixture-editorial-930',
  generation_id: '930',
  content_status: 'verified',
  summary:
    'The 930 Turbo established Porsche\'s reputation for turbocharged performance road cars when it debuted at the 1973 Paris Motor Show.' +
    '\n\n' +
    'Its 3.3-litre engine, introduced in 1978, produced 300 horsepower and came with the iconic whale-tail rear spoiler and a reputation for demanding, expert-level driving dynamics.' +
    '\n\n' +
    'Low-mileage, unmodified examples with documented service history command significant premiums. Numbers-matching engines and original paint are paramount to collector value.',
  watch_outs: [
    'Turbocharger lag is significant — the "widow-maker" reputation is earned on corners',
    'Inspect for IMS or cam chain tensioner replacements (carried forward from SC period)',
    'Verify the engine case numbers match the VIN datacard',
    'Check for rust in the battery tray area and floor sills',
    'Original Fuchs alloys command a premium — confirm they have not been refinished',
  ],
  color_context:
    'Guards Red (G1) was a flagship Porsche colour throughout the air-cooled era and remains the single most recognisable 930 Turbo specification.',
  notable_variants: ['3.0 Turbo', '3.3 Turbo', 'Flachbau', 'Targa Turbo'],
  production_notes: null,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-06-01T00:00:00.000Z',
}

// ---------------------------------------------------------------------------
// Fixture: porsche_color_codes rows
// ---------------------------------------------------------------------------
export const COLOR_SHARK_BLUE: Tables<'porsche_color_codes'> = {
  paint_code: 'M5N',
  color_name: 'Shark Blue',
  color_family: 'Blue',
  finish_type: 'Metallic',
  generation_applicability: ['982-cayman', '982-boxster'],
  is_special_order: true,
  rarity: 'rare',
  notes: 'Paint to Sample colour; produced in very limited numbers for the 982 generation.',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

export const COLOR_GUARDS_RED: Tables<'porsche_color_codes'> = {
  paint_code: 'G1',
  color_name: 'Guards Red',
  color_family: 'Red',
  finish_type: 'Solid',
  generation_applicability: ['930', '964', '993', '996.1', '996.2', '997.1', '997.2'],
  is_special_order: false,
  rarity: 'common',
  notes: 'Standard production colour across the air-cooled and early water-cooled eras.',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
}

// ---------------------------------------------------------------------------
// Fixture: listing_analyses.analysis_data shapes
// ---------------------------------------------------------------------------
export const ANALYSIS_DATA_GT4_RS: AnalysisData = {
  lede:
    'This 2024 Porsche 718 Cayman GT4 RS with 847 miles sold at the upper end of fair market range, supported by 12 comparable sales from the past 18 months.',
  secondary_line: 'Reserve met. One owner from new. Factory Weissach Package.',
  confidence_score: 84,
  confidence_label: 'high',
  methodology: '12 comparable GT4 RS sales, weighted by mileage and specification.',
  fair_value_low_cents: 19500000,
  fair_value_median_cents: 21500000,
  fair_value_high_cents: 24000000,
  comps_used: 12,
  comparable_sales: [
    {
      year: 2024,
      make: 'Porsche',
      model: '718 Cayman',
      trim: 'GT4 RS',
      mileage: 1200,
      mileage_unit: 'mi',
      final_price_cents: 21200000,
      sale_date: '2024-07-15',
      source_platform: 'bring-a-trailer',
    },
    {
      year: 2023,
      make: 'Porsche',
      model: '718 Cayman',
      trim: 'GT4 RS',
      mileage: 3800,
      mileage_unit: 'mi',
      final_price_cents: 19800000,
      sale_date: '2024-05-02',
      source_platform: 'bring-a-trailer',
    },
    {
      year: 2023,
      make: 'Porsche',
      model: '718 Cayman',
      trim: 'GT4 RS',
      mileage: 6100,
      mileage_unit: 'mi',
      final_price_cents: 18500000,
      sale_date: '2024-03-20',
      source_platform: 'cars-and-bids',
    },
  ],
}

export const ANALYSIS_DATA_930: AnalysisData = {
  lede:
    'This 1988 Porsche 930 Turbo with 45,200 miles sold within the established fair market range for well-documented, numbers-matching examples.',
  secondary_line: 'Reserve met. Three prior owners. Service records present.',
  confidence_score: 76,
  confidence_label: 'high',
  methodology: '8 comparable 930 Turbo sales, weighted by mileage, colour, and documentation.',
  fair_value_low_cents: 15000000,
  fair_value_median_cents: 18000000,
  fair_value_high_cents: 22000000,
  comps_used: 8,
  comparable_sales: [
    {
      year: 1988,
      make: 'Porsche',
      model: '911',
      trim: 'Turbo',
      mileage: 38000,
      mileage_unit: 'mi',
      final_price_cents: 19200000,
      sale_date: '2024-06-10',
      source_platform: 'bring-a-trailer',
    },
    {
      year: 1987,
      make: 'Porsche',
      model: '911',
      trim: 'Turbo',
      mileage: 52000,
      mileage_unit: 'mi',
      final_price_cents: 16800000,
      sale_date: '2024-04-15',
      source_platform: 'bring-a-trailer',
    },
  ],
}

// ---------------------------------------------------------------------------
// Fixture: listing_analyses rows (full database row shape including Phase 5 columns)
// ---------------------------------------------------------------------------

export const ANALYSIS_ROW_EMPTY: Tables<'listing_analyses'> = {
  id: 'fixture-analysis-empty-001',
  listing_id: 'fixture-gt4rs-001',
  user_id: null,
  source_url: 'https://bringatrailer.com/listing/2024-porsche-718-cayman-gt4-rs',
  source_platform: 'bring-a-trailer',
  analysis_data: {},
  findings: [] as Json,
  finding_count: 0,
  confidence_score: null,
  comp_count: null,
  created_at: '2024-09-01T00:00:00.000Z',
}

const THREE_FINDINGS: Json = [
  {
    rule_id: 'mileage_above_median',
    category: 'worth_asking',
    severity: 'caution',
    title: 'Mileage is above average for year and trim',
    body: 'At 45,200 miles, this example sits above the median for documented 930 Turbo sales at auction. Request a full service history to account for the additional use and verify no deferred maintenance.',
    qualifier: null,
  },
  {
    rule_id: 'matching_transmission',
    category: 'this_car',
    severity: 'positive',
    title: 'Manual transmission — period correct',
    body: 'The 930 Turbo was exclusively offered with the 4-speed manual gearbox during this model year. A matching-numbers transmission is a meaningful originality signal for collector value.',
    qualifier: null,
  },
  {
    rule_id: 'multi_owner_history',
    category: 'watch_closely',
    severity: 'concern',
    title: 'Three prior owners — verify full history',
    body: 'Three ownership changes is above the median for this generation and configuration. Request complete service records spanning all ownership periods to identify deferred maintenance or unreported incidents.',
    qualifier: '3 prior owners',
  },
]

export const ANALYSIS_ROW_3_FINDINGS: Tables<'listing_analyses'> = {
  id: 'fixture-analysis-findings-001',
  listing_id: 'fixture-930-001',
  user_id: null,
  source_url: 'https://bringatrailer.com/listing/1988-porsche-930-turbo',
  source_platform: 'bring-a-trailer',
  analysis_data: {},
  findings: THREE_FINDINGS,
  finding_count: 3,
  confidence_score: null,
  comp_count: 8,
  created_at: '2024-08-15T00:00:00.000Z',
}
