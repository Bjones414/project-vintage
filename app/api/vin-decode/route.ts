import { NextResponse } from 'next/server'
import { decodeVin } from '@/lib/vin-decode/nhtsa'
import { ALL_MODELS } from '@/lib/porsche/models'

// NHTSA → our internal model name.
// The 718 Boxster/Cayman launched in 2017 but some NHTSA records may carry the
// pre-718 model name. Map those only when the year confirms the 982 generation.
const NHTSA_MODEL_ALIASES: Record<string, string> = {
  'Boxster': '718 Boxster',
  'Cayman': '718 Cayman',
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const vin = searchParams.get('vin')

  if (!vin) {
    return NextResponse.json({ error: 'vin required' }, { status: 400 })
  }

  const result = await decodeVin(vin)

  if (!result) {
    return NextResponse.json({ error: 'Could not decode VIN' }, { status: 422 })
  }

  const year = result.year ? String(result.year) : undefined
  const yearNum = result.year ?? 0

  // Map NHTSA model to our internal model name.
  // Direct match first; fall back to alias only when the alias is valid for the decoded year.
  let model: string | undefined
  if (result.model) {
    if (ALL_MODELS.includes(result.model)) {
      model = result.model
    } else {
      const alias = NHTSA_MODEL_ALIASES[result.model]
      if (alias && ALL_MODELS.includes(alias)) {
        // Only use the alias if the year falls in the 718-era (2017+)
        if (yearNum >= 2017) model = alias
      }
    }
  }

  // Return transmission only when it matches a value the form accepts.
  const VALID_TRANSMISSIONS = new Set(['Manual', 'Automatic', 'PDK', 'Tiptronic'])
  const transmission =
    result.transmission && VALID_TRANSMISSIONS.has(result.transmission)
      ? result.transmission
      : undefined

  // Trim is intentionally omitted — NHTSA returns a composite string like
  // "Carrera S/4S/GTS/4 GTS" that does not map cleanly to our single-trim taxonomy.
  // Users select trim manually after year + model are prefilled.

  return NextResponse.json({
    ...(year ? { year } : {}),
    ...(model ? { model } : {}),
    ...(transmission ? { transmission } : {}),
  })
}
