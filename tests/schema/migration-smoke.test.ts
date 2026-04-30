import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

function migrationSQL(filename: string): string {
  return readFileSync(join(process.cwd(), 'supabase/migrations', filename), 'utf-8')
}

describe('migration smoke — step 1: auction dynamics', () => {
  const sql = migrationSQL('20260429060000_add_auction_dynamics.sql')
  it.each(['bid_count', 'comment_count', 'bid_to_buy_ratio', 'final_to_reserve_ratio'])(
    'declares column %s',
    (col) => expect(sql).toContain(col),
  )
})

describe('migration smoke — step 2: vehicle attributes', () => {
  const sql = migrationSQL('20260429070000_add_vehicle_attributes.sql')
  it.each(['trim_category', 'country_of_sale'])('declares column %s', (col) =>
    expect(sql).toContain(col),
  )
})

describe('migration smoke — step 3: condition & originality signals', () => {
  const sql = migrationSQL('20260429080000_add_condition_signals.sql')
  it.each([
    'condition_signal',
    'paint_signal',
    'interior_signal',
    'numbers_matching',
    'mod_status',
  ])('declares column %s', (col) => expect(sql).toContain(col))

  it('condition_signal CHECK includes all valid values', () => {
    expect(sql).toContain('concours')
    expect(sql).toContain('excellent')
    expect(sql).toContain('good')
    expect(sql).toContain('driver')
    expect(sql).toContain('project')
  })

  it('mod_status CHECK includes all valid values', () => {
    expect(sql).toContain('stock')
    expect(sql).toContain('light_reversible')
    expect(sql).toContain('heavy')
  })
})

describe('migration smoke — step 4: documentation signals', () => {
  const sql = migrationSQL('20260429090000_add_documentation_signals.sql')
  it.each([
    'has_porsche_coa',
    'has_kardex',
    'has_service_records',
    'has_window_sticker',
    'has_owners_manual',
    'owner_count',
    'documentation_score',
  ])('declares column %s', (col) => expect(sql).toContain(col))
})

describe('migration smoke — step 5: factory options', () => {
  const sql = migrationSQL('20260429100000_add_factory_options.sql')
  it.each([
    'factory_options',
    'has_x50_powerkit',
    'has_aero_kit',
    'has_sport_seats',
    'is_paint_to_sample',
  ])('declares column %s', (col) => expect(sql).toContain(col))
})

describe('migration smoke — step 6: market_snapshots', () => {
  const sql = migrationSQL('20260429110000_create_market_snapshots.sql')

  it('creates the market_snapshots table', () => {
    expect(sql).toContain('CREATE TABLE')
    expect(sql).toContain('market_snapshots')
  })

  it.each([
    'generation_id',
    'trim_category',
    'snapshot_date',
    'active_listing_count',
    'sold_count_30d',
    'median_price_30d',
    'median_dom_30d',
    'sell_through_rate_30d',
  ])('declares column %s', (col) => expect(sql).toContain(col))

  it('has composite index on (generation_id, trim_category, snapshot_date)', () => {
    expect(sql).toContain('market_snapshots_gen_trim_date_idx')
    expect(sql).toContain('generation_id')
    expect(sql).toContain('trim_category')
    expect(sql).toContain('snapshot_date')
  })

  it('enables RLS', () => {
    expect(sql).toContain('ENABLE ROW LEVEL SECURITY')
  })

  it('grants SELECT to anon and authenticated', () => {
    expect(sql).toContain('anon')
    expect(sql).toContain('authenticated')
    expect(sql).toContain('GRANT SELECT')
  })

  it('grants ALL to service_role', () => {
    expect(sql).toContain('service_role')
    expect(sql).toContain('GRANT ALL')
  })
})
