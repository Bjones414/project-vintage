import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getViewerTier } from '@/lib/auth/viewer-tier'
import { parseAnalysisData } from '@/components/analyze/types'
import { resolveColorData } from '@/lib/utils/color-lookup'
import { AnalyzeHero } from '@/components/analyze/AnalyzeHero'
import { VerdictBlock } from '@/components/analyze/VerdictBlock'
import { MetricTiles } from '@/components/analyze/MetricTiles'
import { ChassisIdentityCard } from '@/components/analyze/ChassisIdentityCard'
import { ComparableSalesCard } from '@/components/analyze/ComparableSalesCard'
import { ActionRow } from '@/components/analyze/ActionRow'
import { EraCard } from '@/components/analyze/EraCard'
import { WatchOutsCard } from '@/components/analyze/WatchOutsCard'
import { TeaserBlock } from '@/components/analyze/TeaserBlock'
import { AnonymousSignupCTA } from '@/components/analyze/AnonymousSignupCTA'
import { SourceMentionsCard } from '@/components/analyze/SourceMentionsCard'
import { getRecallsByMakeModelYear } from '@/lib/recalls/nhtsa'
import { matchDefects, recallsToWatchForItems } from '@/lib/originality'
import { selectTopThree } from '@/lib/watch-for/select-top-three'
import { GENERATION_HERO_IMAGES } from '@/lib/era-content/generation-hero-images'
import { computeCompsV2 } from '@/lib/comp-engine-v2'
import type { V2CompsResult } from '@/lib/comp-engine-v2'
import type { CompResultRow } from '@/lib/comp-engine/db-types'

function v2ToCompResult(listingId: string, result: V2CompsResult): CompResultRow {
  const tier: CompResultRow['tier'] =
    result.comp_count === 0 || result.verdict === 'insufficient_comps' || result.verdict === 'uncomparable'
      ? 'insufficient'
      : (result.confidence_score ?? 0) >= 60
      ? 'strict'
      : 'wide'
  return {
    id: `live-${listingId}`,
    listing_id: listingId,
    tier,
    comp_count: result.comp_count,
    fair_value_low_cents: result.predicted_p25 ?? null,
    fair_value_median_cents: result.predicted_median ?? null,
    fair_value_high_cents: result.predicted_p75 ?? null,
    most_recent_comp_sold_at: null,
    oldest_comp_sold_at: null,
    comp_listing_ids: result.comps_used.map(c => c.listing_id),
    computed_at: new Date().toISOString(),
  }
}

