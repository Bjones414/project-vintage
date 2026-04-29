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
  GENERATION_993_PUBLISHED,
  EDITORIAL_982_CAYMAN_VERIFIED,
  EDITORIAL_930_VERIFIED,
  COLOR_SHARK_BLUE,
  COLOR_GUARDS_RED,
  ANALYSIS_DATA_GT4_RS,
  ANALYSIS_DATA_930,
} from './fixtures'

import { AnalyzeHeader } from '@/components/analyze/AnalyzeHeader'
import { LiveStatusPill } from '@/components/analyze/LiveStatusPill'
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
  it('renders GT4 RS headline (year + model + trim, no make), subtitle, and sold badge', () => {
    const html = renderToString(
      <AnalyzeHeader
        listing={GT4_RS_LISTING}
        analysisData={ANALYSIS_DATA_GT4_RS}
        viewerTier="anonymous"
      />,
    )
    expect(html).toMatchSnapshot()
    // Headline: year + model + trim, no hardcoded make
    expect(t(html)).toContain('2024 718 Cayman GT4 RS')
    expect(t(html)).not.toContain('Porsche')
    // Subtitle: color over interior, transmission, generation, mileage
    expect(t(html)).toContain('Shark Blue over Black')
    expect(t(html)).toContain('PDK')
    expect(t(html)).toContain('847 miles')
    // Status badge for non-live listing
    expect(t(html)).toContain('Sold')
    // Comps count
    expect(t(html)).toContain('12 comparable sales')
  })

  it('renders 930 Turbo headline and subtitle correctly', () => {
    const html = renderToString(
      <AnalyzeHeader
        listing={TURBO_930_LISTING}
        analysisData={null}
        viewerTier="anonymous"
      />,
    )
    expect(html).toMatchSnapshot()
    expect(t(html)).toContain('1988 911 Turbo')
    expect(t(html)).toContain('Guards Red over Black')
    expect(t(html)).toContain('Manual')
    expect(t(html)).toContain('930')
    expect(t(html)).toContain('45,200 miles')
    expect(html).toContain('2024') // auction_ends_at date rendered in SSR static form
  })

  it('omits auction count line when analysisData is null', () => {
    const html = renderToString(
      <AnalyzeHeader listing={GT4_RS_LISTING} analysisData={null} viewerTier="anonymous" />,
    )
    expect(html).not.toContain('comparable sale')
  })

  it('drops missing subtitle segments without leaving stray separators', () => {
    const listingNoInterior = {
      ...GT4_RS_LISTING,
      interior_color: null,
      generation: null,
    }
    const html = renderToString(
      <AnalyzeHeader listing={listingNoInterior} analysisData={null} viewerTier="anonymous" />,
    )
    // Subtitle renders exterior only (no "over null"), transmission, mileage
    expect(t(html)).toContain('Shark Blue')
    expect(t(html)).not.toContain('over null')
    expect(t(html)).not.toContain(' · · ')
  })

  it('renders live pill instead of badge when listing is live', () => {
    const liveListing = {
      ...GT4_RS_LISTING,
      listing_status: 'live',
      auction_ends_at: '2026-04-29T20:00:00.000Z',
    }
    const now = new Date('2026-04-29T12:00:00Z')
    const html = renderToString(
      <AnalyzeHeader listing={liveListing} analysisData={null} viewerTier="anonymous" now={now} />,
    )
    expect(html).toContain('LIVE')
    expect(html).toContain('ENDS TODAY')
    expect(html).not.toContain('Ended')
    expect(html).not.toContain('Sold')
  })
})

// ---------------------------------------------------------------------------
// LiveStatusPill
// ---------------------------------------------------------------------------
describe('LiveStatusPill', () => {
  const NOW = new Date('2026-04-29T12:00:00Z')

  const liveListing = {
    ...GT4_RS_LISTING,
    listing_status: 'live',
    auction_ends_at: '2026-04-29T20:00:00.000Z', // same day as NOW
  }

  it('renders when listing_status is live', () => {
    const html = renderToString(<LiveStatusPill listing={liveListing} now={NOW} />)
    expect(html).not.toBe('')
    expect(html).toContain('LIVE')
    expect(html).toContain('ENDS')
  })

  it('does not render when listing has ended (sold)', () => {
    const html = renderToString(<LiveStatusPill listing={GT4_RS_LISTING} now={NOW} />)
    expect(html).toBe('')
  })

  it('ENDS TODAY branch when auction ends same day', () => {
    const html = renderToString(<LiveStatusPill listing={liveListing} now={NOW} />)
    expect(html).toContain('ENDS TODAY')
  })

  it('ENDS [WEEKDAY] branch when auction ends within 7 days', () => {
    const listing = { ...liveListing, auction_ends_at: '2026-05-02T18:00:00.000Z' }
    const html = renderToString(<LiveStatusPill listing={listing} now={NOW} />)
    expect(html).toMatch(/ENDS (MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)/)
  })

  it('ENDS [MON DD] branch when auction ends beyond 7 days', () => {
    const listing = { ...liveListing, auction_ends_at: '2026-05-15T18:00:00.000Z' }
    const html = renderToString(<LiveStatusPill listing={listing} now={NOW} />)
    expect(html).toMatch(/ENDS [A-Z]{3} \d+/)
    expect(html).not.toContain('TODAY')
  })

  it('pulsing dot carries motion-reduce class to disable animation', () => {
    const html = renderToString(<LiveStatusPill listing={liveListing} now={NOW} />)
    expect(html).toContain('motion-reduce:animate-none')
  })

  it('pulsing dot also carries animate-pulse for motion-capable viewers', () => {
    const html = renderToString(<LiveStatusPill listing={liveListing} now={NOW} />)
    expect(html).toContain('animate-pulse')
  })
})

