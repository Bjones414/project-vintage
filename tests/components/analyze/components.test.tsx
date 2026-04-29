import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'

// React server rendering inserts <!-- --> comment nodes between dynamic text
// fragments. Strip them before text-content assertions.
function t(html: string): string {
  return html.replace(/<!--.*?-->/g, '')
}
import {
  GT4_RS_LISTING,
  TURBO_930_LISTING,
  GENERATION_982_CAYMAN,
  GENERATION_930,
  EDITORIAL_982_CAYMAN_VERIFIED,
  EDITORIAL_930_VERIFIED,
  COLOR_SHARK_BLUE,
  COLOR_GUARDS_RED,
  ANALYSIS_DATA_GT4_RS,
  ANALYSIS_DATA_930,
} from './fixtures'

import { AnalyzeHeader } from '@/components/analyze/AnalyzeHeader'
import { VerdictBlock } from '@/components/analyze/VerdictBlock'
import { MetricTiles } from '@/components/analyze/MetricTiles'
import { ChassisIdentityCard } from '@/components/analyze/ChassisIdentityCard'
import { ComparableSalesCard } from '@/components/analyze/ComparableSalesCard'
import { EraCard } from '@/components/analyze/EraCard'
import { WatchOutsCard } from '@/components/analyze/WatchOutsCard'
import { ColorRarityCard } from '@/components/analyze/ColorRarityCard'
import { AnonymousSignupCTA } from '@/components/analyze/AnonymousSignupCTA'
import { parseAnalysisData } from '@/components/analyze/types'

// ---------------------------------------------------------------------------
// AnalyzeHeader
// ---------------------------------------------------------------------------
describe('AnalyzeHeader', () => {
  it('renders GT4 RS listing with sold status', () => {
    const html = renderToString(
      <AnalyzeHeader
        listing={GT4_RS_LISTING}
        analysisData={ANALYSIS_DATA_GT4_RS}
        viewerTier="anonymous"
      />,
    )
    expect(html).toMatchSnapshot()
    expect(t(html)).toContain('2024 Porsche 718 Cayman GT4 RS')
    expect(t(html)).toContain('Sold')
    expect(t(html)).toContain('12 comparable sales')
  })

  it('renders 930 Turbo listing with ended time', () => {
    const html = renderToString(
      <AnalyzeHeader
        listing={TURBO_930_LISTING}
        analysisData={null}
        viewerTier="anonymous"
      />,
    )
    expect(html).toMatchSnapshot()
    expect(html).toContain('1988 Porsche 911 Turbo')
    expect(html).toContain('2024') // auction_ends_at date is rendered in SSR static form
  })

  it('omits auction count line when analysisData is null', () => {
    const html = renderToString(
      <AnalyzeHeader
        listing={GT4_RS_LISTING}
        analysisData={null}
        viewerTier="anonymous"
      />,
    )
    expect(html).not.toContain('comparable sale')
  })
})

// ---------------------------------------------------------------------------
// VerdictBlock
// ---------------------------------------------------------------------------
describe('VerdictBlock', () => {
  it('returns null when analysisData has no lede', () => {
    const html = renderToString(
      <VerdictBlock analysisData={null} viewerTier="anonymous" />,
    )
    expect(html).toBe('')
  })

  it('anonymous — shows lede, hides confidence', () => {
    const html = renderToString(
      <VerdictBlock analysisData={ANALYSIS_DATA_GT4_RS} viewerTier="anonymous" />,
    )
    expect(html).toMatchSnapshot()
    expect(html).toContain('Confidence and methodology available with a free account')
    expect(html).not.toContain('84%')
  })

  it('member — shows lede and full confidence', () => {
    const html = renderToString(
      <VerdictBlock analysisData={ANALYSIS_DATA_GT4_RS} viewerTier="member" />,
    )
    expect(html).toMatchSnapshot()
    expect(html).toContain('84%')
    expect(html).toContain('high')
    expect(html).not.toContain('available with a free account')
  })
})

