import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getGenerationContent } from '@/lib/era-content/generation-content'
import { DecadeNav } from '@/components/generations/DecadeNav'

export const metadata = {
  title: 'Porsche Generations — Project Vintage',
}

// ─── Decade editorial copy ────────────────────────────────────────────────────

const DECADE_INTROS: Record<string, string> = {
  '1950s': "The 356 era. Porsche's first production sports car evolves through three generations, establishing the rear-engined formula that would define the company.",
  '1960s': "The 911 arrives. The 356's successor introduces the air-cooled flat-six and the silhouette that will define Porsche for the next sixty years.",
  '1970s': "Three families coexist. The 911 G-series matures, the 914 finds its audience, and the front-engined 924 opens the transaxle era.",
  '1980s': "The transverse era. Transaxle V8s, water-cooled fours, and the 911 hits its mid-life refinement. The 959 redefines what a road car can be.",
  '1990s': "The water-cooled transition. 964 modernizes the 911 platform, 993 closes the air-cooled era, and the Boxster + 996 establish Porsche's modern formula.",
  '2000s': "Expansion. The 997 refines the modern 911, the Cayenne saves the company, the Cayman joins the lineup, and Porsche becomes a multi-segment manufacturer.",
  '2010s': "Electrification on the horizon. 991 modernizes again, the Macan adds a compact SUV, the Panamera matures, and the 718 brings turbo fours to the mid-engined cars.",
  '2020s': "The Taycan era. Full electric joins the lineup, the 992 continues the 911 evolution, hybrid powertrains spread across the range.",
}

const ALL_DECADES = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']

// ─── Helpers ─────────────────────────────────────────────────────────────────

function decadeForGeneration(yearStart: number, yearEnd: number | null): string {
  const end = yearEnd ?? new Date().getFullYear()
  const midpoint = Math.round((yearStart + end) / 2)
  const decadeStart = Math.floor(midpoint / 10) * 10
  return `${decadeStart}s`
}

function generationDisplayName(genId: string, model: string): string {
  if (model === '911') return `Type ${genId}`
  const modelWords = model.toLowerCase().split(/\s+/)
  const idParts = genId.split('-').filter((p) => !modelWords.includes(p.toLowerCase()))
  const numPart = idParts.join(' ')
  return numPart ? `${model} ${numPart}` : model
}

// ─── Types ────────────────────────────────────────────────────────────────────

