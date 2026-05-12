/**
 * scripts/curate-generation-images.ts
 *
 * One-time script: auto-curates CC-licensed hero images from Wikimedia Commons
 * for every Porsche generation defined in lib/era-content/.
 *
 * Outputs:
 *   public/images/generations/[generation_id].jpg  — downloaded images
 *   lib/era-content/generation-hero-images.ts       — attribution data module
 *   scripts/generation-images-attribution.json      — raw report
 *
 * Usage:
 *   npx tsx scripts/curate-generation-images.ts
 *
 * Wikimedia API docs: https://www.mediawiki.org/wiki/API:Main_page
 * Polite access per: https://www.mediawiki.org/wiki/API:Etiquette
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// ── Wikimedia API config ──────────────────────────────────────────────────────

const WIKIMEDIA_API = 'https://commons.wikimedia.org/w/api.php'

// Identify the bot per Wikimedia etiquette
const UA =
  'ProjectVintageImageCurator/1.0 (https://projectvintage.com; image-research-bot) Node/' +
  process.version

// ── Generation map ────────────────────────────────────────────────────────────
// Derived from decade-fallback.ts and generation-content.ts.
// Each entry: search query + human label for report.

interface GenConfig {
  query: string
  label: string
  // Optional keywords that must appear in filename to be accepted
  // (blank = accept any exterior shot)
  requireKeywords?: string[]
  // Optional keywords that disqualify a file
  denyKeywords?: string[]
}

const GENERATIONS: Record<string, GenConfig> = {
  '930': {
    query: 'Porsche 930 911 Turbo 3.3',
    label: '911 Turbo (930)',
  },
  '964': {
    query: 'Porsche 964 911 Carrera',
    label: '911 (964)',
  },
  '993': {
    query: 'Porsche 993 Carrera 911',
    label: '911 (993)',
  },
  '996': {
    query: 'Porsche 996 Carrera 911',
    label: '911 (996)',
  },
  '986': {
    query: 'Porsche Boxster 986 roadster',
    label: 'Boxster (986)',
  },
  '987.1': {
    query: 'Porsche 987 Boxster Cayman',
    label: 'Boxster/Cayman (987.1)',
  },
  '987.2': {
    query: 'Porsche 987 Boxster 2009 2010',
    label: 'Boxster/Cayman (987.2)',
  },
  '981': {
    query: 'Porsche 981 Boxster Cayman 2013',
    label: 'Boxster/Cayman (981)',
  },
  '997.1': {
    query: 'Porsche 997 Carrera 911 2005',
    label: '911 (997.1)',
  },
  '997.2': {
    query: 'Porsche 997 Carrera 911 2009',
    label: '911 (997.2)',
  },
  '991.1': {
    query: 'Porsche 991 Carrera 911 2012',
    label: '911 (991.1)',
  },
  '991.2': {
    query: 'Porsche 991.2 Carrera 911 2016',
    label: '911 (991.2)',
  },
  '992': {
    query: 'Porsche 992 Carrera 911 2019',
    label: '911 (992)',
  },
  '992.2': {
    query: 'Porsche 992 Carrera 911 2024',
    label: '911 (992.2)',
  },
  '982-cayman': {
    query: 'Porsche 718 Cayman 982',
    label: '718 Cayman (982)',
  },
  '982-boxster': {
    query: 'Porsche 718 Boxster 982',
    label: '718 Boxster (982)',
  },
}

// ── Allowed licenses ──────────────────────────────────────────────────────────

const ALLOWED_LICENSE_PATTERNS = [
  'CC BY-SA 4.0',
  'CC BY-SA 3.0',
  'CC BY-SA 2.5',
  'CC BY-SA 2.0',
  'CC BY 4.0',
  'CC BY 3.0',
  'CC BY 2.5',
  'CC BY 2.0',
  'Public Domain',
  'public domain',
  'CC0',
  'Cc-zero',
  'CC-PD',
]

// ── Types ─────────────────────────────────────────────────────────────────────

interface ImageCandidate {
  title: string          // e.g. "File:Porsche_993.jpg"
  pageUrl: string        // Wikimedia file page URL
  downloadUrl: string    // pre-scaled URL (1600px wide if available)
  originalWidth: number
  originalHeight: number
  thumbWidth: number
  thumbHeight: number
  license: string
  licenseUrl: string
  artist: string
}

interface GenerationResult {
  id: string
  label: string
  status: 'success' | 'no_candidate' | 'error'
  image?: {
    wikimediaTitle: string
    localPath: string
    downloadedWidth: number
    downloadedHeight: number
    originalWidth: number
    originalHeight: number
    credit: string
    license: string
    licenseUrl: string
    source: string
  }
  error?: string
  needsReview: boolean
}

// ── API helpers ───────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function wikiFetch(params: Record<string, string>): Promise<unknown> {
  const url = new URL(WIKIMEDIA_API)
  url.searchParams.set('format', 'json')
  url.searchParams.set('formatversion', '2')
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(15_000),
  })
  if (!res.ok) throw new Error(`Wikimedia API HTTP ${res.status}`)
  return res.json()
}

async function searchFiles(query: string): Promise<string[]> {
  const data = (await wikiFetch({
    action: 'query',
    list: 'search',
    srsearch: query,
    srnamespace: '6', // File: namespace
    srlimit: '20',
    srqiprofile: 'popular_inclinks_pv',
  })) as { query?: { search?: { title: string }[] } }

  return (data.query?.search ?? []).map((r) => r.title)
}

async function getImageInfoBatch(titles: string[]): Promise<ImageCandidate[]> {
  if (titles.length === 0) return []

  const data = (await wikiFetch({
    action: 'query',
    titles: titles.join('|'),
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '1600',
  })) as {
    query?: {
      pages?: Record<
        string,
        {
          title: string
          imageinfo?: {
            url: string
            thumburl?: string
            thumbwidth?: number
            thumbheight?: number
            width: number
            height: number
            extmetadata?: Record<string, { value: string }>
          }[]
        }
      >
    }
  }

  const results: ImageCandidate[] = []
  const pages = data.query?.pages ?? {}

  for (const page of Object.values(pages)) {
    const info = page.imageinfo?.[0]
    if (!info) continue

    const meta = info.extmetadata ?? {}
    const license = meta['LicenseShortName']?.value ?? meta['License']?.value ?? ''
    const licenseUrl = meta['LicenseUrl']?.value ?? ''
    const rawArtist = meta['Artist']?.value ?? meta['Credit']?.value ?? ''
    // Strip HTML tags from artist field
    const artist = rawArtist.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

    const thumbUrl = info.thumburl ?? info.url
    const thumbWidth = info.thumbwidth ?? info.width
    const thumbHeight = info.thumbheight ?? info.height

    const pageUrl =
      'https://commons.wikimedia.org/wiki/' +
      encodeURIComponent(page.title).replace(/%3A/g, ':').replace(/%20/g, '_')

    results.push({
      title: page.title,
      pageUrl,
      downloadUrl: thumbUrl,
      originalWidth: info.width,
      originalHeight: info.height,
      thumbWidth,
      thumbHeight,
      license,
      licenseUrl,
      artist,
    })
  }

  return results
}

// ── Filtering & scoring ───────────────────────────────────────────────────────

function isLicenseAllowed(license: string): boolean {
  if (!license) return false
  return ALLOWED_LICENSE_PATTERNS.some((p) =>
    license.toLowerCase().includes(p.toLowerCase()),
  )
}

const REJECT_KEYWORDS = [
  'interior', 'dashboard', 'cockpit', 'cabin', 'seat', 'steering',
  'engine', 'motor', 'bay',
  'badge', 'emblem', 'logo', 'script',
  'wheel', 'rim', 'tire', 'tyre', 'brake', 'caliper',
  'detail', 'close-up', 'closeup',
  'trunk', 'frunk', 'hood open',
  'rear_view_mirror',
  'crash', 'accident', 'wreck',
]

const PROFILE_KEYWORDS = ['side', 'profile', 'lateral']
const QUARTER_KEYWORDS = ['quarter', '3-4', '3_4', 'three_quarter', 'threequarter']
const STUDIO_KEYWORDS = ['studio', 'white_background', 'press', 'official']
const SHOW_KEYWORDS = ['show', 'concours', 'salon', 'exhibition', 'messe', 'ias', 'iaa']

function scoreCandidate(c: ImageCandidate): number {
  const name = c.title.toLowerCase()

  // Hard reject
  for (const kw of REJECT_KEYWORDS) {
    if (name.includes(kw)) return -9999
  }

  let score = 0

  // Resolution bonus (up to 40 pts for 2400px+)
  score += Math.min(40, Math.floor(c.originalWidth / 60))

  // Angle preference
  if (PROFILE_KEYWORDS.some((k) => name.includes(k))) score += 25
  else if (QUARTER_KEYWORDS.some((k) => name.includes(k))) score += 20

  // Clean setting
  if (STUDIO_KEYWORDS.some((k) => name.includes(k))) score += 15
  else if (SHOW_KEYWORDS.some((k) => name.includes(k))) score += 8

  // Front or rear only — mild penalty
  if (name.includes('front') && !QUARTER_KEYWORDS.some((k) => name.includes(k))) score -= 5
  if (name.includes('rear') && !QUARTER_KEYWORDS.some((k) => name.includes(k))) score -= 5

  // Modified / race / rally — mild penalty (not hard reject since some are still useful)
  if (name.includes('tuned') || name.includes('modified') || name.includes('custom')) score -= 12
  if (name.includes('race') || name.includes('racing') || name.includes('rally')) score -= 8
  if (name.includes('cup') || name.includes('gt3_cup')) score -= 8

  return score
}

// ── Download ──────────────────────────────────────────────────────────────────

async function downloadImageToFile(url: string, destPath: string): Promise<void> {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(30_000),
  })
  if (!res.ok) throw new Error(`Image download HTTP ${res.status}: ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(destPath, buf)
}

// ── Per-generation processing ─────────────────────────────────────────────────

async function processGeneration(
  id: string,
  config: GenConfig,
  outputDir: string,
): Promise<GenerationResult> {
  const base: GenerationResult = { id, label: config.label, status: 'no_candidate', needsReview: false }

  try {
    console.log(`\n  Search: "${config.query}"`)
    const titles = await searchFiles(config.query)
    await sleep(400)

    if (titles.length === 0) {
      return { ...base, status: 'no_candidate', error: 'No search results' }
    }

    // Filter to JPEG files
    const jpegTitles = titles.filter((t) => /\.(jpe?g)$/i.test(t))
    if (jpegTitles.length === 0) {
      return { ...base, status: 'no_candidate', error: 'No JPEG files in search results' }
    }

    // Fetch image info for up to 8 candidates at a time (API limit per query)
    const batch = jpegTitles.slice(0, 8)
    const candidates = await getImageInfoBatch(batch)
    await sleep(400)

    if (candidates.length === 0) {
      return { ...base, status: 'no_candidate', error: 'No image info returned' }
    }

    // Filter: license + minimum dimensions
    const MIN_WIDTH = 1200
    const MIN_HEIGHT = 600

    const licensed = candidates.filter((c) => isLicenseAllowed(c.license))
    const sizable = licensed.filter(
      (c) => c.originalWidth >= MIN_WIDTH && c.originalHeight >= MIN_HEIGHT,
    )

    // If nothing meets size threshold, fall back to any licensed image (flagged)
    const pool = sizable.length > 0 ? sizable : licensed
    const needsReview = sizable.length === 0 || pool.length === 0

    if (pool.length === 0) {
      return {
        ...base,
        status: 'no_candidate',
        error: `${candidates.length} candidates found, none with allowed license (licenses: ${candidates.map((c) => c.license || 'none').join(', ')})`,
        needsReview: true,
      }
    }

    // Score and pick best
    const scored = pool
      .map((c) => ({ c, score: scoreCandidate(c) }))
      .filter((x) => x.score > -9999) // remove hard rejects
      .sort((a, b) => b.score - a.score)

    if (scored.length === 0) {
      return { ...base, status: 'no_candidate', error: 'All candidates rejected by scoring filter', needsReview: true }
    }

    const best = scored[0].c
    const score = scored[0].score
    const flagged = needsReview || score < 5

    console.log(`  Best: ${best.title}`)
    console.log(`  Score: ${score} | ${best.originalWidth}×${best.originalHeight} | ${best.license}`)
    console.log(`  Artist: ${best.artist || '(unknown)'}`)

    // Download
    const destPath = join(outputDir, `${id}.jpg`)
    await downloadImageToFile(best.downloadUrl, destPath)
    const fileSizeKb = Math.round(require('fs').statSync(destPath).size / 1024)
    console.log(`  ✓ Saved → ${destPath} (${fileSizeKb} KB, ${best.thumbWidth}×${best.thumbHeight})`)

    return {
      ...base,
      status: 'success',
      needsReview: flagged,
      image: {
        wikimediaTitle: best.title.replace('File:', ''),
        localPath: `/images/generations/${id}.jpg`,
        downloadedWidth: best.thumbWidth,
        downloadedHeight: best.thumbHeight,
        originalWidth: best.originalWidth,
        originalHeight: best.originalHeight,
        credit: best.artist || 'Wikimedia Commons contributor',
        license: best.license,
        licenseUrl: best.licenseUrl,
        source: best.pageUrl,
      },
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(`  ✗ Error: ${message}`)
    return { ...base, status: 'error', error: message, needsReview: true }
  }
}

// ── Generate TypeScript attribution module ────────────────────────────────────

function buildAttributionModule(results: GenerationResult[]): string {
  const successful = results.filter((r) => r.status === 'success' && r.image)

  const lines: string[] = [
    '// AUTO-GENERATED by scripts/curate-generation-images.ts — do not edit by hand.',
    '// Re-run the script to refresh images or update attribution.',
    '',
    'export interface HeroImage {',
    "  src: string      // public path, e.g. '/images/generations/993.jpg'",
    '  credit: string   // photographer or uploader name',
    '  license: string  // e.g. "CC BY-SA 4.0"',
    '  licenseUrl: string',
    '  source: string   // Wikimedia file page URL',
    '}',
    '',
    'export const GENERATION_HERO_IMAGES: Record<string, HeroImage> = {',
  ]

  for (const r of successful) {
    const img = r.image!
    // Escape single quotes in attribution strings
    const credit = img.credit.replace(/'/g, "\\'")
    const license = img.license.replace(/'/g, "\\'")
    const licenseUrl = (img.licenseUrl ?? '').replace(/'/g, "\\'")
    const source = img.source.replace(/'/g, "\\'")

    lines.push(`  // ${r.label} — ${img.downloadedWidth}×${img.downloadedHeight}`)
    lines.push(`  '${r.id}': {`)
    lines.push(`    src: '${img.localPath}',`)
    lines.push(`    credit: '${credit}',`)
    lines.push(`    license: '${license}',`)
    lines.push(`    licenseUrl: '${licenseUrl}',`)
    lines.push(`    source: '${source}',`)
    lines.push(`  },`)
  }

  lines.push('}')
  lines.push('')

  return lines.join('\n')
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const cwd = process.cwd()
  const outputDir = join(cwd, 'public', 'images', 'generations')
  const attrJsonPath = join(cwd, 'scripts', 'generation-images-attribution.json')
  const attrTsPath = join(cwd, 'lib', 'era-content', 'generation-hero-images.ts')

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
    console.log(`Created: ${outputDir}`)
  }

  const genIds = Object.keys(GENERATIONS)

  console.log('═'.repeat(64))
  console.log('Project Vintage — Generation Image Curation')
  console.log(`Target: ${genIds.length} generations`)
  console.log(`Output: ${outputDir}`)
  console.log('═'.repeat(64))

  const results: GenerationResult[] = []

  for (let i = 0; i < genIds.length; i++) {
    const id = genIds[i]
    const config = GENERATIONS[id]
    console.log(`\n[${i + 1}/${genIds.length}] ${id} — ${config.label}`)
    const result = await processGeneration(id, config, outputDir)
    results.push(result)
    // Polite delay between generations
    if (i < genIds.length - 1) await sleep(600)
  }

  // Write raw attribution JSON
  writeFileSync(attrJsonPath, JSON.stringify(results, null, 2))
  console.log(`\n\nRaw attribution → ${attrJsonPath}`)

  // Write TypeScript attribution module
  const tsContent = buildAttributionModule(results)
  writeFileSync(attrTsPath, tsContent)
  console.log(`Attribution module → ${attrTsPath}`)

  // ── Print summary report ──────────────────────────────────────────────────

  const succeeded = results.filter((r) => r.status === 'success')
  const needsReview = results.filter((r) => r.status === 'success' && r.needsReview)
  const noCandidates = results.filter((r) => r.status === 'no_candidate')
  const errored = results.filter((r) => r.status === 'error')

  console.log('\n')
  console.log('═'.repeat(64))
  console.log('SUMMARY REPORT')
  console.log('═'.repeat(64))
  console.log(`\n✓  ${succeeded.length}/${genIds.length} generations got images`)
  if (needsReview.length) console.log(`⚠  ${needsReview.length} need manual review (small image or low score)`)
  if (noCandidates.length) console.log(`✗  ${noCandidates.length} had no acceptable Wikimedia candidate`)
  if (errored.length) console.log(`✗  ${errored.length} errored`)

  if (succeeded.length) {
    console.log('\n─── Images obtained ───────────────────────────────────────')
    for (const r of succeeded) {
      const img = r.image!
      const flag = r.needsReview ? '  ⚠ NEEDS REVIEW' : ''
      console.log(`\n  ${r.id} (${r.label})${flag}`)
      console.log(`  File:    ${img.wikimediaTitle}`)
      console.log(`  Size:    ${img.downloadedWidth}×${img.downloadedHeight} (original ${img.originalWidth}×${img.originalHeight})`)
      console.log(`  Credit:  ${img.credit}`)
      console.log(`  License: ${img.license}`)
      console.log(`  Source:  ${img.source}`)
    }
  }

  if (noCandidates.length || errored.length) {
    console.log('\n─── Needs manual sourcing ─────────────────────────────────')
    for (const r of [...noCandidates, ...errored]) {
      console.log(`  ${r.id}: ${r.error ?? 'unknown error'}`)
    }
  }

  console.log('\n')
  console.log('Next steps:')
  console.log('  1. Review downloaded images in public/images/generations/')
  console.log('  2. Replace any ⚠ NEEDS REVIEW images manually if needed')
  console.log('  3. The generation page already imports from generation-hero-images.ts')
  console.log('     — restart the dev server to see real images on /generations/[id]')
}

main().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})
