import Image from 'next/image'
import type { Tables } from '@/lib/supabase/types'
import type { HeroImage } from '@/lib/era-content/generation-hero-images'
import { formatGenerationFull } from '@/lib/era-content/generation-display'

type Props = {
  listing: Tables<'listings'>
  generation: Tables<'porsche_generations'> | null
  heroImage?: HeroImage | null
}

function formatStatusDate(iso: string | null | undefined): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function AnalyzeHero({ listing, generation, heroImage }: Props) {
  const headline = [listing.year, listing.make, listing.model, listing.trim]
    .filter(Boolean)
    .join(' ')

  const colorSegment = listing.exterior_color
    ? listing.interior_color
      ? `${listing.exterior_color} over ${listing.interior_color}`
      : listing.exterior_color
    : null

  const transmissionSegment = listing.decoded_transmission ?? listing.transmission ?? null

  const mileageUnit =
    listing.mileage_unit === 'mi' ? 'miles' : (listing.mileage_unit ?? 'miles')
  const mileageSegment =
    listing.mileage != null
      ? `${listing.mileage.toLocaleString('en-US')} ${mileageUnit}`
      : null

  const dekParts = [colorSegment, transmissionSegment, mileageSegment].filter(
    (s): s is string => s != null,
  )
  const dek = dekParts.join(' · ')

  const isLive = listing.listing_status === 'live'

  let statusText: string | null = null
  let statusDotClass = 'bg-text-quaternary'

  if (isLive) {
    const dateStr = formatStatusDate(listing.auction_ends_at)
    statusText = dateStr ? `Live · ends ${dateStr}` : 'Live'
    statusDotClass = 'animate-pulse bg-severity-positive'
  } else if (listing.listing_status === 'sold') {
    const dateStr = formatStatusDate(listing.ended_date)
    statusText = dateStr ? `Sold · ${dateStr}` : 'Sold'
  } else if (listing.listing_status === 'no-sale') {
    const dateStr = formatStatusDate(listing.ended_date)
    statusText = dateStr ? `No sale · ${dateStr}` : 'No sale'
  }

  const genLabel = generation?.generation_id
    ? formatGenerationFull(generation.generation_id)
    : (listing.model ?? 'vehicle')

  return (
    <div className="relative overflow-hidden" style={{ height: 460 }}>
      {heroImage ? (
        <Image
          src={heroImage.src}
          alt={headline}
          fill
          className="object-cover object-center"
          style={{ filter: 'saturate(0.75) contrast(1.02)' }}
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #2C2A24 0%, #3D3A30 60%, #4A4538 100%)',
          }}
        />
      )}

      {/* Dark gradient underlay — dense at bottom, transparent at 70% up */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(20,18,14,0.75) 0%, rgba(20,18,14,0.4) 35%, transparent 70%)',
        }}
      />

      {/* Overlay content — bottom-left */}
      <div className="absolute bottom-0 left-0 pb-9 pl-10 pr-10 pt-20">
        {statusText && (
          <div className="mb-3 flex items-center gap-[10px]">
            <span
              className={`h-[6px] w-[6px] shrink-0 rounded-full ${statusDotClass}`}
              aria-hidden="true"
            />
            <span className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-secondary">
              {statusText}
            </span>
          </div>
        )}

        <h1
          className="font-serif text-[38px] leading-[1.15] text-[#FAF8F3]"
          style={{ letterSpacing: '-0.01em', maxWidth: 780 }}
        >
          {headline}
        </h1>

        {dek && (
          <p
            className="mt-2 font-serif text-[15px] italic leading-[1.55]"
            style={{ maxWidth: 700, color: 'rgba(250,248,243,0.82)' }}
          >
            {dek}
          </p>
        )}
      </div>

      {/* Attribution — bottom-right */}
      <p
        className="absolute bottom-3 right-5 font-serif text-[11px] italic"
        style={{ color: 'rgba(250,248,243,0.4)' }}
      >
        {heroImage ? (
          <>
            Representative {genLabel} · Photo:{' '}
            <a
              href={heroImage.source}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75"
            >
              {heroImage.credit}
            </a>
            {' · '}{heroImage.license}
          </>
        ) : (
          <>Representative {genLabel} · Photo: Wikimedia Commons</>
        )}
      </p>
    </div>
  )
}
