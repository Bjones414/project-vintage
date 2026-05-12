#!/usr/bin/env tsx
// Run: npx tsx scripts/audit-generation-images.ts
// Output: /tmp/generation-image-audit.md + printed to stdout

import fs from 'fs'
import os from 'os'
import path from 'path'
import { GENERATION_DEFS } from '../lib/porsche/models'
import { GENERATION_HERO_IMAGES } from '../lib/era-content/generation-hero-images'

// ─── Types ───────────────────────────────────────────────────────────────────

interface AttrJsonImage {
  localPath: string
  downloadedWidth: number
  downloadedHeight: number
  originalWidth: number
  originalHeight: number
  credit: string
}

interface AttrJsonEntry {
  id: string
  image: AttrJsonImage
}

interface VariantJsonEntry {
  id: string
  needs_manual: boolean
  variants_found: number
}

type Status = 'OK' | 'NEEDS REVIEW' | 'MISSING'

interface AuditRow {
  genId: string
  model: string
  yearRange: string
  status: Status
  dimensions: string
  fileSize: string
  credit: string
  notes: string[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..')

function loadAttrByPath(): Map<string, AttrJsonEntry> {
  const raw = fs.readFileSync(path.join(ROOT, 'scripts', 'generation-images-attribution.json'), 'utf-8')
  const entries: AttrJsonEntry[] = JSON.parse(raw)
  const map = new Map<string, AttrJsonEntry>()
  for (const e of entries) map.set(e.image.localPath, e)
  return map
}

function loadVariantById(): Map<string, VariantJsonEntry> {
  const raw = fs.readFileSync(path.join(ROOT, 'scripts', 'generation-image-variants-report.json'), 'utf-8')
  const entries: VariantJsonEntry[] = JSON.parse(raw)
  const map = new Map<string, VariantJsonEntry>()
  for (const e of entries) map.set(e.id, e)
  return map
}

function lookupVariant(genId: string, map: Map<string, VariantJsonEntry>): VariantJsonEntry | null {
  if (map.has(genId)) return map.get(genId)!
  const stripped = genId.replace(/-boxster$|-cayman$/, '')
  if (map.has(stripped)) return map.get(stripped)!
  const base = stripped.replace(/\.\d$/, '')
  if (map.has(base)) return map.get(base)!
  return null
}

function fileSizeKb(absPath: string): string {
  try {
    const stat = fs.statSync(absPath)
    return `${Math.round(stat.size / 1024)} KB`
  } catch {
    return '—'
  }
}

// ─── Audit ────────────────────────────────────────────────────────────────────

function buildAudit(): AuditRow[] {
  const attrMap = loadAttrByPath()
  const variantMap = loadVariantById()
  const publicDir = path.join(ROOT, 'public')

  // Shared image detection
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
        genId, model, yearRange,
        status: 'MISSING',
        dimensions: '—', fileSize: '—', credit: '—',
        notes: ['No image file present — generation not registered in GENERATION_HERO_IMAGES'],
      }
    }

