/**
 * scripts/refetch-generation-images.ts
 *
 * Targeted re-fetch for specific generations where the original curation
 * picked the wrong subject. Applies stricter per-generation keyword guards.
 *
 * Always prints top-3 candidates per generation so the user can pick manually
 * if the automatic selection is still wrong.
 *
 * Updates:
 *   public/images/generations/[id].jpg
 *   lib/era-content/generation-hero-images.ts  (merges changed entries)
 *   scripts/generation-images-attribution.json (merges changed entries)
 *
 * Usage:
 *   npx tsx scripts/refetch-generation-images.ts
 */

import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

// ── Wikimedia API config ──────────────────────────────────────────────────────

const WIKIMEDIA_API = 'https://commons.wikimedia.org/w/api.php'
const UA =
  'ProjectVintageImageCurator/1.0 (https://projectvintage.com; image-research-bot) Node/' +
  process.version

// ── Generations to re-fetch ───────────────────────────────────────────────────

interface RefetchConfig {
  label: string
  queries: string[]           // try multiple queries in order
  requireInFilename?: string[] // at least one must appear in filename (lowercase)
  denyInFilename?: string[]   // any match = reject
}

const REFETCH: Record<string, RefetchConfig> = {
  '964': {
    label: '911 (964) — 1989-1994',
    queries: [
      'Porsche 964 Carrera side profile',
      'Porsche 911 964 exterior',
      'Porsche 964 RS Turbo',
    ],
    requireInFilename: ['964'],
    denyInFilename: ['991', '992', '993', '996', '997', '986', '987', '981', '930', 'interior', 'engine', 'wheel', 'badge'],
  },
  '987.1': {
    label: 'Boxster/Cayman (987.1) — 2005-2008',
    queries: [
      'Porsche 987 Boxster 2005 2006 2007',
      'Porsche 987 Cayman 2006 2007 2008',
      'Porsche Boxster 987 exterior',
    ],
    requireInFilename: ['987'],
    denyInFilename: ['concept', 'prototype', 'show_car', 'showcar', 'study', 'vision', 'interior', 'engine', 'wheel', 'badge'],
  },
  '982-boxster': {
    label: '718 Boxster (982) — open top',
    queries: [
      'Porsche 718 Boxster roadster convertible',
      'Porsche 982 Boxster open',
      'Porsche 718 Boxster exterior 2017 2018 2019',
    ],
    requireInFilename: ['boxster'],
    denyInFilename: ['cayman', 'interior', 'engine', 'wheel', 'badge', 'rear_view', 'detail'],
  },
}

// ── License allowlist ─────────────────────────────────────────────────────────

const ALLOWED_LICENSES = [
  'cc by-sa 4.0', 'cc by-sa 3.0', 'cc by-sa 2.5', 'cc by-sa 2.0',
  'cc by 4.0', 'cc by 3.0', 'cc by 2.5', 'cc by 2.0',
  'public domain', 'cc0', 'cc-zero', 'cc-pd',
]

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
}

// ── API helpers ───────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms))
}

async function wikiFetch(params: Record<string, string>): Promise<unknown> {
  const url = new URL(WIKIMEDIA_API)
  url.searchParams.set('format', 'json')
  url.searchParams.set('formatversion', '2')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(15_000),
  })
  if (!res.ok) throw new Error(`Wikimedia API HTTP ${res.status}`)
  return res.json()
}

