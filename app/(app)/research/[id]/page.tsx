import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import type { ResearchRecord } from '@/lib/research/types'
import { fetchResearchComps } from '@/lib/research/comp-query'
import { getViewerTier } from '@/lib/auth/viewer-tier'

import { ChipBar } from '@/components/research/ChipBar'
import { ResultAnchor } from '@/components/research/ResultAnchor'
import { ResearchVerdictBlock } from '@/components/research/ResearchVerdictBlock'
import { ResearchMetricTiles } from '@/components/research/ResearchMetricTiles'
import { SubjectVehicleCard } from '@/components/research/SubjectVehicleCard'
import { InsufficientCompsBlock } from '@/components/research/InsufficientCompsBlock'
import { EraCard } from '@/components/analyze/EraCard'
import { ComparableSalesCard } from '@/components/analyze/ComparableSalesCard'
import { StickyNav } from '@/components/StickyNav'
import type { StickyNavLink } from '@/components/StickyNav'

interface PageProps {
  params: { id: string }
}

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export default async function ResearchResultPage({ params }: PageProps) {
  const admin = adminClient()

  const { data: record } = await admin
    .from('research_records')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!record) notFound()

  const typedRecord = record as ResearchRecord

  const [comps, { tier: viewerTier }] = await Promise.all([
    fetchResearchComps(typedRecord),
    getViewerTier(),
  ])

  const generationRow = typedRecord.generation_id
    ? await admin
        .from('porsche_generations')
        .select('*')
        .eq('generation_id', typedRecord.generation_id)
        .single()
        .then(({ data }) => data)
    : null

  const hasEnoughComps = comps.sufficient

  const navLinks: StickyNavLink[] = hasEnoughComps
    ? [
        { label: 'Verdict',    href: '#verdict' },
        { label: 'Comps',      href: '#comparable-sales' },
        { label: 'Subject',    href: '#subject' },
        { label: 'Generation', href: '#generation' },
      ]
    : [
        { label: 'Subject',    href: '#subject' },
        { label: 'Generation', href: '#generation' },
      ]

  // Build a minimal compResult-like object for ComparableSalesCard
  const compResultForCard = comps.filteredComps.length > 0
    ? {
        id: 'research',
        listing_id: 'research',
        tier: (hasEnoughComps ? 'strict' : 'insufficient') as 'strict' | 'wide' | 'insufficient',
        comp_count: comps.count,
        fair_value_low_cents: comps.p25,
        fair_value_median_cents: comps.median,
        fair_value_high_cents: comps.p75,
        most_recent_comp_sold_at: comps.filteredComps[0]?.auction_ends_at ?? null,
        oldest_comp_sold_at: comps.filteredComps.at(-1)?.auction_ends_at ?? null,
        comp_listing_ids: comps.filteredComps.map((c) => c.id),
        computed_at: new Date().toISOString(),
      }
    : null

  return (
    <>
      <ChipBar record={typedRecord} researchId={params.id} />
      <StickyNav links={navLinks} />

      <main className="min-h-screen bg-bg-canvas">
        <ResultAnchor record={typedRecord} />

        {hasEnoughComps ? (
          <>
            {/* ── Verdict ─────────────────────────────────────────── */}
            <ResearchVerdictBlock record={typedRecord} comps={comps} />

            {/* ── Metric tiles ────────────────────────────────────── */}
            <ResearchMetricTiles record={typedRecord} comps={comps} />
          </>
        ) : (
          /* ── Insufficient comps empty state ────────────────────── */
          <InsufficientCompsBlock generationId={typedRecord.generation_id} comps={comps} />
        )}

        {/* ── Subject Vehicle + Generation (2-col) ────────────────── */}
        <div
          id="subject"
          className="mx-auto grid max-w-[1080px] items-stretch gap-4 px-7 pb-7"
          style={{ gridTemplateColumns: '1fr 1fr' }}
        >
          <SubjectVehicleCard record={typedRecord} />

          <div id="generation">
            <EraCard
              generation={generationRow ?? null}
              viewerTier={viewerTier}
              watchForItems={[]}
            />
          </div>
        </div>

        {/* ── Comparable Sales ───────────────────────────────────── */}
        <div id="comparable-sales" className="mx-auto max-w-[1080px] px-7 pb-14">
          <ComparableSalesCard
            analysisData={null}
            compResult={compResultForCard ?? undefined}
            compListings={comps.filteredComps}
            viewerTier={viewerTier}
            matchingMode={comps.isMileageFiltered ? 'strict' : 'broad'}
            disclaimer={!comps.isMileageFiltered && typedRecord.mileage == null}
          />
        </div>
      </main>
    </>
  )
}
