// US Census Geocoder integration.
// Endpoint: https://geocoding.geo.census.gov/geocoder/locations/onelineaddress
// Free, no API key required, US addresses only.
// Spec: geocode failure → signup fails (no graceful null fallback).

const CENSUS_GEOCODER_URL =
  'https://geocoding.geo.census.gov/geocoder/locations/onelineaddress'

const US_STATES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC',
])

export class GeocodeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GeocodeError'
  }
}

export class InvalidAddressError extends GeocodeError {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidAddressError'
  }
}

export class GeocodeUnavailableError extends GeocodeError {
  constructor(message: string) {
    super(message)
    this.name = 'GeocodeUnavailableError'
  }
}

type CensusResponse = {
  result?: {
    addressMatches?: Array<{
      coordinates?: { x?: number; y?: number }
    }>
  }
}

export async function geocodeUsAddress(
  city: string,
  state: string,
): Promise<{ lat: number; lng: number }> {
  const normalizedState = state.trim().toUpperCase()
  if (!US_STATES.has(normalizedState)) {
    throw new InvalidAddressError(
      `'${state}' is not a valid 2-letter US state code`,
    )
  }

  const address = `${city.trim()}, ${normalizedState}`
  const url = new URL(CENSUS_GEOCODER_URL)
  url.searchParams.set('address', address)
  url.searchParams.set('benchmark', 'Public_AR_Current')
  url.searchParams.set('format', 'json')

  let response: Response
  try {
    response = await fetch(url.toString())
  } catch (err) {
    throw new GeocodeUnavailableError(
      `Census geocoder unreachable: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  if (!response.ok) {
    throw new GeocodeUnavailableError(
      `Census geocoder returned HTTP ${response.status}`,
    )
  }

  let body: CensusResponse
  try {
    body = (await response.json()) as CensusResponse
  } catch {
    throw new GeocodeUnavailableError(
      'Census geocoder returned a non-JSON response',
    )
  }

  const matches = body?.result?.addressMatches
  if (!Array.isArray(matches) || matches.length === 0) {
    throw new InvalidAddressError(`No geocode match found for: ${address}`)
  }

  if (matches.length > 1) {
    // Use first match per spec; log ambiguity for observability
    console.warn(
      `[geocode] Ambiguous address '${address}': ${matches.length} matches returned, using first`,
    )
  }

  const coords = matches[0]?.coordinates
  if (typeof coords?.x !== 'number' || typeof coords?.y !== 'number') {
    throw new GeocodeUnavailableError(
      'Census geocoder returned a match with no coordinates',
    )
  }

  // Census API convention: x = longitude, y = latitude
  return { lat: coords.y, lng: coords.x }
}
