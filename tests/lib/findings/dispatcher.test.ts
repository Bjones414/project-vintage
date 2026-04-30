import { describe, it, expect } from 'vitest'
import { runFindingsRules } from '@/lib/findings/dispatcher'
import type { RuleInput } from '@/lib/findings/types'
import type { CanonicalListing } from '@/lib/listing-parser/types'

const baseListing: CanonicalListing = {
  source_platform: 'bring-a-trailer',
  source_url: 'https://bringatrailer.com/listing/test',
  source_listing_id: 'test-1',
  title: '2002 Porsche 996 Carrera',
  year: 2002,
  make: 'Porsche',
  model: '911',
  trim: 'Carrera',
  vin: null,
  mileage: 60000,
  engine: null,
  transmission: 'manual',
  exterior_color: null,
  interior_color: null,
  sold_price_cents: null,
  high_bid_cents: null,
  listing_status: 'live',
  bid_count: null,
  reserve_met: null,
  has_no_reserve: false,
  auction_end_date: null,
  seller_info: null,
  description: 'Clean 996 with full service records.',
  modification_notes: null,
  image_urls: [],
  raw_data: {},
}

const baseInput: RuleInput = { listing: baseListing, generationId: '996' }

describe('runFindingsRules dispatcher', () => {
  it('returns an array', () => {
    expect(Array.isArray(runFindingsRules(baseInput))).toBe(true)
  })

  it('filters out null findings', () => {
    // mileage-vs-average always returns null; verify it is excluded
    const findings = runFindingsRules({ listing: baseListing, generationId: '993' })
    expect(findings.every((f) => f !== null)).toBe(true)
  })

  it('returns findings for 996 (at minimum the generation-watchout caution)', () => {
    const findings = runFindingsRules(baseInput)
    const ruleIds = findings.map((f) => f.rule_id)
    expect(ruleIds).toContain('generation-watchout')
  })

  it('includes service-records positive for listing with service record mention', () => {
    const findings = runFindingsRules(baseInput)
    const ruleIds = findings.map((f) => f.rule_id)
    expect(ruleIds).toContain('service-records')
  })

  it('each finding has required shape', () => {
    const findings = runFindingsRules(baseInput)
    for (const f of findings) {
      expect(typeof f.id).toBe('string')
      expect(typeof f.rule_id).toBe('string')
      expect(typeof f.rule_version).toBe('string')
      expect(typeof f.source).toBe('string')
      expect(typeof f.title).toBe('string')
      expect(typeof f.body).toBe('string')
      expect(['positive', 'caution', 'concern']).toContain(f.severity)
    }
  })

  it('catches errors from individual rules and continues', () => {
    // Inject a throwing rule by mocking — use the internal RULES array indirectly
    // by verifying the dispatcher does not throw even if a rule throws
    const throwingInput = {
      listing: {
        ...baseListing,
        // Force a scenario where description accessor might throw (not realistic but tests safety)
        get description(): string | null {
          throw new Error('unexpected parse error')
        },
      },
      generationId: '993',
    }
    // Should not throw — dispatcher catches individual rule errors
    expect(() => runFindingsRules(throwingInput)).not.toThrow()
  })
})
