// ============================================================
// Comp Engine V2 — Stage 8: Methodology Text
// Computed per-run. Not surfaced in V1 UI. Stored in comp_engine_runs.
// ============================================================

interface MethodologyInputs {
  compCount: number
  generationUsed: string
  isMuseumCohort: boolean
  highVariance: boolean
  lowConfidence: boolean
}

export function buildMethodologyText(inputs: MethodologyInputs): string {
  const cohortNote = inputs.isMuseumCohort
    ? 'delivery-mileage cohort (<1,000 mi)'
    : 'standard-mileage cohort'

  const varianceNote = inputs.highVariance
    ? ' Price spread is wide — this generation shows high variance in this configuration.'
    : ''

  const confidenceNote = inputs.lowConfidence
    ? ' Low confidence due to small comp pool — treat as indicative only.'
    : ''

  return (
    `Based on ${inputs.compCount} comp${inputs.compCount !== 1 ? 's' : ''} ` +
    `(${cohortNote}): same trim, body style, and drivetrain · ` +
    `sold within 36 months · weighted by similarity and recency · ` +
    `using ${inputs.generationUsed}-specific factor weights. ` +
    `Condition assessed via observable signals; documentation and ` +
    `originality not yet factored — see comp list for individual specs.` +
    varianceNote +
    confidenceNote
  )
}