// ---------------------------------------------------------------------------
// VerdictBlock
// ---------------------------------------------------------------------------
describe('VerdictBlock', () => {
  it('free/pro — returns null when analysisData has no lede', () => {
    expect(renderToString(
      <VerdictBlock analysisData={null} viewerTier="free" listingId="test-id" />,
    )).toBe('')
    expect(renderToString(
      <VerdictBlock analysisData={null} viewerTier="pro" listingId="test-id" />,
    )).toBe('')
  })

  it('anonymous — renders signup CTA regardless of analysisData', () => {
    const html = renderToString(
      <VerdictBlock analysisData={null} viewerTier="anonymous" listingId="fixture-gt4rs-001" />,
    )
    expect(html).not.toBe('')
    expect(html).toContain('Sign in to see the verdict on this car.')
    expect(html).toContain("Unlock")
    expect(html).toContain('/signup?next=/analyze/fixture-gt4rs-001')
  })

  it('anonymous — CTA link includes correct listingId in next param', () => {
    const html = renderToString(
      <VerdictBlock analysisData={ANALYSIS_DATA_GT4_RS} viewerTier="anonymous" listingId="fixture-gt4rs-001" />,
    )
    expect(html).toMatchSnapshot()
    expect(html).toContain('/signup?next=/analyze/fixture-gt4rs-001')
    // anonymous never shows the verdict lede
    expect(html).not.toContain('supported by 12 comparable sales')
    // never shows confidence score
    expect(html).not.toContain('84%')
  })

  it('free — shows verdict lede and secondary line, no confidence score', () => {
    const html = renderToString(
      <VerdictBlock analysisData={ANALYSIS_DATA_GT4_RS} viewerTier="free" listingId="fixture-gt4rs-001" />,
    )
    expect(html).toMatchSnapshot()
    expect(html).toContain('supported by 12 comparable sales')
    expect(html).toContain('Reserve met')
    // confidence_label (text) shown, confidence_score (number) not shown
    expect(html).toContain('high')
    expect(html).not.toContain('84%')
    expect(html).not.toContain('Sign in to see the verdict')
  })

  it('pro — same as free for now: shows verdict, no confidence score', () => {
    const html = renderToString(
      <VerdictBlock analysisData={ANALYSIS_DATA_GT4_RS} viewerTier="pro" listingId="fixture-gt4rs-001" />,
    )
    expect(html).toContain('supported by 12 comparable sales')
    expect(html).not.toContain('84%')
  })
})

