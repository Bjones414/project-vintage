import { decodeVin } from '@/lib/vin-decode/nhtsa'

const RECALLS_BASE = 'https://api.nhtsa.gov/recalls/recallsByVehicle'

export interface NhtsaRecall {
  campaignNumber: string
  component: string
  summary: string
  consequence: string
  remedy: string
  reportReceivedDate: string // YYYY-MM-DD
  manufacturer: string
}

function str(val: unknown): string {
  return typeof val === 'string' ? val.trim() : ''
}

// /Date(1163116800000)/ is the WCF/Microsoft JSON date format NHTSA uses
function parseMsDate(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  const match = /\/Date\((\d+)\)\//.exec(raw)
  if (!match) return raw
  return new Date(parseInt(match[1], 10)).toISOString().slice(0, 10)
}

function mapRow(r: Record<string, unknown>): NhtsaRecall {
  return {
    campaignNumber: str(r['NHTSACampaignNumber']),
    component: str(r['Component']),
    summary: str(r['Summary']),
    consequence: str(r['Consequence']),
    remedy: str(r['Remedy']),
    reportReceivedDate: parseMsDate(r['ReportReceivedDate']),
    manufacturer: str(r['Manufacturer']),
  }
}

export async function getRecallsByMakeModelYear(
  make: string,
  model: string,
  year: number,
): Promise<NhtsaRecall[]> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8_000)

  let data: unknown
  try {
    const url = new URL(RECALLS_BASE)
    url.searchParams.set('make', make)
    url.searchParams.set('model', model)
    url.searchParams.set('modelYear', String(year))

    const res = await fetch(url.toString(), { signal: controller.signal })
    if (!res.ok) {
      console.error(`[recalls] NHTSA HTTP ${res.status} for ${make} ${model} ${year}`)
      return []
    }
    data = await res.json()
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error(`[recalls] NHTSA timed out for ${make} ${model} ${year}`)
    } else {
      console.error(`[recalls] NHTSA fetch failed for ${make} ${model} ${year}:`, err)
    }
    return []
  } finally {
    clearTimeout(timeoutId)
  }

  const outer = data as Record<string, unknown>
  if (!Array.isArray(outer?.results)) return []

  return (outer.results as Record<string, unknown>[]).map(mapRow)
}

// Convenience: decodes VIN first, then fetches recalls. In the analyze route,
// prefer getRecallsByMakeModelYear directly since decoded data is already available.
export async function getRecallsByVin(vin: string): Promise<NhtsaRecall[] | null> {
  const decoded = await decodeVin(vin)
  if (!decoded?.make || !decoded?.model || decoded.year === null) return null
  return getRecallsByMakeModelYear(decoded.make, decoded.model, decoded.year)
}
