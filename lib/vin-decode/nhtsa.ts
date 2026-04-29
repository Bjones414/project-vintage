const NHTSA_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues'

// 17 characters, no I / O / Q (invalid per ISO 3779)
const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/

export interface VinDecodeResult {
  year: number | null
  make: string | null
  model: string | null
  body_class: string | null
  engine: string | null         // EngineModel, or composed from displacement + cylinders
  plant: string | null          // PlantCity, falls back to PlantCountry
  transmission: string | null   // TransmissionStyle — commonly empty for Porsche
  raw: unknown                  // full NHTSA JSON payload, stored as vin_decode_raw
}

function str(val: unknown): string | null {
  if (typeof val !== 'string') return null
  const v = val.trim()
  return v === '' ? null : v
}

export async function decodeVin(vin: string): Promise<VinDecodeResult | null> {
  const normalized = vin.trim().toUpperCase()

  // Pre-1981 chassis numbers are shorter than 17 chars; modern VINs with I/O/Q are
  // malformed. Return null cleanly — do not call NHTSA for either case.
  if (!VIN_RE.test(normalized)) {
    return null
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8_000)

  let data: unknown
  try {
    const res = await fetch(
      `${NHTSA_BASE}/${encodeURIComponent(normalized)}?format=json`,
      { signal: controller.signal },
    )
    if (!res.ok) {
      console.error(`[vin-decode] NHTSA HTTP ${res.status} for VIN ${normalized}`)
      return null
    }
    data = await res.json()
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error(`[vin-decode] NHTSA timed out for VIN ${normalized}`)
    } else {
      console.error(`[vin-decode] NHTSA fetch failed for VIN ${normalized}:`, err)
    }
    return null
  } finally {
    clearTimeout(timeoutId)
  }

  // Validate outer response shape
  const outer = data as Record<string, unknown>
  if (!Array.isArray(outer?.Results) || outer.Results.length === 0) {
    console.error(`[vin-decode] Unexpected NHTSA response shape for VIN ${normalized}`)
    return null
  }

  const r = outer.Results[0] as Record<string, unknown>

  // NHTSA returns ErrorCode "0" for a clean decode. Non-zero codes like "1" (check-digit
  // mismatch) or "14" (partial decode) are common for European-spec VINs and still carry
  // valid Make/Model/Plant data. Log the code, but only hard-fail if Make is absent —
  // that indicates a truly undecodeable VIN where nothing useful is in the response.
  const errorCode = str(r['ErrorCode'])
  if (errorCode !== null && errorCode !== '0') {
    console.error(`[vin-decode] NHTSA ErrorCode "${errorCode}" for VIN ${normalized}`)
  }

  const make = str(r['Make'])
  if (make === null) {
    return null
  }

  const get = (key: string) => str(r[key])

  // Year
  const yearStr = get('ModelYear')
  const year = yearStr !== null ? (Number(yearStr) || null) : null

  // Engine: prefer EngineModel; compose fallback from configuration + displacement + cylinders
  let engine = get('EngineModel')
  if (engine === null) {
    const parts: string[] = []
    const config = get('EngineConfiguration')
    const disp = get('DisplacementL')
    const cyl = get('EngineCylinders')
    if (config) parts.push(config)
    if (disp) parts.push(`${disp}L`)
    if (cyl) parts.push(`${cyl}-cyl`)
    engine = parts.length > 0 ? parts.join(' ') : null
  }

  return {
    year,
    make,
    model: get('Model'),
    body_class: get('BodyClass'),
    engine,
    plant: get('PlantCity') ?? get('PlantCountry'),
    transmission: get('TransmissionStyle'),
    raw: data,
  }
}
