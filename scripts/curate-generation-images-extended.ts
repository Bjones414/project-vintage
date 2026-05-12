/**
 * scripts/curate-generation-images-extended.ts
 *
 * One-time script: fetches 2–3 additional CC-licensed image variants per
 * Porsche generation from Wikimedia Commons. The canonical image for each
 * generation (already in public/images/generations/[id].jpg) is preserved
 * and never overwritten.
 *
 * Outputs:
 *   public/images/generations/[id]-v2.jpg, -v3.jpg, -v4.jpg  — variant images
 *   lib/era-content/generation-image-variants.ts               — full variant registry
 *
 * Usage:
 *   npx tsx scripts/curate-generation-images-extended.ts
 *
 * Wikimedia etiquette: https://www.mediawiki.org/wiki/API:Etiquette
 */

import { writeFileSync, mkdirSync, existsSync, statSync } from 'fs'
import { join } from 'path'

// ── Wikimedia API ─────────────────────────────────────────────────────────────

const WIKIMEDIA_API = 'https://commons.wikimedia.org/w/api.php'
const UA =
  'ProjectVintageImageCuratorExtended/1.0 (https://projectvintage.com; image-research-bot) Node/' +
  process.version

// ── Canonical images (from generation-hero-images.ts) ─────────────────────────
// Used to exclude canonicals from variant selection.

const CANONICAL_WIKI_FILES: Record<string, string> = {
  '930':        'File:Porsche_911_Turbo_(Typ_930-3.3)-_6301917.jpg',
  '964':        'File:Classic_Moto_Show_2014_(116).JPG',
  '993':        'File:1997_Porsche_911_Carrera_(993)_convertible_(2011-11-18)_01.jpg',
  '996':        'File:Porsche_911_GT3_Touring,_IAA_2017,_Frankfurt_(1Y7A2766).jpg',
  '986':        'File:Porsche_986_Boxster_side_20070522.jpg',
  '987.1':      'File:Porsche_987_at_Legendy_2018_in_Prague.jpg',
  '987.2':      "File:'10_Porsche_Boxster_(MIAS).JPG",
  '981':        'File:2013_Porsche_Panamera_Turbo_S,_Cayman,_Cayman_S,_Boxster_(8402948837).jpg',
  '997.1':      'File:2005_Porsche_911_Carrera_by_Panache_BS_O24.jpg',
  '997.2':      'File:2009_Porsche_911_Carrera_4S_Cabrio_(997)_(3947380399).jpg',
  '991.1':      'File:Porsche_911_Carrera_S_Cabriolet_(7644732598).jpg',
  '991.2':      'File:Porsche_911_Carrera_4S_-_przód_(MSP16).jpg',
  '992':        'File:Porsche_992_Carrera_GTS_Spirit_70_IAA_2025_DSC_1981.jpg',
  '992.2':      'File:Porsche_992_Cabrio,_GIMS_2019,_Le_Grand-Saconnex_(GIMS9993).jpg',
  '982-cayman': 'File:Porsche_718_Boxster_Spyder_RS_IAA_2023_1X7A0535.jpg',
  '982-boxster': 'File:Porsche_ABA-982J2_718_Boxster_GTS_(23052112161).jpg',
}

