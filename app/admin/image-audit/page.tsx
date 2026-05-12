// DEV-ONLY — not intended for production. Reads local public/ files at render time.
// Access at http://localhost:3000/admin/image-audit

export const dynamic = 'force-dynamic'

import fs from 'fs'
import path from 'path'
import { GENERATION_DEFS } from '@/lib/porsche/models'
import { GENERATION_HERO_IMAGES, type HeroImage } from '@/lib/era-content/generation-hero-images'

// ─── Types ───────────────────────────────────────────────────────────────────

interface AttrJsonImage {
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

interface AttrJsonEntry {
  id: string
  label: string
  status: string
  needsReview: boolean
  image: AttrJsonImage
}

interface VariantJsonEntry {
  id: string
  needs_manual: boolean
  variants_found: number
}

interface AuditRow {
  genId: string
  model: string
  yearRange: string
  heroImage: HeroImage | null
  fileExistsOnDisk: boolean
  dimensions: { dw: number; dh: number; ow: number; oh: number } | null
  metadataStale: boolean
  needsManual: boolean
  sharedWith: string[]
  flags: string[]
  status: 'OK' | 'NEEDS REVIEW' | 'MISSING'
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

function loadAttrByPath(): Map<string, AttrJsonEntry> {
  const raw = fs.readFileSync(
    path.join(process.cwd(), 'scripts', 'generation-images-attribution.json'),
    'utf-8',
  )
  const entries: AttrJsonEntry[] = JSON.parse(raw)
  const map = new Map<string, AttrJsonEntry>()
  for (const e of entries) map.set(e.image.localPath, e)
  return map
}

function loadVariantById(): Map<string, VariantJsonEntry> {
  const raw = fs.readFileSync(
    path.join(process.cwd(), 'scripts', 'generation-image-variants-report.json'),
    'utf-8',
  )
  const entries: VariantJsonEntry[] = JSON.parse(raw)
  const map = new Map<string, VariantJsonEntry>()
  for (const e of entries) map.set(e.id, e)
  return map
}

function lookupVariant(genId: string, map: Map<string, VariantJsonEntry>): VariantJsonEntry | null {
  if (map.has(genId)) return map.get(genId)!
  // Strip body suffix: '987.1-boxster' → '987.1'
  const stripped = genId.replace(/-boxster$|-cayman$/, '')
  if (map.has(stripped)) return map.get(stripped)!
  // Strip sub-version: '996.1' → '996', '992.1' → '992'
  const base = stripped.replace(/\.\d$/, '')
  if (map.has(base)) return map.get(base)!
  return null
}

function buildAuditRows(): AuditRow[] {
  const attrMap = loadAttrByPath()
  const variantMap = loadVariantById()
  const publicDir = path.join(process.cwd(), 'public')

  // Map src → [genIds] to detect shared images
  const sharedMap = new Map<string, string[]>()
  for (const [id, hero] of Object.entries(GENERATION_HERO_IMAGES)) {
    const list = sharedMap.get(hero.src) ?? []
    list.push(id)
    sharedMap.set(hero.src, list)
  }

  return GENERATION_DEFS.map((def): AuditRow => {
    const { genId, model, yearStart, yearEnd } = def
    const yearRange = yearEnd > 2025 ? `${yearStart}–present` : `${yearStart}–${yearEnd}`
    const heroImage = GENERATION_HERO_IMAGES[genId] ?? null

    if (!heroImage) {
      return {
        genId, model, yearRange, heroImage: null,
        fileExistsOnDisk: false, dimensions: null, metadataStale: false,
        needsManual: false, sharedWith: [],
        flags: ['No image registered for this generation'],
        status: 'MISSING',
      }
    }

    const absPath = path.join(publicDir, heroImage.src.replace(/^\//, ''))
    const fileExistsOnDisk = fs.existsSync(absPath)

    if (!fileExistsOnDisk) {
      return {
        genId, model, yearRange, heroImage,
        fileExistsOnDisk: false, dimensions: null, metadataStale: false,
        needsManual: false, sharedWith: [],
        flags: ['File referenced in TS module but not found on disk'],
        status: 'MISSING',
      }
    }

    const attr = attrMap.get(heroImage.src) ?? null
    const dimensions = attr
      ? { dw: attr.image.downloadedWidth, dh: attr.image.downloadedHeight,
          ow: attr.image.originalWidth, oh: attr.image.originalHeight }
      : null
    const metadataStale = attr ? attr.image.credit !== heroImage.credit : false

    const variantEntry = lookupVariant(genId, variantMap)
    const needsManual = variantEntry?.needs_manual ?? false
    const sharedWith = (sharedMap.get(heroImage.src) ?? []).filter((id) => id !== genId)

    const flags: string[] = []

    if (metadataStale) {
      flags.push('Attribution JSON credit differs from TS module — metadata may be stale')
    }

    if (dimensions) {
      if (dimensions.ow < 2500) {
        flags.push(`Low source resolution: original ${dimensions.ow}×${dimensions.oh}px`)
      }
      if (dimensions.dh < 600) {
        flags.push(`Very wide crop: downloaded at ${dimensions.dw}×${dimensions.dh}px`)
      }
      if (dimensions.oh > dimensions.ow) {
        flags.push('Portrait orientation — likely poor fit for landscape hero display')
      }
    }

    // Body style mismatch via source URL
    const srcLower = heroImage.source.toLowerCase()
    if (genId.includes('cayman') && srcLower.includes('boxster') && !srcLower.includes('cayman')) {
      flags.push('Body mismatch: source URL references Boxster but generation is Cayman')
    }
    if (genId.includes('boxster') && srcLower.includes('cayman') && !srcLower.includes('boxster')) {
      flags.push('Body mismatch: source URL references Cayman but generation is Boxster')
    }

    if (sharedWith.length > 0) {
      flags.push(`Shared image with: ${sharedWith.join(', ')}`)
    }

    if (needsManual) {
      flags.push('Flagged needs_manual in variant report — no alternate variants found')
    }

    return {
      genId, model, yearRange, heroImage,
      fileExistsOnDisk, dimensions, metadataStale, needsManual, sharedWith, flags,
      status: flags.length > 0 ? 'NEEDS REVIEW' : 'OK',
    }
  })
}

// ─── Badge component ──────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AuditRow['status'] }) {
  const styles = {
    OK: 'bg-green-100 text-green-800 border border-green-300',
    'NEEDS REVIEW': 'bg-amber-100 text-amber-800 border border-amber-300',
    MISSING: 'bg-red-100 text-red-800 border border-red-300',
  }
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold tracking-wide ${styles[status]}`}>
      {status}
    </span>
  )
}

// ─── Card component ────────────────────────────────────────────────────────────

function AuditCard({ row }: { row: AuditRow }) {
  const dimLabel = row.dimensions
    ? `${row.dimensions.dw}×${row.dimensions.dh}px (orig ${row.dimensions.ow}×${row.dimensions.oh})`
    : row.heroImage ? 'Metadata unknown' : '—'

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm flex flex-col">
      {/* Image */}
      <div className="bg-gray-100 relative" style={{ height: 220 }}>
        {row.heroImage && row.fileExistsOnDisk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={row.heroImage.src}
            alt={`${row.model} ${row.genId}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={row.status} />
        </div>
      </div>

      {/* Metadata */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div>
          <code className="text-xs bg-gray-100 rounded px-1 py-0.5 text-gray-700">{row.genId}</code>
          <p className="mt-1 font-semibold text-sm text-gray-900">
            {row.model} — {row.yearRange}
          </p>
        </div>

        <dl className="text-xs text-gray-600 space-y-0.5">
          <div className="flex gap-1">
            <dt className="text-gray-400 shrink-0">File:</dt>
            <dd className="font-mono truncate">{row.heroImage?.src ?? '—'}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="text-gray-400 shrink-0">Dims:</dt>
            <dd>{dimLabel}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="text-gray-400 shrink-0">Credit:</dt>
            <dd className="truncate">{row.heroImage?.credit ?? '—'}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="text-gray-400 shrink-0">License:</dt>
            <dd>
              {row.heroImage?.license
                ? row.heroImage.licenseUrl
                  ? <a href={row.heroImage.licenseUrl} target="_blank" rel="noreferrer" className="underline text-blue-600">{row.heroImage.license}</a>
                  : row.heroImage.license
                : '—'}
            </dd>
          </div>
          <div className="flex gap-1">
            <dt className="text-gray-400 shrink-0">Source:</dt>
            <dd className="truncate">
              {row.heroImage?.source
                ? <a href={row.heroImage.source} target="_blank" rel="noreferrer" className="underline text-blue-600 truncate">Wikimedia ↗</a>
                : '—'}
            </dd>
          </div>
        </dl>

        {row.flags.length > 0 && (
          <ul className="mt-1 space-y-0.5">
            {row.flags.map((flag, i) => (
              <li key={i} className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 leading-snug">
                ⚠ {flag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ImageAuditPage() {
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="p-8 text-text-secondary">
        This admin tool is only available in development.
      </div>
    )
  }

  const rows = buildAuditRows()

  const counts = {
    ok: rows.filter((r) => r.status === 'OK').length,
    review: rows.filter((r) => r.status === 'NEEDS REVIEW').length,
    missing: rows.filter((r) => r.status === 'MISSING').length,
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Generation Hero Image Audit</h1>
          <p className="mt-1 text-sm text-gray-500">
            Dev-only • {rows.length} generations •{' '}
            <span className="text-green-700">{counts.ok} OK</span> •{' '}
            <span className="text-amber-700">{counts.review} needs review</span> •{' '}
            <span className="text-red-700">{counts.missing} missing</span>
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rows.map((row) => (
            <AuditCard key={row.genId} row={row} />
          ))}
        </div>
      </div>
    </main>
  )
}
