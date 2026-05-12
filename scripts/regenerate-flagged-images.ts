/**
 * scripts/regenerate-flagged-images.ts
 *
 * Targeted re-search for generations that previously got no image, got the
 * wrong model, or whose canonical image is a poor match.
 *
 * Relaxed vs original curate-generation-images.ts:
 *   - Min dimensions: 1000×600  (was 1200×800 for variants, 1200×600 for canonicals)
 *   - Additional license types accepted: CC BY 3.0, CC BY 2.5 (were already allowed
 *     in the allowed list — this script just won't skip them)
 *   - Multiple query variations per generation (3–5 instead of 1)
 *   - Filename keyword enforcement for mismatched generations
 *   - Top-5 candidate listing for all generations regardless of outcome
 *
 * Outputs:
 *   public/images/generations/[id].jpg         — overwritten ONLY if a clearly
 *                                                better match is found
 *   scripts/regenerate-flagged-report.json     — full candidate + decision report
 *
 * Usage:
 *   npx tsx scripts/regenerate-flagged-images.ts
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const WIKIMEDIA_API = 'https://commons.wikimedia.org/w/api.php'
const UA =
  'ProjectVintageImageReSearch/1.0 (https://projectvintage.com; image-research-bot) Node/' +
  process.version

// ── Relaxed thresholds ────────────────────────────────────────────────────────

const MIN_WIDTH = 1000
const MIN_HEIGHT = 600

// ── Allowed licenses ──────────────────────────────────────────────────────────

const ALLOWED_LICENSES = [
  'CC BY-SA 4.0', 'CC BY-SA 3.0', 'CC BY-SA 2.5', 'CC BY-SA 2.0', 'CC BY-SA 1.0',
  'CC BY 4.0', 'CC BY 3.0', 'CC BY 2.5', 'CC BY 2.0',
  'Public Domain', 'public domain', 'CC0', 'Cc-zero', 'CC-PD',
]

function isLicenseAllowed(license: string): boolean {
  if (!license) return false
  return ALLOWED_LICENSES.some((p) => license.toLowerCase().includes(p.toLowerCase()))
}

// ── Reject keywords (hard reject from filename) ───────────────────────────────

const HARD_REJECT_KW = [
  'interior', 'dashboard', 'cockpit', 'cabin', 'seat', 'steering',
  'engine', 'motor', 'bay', 'badge', 'emblem', 'logo',
  'wheel', 'rim', 'tire', 'tyre', 'brake', 'caliper',
  'detail', 'close-up', 'closeup', 'trunk', 'frunk',
  'crash', 'accident', 'wreck', 'race', 'racing', 'rally',
  'cup', 'gt3_cup', 'replica', 'kit_car',
]

// ── Flagged generations config ────────────────────────────────────────────────

interface FlaggedGen {
  label: string
  queries: string[]
  // Filename must contain at least one of these (empty = no requirement)
  requireKeywordsInFilename?: string[]
  // Filename must NOT contain any of these (to avoid model mismatches)
  rejectKeywordsInFilename?: string[]
  // Expected body style — used to prefer matching images
  expectedBodyStyle: 'coupe' | 'cabriolet' | 'targa' | 'any'
  // Whether to overwrite the current image (only false for cases we want to preserve)
  shouldOverwrite: boolean
  // Reason this was flagged
  reason: string
}

const FLAGGED: Record<string, FlaggedGen> = {
  // ── CONFIRMED MISMATCH: file is a 718 Boxster Spyder RS (open-top), not Cayman ──
  '982-cayman': {
    label: '718 Cayman (982)',
    reason: 'WRONG MODEL: current image is Boxster Spyder RS (open-top), need Cayman coupe',
    shouldOverwrite: true,
    expectedBodyStyle: 'coupe',
    requireKeywordsInFilename: ['cayman'],
    rejectKeywordsInFilename: ['boxster', 'spyder', 'spider', 'roadster', 'rs_iac', 'spyder_rs'],
    queries: [
      'Porsche 718 Cayman coupe exterior',
      'Porsche 718 Cayman S 2017 exterior',
      'Porsche 718 Cayman GTS coupe side',
      'Porsche Cayman 982 coupe exterior profile',
      'Porsche 982 Cayman exterior street',
    ],
  },

  // ── POSSIBLE MISMATCH: 992 Cabrio from 2019 GIMS, likely a 992.1 not 992.2 facelift ──
  '992.2': {
    label: '911 (992.2)',
    reason: 'POSSIBLE MISMATCH: current image is "992 Cabrio GIMS 2019" (992.1), need 992.2 facelift (2024+)',
    shouldOverwrite: true,
    expectedBodyStyle: 'coupe',
    requireKeywordsInFilename: [],
    rejectKeywordsInFilename: ['gims_2019', 'gims2019'],
    queries: [
      'Porsche 911 992.2 Carrera 2024 exterior',
      'Porsche 992 facelift 2025 coupe exterior',
      'Porsche 911 2025 Carrera exterior side',
      'Porsche 992 Carrera 2024 coupe street',
      'Porsche 992.2 exterior front 3 4',
    ],
  },

  // ── POOR CANONICAL: portrait orientation, multi-car parking lot shot ──
  '981': {
    label: 'Boxster/Cayman (981)',
    reason: 'POOR QUALITY: portrait-orientation multi-car show photo, need clean single-car exterior',
    shouldOverwrite: true,
    expectedBodyStyle: 'any',
    requireKeywordsInFilename: [],
    rejectKeywordsInFilename: ['panamera', 'turbo_s'],
    queries: [
      'Porsche 981 Cayman coupe exterior side',
      'Porsche Cayman 981 exterior street 2013',
      'Porsche Boxster 981 exterior 2013 profile',
      'Porsche 981 Boxster roadster exterior 2014',
      'Porsche Cayman S 981 exterior',
    ],
  },

  // ── NO VARIANTS: classic air-cooled 930 ──
  '930': {
    label: '911 Turbo (930)',
    reason: 'NO VARIANTS: needs variant images for Targa and Cabriolet body styles',
    shouldOverwrite: false,
    expectedBodyStyle: 'coupe',
    requireKeywordsInFilename: [],
    rejectKeywordsInFilename: [],
    queries: [
      'Porsche 930 Turbo exterior coupe profile',
      'Porsche 911 Turbo 930 1980 1981 exterior',
      'Porsche 930 Turbo Targa exterior',
      'Porsche 930 Turbo Cabriolet convertible',
      'Porsche 911 Turbo 3.3 930 exterior side',
    ],
  },

  // ── NO VARIANTS: 993 ──
  '993': {
    label: '911 (993)',
    reason: 'NO VARIANTS + canonical is cabriolet: want coupe and Targa variants',
    shouldOverwrite: false,
    expectedBodyStyle: 'coupe',
    requireKeywordsInFilename: [],
    rejectKeywordsInFilename: [],
    queries: [
      'Porsche 993 Carrera coupe exterior 1996 1997',
      'Porsche 993 911 coupe side profile',
      'Porsche 993 Carrera 4S coupe exterior',
      'Porsche 993 Targa exterior',
      'Porsche 993 Carrera 2 coupe exterior',
    ],
  },

  // ── NO VARIANTS: 986 ──
  '986': {
    label: 'Boxster (986)',
    reason: 'NO VARIANTS: canonical is a side-profile, need front-3/4 and other variants',
    shouldOverwrite: false,
    expectedBodyStyle: 'cabriolet',
    requireKeywordsInFilename: [],
    rejectKeywordsInFilename: [],
    queries: [
      'Porsche Boxster 986 exterior front 3 quarter',
      'Porsche 986 Boxster roadster red blue exterior',
      'Porsche Boxster 986 S exterior 2002 2003',
      'Porsche 986 Boxster hardtop exterior',
      'Porsche Boxster 986 exterior quarter',
    ],
  },

  // ── NO VARIANTS: 987.1 ──
  '987.1': {
    label: 'Boxster/Cayman (987.1)',
    reason: 'NO VARIANTS: canonical unknown body style, need coupe and cabriolet variants',
    shouldOverwrite: false,
    expectedBodyStyle: 'coupe',
    requireKeywordsInFilename: [],
    rejectKeywordsInFilename: [],
    queries: [
      'Porsche Cayman 987 coupe exterior side 2006 2007',
      'Porsche Boxster 987 roadster exterior side',
      'Porsche Cayman S 987 exterior front quarter',
      'Porsche 987 Cayman exterior profile',
      'Porsche 987 Boxster S exterior 2007',
    ],
  },

  // ── NO VARIANTS: 987.2 ──
  '987.2': {
    label: 'Boxster/Cayman (987.2)',
    reason: 'NO VARIANTS: canonical is cabriolet, need coupe Cayman variant',
    shouldOverwrite: false,
    expectedBodyStyle: 'coupe',
    requireKeywordsInFilename: [],
    rejectKeywordsInFilename: [],
    queries: [
      'Porsche Cayman 987 2009 2010 coupe exterior',
      'Porsche 987.2 Cayman S exterior side',
      'Porsche Boxster 987.2 exterior 2009 2010 2011',
      'Porsche 987 Cayman coupe exterior 2010',
      'Porsche Boxster Cayman 987 refreshed exterior',
    ],
  },

  // ── NO VARIANTS: 997.1 ──
  '997.1': {
    label: '911 (997.1)',
    reason: 'NO VARIANTS: canonical is coupe, need Cabriolet and Targa variants',
    shouldOverwrite: false,
    expectedBodyStyle: 'cabriolet',
    requireKeywordsInFilename: [],
    rejectKeywordsInFilename: [],
    queries: [
      'Porsche 997 Carrera Cabriolet 2005 2006 2007',
      'Porsche 997 Targa exterior 2007',
      'Porsche 997 Carrera 4S exterior convertible',
      'Porsche 911 997 Cabriolet exterior profile',
      'Porsche 997 Turbo coupe exterior 2007 2008',
    ],
  },

  // ── NO VARIANTS: 997.2 ──
  '997.2': {
    label: '911 (997.2)',
    reason: 'NO VARIANTS: canonical is cabriolet/side-profile, need coupe front-3/4 variant',
    shouldOverwrite: false,
    expectedBodyStyle: 'coupe',
    requireKeywordsInFilename: [],
    rejectKeywordsInFilename: [],
    queries: [
      'Porsche 997.2 Carrera 2010 2011 coupe exterior',
      'Porsche 911 997 Carrera GTS coupe exterior',
      'Porsche 997 Turbo exterior 2009 2010 coupe',
      'Porsche 997.2 Carrera S exterior side 2010',
      'Porsche 997 facelift coupe exterior front',
    ],
  },

  // ── NO VARIANTS: 991.1 ──
  '991.1': {
    label: '911 (991.1)',
    reason: 'NO VARIANTS: canonical is cabriolet, need coupe and Targa variants',
    shouldOverwrite: false,
    expectedBodyStyle: 'coupe',
    requireKeywordsInFilename: [],
    rejectKeywordsInFilename: [],
    queries: [
      'Porsche 991 Carrera coupe exterior 2012 2013 2014',
      'Porsche 991 Carrera 4S coupe exterior',
      'Porsche 991 Targa exterior 2014 2015',
      'Porsche 911 991 coupe exterior side profile 2013',
      'Porsche 991 GTS coupe exterior',
    ],
  },

  // ── NO VARIANTS: 991.2 ──
  '991.2': {
    label: '911 (991.2)',
    reason: 'NO VARIANTS: canonical is coupe front shot, need Cabriolet and Targa variants',
    shouldOverwrite: false,
    expectedBodyStyle: 'cabriolet',
    requireKeywordsInFilename: [],
    rejectKeywordsInFilename: [],
    queries: [
      'Porsche 991.2 Carrera Cabriolet 2017 2018 exterior',
      'Porsche 991 Targa 2016 2017 2018 exterior',
      'Porsche 911 991.2 GTS Cabriolet exterior',
      'Porsche 991 Carrera 4 Cabriolet 2016 exterior',
      'Porsche 991.2 exterior convertible side',
    ],
  },

  // ── NO VARIANTS: 992 ──
  '992': {
    label: '911 (992)',
    reason: 'NO VARIANTS: canonical is coupe IAA 2025 shot, need Cabriolet and Targa variants',
    shouldOverwrite: false,
    expectedBodyStyle: 'cabriolet',
    requireKeywordsInFilename: [],
    rejectKeywordsInFilename: [],
    queries: [
      'Porsche 992 Carrera Cabriolet 2020 2021 exterior',
      'Porsche 992 Targa exterior 2020 2021',
      'Porsche 911 992 Carrera 4S Cabriolet exterior',
      'Porsche 992 Carrera convertible exterior profile',
      'Porsche 992 Cabriolet exterior 2021 2022',
    ],
  },

  // ── NO VARIANTS: 982-boxster ──
  '982-boxster': {
    label: '718 Boxster (982)',
    reason: 'NO VARIANTS: canonical is front-3/4, need side and rear variants',
    shouldOverwrite: false,
    expectedBodyStyle: 'cabriolet',
    requireKeywordsInFilename: ['boxster', '718', '982'],
    rejectKeywordsInFilename: ['cayman', 'spyder_rs', 'gt4_rs'],
    queries: [
      'Porsche 718 Boxster exterior side profile 2017',
      'Porsche 718 Boxster S exterior 2018 2019',
      'Porsche 718 Boxster GTS exterior roadster',
      'Porsche 982 Boxster exterior side 2017',
      'Porsche 718 Boxster exterior rear 3 quarter',
    ],
  },
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface ImageCandidate {
  title: string
  pageUrl: string
  downloadUrl: string
  originalWidth: number
  originalHeight: number
  thumbWidth: number
  thumbHeight: number
  license: string
  licenseUrl: string
  artist: string
  score: number
  passesFilenameCheck: boolean
}

interface GenReport {
  id: string
  label: string
  reason: string
  shouldOverwrite: boolean
  candidates: ImageCandidate[]
  top5: Pick<ImageCandidate, 'title' | 'pageUrl' | 'originalWidth' | 'originalHeight' | 'license' | 'artist' | 'score' | 'passesFilenameCheck'>[]
  decision: 'downloaded' | 'skipped_no_candidates' | 'skipped_no_overwrite' | 'skipped_no_match'
  downloaded?: {
    wikimediaTitle: string
    localPath: string
    width: number
    height: number
    credit: string
    license: string
    licenseUrl: string
    source: string
  }
  error?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

async function wikiFetch(params: Record<string, string>): Promise<unknown> {
  const url = new URL(WIKIMEDIA_API)
  url.searchParams.set('format', 'json')
  url.searchParams.set('formatversion', '2')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(20_000),
  })
  if (!res.ok) throw new Error(`Wikimedia API HTTP ${res.status}`)
  return res.json()
}

async function searchFiles(query: string, limit = 30): Promise<string[]> {
  const data = (await wikiFetch({
    action: 'query',
    list: 'search',
    srsearch: `${query} filetype:bitmap`,
    srnamespace: '6',
    srlimit: String(limit),
    srqiprofile: 'popular_inclinks_pv',
  })) as { query?: { search?: { title: string }[] } }
  return (data.query?.search ?? []).map((r) => r.title)
}

async function getImageInfoBatch(titles: string[]): Promise<Omit<ImageCandidate, 'score' | 'passesFilenameCheck'>[]> {
  if (titles.length === 0) return []
  const data = (await wikiFetch({
    action: 'query',
    titles: titles.join('|'),
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '1600',
  })) as {
    query?: {
      pages?: Record<string, {
        title: string
        imageinfo?: {
          url: string; thumburl?: string; thumbwidth?: number; thumbheight?: number
          width: number; height: number
          extmetadata?: Record<string, { value: string }>
        }[]
      }>
    }
  }

  const results: Omit<ImageCandidate, 'score' | 'passesFilenameCheck'>[] = []
  for (const page of Object.values(data.query?.pages ?? {})) {
    const info = page.imageinfo?.[0]
    if (!info) continue
    const meta = info.extmetadata ?? {}
    const license = meta['LicenseShortName']?.value ?? meta['License']?.value ?? ''
    const licenseUrl = meta['LicenseUrl']?.value ?? ''
    const rawArtist = meta['Artist']?.value ?? meta['Credit']?.value ?? ''
    const artist = rawArtist.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
    const pageUrl =
      'https://commons.wikimedia.org/wiki/' +
      encodeURIComponent(page.title).replace(/%3A/g, ':').replace(/%20/g, '_')
    results.push({
      title: page.title,
      pageUrl,
      downloadUrl: info.thumburl ?? info.url,
      originalWidth: info.width,
      originalHeight: info.height,
      thumbWidth: info.thumbwidth ?? info.width,
      thumbHeight: info.thumbheight ?? info.height,
      license,
      licenseUrl,
      artist,
    })
  }
  return results
}

function scoreCandidate(c: Omit<ImageCandidate, 'score' | 'passesFilenameCheck'>, config: FlaggedGen): number {
  const name = c.title.toLowerCase()

  // Hard reject by filename keyword
  for (const kw of HARD_REJECT_KW) {
    if (name.includes(kw)) return -9999
  }

  // Hard reject: model mismatch keywords
  for (const kw of config.rejectKeywordsInFilename ?? []) {
    if (name.includes(kw.toLowerCase())) return -9999
  }

  let score = 0

  // Resolution bonus (up to 40 pts)
  score += Math.min(40, Math.floor(c.originalWidth / 60))

  // License preference
  if (name.includes('public domain') || name.includes('cc0')) score += 15
  else if (name.includes('cc by 4.0') || name.includes('cc-by-4')) score += 10
  else if (name.includes('cc by-sa 4.0') || name.includes('cc-by-sa-4')) score += 8

  // Angle preference
  const nl = name
  if (/side|profil|seitenansicht|lateral/.test(nl)) score += 25
  else if (/three.quarter|3.4|front.quarter/.test(nl)) score += 20
  else if (/rear.quarter|heck.sch/.test(nl)) score += 12

  // Body style bonus if it matches expected
  if (config.expectedBodyStyle === 'coupe') {
    if (/coupe|coup[eé]|gt3|gt2|carrera[^4s]/.test(nl)) score += 18
    if (/cabri|convert|roadster|spider|spyder/.test(nl)) score -= 20
  } else if (config.expectedBodyStyle === 'cabriolet') {
    if (/cabri|convert|roadster|open.top/.test(nl)) score += 18
    if (/\bcoupe\b/.test(nl)) score -= 10
  }

  // Require keyword bonus
  for (const kw of config.requireKeywordsInFilename ?? []) {
    if (name.includes(kw.toLowerCase())) score += 30
  }

  // Slight penalties
  if (/tuned|modified|custom/.test(nl)) score -= 15
  if (/messe|iaa|salon|show|exhibition/.test(nl)) score += 3

  return score
}

function checkFilenameRequirements(title: string, config: FlaggedGen): boolean {
  const name = title.toLowerCase()
  const required = config.requireKeywordsInFilename ?? []
  const rejected = config.rejectKeywordsInFilename ?? []

  if (rejected.some((kw) => name.includes(kw.toLowerCase()))) return false
  if (required.length > 0 && !required.some((kw) => name.includes(kw.toLowerCase()))) return false
  return true
}

async function downloadImageToFile(url: string, destPath: string): Promise<void> {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(45_000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  writeFileSync(destPath, Buffer.from(await res.arrayBuffer()))
}

// ── Main processing ───────────────────────────────────────────────────────────

async function processGeneration(
  id: string,
  config: FlaggedGen,
  outputDir: string,
): Promise<GenReport> {
  const report: GenReport = {
    id,
    label: config.label,
    reason: config.reason,
    shouldOverwrite: config.shouldOverwrite,
    candidates: [],
    top5: [],
    decision: 'skipped_no_candidates',
  }

  const seenTitles = new Set<string>()
  const allCandidates: ImageCandidate[] = []

  for (const query of config.queries) {
    console.log(`    Query: "${query}"`)
    let titles: string[]
    try {
      titles = await searchFiles(query, 30)
      await sleep(500)
    } catch (err) {
      console.log(`    ⚠ Search error: ${err instanceof Error ? err.message : String(err)}`)
      continue
    }

    const jpegTitles = titles.filter(
      (t) => /\.(jpe?g)$/i.test(t) && !seenTitles.has(t),
    )
    if (jpegTitles.length === 0) { console.log(`    No new JPEGs`); continue }

    let infos: Omit<ImageCandidate, 'score' | 'passesFilenameCheck'>[]
    try {
      infos = await getImageInfoBatch(jpegTitles.slice(0, 12))
      await sleep(500)
    } catch (err) {
      console.log(`    ⚠ Info fetch error: ${err instanceof Error ? err.message : String(err)}`)
      continue
    }

    for (const info of infos) {
      if (seenTitles.has(info.title)) continue
      seenTitles.add(info.title)
      if (!isLicenseAllowed(info.license)) continue
      if (info.originalWidth < MIN_WIDTH || info.originalHeight < MIN_HEIGHT) continue

      const score = scoreCandidate(info, config)
      if (score <= -9999) continue

      const passesFilenameCheck = checkFilenameRequirements(info.title, config)

      allCandidates.push({ ...info, score, passesFilenameCheck })
    }
  }

  // Sort by: passesFilenameCheck desc, then score desc
  allCandidates.sort((a, b) => {
    if (a.passesFilenameCheck !== b.passesFilenameCheck) {
      return a.passesFilenameCheck ? -1 : 1
    }
    return b.score - a.score
  })

  report.candidates = allCandidates
  report.top5 = allCandidates.slice(0, 5).map(({ title, pageUrl, originalWidth, originalHeight, license, artist, score, passesFilenameCheck }) => ({
    title, pageUrl, originalWidth, originalHeight, license, artist, score, passesFilenameCheck,
  }))

  console.log(`\n  Top candidates (${allCandidates.length} total after filtering):`)
  for (const c of report.top5) {
    const flag = c.passesFilenameCheck ? '✓' : '~'
    console.log(`    ${flag} [score=${c.score.toString().padStart(3)}] ${c.originalWidth}×${c.originalHeight} · ${c.license}`)
    console.log(`       ${c.title}`)
  }

  if (allCandidates.length === 0) {
    console.log(`    ✗ No candidates after filtering`)
    report.decision = 'skipped_no_candidates'
    return report
  }

  if (!config.shouldOverwrite) {
    report.decision = 'skipped_no_overwrite'
    console.log(`    → Not overwriting canonical (shouldOverwrite=false). Variant search complete.`)
    return report
  }

  // Pick best that passes filename check, fall back to best overall
  const best = allCandidates.find((c) => c.passesFilenameCheck) ?? allCandidates[0]

  if (!best.passesFilenameCheck && (config.requireKeywordsInFilename?.length ?? 0) > 0) {
    console.log(`    ✗ No candidate passes filename keyword check — not overwriting to avoid another mismatch`)
    report.decision = 'skipped_no_match'
    return report
  }

  // Download
  const destPath = join(outputDir, `${id}.jpg`)
  try {
    console.log(`\n  Downloading: ${best.title}`)
    await downloadImageToFile(best.downloadUrl, destPath)
    console.log(`  ✓ Saved → ${id}.jpg (${best.thumbWidth}×${best.thumbHeight}, score=${best.score})`)

    report.decision = 'downloaded'
    report.downloaded = {
      wikimediaTitle: best.title.replace('File:', ''),
      localPath: `/images/generations/${id}.jpg`,
      width: best.thumbWidth,
      height: best.thumbHeight,
      credit: best.artist || 'Wikimedia Commons contributor',
      license: best.license,
      licenseUrl: best.licenseUrl,
      source: best.pageUrl,
    }
  } catch (err) {
    report.error = err instanceof Error ? err.message : String(err)
    report.decision = 'skipped_no_candidates'
    console.log(`  ✗ Download failed: ${report.error}`)
  }

  return report
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const cwd = process.cwd()
  const outputDir = join(cwd, 'public', 'images', 'generations')
  const reportPath = join(cwd, 'scripts', 'regenerate-flagged-report.json')

  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true })

  const genIds = Object.keys(FLAGGED)

  console.log('═'.repeat(68))
  console.log('Project Vintage — Targeted Image Re-Search')
  console.log(`Target: ${genIds.length} flagged generations`)
  console.log(`Min dimensions: ${MIN_WIDTH}×${MIN_HEIGHT} (relaxed)`)
  console.log('═'.repeat(68))

  const reports: GenReport[] = []

  for (let i = 0; i < genIds.length; i++) {
    const id = genIds[i]
    const config = FLAGGED[id]
    console.log(`\n[${i + 1}/${genIds.length}] ${id} — ${config.label}`)
    console.log(`  Reason: ${config.reason}`)

    const report = await processGeneration(id, config, outputDir)
    reports.push(report)

    if (i < genIds.length - 1) await sleep(800)
  }

  writeFileSync(reportPath, JSON.stringify(reports, null, 2))
  console.log(`\n\nReport → ${reportPath}`)

  // ── Summary ────────────────────────────────────────────────────────────────

  const downloaded = reports.filter((r) => r.decision === 'downloaded')
  const noMatch = reports.filter((r) => r.decision === 'skipped_no_match')
  const noCandidates = reports.filter((r) => r.decision === 'skipped_no_candidates')
  const noOverwrite = reports.filter((r) => r.decision === 'skipped_no_overwrite')

  console.log('\n')
  console.log('═'.repeat(68))
  console.log('SUMMARY')
  console.log('═'.repeat(68))
  console.log(`\n  Downloaded (canonical replaced): ${downloaded.length}`)
  console.log(`  Skipped — filename check failed: ${noMatch.length}`)
  console.log(`  Skipped — no candidates found:   ${noCandidates.length}`)
  console.log(`  Variant search only (no overwrite): ${noOverwrite.length}`)

  if (downloaded.length > 0) {
    console.log('\n  ── Images replaced ──────────────────────────────────────────')
    for (const r of downloaded) {
      console.log(`\n  ${r.id} (${r.label})`)
      console.log(`    File:    ${r.downloaded!.wikimediaTitle}`)
      console.log(`    Size:    ${r.downloaded!.width}×${r.downloaded!.height}`)
      console.log(`    Credit:  ${r.downloaded!.credit}`)
      console.log(`    License: ${r.downloaded!.license}`)
      console.log(`    Source:  ${r.downloaded!.source}`)
      console.log(`\n  → UPDATE generation-hero-images.ts for '${r.id}' with above attribution`)
    }
  }

  if (noMatch.length > 0 || noCandidates.length > 0) {
    console.log('\n  ── No replacement found ──────────────────────────────────────')
    for (const r of [...noMatch, ...noCandidates]) {
      console.log(`  ${r.id}: ${r.decision} — add to GENERATIONS_WITHOUT_IMAGE list`)
    }
  }

  console.log('\n  ── Variant-only search results ───────────────────────────────')
  for (const r of noOverwrite) {
    const best3 = r.top5.slice(0, 3)
    console.log(`\n  ${r.id} — top ${best3.length} variant candidates:`)
    for (const c of best3) {
      console.log(`    [${c.score}] ${c.originalWidth}×${c.originalHeight} · ${c.license}`)
      console.log(`    ${c.title.replace('File:', '')}`)
    }
  }

  console.log('\n')
  console.log('Next steps:')
  console.log('  1. Update lib/era-content/generation-hero-images.ts for replaced images')
  console.log('  2. Add failed generations to GENERATIONS_WITHOUT_IMAGE in generation-content.ts')
  console.log('  3. Restart dev server to verify changes')
}

main().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})