type GenRow = {
  generation_id: string
  model: string
  production_years: string | null
  year_start: number
  year_end: number | null
  notes: string | null
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function GenerationsPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('porsche_generations')
    .select('generation_id, model, production_years, year_start, year_end, notes')
    .order('year_start', { ascending: true })

  const rows = (data ?? []) as GenRow[]

  // Bucket generations into decades by midpoint year
  const byDecade = new Map<string, GenRow[]>()
  for (const row of rows) {
    const decade = decadeForGeneration(row.year_start, row.year_end)
    const bucket = byDecade.get(decade) ?? []
    bucket.push(row)
    byDecade.set(decade, bucket)
  }

  // Only show decades that have at least one generation
  const activeDecades = ALL_DECADES.filter((d) => byDecade.has(d))

  return (
    <main className="min-h-screen bg-bg-canvas">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '60px 28px 0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 96,
          minHeight: 340,
          alignItems: 'center',
        }}
      >
        {/* Left — editorial text */}
        <div>
          <p
            className="font-serif font-medium uppercase text-accent-primary"
            style={{ fontSize: 11, letterSpacing: '0.24em', marginBottom: 32 }}
          >
            1948 — present
          </p>
          <h1
            className="font-serif font-normal text-text-primary"
            style={{ fontSize: 54, lineHeight: 1.05, letterSpacing: '-0.015em', marginBottom: 32 }}
          >
            The Porsche generations
          </h1>
          <p className="font-serif text-[16px] italic leading-[1.7] text-text-secondary" style={{ maxWidth: 480 }}>
            Editorial reference for each generation — the mechanical evolution, the common watch&#8209;outs, the market positioning. Used to inform every Analyze and Research result.
          </p>
        </div>

        {/* Right — vintage instrument-cluster gauge */}
        <div style={{ maxWidth: 580, marginLeft: 'auto' }}>
          <svg
            viewBox="0 0 440 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <defs>
              <pattern id="gen-dots" width="14" height="14" patternUnits="userSpaceOnUse">
                <circle cx="7" cy="7" r="0.7" fill="rgba(139,105,20,0.18)" />
              </pattern>
            </defs>

            {/* Dot grid */}
            <rect width="440" height="440" fill="url(#gen-dots)" />

            {/* Gauge internals — translate(20,20) pushes mechanical center from (200,180) to (220,200),
                giving year labels at r=185 room to breathe outside the outer bezel ring */}
            <g transform="translate(20, 20)">

              {/* ── Concentric rings ── */}
              <circle cx="200" cy="180" r="150" stroke="#8B6914" strokeWidth="1.2" />
              <circle cx="200" cy="180" r="140" stroke="#8B6914" strokeWidth="0.4" />
              <circle cx="200" cy="180" r="105" stroke="#8B6914" strokeWidth="0.6" />

              {/* ── Major ticks (12px, r 138→150) ── */}
              {/* 1950  θ=0°   top */}
              <line x1="200" y1="30"    x2="200"   y2="42"    stroke="#8B6914" strokeWidth="1.1" />
              {/* 1960  θ=45°  upper-right */}
              <line x1="306.1" y1="73.9" x2="297.6" y2="82.4" stroke="#8B6914" strokeWidth="1.1" />
              {/* 1970  θ=90°  right */}
              <line x1="350"   y1="180"  x2="338"   y2="180"  stroke="#8B6914" strokeWidth="1.1" />
              {/* 1980  θ=135° lower-right */}
              <line x1="306.1" y1="286.1" x2="297.6" y2="277.6" stroke="#8B6914" strokeWidth="1.1" />
              {/* 1990  θ=180° bottom */}
              <line x1="200"   y1="330"  x2="200"   y2="318"  stroke="#8B6914" strokeWidth="1.1" />
              {/* 2000  θ=225° lower-left */}
              <line x1="93.9"  y1="286.1" x2="102.4" y2="277.6" stroke="#8B6914" strokeWidth="1.1" />
              {/* 2010  θ=270° left */}
              <line x1="50"    y1="180"  x2="62"    y2="180"  stroke="#8B6914" strokeWidth="1.1" />
              {/* 2020  θ=315° upper-left */}
              <line x1="93.9"  y1="73.9" x2="102.4" y2="82.4" stroke="#8B6914" strokeWidth="1.1" />

              {/* ── Minor ticks (6px, r 144→150) — 3 between each pair of decades ── */}
              {/* 1950→1960: θ=11.25°, 22.5°, 33.75° */}
              <line x1="229.3" y1="32.9" x2="228.1" y2="38.8" stroke="#8B6914" strokeWidth="0.3" />
              <line x1="257.4" y1="41.4" x2="255.1" y2="47.0" stroke="#8B6914" strokeWidth="0.3" />
              <line x1="283.3" y1="55.3" x2="280.0" y2="60.3" stroke="#8B6914" strokeWidth="0.3" />
              {/* 1960→1970: θ=56.25°, 67.5°, 78.75° */}
              <line x1="324.7" y1="96.7"  x2="319.7" y2="100.0" stroke="#8B6914" strokeWidth="0.3" />
              <line x1="338.6" y1="122.6" x2="333.0" y2="124.9" stroke="#8B6914" strokeWidth="0.3" />
              <line x1="347.1" y1="150.7" x2="341.2" y2="151.9" stroke="#8B6914" strokeWidth="0.3" />
              {/* 1970→1980: θ=101.25°, 112.5°, 123.75° */}
              <line x1="347.1" y1="209.3" x2="341.2" y2="208.1" stroke="#8B6914" strokeWidth="0.3" />
              <line x1="338.6" y1="237.4" x2="333.0" y2="235.1" stroke="#8B6914" strokeWidth="0.3" />
              <line x1="324.7" y1="263.3" x2="319.7" y2="260.0" stroke="#8B6914" strokeWidth="0.3" />
              {/* 1980→1990: θ=146.25°, 157.5°, 168.75° */}
              <line x1="283.3" y1="304.7" x2="280.0" y2="299.7" stroke="#8B6914" strokeWidth="0.3" />
              <line x1="257.4" y1="318.6" x2="255.1" y2="313.0" stroke="#8B6914" strokeWidth="0.3" />
              <line x1="229.3" y1="327.1" x2="228.1" y2="321.2" stroke="#8B6914" strokeWidth="0.3" />
              {/* 1990→2000: θ=191.25°, 202.5°, 213.75° */}
              <line x1="170.7" y1="327.1" x2="171.9" y2="321.2" stroke="#8B6914" strokeWidth="0.3" />
              <line x1="142.6" y1="318.6" x2="144.9" y2="313.0" stroke="#8B6914" strokeWidth="0.3" />
              <line x1="116.7" y1="304.7" x2="120.0" y2="299.7" stroke="#8B6914" strokeWidth="0.3" />
              {/* 2000→2010: θ=236.25°, 247.5°, 258.75° */}
              <line x1="75.3"  y1="263.3" x2="80.3"  y2="260.0" stroke="#8B6914" strokeWidth="0.3" />
              <line x1="61.4"  y1="237.4" x2="67.0"  y2="235.1" stroke="#8B6914" strokeWidth="0.3" />
              <line x1="52.9"  y1="209.3" x2="58.8"  y2="208.1" stroke="#8B6914" strokeWidth="0.3" />
              {/* 2010→2020: θ=281.25°, 292.5°, 303.75° */}
              <line x1="52.9"  y1="150.7" x2="58.8"  y2="151.9" stroke="#8B6914" strokeWidth="0.3" />
              <line x1="61.4"  y1="122.6" x2="67.0"  y2="124.9" stroke="#8B6914" strokeWidth="0.3" />
              <line x1="75.3"  y1="96.7"  x2="80.3"  y2="100.0" stroke="#8B6914" strokeWidth="0.3" />
              {/* 2020→1950: θ=326.25°, 337.5°, 348.75° */}
              <line x1="116.7" y1="55.3"  x2="120.0" y2="60.3"  stroke="#8B6914" strokeWidth="0.3" />
              <line x1="142.6" y1="41.4"  x2="144.9" y2="47.0"  stroke="#8B6914" strokeWidth="0.3" />
              <line x1="170.7" y1="32.9"  x2="171.9" y2="38.8"  stroke="#8B6914" strokeWidth="0.3" />

              {/* ── Needle — pointing to 2020 (θ=315°, r=138 → x=102.4 y=82.4) ── */}
              <line x1="200" y1="180" x2="102.4" y2="82.4" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" />

              {/* ── Inscription ── */}
              <text
                x="200"
                y="232"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontFamily: "'Source Serif Pro', 'Source Serif 4', Georgia, serif", fontSize: 9, fontStyle: 'italic', letterSpacing: '0.04em', fill: '#8B7D5E' }}
              >
                seventy-eight years
              </text>

              {/* ── Center hub (painted last, covers needle base) ── */}
              <circle cx="200" cy="180" r="22" stroke="#8B6914" strokeWidth="0.7" />
              <circle cx="200" cy="180" r="7"  fill="#8B6914" />
              <circle cx="200" cy="180" r="2.5" fill="#FAF8F3" />

            </g>

            {/* ── Decade labels — r=185 from center, placed in new 440×440 coordinate space ── */}
            <text x="220"  y="40"  textAnchor="middle" dominantBaseline="central" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '2px', fill: '#8B7D5E' }}>1950</text>
            <text x="351"  y="93"  textAnchor="middle" dominantBaseline="central" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '2px', fill: '#8B7D5E' }}>1960</text>
            <text x="405"  y="225" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '2px', fill: '#8B7D5E' }}>1970</text>
            <text x="351"  y="355" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '2px', fill: '#8B7D5E' }}>1980</text>
            <text x="220"  y="410" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '2px', fill: '#8B7D5E' }}>1990</text>
            <text x="89"   y="355" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '2px', fill: '#8B7D5E' }}>2000</text>
            <text x="35"   y="225" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '2px', fill: '#8B7D5E' }}>2010</text>
            <text x="89"   y="93"  textAnchor="middle" dominantBaseline="central" style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 500, letterSpacing: '2px', fill: '#8B7D5E' }}>2020</text>

          </svg>
        </div>
      </div>

      {/* ── Sticky decade jump nav ────────────────────────────────────────────── */}
      <DecadeNav decades={activeDecades} />

      {/* ── Decade sections ──────────────────────────────────────────────────── */}
      {activeDecades.map((decade, decadeIndex) => {
        const gens = byDecade.get(decade)!

        // Sort within decade: 911 first by year, then others alphabetically then by year
        const sorted = [...gens].sort((a, b) => {
          if (a.model === '911' && b.model !== '911') return -1
          if (b.model === '911' && a.model !== '911') return 1
          if (a.model !== b.model) return a.model.localeCompare(b.model)
          return a.year_start - b.year_start
        })

        const isLast = decadeIndex === activeDecades.length - 1

        return (
          <section
            key={decade}
            id={decade}
            style={{
              maxWidth: 1280,
              margin: '0 auto',
              padding: '56px 28px 32px',
              borderBottom: isLast ? 'none' : '0.5px solid var(--border-subtle)',
            }}
          >
            {/* Decade header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 28,
                marginBottom: 32,
                paddingBottom: 18,
                borderBottom: '0.5px solid var(--border-subtle)',
              }}
            >
              <h2
                className="shrink-0 font-serif font-normal text-text-primary"
                style={{ fontSize: 42, letterSpacing: '-0.01em' }}
              >
                {decade}
              </h2>
              {DECADE_INTROS[decade] && (
                <p
                  className="font-serif italic text-text-tertiary"
                  style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 680 }}
                >
                  {DECADE_INTROS[decade]}
                </p>
              )}
            </div>

            {/* Generation cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {sorted.map((gen) => {
                const content = getGenerationContent(gen.generation_id)
                const displayName = generationDisplayName(gen.generation_id, gen.model)
                const years =
                  gen.production_years ??
                  (gen.year_start
                    ? `${gen.year_start}${gen.year_end ? ` – ${gen.year_end}` : '–present'}`
                    : null)
                const description = content?.intro ?? gen.notes ?? null
                const hasContent = content !== null

                return (
                  <Link
                    key={gen.generation_id}
                    href={`/generations/${gen.generation_id}`}
                    className="flex flex-col border-[0.5px] border-border-default bg-bg-surface px-6 py-[22px] transition-colors hover:border-border-default"
                  >
                    <h3 className="font-serif text-[18px] font-normal text-text-primary">
                      {displayName}
                    </h3>

                    {years && (
                      <p className="mt-[6px] font-sans text-[10px] font-medium uppercase tracking-[0.06em] text-text-quaternary">
                        {years}
                      </p>
                    )}

                    {description ? (
                      <p className="mt-3 line-clamp-3 flex-1 font-serif text-[13px] italic leading-[1.55] text-text-secondary">
                        {description}
                      </p>
                    ) : (
                      <div className="flex-1" />
                    )}

                    {!hasContent && (
                      <p className="mt-3 self-start bg-bg-elevated px-2 py-[3px] font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">
                        In progress
                      </p>
                    )}

                    <p className="mt-[14px] border-t-[0.5px] border-border-subtle pt-3 font-serif text-[12px] italic text-accent-primary">
                      View →
                    </p>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}

    </main>
  )
}
