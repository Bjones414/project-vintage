// ============================================================
// Comp Engine V2 — Feature Registry
//
// Declarative registry of features used to build the design matrix
// for Ridge regression. Features are registered at module load time.
// The registry owns extraction and transformation metadata; the
// Ridge solver owns the math.
//
// Three initial features:
//   mileage_log        — log(mileage), negative β expected
//   age_months         — months sold before reference date
//   mileage_log_x_era  — interaction: log(mileage) × era ordinal
// ============================================================

import type { V2CompCandidate } from './types'
import { getEra, ERA_ORDINAL } from './era'

export type FeatureTransformation = 'linear' | 'log' | 'polynomial' | 'binary' | 'interaction'

export interface FeatureRegistryEntry {
  name: string
  description: string
  transformation: FeatureTransformation
  // Returns null when the feature cannot be computed (missing data).
  // Comps with null features are excluded from the design matrix.
  extractor: (comp: V2CompCandidate, referenceDate?: Date) => number | null
}

const _registry: FeatureRegistryEntry[] = []

export function registerFeature(entry: FeatureRegistryEntry): void {
  if (_registry.some(f => f.name === entry.name)) {
    throw new Error(`[feature-registry] Feature "${entry.name}" is already registered.`)
  }
  _registry.push(entry)
}

export function getFeature(name: string): FeatureRegistryEntry | undefined {
  return _registry.find(f => f.name === name)
}

export function getAllFeatures(): FeatureRegistryEntry[] {
  return [..._registry]
}

export function getRegisteredFeatureNames(): string[] {
  return _registry.map(f => f.name)
}

/**
 * Extract a complete feature vector for one comp. Returns null if any
 * feature cannot be computed — that comp is excluded from the design matrix.
 */
export function extractFeatureVector(
  comp: V2CompCandidate,
  features: FeatureRegistryEntry[],
  referenceDate?: Date,
): number[] | null {
  const values: number[] = []
  for (const feature of features) {
    const v = feature.extractor(comp, referenceDate)
    if (v === null) return null
    values.push(v)
  }
  return values
}

// ---- Feature registrations -----------------------------------------------

registerFeature({
  name: 'mileage_log',
  description:
    'Natural log of mileage in miles. Negative coefficient expected: higher mileage → lower price.',
  transformation: 'log',
  extractor: (comp) => {
    if (comp.mileage === null || comp.mileage <= 0) return null
    return Math.log(comp.mileage)
  },
})

registerFeature({
  name: 'age_months',
  description:
    'Months between the auction close date and the reference date. Captures market timing effects.',
  transformation: 'linear',
  extractor: (comp, referenceDate = new Date()) => {
    if (!comp.sold_at) return null
    const diffMs = referenceDate.getTime() - new Date(comp.sold_at).getTime()
    return diffMs / (1000 * 60 * 60 * 24 * 30.4375)
  },
})

registerFeature({
  name: 'mileage_log_x_era',
  description:
    'Interaction term: log(mileage) × era ordinal (0=air_cooled … 3=modern_turbo). ' +
    'Captures era-dependent mileage sensitivity; air-cooled era has ordinal 0 so this term is zero for air-cooled comps.',
  transformation: 'interaction',
  extractor: (comp) => {
    if (comp.mileage === null || comp.mileage <= 0) return null
    if (!comp.generation_id) return null
    try {
      const era = getEra(comp.generation_id, comp.trim_category)
      return Math.log(comp.mileage) * ERA_ORDINAL[era]
    } catch {
      return null
    }
  },
})