// ---------------------------------------------------------------------------
// MetricTiles
// ---------------------------------------------------------------------------
describe('MetricTiles', () => {
  it('anonymous — all tiles show real values; comps tile has sign-in hint', () => {
    const html = renderToString(
      <MetricTiles
        listing={GT4_RS_LISTING}
        analysisData={ANALYSIS_DATA_GT4_RS}
        viewerTier="anonymous"
      />,
    )
    expect(html).toMatchSnapshot()
    // Comps count is visible — no locking
    expect(html).toContain('12')
    expect(html).toContain('Sign in to see full comparison')
    // Banned strings
    expect(html).not.toContain('Free account')
    expect(html).not.toContain('Locked')
    expect(html).not.toContain('locked')
  })

  it('free — all tiles show real values, no hint', () => {
    const html = renderToString(
      <MetricTiles
        listing={GT4_RS_LISTING}
        analysisData={ANALYSIS_DATA_GT4_RS}
        viewerTier="free"
      />,
    )
    expect(html).toContain('12')
    expect(html).not.toContain('Free account')
    expect(html).not.toContain('Sign in to see full comparison')
    expect(html).not.toContain('Locked')
  })

  it('pro — all tiles show real values, no hint', () => {
    const html = renderToString(
      <MetricTiles
        listing={GT4_RS_LISTING}
        analysisData={ANALYSIS_DATA_GT4_RS}
        viewerTier="pro"
      />,
    )
    expect(html).toContain('12')
    expect(html).not.toContain('Sign in to see full comparison')
    expect(html).not.toContain('Locked')
  })

  it('shows sale price for sold listing', () => {
    const html = renderToString(
      <MetricTiles
        listing={GT4_RS_LISTING}
        analysisData={null}
        viewerTier="free"
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

  it('free — shows all comps, no upsell', () => {
    const html = renderToString(
      <ComparableSalesCard analysisData={ANALYSIS_DATA_GT4_RS} viewerTier="free" />,
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
  it('null generation — renders development message', () => {
    const html = renderToString(
      <EraCard generation={null} viewerTier="anonymous" />,
    )
    expect(html).toMatchSnapshot()
    expect(t(html)).toContain('Era guide for this generation is in development')
  })

  it('draft generation (content_status null) — renders development message', () => {
    const html = renderToString(
      <EraCard generation={GENERATION_930} viewerTier="anonymous" />,
    )
    expect(t(html)).toContain('Era guide for this generation is in development')
  })

  it('anonymous + published generation — renders only first paragraph', () => {
    const html = renderToString(
      <EraCard generation={GENERATION_993_PUBLISHED} viewerTier="anonymous" />,
    )
    expect(html).toMatchSnapshot()
    expect(html).toContain('993 era')
    expect(html).toContain('last air-cooled 911')
    expect(html).not.toContain('Production ended')
    expect(html).toContain('Full era guide available with a free account')
  })

  it('free + published generation — renders all paragraphs', () => {
    const html = renderToString(
      <EraCard generation={GENERATION_993_PUBLISHED} viewerTier="free" />,
    )
    expect(t(html)).toContain('last air-cooled 911')
    expect(t(html)).toContain('Production ended')
    expect(t(html)).toContain('Carrera RS 3.8')
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

  it('free — shows all watch-outs', () => {
    const html = renderToString(
      <WatchOutsCard editorial={EDITORIAL_930_VERIFIED} viewerTier="free" />,
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

  it('anonymous — shows color name + two-state rarity label, hides detail stats', () => {
    const html = renderToString(
      <ColorRarityCard listing={GT4_RS_LISTING} colorData={COLOR_SHARK_BLUE} viewerTier="anonymous" />,
    )
    expect(html).toMatchSnapshot()
    expect(html).toContain('Shark Blue')
    expect(html).toContain('Rare or special-order')
    expect(html).not.toContain('Special Order / Paint to Sample')
    expect(html).toContain('Color history and context available')
  })

  it('free — rare/special-order: label shows "Rare or special-order", detail stats visible', () => {
    const html = renderToString(
      <ColorRarityCard listing={GT4_RS_LISTING} colorData={COLOR_SHARK_BLUE} viewerTier="free" />,
    )
    expect(html).toMatchSnapshot()
    expect(html).toContain('Rare or special-order')
    expect(html).toContain('Metallic')
    expect(html).not.toContain('Special Order / Paint to Sample')
    expect(html).not.toContain('available with a free account')
  })

  it('common color — shows "Common" label without special-order treatment', () => {
    const html = renderToString(
      <ColorRarityCard listing={TURBO_930_LISTING} colorData={COLOR_GUARDS_RED} viewerTier="free" />,
    )
    expect(html).toContain('Guards Red')
    expect(html).toContain('Common')
    expect(html).not.toContain('Rare or special-order')
    expect(html).not.toContain('Special Order / Paint to Sample')
  })

  it('uncommon rarity → "Rare or special-order" label', () => {
    const colorUncommon = { ...COLOR_GUARDS_RED, rarity: 'uncommon', is_special_order: false }
    const html = renderToString(
      <ColorRarityCard listing={GT4_RS_LISTING} colorData={colorUncommon} viewerTier="free" />,
    )
    expect(html).toContain('Rare or special-order')
    expect(html).not.toContain('Uncommon')
  })

  it('very_rare rarity → "Rare or special-order" label', () => {
    const colorVeryRare = { ...COLOR_GUARDS_RED, rarity: 'very_rare', is_special_order: false }
    const html = renderToString(
      <ColorRarityCard listing={GT4_RS_LISTING} colorData={colorVeryRare} viewerTier="free" />,
    )
    expect(html).toContain('Rare or special-order')
    expect(html).not.toContain('Very Rare')
  })

  it('common rarity + is_special_order → "Rare or special-order" label', () => {
    const colorSpecialCommon = { ...COLOR_GUARDS_RED, rarity: 'common', is_special_order: true }
    const html = renderToString(
      <ColorRarityCard listing={GT4_RS_LISTING} colorData={colorSpecialCommon} viewerTier="free" />,
    )
    expect(html).toContain('Rare or special-order')
    expect(html).not.toContain('>Common<')
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
        <VerdictBlock analysisData={null} viewerTier="anonymous" listingId={GT4_RS_LISTING.id} />
        <MetricTiles listing={GT4_RS_LISTING} analysisData={null} viewerTier="anonymous" />
        <div>
          <ChassisIdentityCard listing={GT4_RS_LISTING} generation={GENERATION_982_CAYMAN} />
          <ComparableSalesCard analysisData={null} viewerTier="anonymous" />
        </div>
        <div>
          <EraCard
            generation={GENERATION_982_CAYMAN}
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
    // Anonymous sees: chassis, status badge, color name, CTA, verdict signup prompt
    expect(html).toContain('WP0AC2A84RS270001')
    expect(html).toContain('Sold')
    expect(html).toContain('Shark Blue')
    expect(html).toContain('Create a free account')
    expect(html).toContain('Sign in to see the verdict on this car.')
    // Does NOT see: confidence score number
    expect(html).not.toContain('84%')
    // "Locked" is banned in user-facing copy
    expect(html).not.toContain('Locked')
    // The old MetricTiles lock pattern ("Free account" as a value replacement) is gone
    expect(html).not.toContain('text-gray-400">Free account')
  })

  it('scenario B: free viewer, 930 Turbo, verified editorial', () => {
    const html = renderToString(
      <div>
        <AnalyzeHeader
          listing={TURBO_930_LISTING}
          analysisData={ANALYSIS_DATA_930}
          viewerTier="free"
        />
        <VerdictBlock analysisData={ANALYSIS_DATA_930} viewerTier="free" listingId={TURBO_930_LISTING.id} />
        <MetricTiles listing={TURBO_930_LISTING} analysisData={ANALYSIS_DATA_930} viewerTier="free" />
        <div>
          <ChassisIdentityCard listing={TURBO_930_LISTING} generation={GENERATION_930} />
          <ComparableSalesCard analysisData={ANALYSIS_DATA_930} viewerTier="free" />
        </div>
        <div>
          <EraCard
            generation={GENERATION_930}
            viewerTier="free"
          />
          <WatchOutsCard editorial={EDITORIAL_930_VERIFIED} viewerTier="free" />
          <ColorRarityCard
            listing={TURBO_930_LISTING}
            colorData={COLOR_GUARDS_RED}
            viewerTier="free"
          />
        </div>
      </div>,
    )
    expect(html).toMatchSnapshot()
    // Free tier sees verdict (no score), all comps, all watch-outs; EraCard shows "in development" (no published notes)
    expect(t(html)).toContain('45,200 miles sold within')
    expect(html).toContain('Era guide for this generation is in development')
    expect(html).toContain('widow-maker')
    expect(html).toContain('Fuchs alloys')
    expect(html).not.toContain('76%')
    expect(html).not.toContain('Create a free account')
    expect(html).not.toContain('Locked')
  })

  it('scenario C: free viewer, 930 Turbo, no verified editorial row', () => {
    const html = renderToString(
      <div>
        <AnalyzeHeader
          listing={TURBO_930_LISTING}
          analysisData={ANALYSIS_DATA_930}
          viewerTier="free"
        />
        <VerdictBlock analysisData={ANALYSIS_DATA_930} viewerTier="free" listingId={TURBO_930_LISTING.id} />
        <MetricTiles listing={TURBO_930_LISTING} analysisData={ANALYSIS_DATA_930} viewerTier="free" />
        <div>
          <ChassisIdentityCard listing={TURBO_930_LISTING} generation={GENERATION_930} />
          <ComparableSalesCard analysisData={ANALYSIS_DATA_930} viewerTier="free" />
        </div>
        <div>
          <EraCard
            generation={GENERATION_930}
            viewerTier="free"
          />
          <WatchOutsCard editorial={null} viewerTier="free" />
          <ColorRarityCard
            listing={TURBO_930_LISTING}
            colorData={COLOR_GUARDS_RED}
            viewerTier="free"
          />
        </div>
      </div>,
    )
    expect(html).toMatchSnapshot()
    // No editorial row → development fallback message, no watch-outs
    expect(html).toContain('Era guide for this generation is in development')
    // Still shows chassis and verdict
    expect(html).toContain('WP0EB0918JS857501')
    expect(t(html)).toContain('45,200 miles sold within')
    expect(html).not.toContain('76%')
  })
})