// ---------------------------------------------------------------------------
// MetricTiles
// ---------------------------------------------------------------------------
describe('MetricTiles', () => {
  it('anonymous — comps count locked', () => {
    const html = renderToString(
      <MetricTiles
        listing={GT4_RS_LISTING}
        analysisData={ANALYSIS_DATA_GT4_RS}
        viewerTier="anonymous"
      />,
    )
    expect(html).toMatchSnapshot()
    expect(html).toContain('Comps Used')
    expect(html).toContain('Free account')
    expect(html).not.toContain('>12<')
  })

  it('member — comps count visible', () => {
    const html = renderToString(
      <MetricTiles
        listing={GT4_RS_LISTING}
        analysisData={ANALYSIS_DATA_GT4_RS}
        viewerTier="member"
      />,
    )
    expect(html).toContain('12')
    expect(html).not.toContain('Free account')
  })

  it('shows sale price for sold listing', () => {
    const html = renderToString(
      <MetricTiles
        listing={GT4_RS_LISTING}
        analysisData={null}
        viewerTier="member"
      />,
    )
    expect(html).toContain('Sale Price')
    expect(html).toContain('$220,000')
  })

  it('shows reserve status', () => {
    const html = renderToString(
      <MetricTiles
        listing={GT4_RS_LISTING}
        analysisData={null}
        viewerTier="anonymous"
      />,
    )
    expect(html).toContain('Reserve')
    expect(html).toContain('Met')
  })
})

// ---------------------------------------------------------------------------
// ChassisIdentityCard
// ---------------------------------------------------------------------------
describe('ChassisIdentityCard', () => {
  it('renders all identity fields for GT4 RS', () => {
    const html = renderToString(
      <ChassisIdentityCard listing={GT4_RS_LISTING} generation={GENERATION_982_CAYMAN} />,
    )
    expect(html).toMatchSnapshot()
    expect(html).toContain('WP0AC2A84RS270001')
    expect(html).toContain('Zuffenhausen')
    expect(html).toContain('4.0L H-6')
    expect(html).toContain('Coupe')
  })

  it('renders 930 Turbo identity — all viewers see VIN', () => {
    const html = renderToString(
      <ChassisIdentityCard listing={TURBO_930_LISTING} generation={GENERATION_930} />,
    )
    expect(html).toContain('WP0EB0918JS857501')
    expect(html).toContain('930')
    expect(html).toContain('3.3L H-6 Turbo')
  })

  it('gracefully handles no generation data', () => {
    const html = renderToString(
      <ChassisIdentityCard listing={GT4_RS_LISTING} generation={null} />,
    )
    expect(html).toContain('Chassis Identity')
    expect(html).toContain('WP0AC2A84RS270001')
  })
})

// ---------------------------------------------------------------------------
// ComparableSalesCard
// ---------------------------------------------------------------------------
describe('ComparableSalesCard', () => {
  it('anonymous — shows 1 comp + upsell', () => {
    const html = renderToString(
      <ComparableSalesCard analysisData={ANALYSIS_DATA_GT4_RS} viewerTier="anonymous" />,
    )
    expect(html).toMatchSnapshot()
    expect(t(html)).toContain('12 comparable sales found')
    expect(t(html)).toContain('available with a free account')
    // First comp visible
    expect(t(html)).toContain('$212,000')
    // Second comp not rendered
    expect(t(html)).not.toContain('$198,000')
  })

  it('member — shows all comps, no upsell', () => {
    const html = renderToString(
      <ComparableSalesCard analysisData={ANALYSIS_DATA_GT4_RS} viewerTier="member" />,
    )
    expect(html).toContain('$212,000')
    expect(html).toContain('$198,000')
    expect(html).not.toContain('available with a free account')
  })

  it('renders empty state when no analysis', () => {
    const html = renderToString(
      <ComparableSalesCard analysisData={null} viewerTier="anonymous" />,
    )
    expect(html).toContain('No comparable sales data available')
  })
})

// ---------------------------------------------------------------------------
// EraCard
// ---------------------------------------------------------------------------
describe('EraCard', () => {
  it('no editorial — renders development message', () => {
    const html = renderToString(
      <EraCard generation={GENERATION_930} editorial={null} viewerTier="anonymous" />,
    )
    expect(html).toMatchSnapshot()
    expect(t(html)).toContain('Era guide for this generation is in development')
  })

  it('anonymous — renders only first paragraph', () => {
    const html = renderToString(
      <EraCard
        generation={GENERATION_982_CAYMAN}
        editorial={EDITORIAL_982_CAYMAN_VERIFIED}
        viewerTier="anonymous"
      />,
    )
    expect(html).toMatchSnapshot()
    expect(html).toContain('982-cayman era')
    expect(html).toContain('significant step forward')
    expect(html).not.toContain('GT4 and GT4 RS variants')
    expect(html).toContain('Full era guide available with a free account')
  })

  it('member — renders all paragraphs', () => {
    const html = renderToString(
      <EraCard
        generation={GENERATION_930}
        editorial={EDITORIAL_930_VERIFIED}
        viewerTier="member"
      />,
    )
    expect(t(html)).toContain('1973 Paris Motor Show')
    expect(t(html)).toContain('Numbers-matching')
    expect(t(html)).not.toContain('available with a free account')
  })
})

