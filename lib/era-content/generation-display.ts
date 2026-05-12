// Converts internal generation_id strings to user-facing display strings.
// Internal IDs include body-model suffixes for comp engine routing (e.g. '982-cayman')
// that should never be shown to users.

const BODY_MODELS = ['cayman', 'boxster'] as const
type BodyModel = typeof BODY_MODELS[number]

// Complex IDs that don't follow the numeric-hyphen-body pattern
const DISPLAY_OVERRIDES: Record<string, string> = {
  '911-pre-a':       'pre-A',
  '911-f-body':      'F-body',
  '911-g-body':      'G-body',
  '911-3.2-carrera': '3.2 Carrera',
  'g-series-2.7':    'G-series 2.7',
  '911-sc':          'SC',
}

function splitBodyModel(id: string): { base: string; model: BodyModel } | null {
  for (const model of BODY_MODELS) {
    if (id.endsWith(`-${model}`)) {
      return { base: id.slice(0, -(model.length + 1)), model }
    }
  }
  return null
}

/**
 * Short display label — strips body suffix.
 * '982-cayman' → '982', '993' → '993', '911-f-body' → 'F-body'
 */
export function formatGenerationDisplay(generationId: string): string {
  const override = DISPLAY_OVERRIDES[generationId]
  if (override) return override
  const split = splitBodyModel(generationId)
  if (split) return split.base
  return generationId
}

/**
 * Full display label — keeps body model name for context.
 * '982-cayman' → '982 Cayman', '993' → '993', '911-f-body' → 'F-body'
 * Use for headers and hero titles where body-style context adds value.
 */
export function formatGenerationFull(generationId: string): string {
  const override = DISPLAY_OVERRIDES[generationId]
  if (override) return override
  const split = splitBodyModel(generationId)
  if (split) {
    const label = split.model.charAt(0).toUpperCase() + split.model.slice(1)
    return `${split.base} ${label}`
  }
  return generationId
}
