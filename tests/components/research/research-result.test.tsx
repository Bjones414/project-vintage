import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'

function t(html: string): string {
  return html.replace(/<!--.*?-->/g, '')
}

import type { ResearchRecord } from '@/lib/research/types'
import { SubjectVehicleCard } from '@/components/research/SubjectVehicleCard'
import { EraCard } from '@/components/analyze/EraCard'
import { ComparableSalesCard } from '@/components/analyze/ComparableSalesCard'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const RESEARCH_991_1_TURBO: ResearchRecord = {
  id: 'research-test-991-turbo',
  year: 2013,
  model: '911',
  trim: 'Turbo',
  mileage: 22000,
  asking_price_cents: null,
  transmission: null,
  exterior_color: null,
  interior_color: null,
  vin: 'WP0CB2A9XDS154936',
  generation_id: '991.1',
  drivetrain: 'AWD',
  body_style: 'Coupe',
  cooling: 'Water-cooled',
  created_at: '2026-05-16T00:00:00.000Z',
}

const RESEARCH_NO_GEN: ResearchRecord = {
  id: 'research-test-no-gen',
  year: 1982,
  model: '911',
  trim: 'SC',
  mileage: null,
  asking_price_cents: null,
  transmission: null,
  exterior_color: null,
  interior_color: null,
  vin: null,
  generation_id: null,
  drivetrain: null,
  body_style: null,
  cooling: null,
  created_at: '2026-05-16T00:00:00.000Z',
}

const COMP_RESULT_RESEARCH_SUFFICIENT = {
  id: 'research',
  listing_id: 'research',
  tier: 'strict' as const,
  comp_count: 6,
  fair_value_low_cents: 130_000_00,
  fair_value_median_cents: 155_000_00,
  fair_value_high_cents: 175_000_00,
  most_recent_comp_sold_at: null,
  oldest_comp_sold_at: null,
  comp_listing_ids: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'],
  computed_at: new Date().toISOString(),
}

const COMP_RESULT_RESEARCH_INSUFFICIENT = {
  ...COMP_RESULT_RESEARCH_SUFFICIENT,
  tier: 'insufficient' as const,
  comp_count: 1,
  fair_value_low_cents: null,
  fair_value_median_cents: null,
  fair_value_high_cents: null,
  comp_listing_ids: [],
}

// ---------------------------------------------------------------------------
// SubjectVehicleCard — identity fields and Research-only factory specs
// ---------------------------------------------------------------------------

describe('SubjectVehicleCard — vehicle identity', () => {
  it('renders section label and key identity fields', () => {
    const html = renderToString(<SubjectVehicleCard record={RESEARCH_991_1_TURBO} />)
    expect(t(html)).toContain('Subject Vehicle')
    expect(t(html)).toContain('2013')
    expect(t(html)).toContain('911')
    expect(t(html)).toContain('Turbo')
    expect(t(html)).toContain('991.1')
  })

  it('renders VIN when present', () => {
    const html = renderToString(<SubjectVehicleCard record={RESEARCH_991_1_TURBO} />)
    expect(html).toContain('WP0CB2A9XDS154936')
    expect(t(html)).toContain('VIN')
  })

  it('formats mileage with thousands separator', () => {
    const html = renderToString(<SubjectVehicleCard record={RESEARCH_991_1_TURBO} />)
    expect(t(html)).toContain('22,000 mi')
  })

  it('omits VIN section when vin is null', () => {
    const html = renderToString(<SubjectVehicleCard record={RESEARCH_NO_GEN} />)
    expect(html).not.toContain('VIN')
  })
})

describe('SubjectVehicleCard — factory specs (Research-only)', () => {
  it('renders Factory Specs section for known generation+trim', () => {
    const html = renderToString(<SubjectVehicleCard record={RESEARCH_991_1_TURBO} />)
    expect(t(html)).toContain('Factory Specs')
    expect(t(html)).toContain('Power')
    expect(t(html)).toContain('Torque')
    expect(t(html)).toContain('0–60 mph')
  })

  it('renders correct power figure for 991.1 Turbo', () => {
    const html = renderToString(<SubjectVehicleCard record={RESEARCH_991_1_TURBO} />)
    expect(t(html)).toContain('520 hp')
  })

  it('omits factory specs when generation_id is null', () => {
    const html = renderToString(<SubjectVehicleCard record={RESEARCH_NO_GEN} />)
    expect(t(html)).not.toContain('Factory Specs')
  })
})

// ---------------------------------------------------------------------------
// EraCard — generation header fix (Research-specific bug: "THE THIS GENERATION GENERATION")
// ---------------------------------------------------------------------------

describe('EraCard — generation header in Research context', () => {
  it('renders "The 991.1 generation" header when generationId is passed and DB row is null', () => {
    const html = renderToString(
      <EraCard generation={null} generationId="991.1" viewerTier="free" />,
    )
    expect(t(html)).toContain('991.1 generation')
    expect(t(html)).not.toContain('this generation generation')
  })

  it('uses actual generation_id in the era guide header, not a placeholder', () => {
    const html = renderToString(
      <EraCard generation={null} generationId="996.2" viewerTier="free" />,
    )
    expect(t(html)).toContain('996.2 generation')
    expect(t(html)).not.toContain('this generation')
  })

  it('renders real 991.1 era content — no coming-soon placeholder', () => {
    const html = renderToString(
      <EraCard generation={null} generationId="991.1" viewerTier="free" />,
    )
    // Intro text from generation-content.ts
    expect(t(html)).toContain('991.1 was the first all-new 911 platform')
    expect(t(html)).not.toContain('Era guide for this generation coming soon')
  })

  it('shows "More on the 991.1 →" link for non-anonymous viewer', () => {
    const html = renderToString(
      <EraCard generation={null} generationId="991.1" viewerTier="free" />,
    )
    expect(html).toContain('/generations/991.1')
    expect(t(html)).toContain('More on the 991.1')
  })
})

// ---------------------------------------------------------------------------
// Research result — no auction-specific UI rendered
// ---------------------------------------------------------------------------

describe('Research result — no auction-specific components', () => {
  it('ComparableSalesCard with insufficient tier renders empty state without auction copy', () => {
    const html = renderToString(
      <ComparableSalesCard
        analysisData={null}
        compResult={COMP_RESULT_RESEARCH_INSUFFICIENT}
        compListings={[]}
        viewerTier="free"
      />,
    )
    expect(t(html)).toContain('Comparable Sales')
    // Insufficient state renders
    expect(t(html)).toContain('Not enough comparable sales')
  })

  it('ComparableSalesCard with sufficient comps renders comp list — no fair-value verdict tile', () => {
    const compListings = [
      {
        id: 'c1',
        year: 2013,
        make: 'Porsche',
        model: '911',
        trim: 'Turbo',
        mileage: 18000,
        final_price: 155_000_00,
        auction_ends_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        source_url: null,
        source_platform: 'bring-a-trailer',
        source_publication: null,
      },
    ]
    const html = renderToString(
      <ComparableSalesCard
        analysisData={null}
        compResult={COMP_RESULT_RESEARCH_SUFFICIENT}
        compListings={compListings}
        viewerTier="free"
      />,
    )
    expect(t(html)).toContain('Comparable Sales')
    expect(t(html)).toContain('2013 Porsche 911 Turbo')
    // No verdict pill UI (those live in VerdictBlock / ResearchVerdictBlock, not here)
    expect(t(html)).not.toContain('Fair Value Range')
  })
})