    const absPath = path.join(publicDir, heroImage.src.replace(/^\//, ''))
    const fileExists = fs.existsSync(absPath)

    if (!fileExists) {
      return {
        genId, model, yearRange,
        status: 'MISSING',
        dimensions: '—', fileSize: '—', credit: heroImage.credit,
        notes: ['File registered in TS module but not found on disk at ' + heroImage.src],
      }
    }

    const attr = attrMap.get(heroImage.src) ?? null
    const metadataStale = attr ? attr.image.credit !== heroImage.credit : false

    const dimensions = attr
      ? `${attr.image.downloadedWidth}×${attr.image.downloadedHeight} (orig ${attr.image.originalWidth}×${attr.image.originalHeight})`
      : 'Unknown (metadata stale or missing)'

    const variantEntry = lookupVariant(genId, variantMap)
    const needsManual = variantEntry?.needs_manual ?? false
    const sharedWith = (sharedMap.get(heroImage.src) ?? []).filter((id) => id !== genId)

    const notes: string[] = []

    if (metadataStale) {
      notes.push('Stale attribution JSON: credit in TS differs from JSON — dimensions may reflect an old image')
    }

    if (attr) {
      if (attr.image.originalWidth < 2500) {
        notes.push(`Low resolution: source was only ${attr.image.originalWidth}×${attr.image.originalHeight}px`)
      }
      if (attr.image.downloadedHeight < 600) {
        notes.push(`Very wide/thin crop: downloaded at ${attr.image.downloadedWidth}×${attr.image.downloadedHeight}px`)
      }
      if (attr.image.originalHeight > attr.image.originalWidth) {
        notes.push('Portrait orientation — poor fit for landscape hero display')
      }
    }

    const srcLower = heroImage.source.toLowerCase()
    if (genId.includes('cayman') && srcLower.includes('boxster') && !srcLower.includes('cayman')) {
      notes.push('Body style mismatch: source URL suggests Boxster, generation is Cayman')
    }
    if (genId.includes('boxster') && srcLower.includes('cayman') && !srcLower.includes('boxster')) {
      notes.push('Body style mismatch: source URL suggests Cayman, generation is Boxster')
    }

    if (sharedWith.length > 0) {
      notes.push(`Shared image with: ${sharedWith.join(', ')}`)
    }

    if (needsManual) {
      notes.push(`Flagged needs_manual in variant report (0 alternate variants found)`)
    }

    const status: Status = notes.length > 0 ? 'NEEDS REVIEW' : 'OK'

    return {
      genId, model, yearRange, status,
      dimensions,
      fileSize: fileSizeKb(absPath),
      credit: heroImage.credit,
      notes,
    }
  })
}

// ─── Markdown output ──────────────────────────────────────────────────────────

function renderMarkdown(rows: AuditRow[]): string {
  const ok = rows.filter((r) => r.status === 'OK').length
  const review = rows.filter((r) => r.status === 'NEEDS REVIEW').length
  const missing = rows.filter((r) => r.status === 'MISSING').length

  const lines: string[] = [
    '# Generation Hero Image Audit',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `**${rows.length} generations total** — ✅ ${ok} OK · ⚠️ ${review} needs review · ❌ ${missing} missing`,
    '',
    '| Generation ID | Model | Years | Status | Dimensions | File Size | Credit | Notes |',
    '|---|---|---|---|---|---|---|---|',
  ]

  for (const row of rows) {
    const statusEmoji = row.status === 'OK' ? '✅ OK' : row.status === 'NEEDS REVIEW' ? '⚠️ NEEDS REVIEW' : '❌ MISSING'
    const notesCell = row.notes.length > 0 ? row.notes.join(' / ') : '—'
    const creditTrunc = row.credit.length > 25 ? row.credit.slice(0, 22) + '…' : row.credit
    const dimsTrunc = row.dimensions.length > 35 ? row.dimensions.slice(0, 32) + '…' : row.dimensions
    lines.push(
      `| \`${row.genId}\` | ${row.model} | ${row.yearRange} | ${statusEmoji} | ${dimsTrunc} | ${row.fileSize} | ${creditTrunc} | ${notesCell} |`
    )
  }

  // Priority list — generations most likely to need replacement
  const priority = rows
    .filter((r) => r.status !== 'OK')
    .sort((a, b) => {
      // MISSING first, then sort NEEDS REVIEW by number of flags
      if (a.status === 'MISSING' && b.status !== 'MISSING') return -1
      if (b.status === 'MISSING' && a.status !== 'MISSING') return 1
      return b.notes.length - a.notes.length
    })
    .slice(0, 10)

  lines.push('')
  lines.push('## Top priority — most likely to need image replacement')
  lines.push('')
  for (let i = 0; i < priority.length; i++) {
    const row = priority[i]
    lines.push(`### ${i + 1}. \`${row.genId}\` — ${row.model} (${row.yearRange})`)
    lines.push(`**Status:** ${row.status}`)
    for (const note of row.notes) {
      lines.push(`- ${note}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const rows = buildAudit()
const markdown = renderMarkdown(rows)

// Write to system temp dir
const outPath = path.join(os.tmpdir(), 'generation-image-audit.md')
fs.writeFileSync(outPath, markdown, 'utf-8')
console.log(`\nWrote audit to ${outPath}\n`)
console.log(markdown)
