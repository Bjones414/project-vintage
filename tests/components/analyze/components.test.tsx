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
  ANALYSIS_ROW_EMPTY,
  ANALYSIS_ROW_3_FINDINGS,
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
import { TeaserBlock } from '@/components/analyze/TeaserBlock'
import { AnonymousSignupCTA } from '@/components/analyze/AnonymousSignupCTA'
import { parseAnalysisData } from '@/components/analyze/types'

// ---------------------------------------------------------------------------
// AnalyzeHeader
// ---------------------------------------------------------------------------
describe('AnalyzeHeader', () => {
  it('renders GT4 RS headline (year + make + model + trim), subtitle, and sold badge', () => {
    const html = renderToString(
      <AnalyzeHeader
        listing={GT4_RS_LISTING}
        analysisData={ANALYSIS_DATA_GT4_RS}
        viewerTier="anonymous"
      />,
    )
    expect(html).toMatchSnapshot()
    // Headline: year + make + model + trim
    expect(t(html)).toContain('2024 Porsche 718 Cayman GT4 RS')
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
    expect(t(html)).toContain('1988 Porsche 911 Turbo')
    expect(t(html)).toContain('Guards Red over Black')
    expect(t(html)).toContain('Manual')
    expect(t(html)).toContain('930')
    expect(t(html)).toContain('45,200 miles')
    // AuctionCountdown not rendered for non-live listings — no "Auction ended" text in upper right
    expect(html).not.toContain('Auction ended')
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
  it('free/pro — renders "in development" state when analysisData has no lede', () => {
    const htmlFree = renderToString(
      <VerdictBlock analysisData={null} viewerTier="free" listingId="test-id" />,
    )
    const htmlPro = renderToString(
      <VerdictBlock analysisData={null} viewerTier="pro" listingId="test-id" />,
    )
    // Shows section label and in-development headline — not empty
    expect(t(htmlFree)).toContain('The verdict')
    expect(t(htmlFree)).toContain('Verdict in development.')
    expect(t(htmlFree)).toContain('Comp engine launching with full report.')
    // No CTA button — user is already signed in
    expect(htmlFree).not.toContain('Unlock')
    expect(htmlFree).not.toContain('/signup')
    // Same for pro
    expect(t(htmlPro)).toContain('Verdict in development.')
    expect(htmlPro).not.toContain('Unlock')
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
  it('anonymous — Fair Value and Comps show "Sign in to see"; bid and reserve show real values', () => {
    const html = renderToString(
      <MetricTiles
        listing={GT4_RS_LISTING}
        analysisData={ANALYSIS_DATA_GT4_RS}
        viewerTier="anonymous"
      />,
    )
    expect(html).toMatchSnapshot()
    // Fair Value and Comps locked for anonymous
    expect(t(html)).toContain('Sign in to see')
    // Comps count not visible for anonymous
    expect(html).not.toContain('>12<')
    // Bid and reserve show real values
    expect(t(html)).toContain('$220,000')
    expect(t(html)).toContain('Reserve Met')
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
    expect(html).toContain('Reserve Met')
  })
})

// ---------------------------------------------------------------------------
// ChassisIdentityCard
// ---------------------------------------------------------------------------
describe('ChassisIdentityCard', () => {
  it('renders all identity fields for GT4 RS including Exterior Color rarity indicator', () => {
    const html = renderToString(
      <ChassisIdentityCard
        listing={GT4_RS_LISTING}
        generation={GENERATION_982_CAYMAN}
        colorData={COLOR_SHARK_BLUE}
      />,
    )
    expect(html).toMatchSnapshot()
    // VIN is NOT displayed — it is not persisted to the DB per compliance policy
    expect(html).not.toContain('WP0AC2A84RS270001')
    expect(html).not.toContain('VIN')
    expect(html).toContain('Zuffenhausen')
    expect(html).toContain('4.0L H-6')
    expect(html).toContain('Coupe')
    // Exterior Color with embedded rarity indicator
    expect(t(html)).toContain('Exterior Color')
    expect(t(html)).toContain('Shark Blue')
    // COLOR_SHARK_BLUE has is_special_order: true → Paint to Sample tier, gold dot
    expect(t(html)).toContain('Paint to Sample')
    expect(html).toContain('bg-amber-400')
    // Rarity is now embedded in Exterior Color field, not a separate field
    expect(html).not.toContain('Color Rarity')
  })

  it('renders 930 Turbo identity with common color rarity', () => {
    const html = renderToString(
      <ChassisIdentityCard
        listing={TURBO_930_LISTING}
        generation={GENERATION_930}
        colorData={COLOR_GUARDS_RED}
      />,
    )
    // VIN is NOT displayed — it is not persisted to the DB per compliance policy
    expect(html).not.toContain('WP0EB0918JS857501')
    expect(html).toContain('930')
    expect(html).toContain('3.3L H-6 Turbo')
    // COLOR_GUARDS_RED has rarity: 'common', is_special_order: false → Common tier, gray dot
    expect(t(html)).toContain('Common')
    expect(html).toContain('bg-gray-400')
  })

  it('gracefully handles no generation data and no color data', () => {
    const html = renderToString(
      <ChassisIdentityCard listing={GT4_RS_LISTING} generation={null} colorData={null} />,
    )
    expect(html).toContain('Chassis Identity')
    // VIN is NOT displayed — it is not persisted to the DB per compliance policy
    expect(html).not.toContain('WP0AC2A84RS270001')
    // Rarity indicator always renders; with no colorData it defaults to Common
    expect(t(html)).toContain('Common')
    expect(html).not.toContain('Color Rarity')
  })

  it('formats mileage with thousands separator and "mi" suffix', () => {
    // GT4 RS: mileage = 847 (no thousands separator needed)
    const html847 = renderToString(
      <ChassisIdentityCard listing={GT4_RS_LISTING} generation={null} colorData={null} />,
    )
    expect(t(html847)).toContain('847 mi')

    // 930 Turbo: mileage = 45200 → "45,200 mi"
    const html45k = renderToString(
      <ChassisIdentityCard listing={TURBO_930_LISTING} generation={null} colorData={null} />,
    )
    expect(t(html45k)).toContain('45,200 mi')
  })

  it('renders em dash when mileage is null', () => {
    const nullMileageListing = { ...GT4_RS_LISTING, mileage: null }
    const html = renderToString(
      <ChassisIdentityCard listing={nullMileageListing} generation={null} colorData={null} />,
    )
    expect(t(html)).toContain('Mileage')
    expect(t(html)).toContain('—')
    // No "123 mi" formatted value — only the em dash should appear
    expect(html).not.toMatch(/[\d,]+ mi/)
  })

  it('Trim appears before Model Year, Mileage appears after Model Year in render order', () => {
    const html = renderToString(
      <ChassisIdentityCard listing={GT4_RS_LISTING} generation={GENERATION_982_CAYMAN} colorData={null} />,
    )
    const trimIdx = html.indexOf('>Trim<')
    const yearIdx = html.indexOf('Model Year')
    const mileageIdx = html.indexOf('Mileage')
    expect(trimIdx).toBeGreaterThan(-1)
    expect(yearIdx).toBeGreaterThan(trimIdx)
    expect(mileageIdx).toBeGreaterThan(yearIdx)
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
    expect(html).toContain('Comparable sales engine in development')
    expect(html).toContain('see the auction page directly')
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

  it('anonymous + published generation — renders only first paragraph and metadata grid', () => {
    const html = renderToString(
      <EraCard generation={GENERATION_993_PUBLISHED} viewerTier="anonymous" />,
    )
    expect(html).toMatchSnapshot()
    expect(html).toContain('993 era')
    expect(html).toContain('last air-cooled 911')
    expect(html).not.toContain('Production ended')
    expect(html).toContain('Full era guide available with a free account')
    // Metadata grid — all 6 fields present for 993
    expect(t(html)).toContain('1995–1998')
    expect(t(html)).toContain('Coupe, Cabriolet, Targa')
    expect(t(html)).toContain('M64 air-cooled flat-six, 3.6L')
    expect(t(html)).toContain('~67,000 worldwide')
    expect(t(html)).toContain('Air-cooled')
    // Labels
    expect(t(html)).toContain('Production')
    expect(t(html)).toContain('Body styles')
    expect(t(html)).toContain('Engine')
    expect(t(html)).toContain('Units produced')
    expect(t(html)).toContain('Cooling')
  })

  it('free + published generation — renders all paragraphs and metadata grid', () => {
    const html = renderToString(
      <EraCard generation={GENERATION_993_PUBLISHED} viewerTier="free" />,
    )
    expect(t(html)).toContain('last air-cooled 911')
    expect(t(html)).toContain('Production ended')
    expect(t(html)).toContain('Carrera RS 3.8')
    expect(t(html)).not.toContain('available with a free account')
    // Metadata still visible for free tier
    expect(t(html)).toContain('1995–1998')
    expect(t(html)).toContain('~67,000 worldwide')
  })

  it('published generation with null metadata fields — omits those rows', () => {
    const partialGen = {
      ...GENERATION_993_PUBLISHED,
      production_years: null,
      engine_family: null,
      msrp_launch_usd: null,
      units_produced: null,
    }
    const html = renderToString(
      <EraCard generation={partialGen} viewerTier="free" />,
    )
    // Notes still render
    expect(t(html)).toContain('last air-cooled 911')
    // Body styles and cooling still appear (derived from existing columns)
    expect(t(html)).toContain('Coupe, Cabriolet, Targa')
    expect(t(html)).toContain('Air-cooled')
    // Nulled fields are gone — no label without a value
    expect(html).not.toContain('~67,000')
    expect(html).not.toContain('M64')
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
// TeaserBlock
// ---------------------------------------------------------------------------
describe('TeaserBlock', () => {
  const LISTING_ID = 'fixture-gt4rs-001'

  it('headline: "Continue with the full analysis." when finding_count is 0', () => {
    const html = renderToString(
      <TeaserBlock analysisRow={ANALYSIS_ROW_EMPTY} listingId={LISTING_ID} viewerTier="free" />,
    )
    expect(t(html)).toContain('Continue with the full analysis.')
  })

  it('headline: "Continue with the full analysis." when analysisRow is null', () => {
    const html = renderToString(
      <TeaserBlock analysisRow={null} listingId={LISTING_ID} viewerTier="free" />,
    )
    expect(t(html)).toContain('Continue with the full analysis.')
  })

  it('headline: singular "1 thing" for finding_count=1', () => {
    const row = { ...ANALYSIS_ROW_3_FINDINGS, finding_count: 1 }
    const html = renderToString(
      <TeaserBlock analysisRow={row} listingId={LISTING_ID} viewerTier="free" />,
    )
    // Count is wrapped in a span for gold emphasis — check parts separately
    expect(t(html)).toContain('We found')
    expect(t(html)).toContain('1 thing')
    expect(t(html)).toContain('you should ask the seller about this car')
    expect(t(html)).not.toContain('things')
  })

  it('headline: plural "5 things" for finding_count=5', () => {
    const row = { ...ANALYSIS_ROW_3_FINDINGS, finding_count: 5 }
    const html = renderToString(
      <TeaserBlock analysisRow={row} listingId={LISTING_ID} viewerTier="free" />,
    )
    expect(t(html)).toContain('We found')
    expect(t(html)).toContain('5 things')
    expect(t(html)).toContain('you should ask the seller about this car')
  })

  it('tiles: renders 3 tiles when 3 findings present', () => {
    const html = renderToString(
      <TeaserBlock analysisRow={ANALYSIS_ROW_3_FINDINGS} listingId={LISTING_ID} viewerTier="free" />,
    )
    expect(html).toContain('Mileage is above average for year and trim')
    expect(html).toContain('Manual transmission — period correct')
    expect(html).toContain('Three prior owners — verify full history')
  })

  it('tiles: renders 1 tile when 1 finding present', () => {
    const singleFinding = [{
      rule_id: 'mileage_above_median',
      category: 'worth_asking',
      severity: 'caution',
      title: 'Mileage is above average for year and trim',
      body: 'At 45,200 miles, this example sits above the median.',
      qualifier: null,
    }]
    const row = { ...ANALYSIS_ROW_3_FINDINGS, findings: singleFinding, finding_count: 1 }
    const html = renderToString(
      <TeaserBlock analysisRow={row} listingId={LISTING_ID} viewerTier="free" />,
    )
    expect(html).toContain('Mileage is above average for year and trim')
    expect(html).not.toContain('Manual transmission')
    expect(html).not.toContain('Three prior owners')
  })

  it('tiles: renders 0 tiles when no findings', () => {
    const html = renderToString(
      <TeaserBlock analysisRow={ANALYSIS_ROW_EMPTY} listingId={LISTING_ID} viewerTier="free" />,
    )
    expect(html).not.toContain('Mileage is above average')
    expect(html).not.toContain('Manual transmission')
  })

  it('tiles: blur class applied to body text, not to title', () => {
    const html = renderToString(
      <TeaserBlock analysisRow={ANALYSIS_ROW_3_FINDINGS} listingId={LISTING_ID} viewerTier="free" />,
    )
    expect(html).toContain('blur-[2.5px]')
    expect(html).toContain('select-none')
    // Title itself appears without blur class (blur is on the body paragraph)
    expect(html).toContain('Mileage is above average for year and trim')
  })

  it('"Also in the full report" strip renders regardless of finding count', () => {
    const htmlEmpty = renderToString(
      <TeaserBlock analysisRow={ANALYSIS_ROW_EMPTY} listingId={LISTING_ID} viewerTier="free" />,
    )
    const htmlWithFindings = renderToString(
      <TeaserBlock analysisRow={ANALYSIS_ROW_3_FINDINGS} listingId={LISTING_ID} viewerTier="free" />,
    )
    expect(htmlEmpty).toContain('Generation deep-dive')
    expect(htmlEmpty).toContain('Comp set with recency weighting')
    expect(htmlWithFindings).toContain('Generation deep-dive')
  })

  it('CTA: anonymous links to /signup with ?next= param', () => {
    const html = renderToString(
      <TeaserBlock analysisRow={ANALYSIS_ROW_EMPTY} listingId={LISTING_ID} viewerTier="anonymous" />,
    )
    expect(html).toContain(`/signup?next=/analyze/${LISTING_ID}/full`)
    expect(t(html)).toContain('Sign in for the full analysis')
  })

  it('CTA: free links to /analyze/[id]/full', () => {
    const html = renderToString(
      <TeaserBlock analysisRow={ANALYSIS_ROW_EMPTY} listingId={LISTING_ID} viewerTier="free" />,
    )
    expect(html).toContain(`/analyze/${LISTING_ID}/full`)
    expect(t(html)).toContain('Read the full analysis')
  })

  it('CTA: pro links to /analyze/[id]/full', () => {
    const html = renderToString(
      <TeaserBlock analysisRow={ANALYSIS_ROW_EMPTY} listingId={LISTING_ID} viewerTier="pro" />,
    )
    expect(html).toContain(`/analyze/${LISTING_ID}/full`)
    expect(t(html)).toContain('Read the full analysis')
  })

  it('"Locked" never appears in rendered output', () => {
    const html = renderToString(
      <TeaserBlock analysisRow={ANALYSIS_ROW_3_FINDINGS} listingId={LISTING_ID} viewerTier="anonymous" />,
    )
    expect(html).not.toContain('Locked')
    expect(html).not.toContain('locked')
  })

  it('affordance: "Sign in to read" appears on finding tiles', () => {
    const html = renderToString(
      <TeaserBlock analysisRow={ANALYSIS_ROW_3_FINDINGS} listingId={LISTING_ID} viewerTier="free" />,
    )
    expect(html).toContain('Sign in to read')
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
    const benefitCount = (html.match(/text-severity-positive/g) ?? []).length
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
          <ChassisIdentityCard
            listing={GT4_RS_LISTING}
            generation={GENERATION_982_CAYMAN}
            colorData={COLOR_SHARK_BLUE}
          />
          <ComparableSalesCard analysisData={null} viewerTier="anonymous" />
        </div>
        <div>
          <EraCard generation={GENERATION_982_CAYMAN} viewerTier="anonymous" />
          <WatchOutsCard editorial={null} viewerTier="anonymous" />
        </div>
        <AnonymousSignupCTA />
      </div>,
    )
    expect(html).toMatchSnapshot()
    // Anonymous sees: chassis, status badge, color name, CTA, verdict signup prompt
    // VIN is never displayed (NEVER_PERSIST_FIELDS compliance — VIN not stored in DB)
    expect(html).not.toContain('WP0AC2A84RS270001')
    expect(html).toContain('Sold')
    expect(html).toContain('Shark Blue')
    expect(html).toContain('Paint to Sample')
    expect(html).toContain('Create a free account')
    expect(html).toContain('Sign in to see the verdict on this car.')
    // No standalone ColorRarityCard on the page
    expect(html).not.toContain('Color history and context available')
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
          <ChassisIdentityCard
            listing={TURBO_930_LISTING}
            generation={GENERATION_930}
            colorData={COLOR_GUARDS_RED}
          />
          <ComparableSalesCard analysisData={ANALYSIS_DATA_930} viewerTier="free" />
        </div>
        <div>
          <EraCard generation={GENERATION_930} viewerTier="free" />
          <WatchOutsCard editorial={EDITORIAL_930_VERIFIED} viewerTier="free" />
        </div>
      </div>,
    )
    expect(html).toMatchSnapshot()
    // Free tier sees verdict, all comps, all watch-outs; EraCard "in development" (no published notes)
    expect(t(html)).toContain('45,200 miles sold within')
    expect(html).toContain('Era guide for this generation is in development')
    expect(html).toContain('widow-maker')
    expect(html).toContain('Fuchs alloys')
    // Common rarity tier in ChassisIdentity
    expect(t(html)).toContain('Common')
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
          <ChassisIdentityCard
            listing={TURBO_930_LISTING}
            generation={GENERATION_930}
            colorData={COLOR_GUARDS_RED}
          />
          <ComparableSalesCard analysisData={ANALYSIS_DATA_930} viewerTier="free" />
        </div>
        <div>
          <EraCard generation={GENERATION_930} viewerTier="free" />
          <WatchOutsCard editorial={null} viewerTier="free" />
        </div>
      </div>,
    )
    expect(html).toMatchSnapshot()
    // No editorial row → development fallback, no watch-outs
    expect(html).toContain('Era guide for this generation is in development')
    // Chassis and verdict still present (VIN not displayed per NEVER_PERSIST_FIELDS compliance)
    expect(html).not.toContain('WP0EB0918JS857501')
    expect(t(html)).toContain('45,200 miles sold within')
    expect(html).not.toContain('76%')
  })
})

// ---------------------------------------------------------------------------
// Comp engine UI — VerdictBlock with comp data
// ---------------------------------------------------------------------------

const COMP_RESULT_STRICT = {
  id: 'cr-strict-001',
  listing_id: 'fixture-gt4rs-001',
  tier: 'strict' as const,
  comp_count: 8,
  fair_value_low_cents: 180_000_00,
  fair_value_median_cents: 200_000_00,
  fair_value_high_cents: 220_000_00,
  most_recent_comp_sold_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // ~2mo ago
  oldest_comp_sold_at: new Date(Date.now() - 18 * 30.4375 * 24 * 60 * 60 * 1000).toISOString(),
  comp_listing_ids: ['id1', 'id2', 'id3', 'id4', 'id5', 'id6', 'id7', 'id8'],
  computed_at: new Date().toISOString(),
}

const COMP_RESULT_WIDE = {
  ...COMP_RESULT_STRICT,
  tier: 'wide' as const,
  comp_count: 4,
}

const COMP_RESULT_INSUFFICIENT = {
  id: 'cr-insuf-001',
  listing_id: 'fixture-930-001',
  tier: 'insufficient' as const,
  comp_count: 1,
  fair_value_low_cents: null,
  fair_value_median_cents: null,
  fair_value_high_cents: null,
  most_recent_comp_sold_at: null,
  oldest_comp_sold_at: null,
  comp_listing_ids: [],
  computed_at: new Date().toISOString(),
}

const COMP_LISTINGS = [
  {
    id: 'comp-1',
    year: 2023,
    make: 'Porsche',
    model: '718 Cayman',
    trim: 'GT4 RS',
    mileage: 1200,
    final_price: 210_000_00,
    auction_ends_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    source_url: 'https://bringatrailer.com/listing/2023-comp-1',
    source_platform: 'bring-a-trailer',
  },
  {
    id: 'comp-2',
    year: 2022,
    make: 'Porsche',
    model: '718 Cayman',
    trim: 'GT4 RS',
    mileage: 3400,
    final_price: 195_000_00,
    auction_ends_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    source_url: null,
    source_platform: 'bring-a-trailer',
  },
]

describe('VerdictBlock — comp engine data', () => {
  it('strict tier — "Priced below" when subject is below range', () => {
    // GT4_RS_LISTING.final_price = 22000000 ($220k), fair value high = 22000000 → exactly at high
    // To test "below": use a listing with lower price
    const listingBelow = { ...GT4_RS_LISTING, final_price: 150_000_00 } // $150k < $180k low
    const html = renderToString(
      <VerdictBlock
        listing={listingBelow}
        analysisData={null}
        compResult={COMP_RESULT_STRICT}
        viewerTier="free"
        listingId="fixture-gt4rs-001"
      />,
    )
    expect(t(html)).toContain('Priced below comparable sales.')
    expect(t(html)).toContain('$180,000') // fair_value_low_cents = 18000000 → $180,000
    expect(t(html)).not.toContain('Wide-criteria')
  })

  it('strict tier — "Priced at fair value" when subject is within range', () => {
    const listingWithin = { ...GT4_RS_LISTING, final_price: 200_000_00 } // $200k within $180-$220k
    const html = renderToString(
      <VerdictBlock
        listing={listingWithin}
        analysisData={null}
        compResult={COMP_RESULT_STRICT}
        viewerTier="free"
        listingId="fixture-gt4rs-001"
      />,
    )
    expect(t(html)).toContain('Priced at fair value.')
    expect(t(html)).toContain('8 comps')
  })

  it('strict tier — "Priced above" when subject is above range', () => {
    const listingAbove = { ...GT4_RS_LISTING, final_price: 280_000_00 } // $280k > $220k high
    const html = renderToString(
      <VerdictBlock
        listing={listingAbove}
        analysisData={null}
        compResult={COMP_RESULT_STRICT}
        viewerTier="free"
        listingId="fixture-gt4rs-001"
      />,
    )
    expect(t(html)).toContain('Priced above comparable sales.')
  })

  it('wide tier — shows wide-criteria note', () => {
    const html = renderToString(
      <VerdictBlock
        listing={GT4_RS_LISTING}
        analysisData={null}
        compResult={COMP_RESULT_WIDE}
        viewerTier="free"
        listingId="fixture-gt4rs-001"
      />,
    )
    expect(t(html)).toContain('Wide-criteria comps used due to limited matches.')
  })

  it('insufficient tier — renders in-development state', () => {
    const html = renderToString(
      <VerdictBlock
        listing={TURBO_930_LISTING}
        analysisData={null}
        compResult={COMP_RESULT_INSUFFICIENT}
        viewerTier="free"
        listingId="fixture-930-001"
      />,
    )
    expect(t(html)).toContain('Verdict in development.')
  })

  it('no comp result — renders in-development state', () => {
    const html = renderToString(
      <VerdictBlock
        listing={GT4_RS_LISTING}
        analysisData={null}
        compResult={null}
        viewerTier="free"
        listingId="fixture-gt4rs-001"
      />,
    )
    expect(t(html)).toContain('Verdict in development.')
  })
})

describe('MetricTiles — comp engine data', () => {
  it('shows fair value range from comp result', () => {
    const html = renderToString(
      <MetricTiles
        listing={GT4_RS_LISTING}
        analysisData={null}
        compResult={COMP_RESULT_STRICT}
        viewerTier="free"
      />,
    )
    expect(t(html)).toContain('Fair Value Range')
    // Low and high cents formatted
    expect(html).not.toContain('In development')
    expect(html).not.toContain('in development')
  })

  it('shows comps count and recency from comp result', () => {
    const html = renderToString(
      <MetricTiles
        listing={GT4_RS_LISTING}
        analysisData={null}
        compResult={COMP_RESULT_STRICT}
        viewerTier="free"
      />,
    )
    expect(t(html)).toContain('8 comps')
  })

  it('fair value locked for anonymous even with comp data', () => {
    const html = renderToString(
      <MetricTiles
        listing={GT4_RS_LISTING}
        analysisData={null}
        compResult={COMP_RESULT_STRICT}
        viewerTier="anonymous"
      />,
    )
    expect(t(html)).toContain('Sign in to see')
    expect(html).not.toContain('8 comps')
  })
})

describe('ComparableSalesCard — comp engine data', () => {
  it('strict tier — free user sees comp listings with editorial numbered rows', () => {
    const html = renderToString(
      <ComparableSalesCard
        analysisData={null}
        compResult={COMP_RESULT_STRICT}
        compListings={COMP_LISTINGS}
        viewerTier="free"
      />,
    )
    expect(t(html)).toContain('8 comparable sales found')
    // numbered rows (01, 02)
    expect(t(html)).toContain('01')
    expect(t(html)).toContain('02')
    expect(t(html)).toContain('2023 Porsche 718 Cayman GT4 RS')
    expect(html).not.toContain('available with a free account')
  })

  it('wide tier — shows wide-criteria note', () => {
    const html = renderToString(
      <ComparableSalesCard
        analysisData={null}
        compResult={COMP_RESULT_WIDE}
        compListings={COMP_LISTINGS}
        viewerTier="free"
      />,
    )
    expect(html).toContain('wide criteria')
  })

  it('anonymous — shows 1 comp, hides rest', () => {
    const html = renderToString(
      <ComparableSalesCard
        analysisData={null}
        compResult={COMP_RESULT_STRICT}
        compListings={COMP_LISTINGS}
        viewerTier="anonymous"
      />,
    )
    // First row marker rendered; second row marker not rendered
    expect(html).toContain('>01<')
    expect(html).not.toContain('>02<')
    expect(html).toContain('available with a free account')
  })

  it('insufficient tier — shows honest empty state', () => {
    const html = renderToString(
      <ComparableSalesCard
        analysisData={null}
        compResult={COMP_RESULT_INSUFFICIENT}
        compListings={[]}
        viewerTier="free"
      />,
    )
    expect(t(html)).toContain('Not enough comparable sales')
    expect(html).not.toContain('available with a free account')
  })
})