type PageProps = {
  params: { id: string }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const supabase = createClient()

  const [listingResult, { tier: viewerTier }] = await Promise.all([
    supabase.from('listings').select('*').eq('id', params.id).single(),
    getViewerTier(),
  ])

  if (listingResult.error || !listingResult.data) {
    notFound()
  }

  const listing = listingResult.data

  const [generationResult, editorialResult, colorData, analysisResult, v2CompsResult, recalls] =
    await Promise.all([
      listing.generation_id
        ? supabase
            .from('porsche_generations')
            .select('*')
            .eq('generation_id', listing.generation_id)
            .single()
        : Promise.resolve({ data: null, error: null } as const),
      listing.generation_id
        ? supabase
            .from('generation_editorial')
            .select('*')
            .eq('generation_id', listing.generation_id)
            .eq('content_status', 'verified')
            .maybeSingle()
        : Promise.resolve({ data: null, error: null } as const),
      resolveColorData(supabase, {
        paintCode: listing.exterior_color_code,
        colorName: listing.exterior_color,
        generationId: listing.generation_id,
      }),
      supabase
        .from('listing_analyses')
        .select('*')
        .eq('listing_id', listing.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      computeCompsV2(listing.id).catch((e: unknown) => {
        console.error('[analyze page] computeCompsV2 failed', e instanceof Error ? e.message : String(e))
        return null
      }),
      getRecallsByMakeModelYear(
        listing.decoded_make ?? listing.make,
        listing.decoded_model ?? listing.model,
        listing.decoded_year ?? listing.year,
      ),
    ])

  const generation = generationResult.data ?? null
  const editorial = editorialResult.data ?? null
  const analysisData = parseAnalysisData(analysisResult.data?.analysis_data ?? null)
  const compResult: CompResultRow | null = v2CompsResult ? v2ToCompResult(listing.id, v2CompsResult) : null

  const catalogItems = matchDefects({
    generation_id: listing.generation_id ?? null,
    engine_family: generation?.engine_family ?? null,
    year: listing.year ?? null,
    mileage: listing.mileage ?? null,
    trim: listing.trim ?? null,
  })
  const recallItems = recallsToWatchForItems(recalls)
  const severityOrder = { high: 0, moderate: 1, low: 2 } as const
  const watchForItems = [...catalogItems, ...recallItems].sort((a, b) => {
    const sevDiff = severityOrder[a.severity] - severityOrder[b.severity]
    if (sevDiff !== 0) return sevDiff
    return (b.relevance_score ?? 0) - (a.relevance_score ?? 0)
  })

  const compListings =
    compResult && compResult.comp_listing_ids.length > 0
      ? await supabase
          .from('listings')
          .select('id, year, make, model, trim, mileage, final_price, auction_ends_at, source_url, source_platform, source_publication')
          .in('id', compResult.comp_listing_ids)
          .not('final_price', 'is', null)
          .order('auction_ends_at', { ascending: false })
          .then(r => r.data ?? [])
      : []

  // Generation hero image — falls back to null (AnalyzeHero renders placeholder gradient)
  const heroImage = listing.generation_id
    ? (GENERATION_HERO_IMAGES[listing.generation_id] ?? null)
    : null

  return (
    <main className="mx-auto max-w-7xl">
      {/* Full-width photo hero — no horizontal padding */}
      <AnalyzeHero listing={listing} generation={generation} heroImage={heroImage} />

      <div className="pb-8 pt-5">
        <div id="verdict">
          <VerdictBlock
            listing={listing}
            analysisData={analysisData}
            compResult={compResult}
            viewerTier={viewerTier}
            listingId={listing.id}
            trimCategory={listing.trim_category ?? null}
            generationId={listing.generation_id ?? null}
          />
        </div>

        <MetricTiles
          listing={listing}
          analysisData={analysisData}
          compResult={compResult}
          viewerTier={viewerTier}
        />

        {/* Two-column: Chassis Identity | Era Card — stretch so both cards share the taller height */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div id="chassis">
            <ChassisIdentityCard listing={listing} generation={generation} colorData={colorData} />
          </div>
          <div id="generation">
            <EraCard generation={generation} viewerTier={viewerTier} watchForItems={selectTopThree(watchForItems)} />
          </div>
        </div>

        {/* Full-width: Watch-outs (editorial layer, separate from defect catalog) */}
        {editorial && (
          <div className="mt-4">
            <WatchOutsCard editorial={editorial} viewerTier={viewerTier} />
          </div>
        )}

        {/* Source-mention signals */}
        <div className="mt-4">
          <SourceMentionsCard listing={listing} />
        </div>

        {/* Full-width: Comparable Sales */}
        <div id="comps" className="mt-4">
          <ComparableSalesCard
            analysisData={analysisData}
            compResult={compResult}
            compListings={compListings}
            viewerTier={viewerTier}
            trimCategory={listing.trim_category ?? null}
          />
        </div>

        {/* Full Analysis teaser */}
        <TeaserBlock
          analysisRow={analysisResult.data ?? null}
          listingId={listing.id}
          viewerTier={viewerTier}
        />

        {viewerTier === 'anonymous' && <AnonymousSignupCTA />}

        <ActionRow listing={listing} viewerTier={viewerTier} />
      </div>
    </main>
  )
}