// Canonical attribution (for building the full variant registry)
const CANONICAL_ATTRIBUTION: Record<string, {
  credit: string; license: string; licenseUrl: string; source: string;
  body_style: string; color: string; angle: string
}> = {
  '930':        { credit: 'Ermell', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Porsche_911_Turbo_(Typ_930-3.3)-_6301917.jpg', body_style: 'coupe', color: 'unknown', angle: 'front-3-4' },
  '964':        { credit: 'Dawid783', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Classic_Moto_Show_2014_(116).JPG', body_style: 'coupe', color: 'unknown', angle: 'front-3-4' },
  '993':        { credit: 'OSX', license: 'Public domain', licenseUrl: '', source: 'https://commons.wikimedia.org/wiki/File:1997_Porsche_911_Carrera_(993)_convertible_(2011-11-18)_01.jpg', body_style: 'cabriolet', color: 'silver', angle: 'front-3-4' },
  '996':        { credit: 'Matti Blume', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Porsche_911_GT3_Touring,_IAA_2017,_Frankfurt_(1Y7A2766).jpg', body_style: 'coupe', color: 'white', angle: 'front-3-4' },
  '986':        { credit: 'Rudolf Stricker', license: 'CC BY-SA 3.0', licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/', source: 'https://commons.wikimedia.org/wiki/File:Porsche_986_Boxster_side_20070522.jpg', body_style: 'cabriolet', color: 'silver', angle: 'side-profile' },
  '987.1':      { credit: 'Jiří Sedláček', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Porsche_987_at_Legendy_2018_in_Prague.jpg', body_style: 'unknown', color: 'unknown', angle: 'front-3-4' },
  '987.2':      { credit: 'Bull-Doser', license: 'Public domain', licenseUrl: '', source: "https://commons.wikimedia.org/wiki/File:'10_Porsche_Boxster_(MIAS).JPG", body_style: 'cabriolet', color: 'unknown', angle: 'front-3-4' },
  '981':        { credit: 'Sarah Larson', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0', source: 'https://commons.wikimedia.org/wiki/File:2013_Porsche_Panamera_Turbo_S,_Cayman,_Cayman_S,_Boxster_(8402948837).jpg', body_style: 'cabriolet', color: 'unknown', angle: 'front-3-4' },
  '997.1':      { credit: 'MrWalkr', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:2005_Porsche_911_Carrera_by_Panache_BS_O24.jpg', body_style: 'coupe', color: 'silver', angle: 'front-3-4' },
  '997.2':      { credit: 'Spanish Coches', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0', source: 'https://commons.wikimedia.org/wiki/File:2009_Porsche_911_Carrera_4S_Cabrio_(997)_(3947380399).jpg', body_style: 'cabriolet', color: 'unknown', angle: 'side-profile' },
  '991.1':      { credit: 'Alexandre Prévot', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0', source: 'https://commons.wikimedia.org/wiki/File:Porsche_911_Carrera_S_Cabriolet_(7644732598).jpg', body_style: 'cabriolet', color: 'silver', angle: 'side-profile' },
  '991.2':      { credit: 'Jakub "Flyz1" Maciejewski', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Porsche_911_Carrera_4S_-_przód_(MSP16).jpg', body_style: 'coupe', color: 'unknown', angle: 'front' },
  '992':        { credit: 'Alexander-93', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Porsche_992_Carrera_GTS_Spirit_70_IAA_2025_DSC_1981.jpg', body_style: 'coupe', color: 'unknown', angle: 'front-3-4' },
  '992.2':      { credit: 'Matti Blume', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Porsche_992_Cabrio,_GIMS_2019,_Le_Grand-Saconnex_(GIMS9993).jpg', body_style: 'cabriolet', color: 'unknown', angle: 'front-3-4' },
  '982-cayman': { credit: 'Alexander-93', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Porsche_718_Boxster_Spyder_RS_IAA_2023_1X7A0535.jpg', body_style: 'coupe', color: 'unknown', angle: 'front-3-4' },
  '982-boxster': { credit: '先従隗始', license: 'CC0', licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', source: 'https://commons.wikimedia.org/wiki/File:Porsche_ABA-982J2_718_Boxster_GTS_(23052112161).jpg', body_style: 'cabriolet', color: 'unknown', angle: 'front-3-4' },
}

// ── Per-generation variant search queries ──────────────────────────────────────

interface GenVariantConfig {
  label: string
  queries: string[]  // tried in order until we have enough variants
}

const GENERATIONS: Record<string, GenVariantConfig> = {
  '930': {
    label: '911 Turbo (930)',
    queries: [
      'Porsche 930 Turbo 1980 coupe exterior',
      'Porsche 911 Turbo 930 1979 1981 side',
      'Porsche 930 Turbo Cabriolet Targa',
    ],
  },
  '964': {
    label: '911 (964)',
    queries: [
      'Porsche 964 Carrera exterior side profile',
      'Porsche 964 Carrera Cabriolet convertible',
      'Porsche 964 Carrera 4 Targa coupe',
    ],
  },
  '993': {
    label: '911 (993)',
    queries: [
      'Porsche 993 Carrera coupe exterior',
      'Porsche 993 Carrera Targa coupe 1996',
      'Porsche 993 Turbo exterior red blue',
    ],
  },
  '996': {
    label: '911 (996)',
    queries: [
      'Porsche 996 Carrera 911 exterior coupe',
      'Porsche 996 Carrera Cabriolet convertible',
      'Porsche 996 Carrera 4S exterior',
    ],
  },
  '986': {
    label: 'Boxster (986)',
    queries: [
      'Porsche Boxster 986 exterior red blue',
      'Porsche 986 Boxster coupe hardtop',
      'Porsche Boxster 986 2001 2002 exterior',
    ],
  },
  '987.1': {
    label: 'Boxster/Cayman (987.1)',
    queries: [
      'Porsche Cayman 987 coupe exterior',
      'Porsche Boxster 987 Cayman S exterior',
      'Porsche 987 Cayman coupe silver blue',
    ],
  },
  '987.2': {
    label: 'Boxster/Cayman (987.2)',
    queries: [
      'Porsche Boxster 987 2009 2010 exterior',
      'Porsche Cayman 987 2009 coupe exterior',
      'Porsche 987.2 Boxster S exterior',
    ],
  },
  '981': {
    label: 'Boxster/Cayman (981)',
    queries: [
      'Porsche Cayman 981 coupe exterior',
      'Porsche Boxster 981 exterior side',
      'Porsche 981 Cayman GTS exterior',
    ],
  },
  '997.1': {
    label: '911 (997.1)',
    queries: [
      'Porsche 997 Carrera S coupe exterior side',
      'Porsche 997 Carrera Cabriolet convertible exterior',
      'Porsche 997 Carrera 4S Targa exterior',
    ],
  },
  '997.2': {
    label: '911 (997.2)',
    queries: [
      'Porsche 997.2 Carrera 911 coupe exterior',
      'Porsche 997 Carrera GTS coupe exterior 2011',
      'Porsche 997 Turbo exterior 2010',
    ],
  },
  '991.1': {
    label: '911 (991.1)',
    queries: [
      'Porsche 991 Carrera coupe exterior side',
      'Porsche 991 Carrera S Targa exterior',
      'Porsche 991 Carrera GTS exterior 2015',
    ],
  },
  '991.2': {
    label: '911 (991.2)',
    queries: [
      'Porsche 991.2 Carrera coupe exterior',
      'Porsche 991 Carrera Cabriolet 2017 exterior',
      'Porsche 991 GTS Targa exterior 2018',
    ],
  },
  '992': {
    label: '911 (992)',
    queries: [
      'Porsche 992 Carrera coupe exterior side',
      'Porsche 992 Carrera Cabriolet exterior',
      'Porsche 992 Carrera 4S exterior 2020',
    ],
  },
  '992.2': {
    label: '911 (992.2)',
    queries: [
      'Porsche 992 Carrera 2024 exterior coupe',
      'Porsche 992.2 911 exterior 2025',
      'Porsche 992 facelift coupe exterior',
    ],
  },
  '982-cayman': {
    label: '718 Cayman (982)',
    queries: [
      'Porsche 718 Cayman coupe exterior side',
      'Porsche 718 Cayman S exterior 2017',
      'Porsche 718 Cayman GTS exterior',
    ],
  },
  '982-boxster': {
    label: '718 Boxster (982)',
    queries: [
      'Porsche 718 Boxster exterior side profile',
      'Porsche 718 Boxster S exterior 2017',
      'Porsche 718 Boxster GTS roadster exterior',
    ],
  },
}

// ── Allowed licenses ───────────────────────────────────────────────────────────

const ALLOWED_LICENSE_PATTERNS = [
  'CC BY-SA 4.0', 'CC BY-SA 3.0', 'CC BY-SA 2.5', 'CC BY-SA 2.0',
  'CC BY 4.0', 'CC BY 3.0', 'CC BY 2.5', 'CC BY 2.0',
  'Public Domain', 'public domain', 'CC0', 'Cc-zero', 'CC-PD',
]

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ImageVariant {
  src: string
  credit: string
  license: string
  licenseUrl: string
  source: string
  body_style: 'coupe' | 'cabriolet' | 'targa' | 'unknown'
  color: string
  angle: 'front-3-4' | 'side-profile' | 'rear-3-4' | 'front' | 'rear' | 'unknown'
  is_canonical: boolean
}

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

interface VariantResult {
  wikimediaTitle: string
  localPath: string
  downloadedWidth: number
  downloadedHeight: number
  credit: string
  license: string
  licenseUrl: string
  source: string
  body_style: 'coupe' | 'cabriolet' | 'targa' | 'unknown'
  color: string
  angle: 'front-3-4' | 'side-profile' | 'rear-3-4' | 'front' | 'rear' | 'unknown'
  slot: string   // 'v2', 'v3', 'v4'
}

interface GenerationVariantReport {
  id: string
  label: string
  canonical_body_style: string
  canonical_color: string
  variants_found: number
  variants: VariantResult[]
  errors: string[]
  needs_manual: boolean
}

// ── Helpers ────────────────────────────────────────────────────────────────────

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

async function searchFiles(query: string, limit = 25): Promise<string[]> {
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

function isLicenseAllowed(license: string): boolean {
  if (!license) return false
  return ALLOWED_LICENSE_PATTERNS.some((p) => license.toLowerCase().includes(p.toLowerCase()))
}

// ── Metadata inference from filename ──────────────────────────────────────────

type BodyStyle = 'coupe' | 'cabriolet' | 'targa' | 'unknown'
type Angle = 'front-3-4' | 'side-profile' | 'rear-3-4' | 'front' | 'rear' | 'unknown'

function inferBodyStyle(title: string): BodyStyle {
  const n = title.toLowerCase()
  if (/cabri|cabriolet|convertible|roadster|spider|spyder|open[-_]top/.test(n)) return 'cabriolet'
  if (/targa/.test(n)) return 'targa'
  if (/coupe|coup[eé]|gt3|gt2|turbo|carrera[^4]/.test(n)) return 'coupe'
  return 'unknown'
}

const COLOR_MAP: [RegExp, string][] = [
  [/\bred\b|rojo|rouge|rosso|rot\b/i, 'red'],
  [/\bblue\b|bleu|blau|blu\b|blauw/i, 'blue'],
  [/\bsilver\b|silber|argent|aluminium/i, 'silver'],
  [/\bgrey\b|\bgray\b|grau|gris\b/i, 'grey'],
  [/\bblack\b|schwarz|noir|nero/i, 'black'],
  [/\bwhite\b|weiss|weiß|blanc|bianco/i, 'white'],
  [/\byellow\b|gelb|jaune|giallo/i, 'yellow'],
  [/\bgreen\b|grün|gruen|vert\b|verde/i, 'green'],
  [/\borange\b/i, 'orange'],
  [/\bpurple\b|violet|lila/i, 'purple'],
  [/\bguardsman\b|\bmexico\b|\bindischrot\b/i, 'red'],   // Porsche-specific
  [/\bkobalt\b|\bmarinblau\b/i, 'blue'],
  [/\bplatin\b|\bplatinum\b/i, 'silver'],
  [/\bagate\b|\bgranit\b/i, 'grey'],
]

function inferColor(title: string): string {
  for (const [re, color] of COLOR_MAP) {
    if (re.test(title)) return color
  }
  return 'unknown'
}

function inferAngle(title: string): Angle {
  const n = title.toLowerCase()
  if (/rear[-_]?3[-_]?4|rear.*quarter|hinten.*schräg/.test(n)) return 'rear-3-4'
  if (/front[-_]?3[-_]?4|vorn.*schräg|three[-_]?quarter/.test(n)) return 'front-3-4'
  if (/\bside\b|\bprofil\b|seitenansicht|lateral/.test(n)) return 'side-profile'
  if (/\bfront\b|\bvorne\b|\bvorn\b/.test(n)) return 'front'
  if (/\brear\b|\bheck\b|\bback\b/.test(n)) return 'rear'
  return 'unknown'
}

// ── Candidate scoring ──────────────────────────────────────────────────────────

const HARD_REJECT_KW = [
  'interior', 'dashboard', 'cockpit', 'cabin', 'seat', 'steering',
  'engine', 'motor', 'bay', 'badge', 'emblem', 'logo',
  'wheel', 'rim', 'tire', 'tyre', 'brake', 'caliper',
  'detail', 'close-up', 'closeup', 'trunk', 'frunk',
  'crash', 'accident', 'wreck', 'race', 'racing', 'rally',
  'cup', 'gt3_cup', 'replica', 'kit_car',
]

function scoreCandidate(
  c: ImageCandidate,
  canonicalBodyStyle: string,
  canonicalColor: string,
  existingVariantBodyStyles: string[],
  existingVariantColors: string[],
): number {
  const name = c.title.toLowerCase()

  for (const kw of HARD_REJECT_KW) {
    if (name.includes(kw)) return -9999
  }

  let score = 0

  // Resolution bonus
  score += Math.min(40, Math.floor(c.originalWidth / 60))

  const bodyStyle = inferBodyStyle(c.title)
  const color = inferColor(c.title)
  const angle = inferAngle(c.title)

  // Angle preference
  if (angle === 'side-profile') score += 25
  else if (angle === 'front-3-4') score += 20
  else if (angle === 'rear-3-4') score += 15
  else if (angle === 'front') score += 5
  else if (angle === 'rear') score += 5

  // Diversity bonus — prefer different body style than canonical
  if (bodyStyle !== 'unknown' && bodyStyle !== canonicalBodyStyle) score += 25
  // Prefer body styles not yet covered in existing variants
  if (bodyStyle !== 'unknown' && !existingVariantBodyStyles.includes(bodyStyle)) score += 15

  // Color diversity bonus
  if (color !== 'unknown' && color !== canonicalColor) score += 12
  if (color !== 'unknown' && !existingVariantColors.includes(color)) score += 8

  // Modified / show setting — slight penalty for cluttered backgrounds
  if (/tuned|modified|custom/.test(name)) score -= 15
  if (/messe|iaa|salon|show|exhibition/.test(name)) score += 5
  if (/studio|press|official/.test(name)) score += 10

  return score
}

// ── Download ───────────────────────────────────────────────────────────────────

async function downloadImageToFile(url: string, destPath: string): Promise<void> {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA },
    signal: AbortSignal.timeout(30_000),
  })
  if (!res.ok) throw new Error(`Image download HTTP ${res.status}: ${url}`)
  writeFileSync(destPath, Buffer.from(await res.arrayBuffer()))
}

// ── Per-generation processing ──────────────────────────────────────────────────

const MIN_WIDTH = 1200
const MIN_HEIGHT = 600
const MAX_VARIANTS = 3

async function processGeneration(
  id: string,
  config: GenVariantConfig,
  outputDir: string,
  canonicalFile: string | undefined,
): Promise<GenerationVariantReport> {
  const canonAttr = CANONICAL_ATTRIBUTION[id]
  const canonBodyStyle = canonAttr?.body_style ?? 'unknown'
  const canonColor = canonAttr?.color ?? 'unknown'
  const errors: string[] = []
  const variants: VariantResult[] = []
  const seenTitles = new Set<string>([canonicalFile ?? '__none__'])

  for (const query of config.queries) {
    if (variants.length >= MAX_VARIANTS) break

    console.log(`    Query: "${query}"`)
    let titles: string[]
    try {
      titles = await searchFiles(query, 25)
      await sleep(400)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      errors.push(`Search failed for "${query}": ${msg}`)
      console.log(`    ⚠ Search error: ${msg}`)
      continue
    }

    // JPEG only
    const jpegTitles = titles.filter(
      (t) => /\.(jpe?g)$/i.test(t) && !seenTitles.has(t),
    )
    if (jpegTitles.length === 0) {
      console.log(`    No new JPEGs from this query`)
      continue
    }

    let candidates: ImageCandidate[]
    try {
      candidates = await getImageInfoBatch(jpegTitles.slice(0, 10))
      await sleep(500)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      errors.push(`Image info fetch failed: ${msg}`)
      continue
    }

    // Filter: license + dimensions
    const licensed = candidates.filter((c) => isLicenseAllowed(c.license))
    const sizable = licensed.filter(
      (c) => c.originalWidth >= MIN_WIDTH && c.originalHeight >= MIN_HEIGHT,
    )
    const pool = sizable.length > 0 ? sizable : licensed

    // Score with diversity context
    const existingBodyStyles = variants.map((v) => v.body_style)
    const existingColors = variants.map((v) => v.color)

    const scored = pool
      .filter((c) => !seenTitles.has(c.title))
      .map((c) => ({
        c,
        score: scoreCandidate(c, canonBodyStyle, canonColor, existingBodyStyles, existingColors),
      }))
      .filter((x) => x.score > -9999)
      .sort((a, b) => b.score - a.score)

    // Take candidates from this query (don't over-fill with one query's results)
    const remaining = MAX_VARIANTS - variants.length
    const toUse = scored.slice(0, remaining)

    for (const { c, score } of toUse) {
      const slot = `v${variants.length + 2}` // v2, v3, v4
      const localFilename = `${id}-${slot}.jpg`
      const destPath = join(outputDir, localFilename)

      // Skip download if already exists
      if (existsSync(destPath)) {
        const kb = Math.round(statSync(destPath).size / 1024)
        console.log(`    ↩ ${slot}: already exists (${kb} KB) — ${c.title}`)
      } else {
        try {
          await downloadImageToFile(c.downloadUrl, destPath)
          const kb = Math.round(statSync(destPath).size / 1024)
          console.log(`    ✓ ${slot}: ${c.title} (${c.thumbWidth}×${c.thumbHeight}, score=${score}, ${kb} KB)`)
          await sleep(300)
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          errors.push(`Download failed for ${c.title}: ${msg}`)
          console.log(`    ✗ ${slot}: Download failed — ${msg}`)
          continue
        }
      }

      seenTitles.add(c.title)
      variants.push({
        wikimediaTitle: c.title.replace('File:', ''),
        localPath: `/images/generations/${localFilename}`,
        downloadedWidth: c.thumbWidth,
        downloadedHeight: c.thumbHeight,
        credit: c.artist || 'Wikimedia Commons contributor',
        license: c.license,
        licenseUrl: c.licenseUrl,
        source: c.pageUrl,
        body_style: inferBodyStyle(c.title),
        color: inferColor(c.title),
        angle: inferAngle(c.title),
        slot,
      })
    }
  }

  return {
    id,
    label: config.label,
    canonical_body_style: canonBodyStyle,
    canonical_color: canonColor,
    variants_found: variants.length,
    variants,
    errors,
    needs_manual: variants.length < 2,
  }
}

// ── Output module builder ──────────────────────────────────────────────────────

function buildVariantsModule(reports: GenerationVariantReport[]): string {
  const lines: string[] = [
    '// AUTO-GENERATED by scripts/curate-generation-images-extended.ts — do not edit by hand.',
    '// Re-run the script to refresh variant images or update attribution.',
    '',
    "export type ImageVariantBodyStyle = 'coupe' | 'cabriolet' | 'targa' | 'unknown'",
    "export type ImageVariantAngle = 'front-3-4' | 'side-profile' | 'rear-3-4' | 'front' | 'rear' | 'unknown'",
    '',
    'export interface ImageVariant {',
    "  src: string          // public path, e.g. '/images/generations/993.jpg'",
    '  credit: string       // photographer or uploader name',
    '  license: string',
    '  licenseUrl: string',
    '  source: string       // Wikimedia file page URL',
    '  body_style: ImageVariantBodyStyle',
    '  color: string        // inferred color, or "unknown"',
    '  angle: ImageVariantAngle',
    '  is_canonical: boolean',
    '}',
    '',
    'export const GENERATION_IMAGE_VARIANTS: Record<string, ImageVariant[]> = {',
  ]

  for (const report of reports) {
    const canon = CANONICAL_ATTRIBUTION[report.id]
    lines.push(`  // ${report.label}`)
    lines.push(`  '${report.id}': [`)

    // Canonical entry
    if (canon) {
      lines.push(`    {`)
      lines.push(`      src: '/images/generations/${report.id}.jpg',`)
      lines.push(`      credit: ${JSON.stringify(canon.credit)},`)
      lines.push(`      license: ${JSON.stringify(canon.license)},`)
      lines.push(`      licenseUrl: ${JSON.stringify(canon.licenseUrl)},`)
      lines.push(`      source: ${JSON.stringify(canon.source)},`)
      lines.push(`      body_style: ${JSON.stringify(canon.body_style)},`)
      lines.push(`      color: ${JSON.stringify(canon.color)},`)
      lines.push(`      angle: ${JSON.stringify(canon.angle)},`)
      lines.push(`      is_canonical: true,`)
      lines.push(`    },`)
    }

    // Variant entries
    for (const v of report.variants) {
      lines.push(`    {`)
      lines.push(`      src: ${JSON.stringify(v.localPath)},`)
      lines.push(`      credit: ${JSON.stringify(v.credit)},`)
      lines.push(`      license: ${JSON.stringify(v.license)},`)
      lines.push(`      licenseUrl: ${JSON.stringify(v.licenseUrl)},`)
      lines.push(`      source: ${JSON.stringify(v.source)},`)
      lines.push(`      body_style: ${JSON.stringify(v.body_style)},`)
      lines.push(`      color: ${JSON.stringify(v.color)},`)
      lines.push(`      angle: ${JSON.stringify(v.angle)},`)
      lines.push(`      is_canonical: false,`)
      lines.push(`    },`)
    }

    lines.push(`  ],`)
  }

  lines.push('}')
  lines.push('')
  lines.push('/**')
  lines.push(' * Returns the best image for a given generation + optional body style preference.')
  lines.push(' * Falls back to the canonical image if no variant matches.')
  lines.push(' */')
  lines.push('export function pickGenerationImage(')
  lines.push('  generationId: string,')
  lines.push("  preferBodyStyle?: ImageVariantBodyStyle,",)
  lines.push('): ImageVariant | null {')
  lines.push('  const variants = GENERATION_IMAGE_VARIANTS[generationId]')
  lines.push('  if (!variants || variants.length === 0) return null')
  lines.push('  if (preferBodyStyle && preferBodyStyle !== "unknown") {')
  lines.push('    const match = variants.find(')
  lines.push('      (v) => v.body_style === preferBodyStyle && !v.is_canonical,')
  lines.push('    )')
  lines.push('    if (match) return match')
  lines.push('  }')
  lines.push('  // Fall back to canonical')
  lines.push('  return variants.find((v) => v.is_canonical) ?? variants[0]')
  lines.push('}')
  lines.push('')

  return lines.join('\n')
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const cwd = process.cwd()
  const outputDir = join(cwd, 'public', 'images', 'generations')
  const variantsTsPath = join(cwd, 'lib', 'era-content', 'generation-image-variants.ts')

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  const genIds = Object.keys(GENERATIONS)
  console.log('═'.repeat(68))
  console.log('Project Vintage — Extended Image Curation (Variants)')
  console.log(`Target: ${genIds.length} generations × up to ${MAX_VARIANTS} variants each`)
  console.log(`Output dir: ${outputDir}`)
  console.log('═'.repeat(68))

  const reports: GenerationVariantReport[] = []

  for (let i = 0; i < genIds.length; i++) {
    const id = genIds[i]
    const config = GENERATIONS[id]
    const canonFile = CANONICAL_WIKI_FILES[id]
    console.log(`\n[${i + 1}/${genIds.length}] ${id} — ${config.label}`)
    console.log(`  Canonical: ${canonFile ?? '(none registered)'}`)
    const report = await processGeneration(id, config, outputDir, canonFile)
    reports.push(report)
    if (i < genIds.length - 1) await sleep(800)
  }

  // Write variants TypeScript module
  const tsContent = buildVariantsModule(reports)
  writeFileSync(variantsTsPath, tsContent)
  console.log(`\n\nVariants module → ${variantsTsPath}`)

  // Write raw JSON report
  const jsonPath = join(cwd, 'scripts', 'generation-image-variants-report.json')
  writeFileSync(jsonPath, JSON.stringify(reports, null, 2))
  console.log(`Raw report → ${jsonPath}`)

  // ── Summary report ────────────────────────────────────────────────────────

  const totalVariants = reports.reduce((s, r) => s + r.variants_found, 0)
  const fullCoverage = reports.filter((r) => r.variants_found >= 2)
  const weakCoverage = reports.filter((r) => r.variants_found < 2)
  const noVariants = reports.filter((r) => r.variants_found === 0)

  console.log('\n')
  console.log('═'.repeat(68))
  console.log('SUMMARY REPORT')
  console.log('═'.repeat(68))
  console.log(`\nTotal variant images fetched: ${totalVariants}`)
  console.log(`Generations with 2+ variants: ${fullCoverage.length}/${genIds.length}`)
  console.log(`Generations with <2 variants:  ${weakCoverage.length}/${genIds.length}  ← flag for manual`)
  console.log(`Generations with 0 variants:   ${noVariants.length}/${genIds.length}`)

  console.log('\n─── Per-generation breakdown ──────────────────────────────────────')
  for (const r of reports) {
    const flag = r.needs_manual ? '  ⚠ NEEDS MANUAL' : ''
    const bodyStyles = [
      `${r.canonical_body_style} (canonical)`,
      ...r.variants.map((v) => `${v.body_style} (${v.slot})`),
    ].join(', ')
    const colors = [
      r.canonical_color !== 'unknown' ? r.canonical_color : null,
      ...r.variants.map((v) => (v.color !== 'unknown' ? v.color : null)),
    ].filter(Boolean).join(', ') || 'none identified'

    console.log(`\n  ${r.id} (${r.label})${flag}`)
    console.log(`  Variants: ${r.variants_found}/${MAX_VARIANTS}`)
    console.log(`  Body styles: ${bodyStyles}`)
    console.log(`  Colors: ${colors}`)

    for (const v of r.variants) {
      console.log(`    ${v.slot}: ${v.wikimediaTitle}`)
      console.log(`          ${v.downloadedWidth}×${v.downloadedHeight} · ${v.license} · ${v.body_style} · ${v.color} · ${v.angle}`)
    }
    if (r.errors.length > 0) {
      for (const e of r.errors) console.log(`  ✗ ${e}`)
    }
  }

  if (weakCoverage.length > 0) {
    console.log('\n─── Weak coverage — recommend manual sourcing ─────────────────────')
    for (const r of weakCoverage) {
      console.log(`  ${r.id} (${r.label}): ${r.variants_found} variant(s) found`)
      console.log(`    Body styles not covered: Wikimedia search returned limited results`)
    }
  }

  console.log('\n─── Body style coverage by generation ─────────────────────────────')
  for (const r of reports) {
    const covered = new Set([
      r.canonical_body_style,
      ...r.variants.map((v) => v.body_style),
    ])
    covered.delete('unknown')
    const coveredStr = covered.size > 0 ? Array.from(covered).join(', ') : '(all unknown)'
    console.log(`  ${r.id.padEnd(12)} ${coveredStr}`)
  }

  console.log('\n')
  console.log('Next steps:')
  console.log('  1. Review downloaded images in public/images/generations/')
  console.log('  2. For ⚠ generations: source 1-2 additional images manually from')
  console.log('     Wikimedia Commons and save as [id]-v3.jpg / [id]-v4.jpg')
  console.log('  3. Update lib/era-content/generation-image-variants.ts for manual')
  console.log('     additions following the existing record format')
  console.log('  4. The pickGenerationImage() helper is ready to import in the')
  console.log('     analyze page for body-style-matched hero selection')
}

main().catch((err) => {
  console.error('\nFatal error:', err)
  process.exit(1)
})
