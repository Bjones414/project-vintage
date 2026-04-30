import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getViewerTier } from '@/lib/auth/viewer-tier'
import { parseAnalysisData } from '@/components/analyze/types'
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

  const [generationResult, editorialResult, colorResult, analysisResult] =
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
      listing.exterior_color_code
        ? supabase
            .from('porsche_color_codes')
            .select('*')
            .eq('paint_code', listing.exterior_color_code)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null } as const),
      supabase
        .from('listing_analyses')
        .select('*')
        .eq('listing_id', listing.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

  const generation = generationResult.data ?? null
  const editorial = editorialResult.data ?? null
  const colorData = colorResult.data ?? null
  const analysisData = parseAnalysisData(analysisResult.data?.analysis_data ?? null)

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <AnalyzeHeader
        listing={listing}
        analysisData={analysisData}
        viewerTier={viewerTier}
      />
      <VerdictBlock
        analysisData={analysisData}
        viewerTier={viewerTier}
        listingId={listing.id}
      />
      <MetricTiles
        listing={listing}
        analysisData={analysisData}
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

      {/* Full-width: Comparable Sales */}
      <div className="mt-4">
        <ComparableSalesCard analysisData={analysisData} viewerTier={viewerTier} />
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