async function searchFiles(query: string, limit = 30): Promise<string[]> {
  const data = (await wikiFetch({
    action: 'query',
    list: 'search',
    srsearch: query,
    srnamespace: '6',
    srlimit: String(limit),
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

  const results: ImageCandidate[] = []
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

// ── Filtering & scoring ───────────────────────────────────────────────────────

const GLOBAL_REJECT = [
  'interior', 'dashboard', 'cockpit', 'cabin', 'seat', 'steering',
  'engine', 'motor', 'bay', 'badge', 'emblem', 'logo',
  'wheel', 'rim', 'tire', 'tyre', 'brake',
  'detail', 'close-up', 'closeup',
  'crash', 'accident', 'wreck',
]

const PROFILE_KW = ['side', 'profile', 'lateral']
const QUARTER_KW = ['quarter', '3-4', '3_4', 'three_quarter']
const STUDIO_KW  = ['studio', 'white_background', 'press', 'official']
const SHOW_KW    = ['show', 'concours', 'salon', 'exhibition', 'messe', 'iaa', 'ias']

function isLicenseAllowed(license: string): boolean {
  if (!license) return false
  return ALLOWED_LICENSES.some((p) => license.toLowerCase().includes(p))
}

function passesFilenameGuards(title: string, cfg: RefetchConfig): boolean {
  const name = title.toLowerCase()

  if (cfg.requireInFilename && cfg.requireInFilename.length > 0) {
    const passes = cfg.requireInFilename.some((kw) => name.includes(kw))
    if (!passes) return false
  }

  if (cfg.denyInFilename) {
    for (const kw of cfg.denyInFilename) {
      if (name.includes(kw)) return false
    }
  }

  return true
}

function scoreCandidate(c: ImageCandidate): number {
  const name = c.title.toLowerCase()

  for (const kw of GLOBAL_REJECT) {
    if (name.includes(kw)) return -9999
  }

  let score = 0
  score += Math.min(40, Math.floor(c.originalWidth / 60))
  if (PROFILE_KW.some((k) => name.includes(k))) score += 25
  else if (QUARTER_KW.some((k) => name.includes(k))) score += 20
  if (STUDIO_KW.some((k) => name.includes(k))) score += 15
  else if (SHOW_KW.some((k) => name.includes(k))) score += 8
  if (name.includes('front') && !QUARTER_KW.some((k) => name.includes(k))) score -= 5
  if (name.includes('rear') && !QUARTER_KW.some((k) => name.includes(k))) score -= 5
  if (name.includes('tuned') || name.includes('modified')) score -= 12
  if (name.includes('race') || name.includes('racing') || name.includes('rally')) score -= 8
  if (name.includes('cup') || name.includes('gt3_cup')) score -= 8

  return score
}

async function downloadToFile(url: string, dest: string): Promise<void> {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) })
  if (!res.ok) throw new Error(`Download HTTP ${res.status}: ${url}`)
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
}

// ── Process one generation ────────────────────────────────────────────────────

interface ProcessResult {
  id: string
  status: 'success' | 'no_candidate'
  picked?: ImageCandidate & { score: number }
  top3: (ImageCandidate & { score: number; passedFilters: boolean })[]
  error?: string
}

async function processGeneration(
  id: string,
  cfg: RefetchConfig,
  outputDir: string,
): Promise<ProcessResult> {
  // Collect candidates across all queries, deduplicate by title
  const seenTitles = new Set<string>()
  const allCandidates: ImageCandidate[] = []

  for (const query of cfg.queries) {
    console.log(`  Search: "${query}"`)
    const titles = await searchFiles(query, 30)
    await sleep(350)

    // JPEG only, deduplicate
    const jpegTitles = titles.filter((t) => /\.(jpe?g)$/i.test(t) && !seenTitles.has(t))
    jpegTitles.forEach((t) => seenTitles.add(t))

    if (jpegTitles.length === 0) continue

    // Batch fetch image info (up to 10 per API call)
    for (let i = 0; i < Math.min(jpegTitles.length, 10); i += 8) {
      const batch = jpegTitles.slice(i, i + 8)
      const infos = await getImageInfoBatch(batch)
      allCandidates.push(...infos)
      await sleep(300)
    }
  }

  if (allCandidates.length === 0) {
    return { id, status: 'no_candidate', top3: [], error: 'No JPEG files found across all queries' }
  }

  // Score all candidates (annotate with pass/fail for filename guards)
  const annotated = allCandidates.map((c) => {
    const passedFilters =
      isLicenseAllowed(c.license) &&
      c.originalWidth >= 1200 &&
      c.originalHeight >= 600 &&
      passesFilenameGuards(c.title, cfg)
    const score = passedFilters ? scoreCandidate(c) : -99999
    return { ...c, score, passedFilters }
  })

  const top3 = [...annotated]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  // Pick best: must pass all filters and not be hard-rejected by scorer
  const eligible = annotated
    .filter((c) => c.passedFilters && c.score > -9999)
    .sort((a, b) => b.score - a.score)

  if (eligible.length === 0) {
    return { id, status: 'no_candidate', top3, error: 'No candidates survived filename + license + size filters' }
  }

  const best = eligible[0]
  const destPath = join(outputDir, `${id}.jpg`)
  await downloadToFile(best.downloadUrl, destPath)
  const fileSizeKb = Math.round(require('fs').statSync(destPath).size / 1024)
  console.log(`  ✓ Saved → ${destPath} (${fileSizeKb} KB, ${best.thumbWidth}×${best.thumbHeight})`)

  return { id, status: 'success', picked: best, top3 }
}

// ── Merge into generation-hero-images.ts ──────────────────────────────────────

function buildHeroEntry(id: string, c: ImageCandidate): string {
  const label = REFETCH[id].label
  const credit = c.artist.replace(/'/g, "\\'") || 'Wikimedia Commons contributor'
  const license = c.license.replace(/'/g, "\\'")
  const licenseUrl = (c.licenseUrl ?? '').replace(/'/g, "\\'")
  const source = c.pageUrl.replace(/'/g, "\\'")

  return [
    `  // ${label} — ${c.thumbWidth}×${c.thumbHeight}`,
    `  '${id}': {`,
    `    src: '/images/generations/${id}.jpg',`,
    `    credit: '${credit}',`,
    `    license: '${license}',`,
    `    licenseUrl: '${licenseUrl}',`,
    `    source: '${source}',`,
    `  },`,
  ].join('\n')
}

function mergeHeroImagesTs(tsPath: string, updates: Record<string, ImageCandidate>): void {
  let src = readFileSync(tsPath, 'utf-8')

  for (const [id, c] of Object.entries(updates)) {
    const newEntry = buildHeroEntry(id, c)
    // Match the existing entry block: from '  // ... label' comment to closing '},'
    // Use a regex that matches the id key line through the closing brace
    const escapedId = id.replace('.', '\\.').replace('-', '\\-')
    const pattern = new RegExp(
      `  // [^\n]*\\n  '${escapedId}': \\{[\\s\\S]*?  \\},`,
      'm',
    )
    if (pattern.test(src)) {
      src = src.replace(pattern, newEntry)
    } else {
      // Key not found — append before closing brace of the Record
      src = src.replace(/^(\})\s*$/, `${newEntry}\n$1`)
    }
  }

  writeFileSync(tsPath, src, 'utf-8')
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const cwd = process.cwd()
  const outputDir = join(cwd, 'public', 'images', 'generations')
  const attrTsPath = join(cwd, 'lib', 'era-content', 'generation-hero-images.ts')
  const attrJsonPath = join(cwd, 'scripts', 'generation-images-attribution.json')

  const genIds = Object.keys(REFETCH)

  console.log('═'.repeat(64))
  console.log('Project Vintage — Targeted Image Re-fetch')
  console.log(`Target: ${genIds.length} generations (964, 987.1, 982-boxster)`)
  console.log('═'.repeat(64))

  const updates: Record<string, ImageCandidate> = {}
  const results: ProcessResult[] = []

  for (let i = 0; i < genIds.length; i++) {
    const id = genIds[i]
    const cfg = REFETCH[id]
    console.log(`\n[${i + 1}/${genIds.length}] ${id} — ${cfg.label}`)
    const result = await processGeneration(id, cfg, outputDir)
    results.push(result)
    if (result.status === 'success' && result.picked) {
      updates[id] = result.picked
    }
    if (i < genIds.length - 1) await sleep(600)
  }

  // ── Summary report ──────────────────────────────────────────────────────────

  console.log('\n')
  console.log('═'.repeat(64))
  console.log('RESULTS')
  console.log('═'.repeat(64))

  for (const r of results) {
    const cfg = REFETCH[r.id]
    console.log(`\n━━ ${r.id} — ${cfg.label}`)

    if (r.status === 'success' && r.picked) {
      const p = r.picked
      console.log(`  AUTO-SELECTED (score: ${p.score}):`)
      console.log(`    File:    ${p.title}`)
      console.log(`    Size:    ${p.thumbWidth}×${p.thumbHeight} (original ${p.originalWidth}×${p.originalHeight})`)
      console.log(`    Credit:  ${p.artist || '(unknown)'}`)
      console.log(`    License: ${p.license}`)
      console.log(`    Source:  ${p.pageUrl}`)
    } else {
      console.log(`  ✗ NO CANDIDATE — ${r.error}`)
    }

    console.log(`\n  TOP 3 CANDIDATES (for manual review):`)
    if (r.top3.length === 0) {
      console.log('    (none found)')
    } else {
      r.top3.forEach((c, idx) => {
        const flags: string[] = []
        if (!c.passedFilters) flags.push('FILTERED OUT')
        if (c.score <= -9999) flags.push('SCORER REJECTED')
        const flagStr = flags.length ? ` [${flags.join(', ')}]` : ''
        console.log(`\n    #${idx + 1}${flagStr}`)
        console.log(`      File:    ${c.title}`)
        console.log(`      Size:    ${c.originalWidth}×${c.originalHeight}`)
        console.log(`      License: ${c.license}`)
        console.log(`      Score:   ${c.score}`)
        console.log(`      Source:  ${c.pageUrl}`)
        console.log(`      Artist:  ${c.artist || '(unknown)'}`)
      })
    }
  }

  // ── Write outputs ────────────────────────────────────────────────────────────

  if (Object.keys(updates).length > 0) {
    mergeHeroImagesTs(attrTsPath, updates)
    console.log(`\n✓ Updated attribution module: ${attrTsPath}`)

    // Merge into attribution JSON
    let existingJson: Record<string, unknown>[] = []
    if (existsSync(attrJsonPath)) {
      try { existingJson = JSON.parse(readFileSync(attrJsonPath, 'utf-8')) } catch { /* ok */ }
    }
    for (const r of results.filter((x) => x.status === 'success')) {
      const idx = existingJson.findIndex((e: unknown) => (e as { id?: string }).id === r.id)
      const newEntry = {
        id: r.id,
        label: REFETCH[r.id].label,
        status: 'success',
        needsReview: false,
        image: r.picked ? {
          wikimediaTitle: r.picked.title.replace('File:', ''),
          localPath: `/images/generations/${r.id}.jpg`,
          downloadedWidth: r.picked.thumbWidth,
          downloadedHeight: r.picked.thumbHeight,
          originalWidth: r.picked.originalWidth,
          originalHeight: r.picked.originalHeight,
          credit: r.picked.artist || 'Wikimedia Commons contributor',
          license: r.picked.license,
          licenseUrl: r.picked.licenseUrl,
          source: r.picked.pageUrl,
        } : undefined,
      }
      if (idx >= 0) existingJson[idx] = newEntry
      else existingJson.push(newEntry)
    }
    writeFileSync(attrJsonPath, JSON.stringify(existingJson, null, 2))
    console.log(`✓ Updated attribution JSON: ${attrJsonPath}`)
  } else {
    console.log('\n⚠ No images were saved — all generations need manual sourcing.')
  }

  console.log('\nDone.\n')
}

main().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})
