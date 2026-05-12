import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDecadeFallback } from '@/lib/era-content/decade-fallback'
import { getGenerationContent } from '@/lib/era-content/generation-content'
import { GENERATION_HERO_IMAGES } from '@/lib/era-content/generation-hero-images'
import { GENERATIONS_WITHOUT_IMAGE } from '@/lib/era-content/generations-without-image'
import { formatCents } from '@/lib/utils/currency'
import { StickyNav } from '@/components/StickyNav'
import { WatchForSection } from '@/components/generations/WatchForSection'
import { StatCalloutRow } from '@/components/generation/StatCalloutRow'
import { formatGenerationFull } from '@/lib/era-content/generation-display'

type PageProps = { params: { id: string } }

const LINING: React.CSSProperties = { fontVariantNumeric: 'lining-nums', fontFeatureSettings: '"lnum"' }

function computeMarketStats(prices: number[]): {
  count: number
  median: number
} | null {
  if (prices.length === 0) return null
  const sorted = [...prices].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  const median =
    sorted.length % 2 === 0
      ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
      : sorted[mid]
  return { count: sorted.length, median }
}

function variantSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const GEN_NAV_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Engineering', href: '#engineering' },
  { label: 'Variants', href: '#variants' },
  { label: 'Watch For', href: '#watch-for' },
  { label: 'Market', href: '#market' },
  { label: 'Service', href: '#service' },
]

