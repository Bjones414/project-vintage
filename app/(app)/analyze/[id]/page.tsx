import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getViewerTier } from '@/lib/auth/viewer-tier'
import { parseAnalysisData } from '@/components/analyze/types'
import { resolveColorData } from '@/lib/utils/color-lookup'
import { AnalyzeHeader } from '@/components/analyze/AnalyzeHeader'
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

  const [generationResult, editorialResult, colorData, analysisResult, compResultRaw] =
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
      // Fetch latest comp result — non-fatal if absent (corpus may be too small)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any)
        .from('comp_results')
        .select('id, listing_id, tier, comp_count, fair_value_low_cents, fair_value_median_cents, fair_value_high_cents, most_recent_comp_sold_at, oldest_comp_sold_at, comp_listing_ids, computed_at')
        .eq('listing_id', listing.id)
        .order('computed_at', { ascending: false })
        .limit(1)
        .maybeSingle() as Promise<{ data: import('@/lib/comp-engine/db-types').CompResultRow | null; error: unknown }>,
    ])

  const generation = generationResult.data ?? null
  const editorial = editorialResult.data ?? null
  const analysisData = parseAnalysisData(analysisResult.data?.analysis_data ?? null)
  const compResult: import('@/lib/comp-engine/db-types').CompResultRow | null = compResultRaw.data ?? null

  // Fetch top 5 comp listings by recency for ComparableSalesCard display.
  // Only needed when comp result exists and has actual comps (not insufficient).
  const compListings =
    compResult && compResult.comp_listing_ids.length > 0
      ? await supabase
          .from('listings')
          .select('id, year, make, model, trim, mileage, final_price, auction_ends_at, source_url, source_platform, source_publication')
          .in('id', compResult.comp_listing_ids)
          .not('final_price', 'is', null)
          .order('auction_ends_at', { ascending: false })
          .limit(5)
          .then(r => r.data ?? [])
      : []

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <AnalyzeHeader
        listing={listing}
        analysisData={analysisData}
        viewerTier={viewerTier}
      />
      <VerdictBlock
        listing={listing}
        analysisData={analysisData}
        compResult={compResult}
        viewerTier={viewerTier}
        listingId={listing.id}
      />
      <MetricTiles
        listing={listing}
        analysisData={analysisData}
        compResult={compResult}
        viewerTier={viewerTier}
      />

      {/* Two-column: Chassis Identity | Era Card */}
      <div className="mt-6 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
        <ChassisIdentityCard listing={listing} generation={generation} colorData={colorData} />
        <EraCard generation={generation} viewerTier={viewerTier} />
      </div>

      {/* Full-width: Watch-outs */}
      {editorial && (
        <div className="mt-4">
          <WatchOutsCard editorial={editorial} viewerTier={viewerTier} />
        </div>
      )}

      {/* Source-mention signals — subject page only, framed as "Source mentions:" */}
      <div className="mt-4">
        <SourceMentionsCard listing={listing} />
      </div>

      {/* Full-width: Comparable Sales */}
      <div className="mt-4">
        <ComparableSalesCard
          analysisData={analysisData}
          compResult={compResult}
          compListings={compListings}
          viewerTier={viewerTier}
        />
      </div>

      {/* Full-width: Teaser */}
      <TeaserBlock
        analysisRow={analysisResult.data ?? null}
        listingId={listing.id}
        viewerTier={viewerTier}
      />

      {viewerTier === 'anonymous' && <AnonymousSignupCTA />}

      <ActionRow listing={listing} viewerTier={viewerTier} />
    </main>
  )
}
