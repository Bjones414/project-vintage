import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import type { DefectRecord, DefectExclude } from './types'

let cachedCatalog: DefectRecord[] | null = null

function extractYamlBlocks(markdown: string): string[] {
  const blocks: string[] = []
  const regex = /```yaml\n([\s\S]*?)```/g
  let match
  while ((match = regex.exec(markdown)) !== null) {
    blocks.push(match[1])
  }
  return blocks
}

// js-yaml parses bare numbers like 993 and 964 as number type.
// All generation/engine/trim fields must be strings for comparison to work.
function toStrings(arr: unknown[] | undefined): string[] | undefined {
  if (!arr) return undefined
  return arr.map(String)
}

function normalizeExclude(exc: DefectExclude): DefectExclude {
  return {
    ...exc,
    generation: toStrings(exc.generation as unknown[]),
    engine_family: toStrings(exc.engine_family as unknown[]),
    trim_category: toStrings(exc.trim_category as unknown[]),
  }
}

function normalizeRecord(record: DefectRecord): DefectRecord {
  const app = record.applicability
  if (!app) return record
  const excludes = app.excludes
    ? Array.isArray(app.excludes)
      ? app.excludes.map(normalizeExclude)
      : normalizeExclude(app.excludes)
    : undefined
  return {
    ...record,
    applicability: {
      ...app,
      generation: toStrings(app.generation as unknown[]),
      engine_family: toStrings(app.engine_family as unknown[]),
      trim_category: toStrings(app.trim_category as unknown[]),
      excludes,
    },
  }
}

export function loadDefectCatalog(): DefectRecord[] {
  if (cachedCatalog) return cachedCatalog

  const defectsDir = path.join(process.cwd(), 'docs', 'reference', 'defects')

  let files: string[]
  try {
    files = fs
      .readdirSync(defectsDir)
      .filter((f) => f.endsWith('.md') && f !== '00_schema.md')
  } catch {
    console.warn('[defect-catalog] docs/reference/defects not readable; returning empty catalog')
    cachedCatalog = []
    return cachedCatalog
  }

  const records: DefectRecord[] = []

  for (const file of files) {
    const content = fs.readFileSync(path.join(defectsDir, file), 'utf-8')
    const blocks = extractYamlBlocks(content)
    for (const block of blocks) {
      try {
        const parsed = yaml.load(block) as Record<string, unknown>
        if (
          parsed &&
          typeof parsed === 'object' &&
          typeof parsed.id === 'string' &&
          typeof parsed.flag_title === 'string' &&
          parsed.applicability
        ) {
          records.push(normalizeRecord(parsed as unknown as DefectRecord))
        }
      } catch (err) {
        console.warn(`[defect-catalog] Failed to parse YAML block in ${file}:`, err)
      }
    }
  }

  cachedCatalog = records
  return cachedCatalog
}