// ---------------------------------------------------------------------------
// WatchOutsCard
// ---------------------------------------------------------------------------
describe('WatchOutsCard', () => {
  it('returns null when editorial is null', () => {
    const html = renderToString(
      <WatchOutsCard editorial={null} viewerTier="anonymous" />,
    )
    expect(html).toBe('')
  })

  it('anonymous — shows 1 watch-out + N more', () => {
    const html = renderToString(
      <WatchOutsCard editorial={EDITORIAL_982_CAYMAN_VERIFIED} viewerTier="anonymous" />,
    )
    expect(html).toMatchSnapshot()
    expect(t(html)).toContain('clutch wear')
    expect(t(html)).not.toContain('water pump')
    expect(t(html)).toContain('+3 more for members')
  })

  it('member — shows all watch-outs', () => {
    const html = renderToString(
      <WatchOutsCard editorial={EDITORIAL_930_VERIFIED} viewerTier="member" />,
    )
    expect(html).toContain('widow-maker')
    expect(html).toContain('Fuchs alloys')
    expect(html).not.toContain('more for members')
  })
})

// ---------------------------------------------------------------------------
// ColorRarityCard
// ---------------------------------------------------------------------------
describe('ColorRarityCard', () => {
  it('returns null when no color name available', () => {
    const listingNoColor = { ...GT4_RS_LISTING, exterior_color: null, exterior_color_code: null }
    const html = renderToString(
      <ColorRarityCard listing={listingNoColor} colorData={null} viewerTier="anonymous" />,
    )
    expect(html).toBe('')
  })

  it('anonymous — shows color name + one-word rarity, hides stats', () => {
    const html = renderToString(
      <ColorRarityCard
        listing={GT4_RS_LISTING}
        colorData={COLOR_SHARK_BLUE}
        viewerTier="anonymous"
      />,
    )
    expect(html).toMatchSnapshot()
    expect(html).toContain('Shark Blue')
    expect(html).toContain('Rare')
    expect(html).not.toContain('Paint to Sample')
    expect(html).toContain('Color history and context available')
  })

  it('member — shows color stats and special order badge', () => {
    const html = renderToString(
      <ColorRarityCard
        listing={GT4_RS_LISTING}
        colorData={COLOR_SHARK_BLUE}
        viewerTier="member"
      />,
    )
    expect(html).toContain('Paint to Sample')
    expect(html).toContain('Metallic')
    expect(html).not.toContain('available with a free account')
  })

  it('common color — shows rarity without special order badge', () => {
    const html = renderToString(
      <ColorRarityCard
        listing={TURBO_930_LISTING}
        colorData={COLOR_GUARDS_RED}
        viewerTier="member"
      />,
    )
    expect(html).toContain('Guards Red')
    expect(html).toContain('Common')
    expect(html).not.toContain('Paint to Sample')
  })
})

// ---------------------------------------------------------------------------
// AnonymousSignupCTA
// ---------------------------------------------------------------------------
describe('AnonymousSignupCTA', () => {
  it('renders all six benefit lines and CTA link', () => {
    const html = renderToString(<AnonymousSignupCTA />)
    expect(html).toMatchSnapshot()
    expect(html).toContain('Two free full reports')
    expect(html).toContain('No card required')
    expect(html).toContain('Create a free account')
    // six benefits
    const benefitCount = (html.match(/text-green-500/g) ?? []).length
    expect(benefitCount).toBe(6)
  })
})

// ---------------------------------------------------------------------------
// parseAnalysisData — unit tests for the jsonb coercion helper
// ---------------------------------------------------------------------------
describe('parseAnalysisData', () => {
  it('returns null for null input', () => {
    expect(parseAnalysisData(null)).toBeNull()
  })

  it('returns null for string input', () => {
    expect(parseAnalysisData('hello')).toBeNull()
  })

  it('returns null for array input', () => {
    expect(parseAnalysisData([])).toBeNull()
  })

  it('returns the object cast to AnalysisData', () => {
    const data = { lede: 'Test lede', comps_used: 5 }
    const result = parseAnalysisData(data)
    expect(result).not.toBeNull()
    expect(result?.lede).toBe('Test lede')
    expect(result?.comps_used).toBe(5)
  })
})