export default async function GenerationPage({ params }: PageProps) {
  const { id } = params
  const supabase = createClient()

  const [{ data: generation }, marketResult] = await Promise.all([
    supabase.from('porsche_generations').select('*').eq('generation_id', id).maybeSingle(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from('listings')
      .select('final_price')
      .eq('generation_id', id)
      .eq('listing_status', 'sold')
      .not('final_price', 'is', null)
      .limit(2000) as Promise<{ data: Array<{ final_price: number }> | null; error: unknown }>,
  ])

  const content = getGenerationContent(id)
  const fallback = getDecadeFallback(id)

  if (!generation && !content && !fallback) notFound()

  const prices = (marketResult.data ?? []).map((r) => r.final_price)
  const marketStats = computeMarketStats(prices)

  const genLabel = formatGenerationFull(generation?.generation_id ?? id)
  const positioning = content?.positioning ?? null
  const intro = content?.intro ?? fallback?.intro ?? null
  const productionYears = content?.production_years ?? generation?.production_years ?? fallback?.production_years ?? null
  const bodyStyles = content?.body_styles ?? (generation?.body_styles?.join(', ') || null) ?? fallback?.body_styles ?? null
  const engine = content?.engine ?? generation?.engine_family ?? fallback?.engine ?? null
  const cooling = content?.cooling ?? generation?.engine_type ?? fallback?.cooling ?? null
  const unitsProduced = content?.units_produced ?? generation?.units_produced ?? null
  const msrp = generation?.msrp_launch_usd ?? null
  const notes = content?.notes ?? fallback?.notes ?? []

  const heroImage = GENERATION_HERO_IMAGES[id] ?? null
  const hasPhoto = !GENERATIONS_WITHOUT_IMAGE.includes(id)

  const quickFacts = [
    { label: 'Production', value: productionYears },
    { label: 'Engine', value: engine },
    { label: 'Cooling', value: cooling },
    { label: 'Body styles', value: bodyStyles },
    { label: 'Units produced', value: unitsProduced },
    { label: 'Launch MSRP', value: msrp },
  ].filter((f): f is { label: string; value: string } => !!f.value)

  const eyebrow = [
    productionYears,
    positioning ? positioning.toUpperCase() : null,
  ]
    .filter(Boolean)
    .join(' · ')

  const heroTitle = `Porsche ${genLabel}`

  return (
    <main className="mx-auto max-w-7xl">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}

      {hasPhoto ? (
        /* ── State A: Photo hero — 520px, title overlay ─────────────────── */
        <div className="relative overflow-hidden" style={{ height: 520 }}>
          {heroImage ? (
            <Image
              src={heroImage.src}
              alt={heroTitle}
              fill
              className="object-cover object-center"
              style={{ filter: 'grayscale(1) sepia(0.35) brightness(0.88)' }}
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

          {/* Gradient underlay — mild wash, title plate handles readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(15,12,8,0.6) 0%, rgba(15,12,8,0.3) 40%, rgba(15,12,8,0) 60%)',
            }}
          />

          {/* Overlay content — bottom-left */}
          <div className="absolute bottom-0 left-0 pb-10 pl-11">
            {/* Dark title plate — solid backdrop behind text block */}
            <div
              style={{
                backgroundColor: 'rgba(15, 12, 8, 0.7)',
                borderRadius: '2px',
                padding: '24px 32px',
              }}
            >
              {eyebrow && (
                <p className="mb-3 font-serif text-[11px] uppercase tracking-[0.18em] text-accent-secondary">
                  {eyebrow}
                </p>
              )}
              <h1
                className="font-serif leading-[1.1] text-[#FAF8F3]"
                style={{ fontSize: '54px', letterSpacing: '-0.01em', maxWidth: 780 }}
              >
                {heroTitle}
              </h1>
              {intro && (
                <p
                  className="mt-3 font-serif text-[16px] italic leading-[1.55]"
                  style={{ maxWidth: 680, color: 'rgba(250,248,243,0.82)' }}
                >
                  {intro}
                </p>
              )}
            </div>
          </div>

          {/* Attribution — bottom-right */}
          {heroImage && (
            <p
              className="absolute bottom-3 right-5 font-serif text-[11px] italic"
              style={{ color: 'rgba(250,248,243,0.4)' }}
            >
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
            </p>
          )}
        </div>
      ) : (
        /* ── State B: Typography-only hero — 420px, cream background ────── */
        <div className="relative bg-bg-canvas" style={{ height: 420 }}>
          {/* Hairline at bottom to mark hero boundary */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: 1, backgroundColor: 'var(--border-subtle)' }}
          />

          {/* Main content — top-anchored */}
          <div className="absolute left-11 right-10 top-[88px]">
            {eyebrow && (
              <p className="font-serif text-[11px] uppercase tracking-[0.25em] text-accent-secondary">
                {eyebrow}
              </p>
            )}
            <h1
              className="mt-3 font-serif leading-[1.1] text-text-primary"
              style={{ fontSize: '64px', letterSpacing: '-0.01em', maxWidth: 860 }}
            >
              {heroTitle}
            </h1>
            {intro && (
              <p
                className="mt-3 font-serif text-[17px] italic leading-[1.55] text-text-secondary"
                style={{ maxWidth: 680 }}
              >
                {intro}
              </p>
            )}
            {/* Divider rule — separates title block from stats */}
            <div
              className="mt-6"
              style={{ width: 120, height: 1.5, backgroundColor: 'var(--accent-primary)' }}
            />
            <div className="mt-6">
              <StatCalloutRow
                productionYears={productionYears}
                unitsProduced={unitsProduced}
                engine={engine}
              />
            </div>
          </div>

          {/* Bottom row — decorative, absolute to hero floor */}
          <div className="absolute bottom-5 left-11 right-10 flex items-center justify-between">
            <p className="font-serif text-[10px] uppercase tracking-[0.18em] text-text-quaternary">
              Generation Reference
            </p>
            <p className="font-serif text-[10px] uppercase tracking-[0.18em] text-text-quaternary">
              Project Vintage
            </p>
          </div>
        </div>
      )}

      {/* ── STICKY NAV ────────────────────────────────────────────────────── */}
      <StickyNav links={GEN_NAV_LINKS} />

      {/* ── OVERVIEW + QUICK FACTS — asymmetric grid ─────────────────────── */}
      <section id="overview" className="px-6 pt-10 pb-0 sm:px-8 lg:px-10">
        <div
          className={`grid grid-cols-1 gap-8 ${quickFacts.length > 0 ? 'lg:grid-cols-[1fr_340px] lg:gap-12' : ''}`}
          style={{ alignItems: 'start' }}
        >
          {/* Left — prose, no card */}
          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
              Why this generation matters
            </p>
            <div className="mt-5 space-y-5">
              {notes.map((para, idx) => (
                <p
                  key={idx}
                  className="font-serif text-[15px] italic leading-[1.65] text-text-primary"
                  style={LINING}
                >
                  {para}
                </p>
              ))}
              {notes.length === 0 && (
                <p className="font-serif text-[15px] italic leading-[1.65] text-text-tertiary">
                  Generation overview coming soon.
                </p>
              )}
            </div>
          </div>

          {/* Right — Quick Facts card (340px) */}
          {quickFacts.length > 0 && (
            <aside>
              <div className="border-[0.5px] border-border-default bg-bg-surface px-6 py-6">
                <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
                  Quick facts
                </p>
                <dl className="mt-5 divide-y divide-border-subtle" style={LINING}>
                  {quickFacts.map(({ label, value }) => (
                    <div key={label} className="py-4 first:pt-0 last:pb-0">
                      <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">
                        {label}
                      </dt>
                      <dd className="mt-1.5 font-serif text-[15px] text-text-primary">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* ── ENGINEERING — aligned with prose left column ──────────────────── */}
      {content?.engineering && content.engineering.length > 0 && (
        <section id="engineering" className="px-6 py-12 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] lg:gap-12">
          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
              Engineering highlights
            </p>
            <div className="mt-6">
              {content.engineering.map((para, idx) => {
                const colonIdx = para.indexOf(':')
                const lead = colonIdx > -1 ? para.slice(0, colonIdx) : null
                const body = colonIdx > -1 ? para.slice(colonIdx + 1).trim() : para
                return (
                  <div
                    key={idx}
                    className={`grid gap-0 ${idx > 0 ? 'border-t-[0.5px] border-border-subtle' : ''}`}
                    style={{ gridTemplateColumns: '54px 1fr' }}
                  >
                    <div className="pt-6 pr-4">
                      <span
                        className="font-serif text-[24px] leading-none text-accent-secondary"
                        style={LINING}
                        aria-hidden="true"
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="py-6">
                      {lead && (
                        <h3 className="font-serif text-[18px] leading-[1.3] text-text-primary">
                          {lead}
                        </h3>
                      )}
                      <p
                        className={`font-serif text-[14px] leading-[1.65] text-text-secondary ${lead ? 'mt-2' : ''}`}
                        style={LINING}
                      >
                        {body}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          </div>
        </section>
      )}

      {/* ── VARIANTS — bg-elevated band ───────────────────────────────────── */}
      {content?.variants && content.variants.length > 0 && (
        <section id="variants" className="bg-bg-elevated px-6 py-10 sm:px-8 lg:px-10">
          <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
            Variants &amp; trim map
          </p>
          <div className="mt-6 grid grid-cols-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-3">
            {content.variants.map((v) => (
              <Link
                key={v.name}
                href={`/generations/${id}/${variantSlug(v.name)}`}
                className="group block border-[0.5px] border-border-default bg-bg-surface px-5 py-5 hover:border-accent-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              >
                <h3
                  className="font-serif text-[18px] leading-[1.25] text-text-primary"
                  style={LINING}
                >
                  {v.name}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                  {v.years && (
                    <span
                      className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary"
                      style={LINING}
                    >
                      {v.years}
                    </span>
                  )}
                  {v.drivetrain && (
                    <span className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">
                      · {v.drivetrain}
                    </span>
                  )}
                  {v.power && (
                    <span
                      className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary"
                      style={LINING}
                    >
                      · {v.power}
                    </span>
                  )}
                </div>
                <p className="mt-3 font-sans text-[13px] leading-[1.6] text-text-secondary">
                  {v.description}
                </p>
                {v.production && (
                  <p
                    className="mt-3 border-t-[0.5px] border-border-subtle pt-3 font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary"
                    style={LINING}
                  >
                    {v.production}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── WHAT TO WATCH FOR — centered column, expand/collapse ─────────── */}
      {content?.watch_for && content.watch_for.length > 0 && (
        <section id="watch-for" className="px-6 py-12 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[840px]">
            <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
              What to watch for
            </p>
            <div className="mt-6">
              <WatchForSection items={content.watch_for} />
            </div>
          </div>
        </section>
      )}

      {/* ── MARKET NOTES — bg-elevated band, 2 stats ─────────────────────── */}
      <section id="market" className="bg-bg-elevated px-6 py-10 sm:px-8 lg:px-10">
        <div className="flex items-center gap-4">
          <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
            Market notes
          </p>
          <span className="inline-flex items-center border-[0.5px] border-border-default px-[7px] py-[3px] font-sans text-[8.5px] uppercase tracking-[0.12em] text-text-quaternary">
            Redesign pending
          </span>
        </div>
        {marketStats ? (
          <>
            <dl
              className="mt-6 grid grid-cols-2 gap-x-8 gap-y-0 sm:grid-cols-2"
              style={{ maxWidth: 480, ...LINING }}
            >
              <div>
                <dt className="font-serif text-[10px] uppercase tracking-[0.16em] text-accent-primary">
                  Median sale
                </dt>
                <dd className="mt-1.5 font-serif text-[28px] leading-[1.15] text-text-primary">
                  {formatCents(marketStats.median, 'USD')}
                </dd>
              </div>
              <div>
                <dt className="font-serif text-[10px] uppercase tracking-[0.16em] text-accent-primary">
                  Sales in database
                </dt>
                <dd className="mt-1.5 font-serif text-[28px] leading-[1.15] text-text-primary">
                  {marketStats.count.toLocaleString()}
                </dd>
              </div>
            </dl>
            <p className="mt-6 font-sans text-[11px] text-text-quaternary">
              All variants combined · USD · Project Vintage auction database
            </p>
          </>
        ) : (
          <p className="mt-4 font-serif text-[14px] italic leading-[1.65] text-text-tertiary">
            Auction data for this generation is still building. Check back as the database grows.
          </p>
        )}
      </section>

      {/* ── SERVICE & OWNERSHIP ───────────────────────────────────────────── */}
      <section id="service" className="px-6 py-12 sm:px-8 lg:px-10">
        <div className="flex items-center gap-4">
          <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
            Service &amp; ownership
          </p>
          {!content?.service && (
            <span className="inline-flex items-center border-[0.5px] border-border-default px-[7px] py-[3px] font-sans text-[8.5px] uppercase tracking-[0.12em] text-text-quaternary">
              Content production
            </span>
          )}
        </div>
        {content?.service ? (
          <div className="mt-6 mx-auto max-w-[760px] space-y-0">
            {content.service.map((para, idx) => {
              const colonIdx = para.indexOf('. ')
              const lead = colonIdx > 20 && colonIdx < 180 ? para.slice(0, colonIdx + 1) : null
              const body = lead ? para.slice(colonIdx + 2) : null
              return (
                <div
                  key={idx}
                  className={idx > 0 ? 'mt-5 border-t-[0.5px] border-border-subtle pt-5' : ''}
                >
                  <p className="font-serif text-[15px] leading-[1.6] text-text-primary">
                    {lead ?? para}
                  </p>
                  {body && (
                    <p
                      className="mt-2 font-sans text-[13px] leading-[1.65] text-text-secondary"
                      style={LINING}
                    >
                      {body}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <p className="mt-4 font-sans text-[13px] text-text-tertiary">
            Detailed service notes for this generation are under production. Check back as the
            database grows.
          </p>
        )}
      </section>

      {/* ── BACK LINK ─────────────────────────────────────────────────────── */}
      <div className="border-t-[0.5px] border-border-subtle mx-6 pb-12 pt-6 sm:mx-8 lg:mx-10">
        <Link
          href="/dashboard"
          className="font-sans text-[13px] text-text-tertiary hover:text-text-primary"
        >
          ← Back to dashboard
        </Link>
      </div>

    </main>
  )
}