// ---------------------------------------------------------------------------
// Integration: full component tree — three scenarios
// ---------------------------------------------------------------------------
describe('integration — analyze page layout', () => {
  it('scenario A: anonymous viewer, GT4 RS, no analysis', () => {
    const html = renderToString(
      <div>
        <AnalyzeHeader
          listing={GT4_RS_LISTING}
          analysisData={null}
          viewerTier="anonymous"
        />
        <VerdictBlock analysisData={null} viewerTier="anonymous" />
        <MetricTiles listing={GT4_RS_LISTING} analysisData={null} viewerTier="anonymous" />
        <div>
          <ChassisIdentityCard listing={GT4_RS_LISTING} generation={GENERATION_982_CAYMAN} />
          <ComparableSalesCard analysisData={null} viewerTier="anonymous" />
        </div>
        <div>
          <EraCard
            generation={GENERATION_982_CAYMAN}
            editorial={null}
            viewerTier="anonymous"
          />
          <WatchOutsCard editorial={null} viewerTier="anonymous" />
          <ColorRarityCard
            listing={GT4_RS_LISTING}
            colorData={COLOR_SHARK_BLUE}
            viewerTier="anonymous"
          />
        </div>
        <AnonymousSignupCTA />
      </div>,
    )
    expect(html).toMatchSnapshot()
    // Anonymous sees: chassis, status badge, color name, CTA
    expect(html).toContain('WP0AC2A84RS270001')
    expect(html).toContain('Sold')
    expect(html).toContain('Shark Blue')
    expect(html).toContain('Create a free account')
    // Does NOT see: confidence, methodology
    expect(html).not.toContain('84%')
  })

  it('scenario B: member viewer, 930 Turbo, verified editorial', () => {
    const html = renderToString(
      <div>
        <AnalyzeHeader
          listing={TURBO_930_LISTING}
          analysisData={ANALYSIS_DATA_930}
          viewerTier="member"
        />
        <VerdictBlock analysisData={ANALYSIS_DATA_930} viewerTier="member" />
        <MetricTiles listing={TURBO_930_LISTING} analysisData={ANALYSIS_DATA_930} viewerTier="member" />
        <div>
          <ChassisIdentityCard listing={TURBO_930_LISTING} generation={GENERATION_930} />
          <ComparableSalesCard analysisData={ANALYSIS_DATA_930} viewerTier="member" />
        </div>
        <div>
          <EraCard
            generation={GENERATION_930}
            editorial={EDITORIAL_930_VERIFIED}
            viewerTier="member"
          />
          <WatchOutsCard editorial={EDITORIAL_930_VERIFIED} viewerTier="member" />
          <ColorRarityCard
            listing={TURBO_930_LISTING}
            colorData={COLOR_GUARDS_RED}
            viewerTier="member"
          />
        </div>
      </div>,
    )
    expect(html).toMatchSnapshot()
    // Member sees full confidence, all comps, all era paragraphs, all watch-outs
    expect(html).toContain('76%')
    expect(html).toContain('1973 Paris Motor Show')
    expect(html).toContain('widow-maker')
    expect(html).toContain('Fuchs alloys')
    expect(html).not.toContain('available with a free account')
    expect(html).not.toContain('Create a free account')
  })

  it('scenario C: member viewer, 930 Turbo, no verified editorial row', () => {
    const html = renderToString(
      <div>
        <AnalyzeHeader
          listing={TURBO_930_LISTING}
          analysisData={ANALYSIS_DATA_930}
          viewerTier="member"
        />
        <VerdictBlock analysisData={ANALYSIS_DATA_930} viewerTier="member" />
        <MetricTiles listing={TURBO_930_LISTING} analysisData={ANALYSIS_DATA_930} viewerTier="member" />
        <div>
          <ChassisIdentityCard listing={TURBO_930_LISTING} generation={GENERATION_930} />
          <ComparableSalesCard analysisData={ANALYSIS_DATA_930} viewerTier="member" />
        </div>
        <div>
          <EraCard
            generation={GENERATION_930}
            editorial={null}
            viewerTier="member"
          />
          <WatchOutsCard editorial={null} viewerTier="member" />
          <ColorRarityCard
            listing={TURBO_930_LISTING}
            colorData={COLOR_GUARDS_RED}
            viewerTier="member"
          />
        </div>
      </div>,
    )
    expect(html).toMatchSnapshot()
    // No editorial row → development fallback message, no watch-outs
    expect(html).toContain('Era guide for this generation is in development')
    // Still shows chassis and analysis
    expect(html).toContain('WP0EB0918JS857501')
    expect(html).toContain('76%')
  })
})
