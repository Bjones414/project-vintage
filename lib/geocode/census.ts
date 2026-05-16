// City+state geocoder using Nominatim (OpenStreetMap).
// Free, no API key. Nominatim ToS requires a descriptive User-Agent.
// Returns null on any failure — callers must handle null gracefully.
//
// Replaced Census Geocoder: onelineaddress endpoint requires a full street
// address and returns empty addressMatches for city-only queries.

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'ProjectVintage/1.0 (alpha)'

const US_STATES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC',
])

type NominatimResult = { lat: string; lon: string }

const cache = new Map<string, { lat: number; lng: number }>()
const CACHE_MAX = 1000

export async function geocodeUsAddress(
  city: string,
  state: string,
): Promise<{ lat: number; lng: number } | null> {
  const normalizedState = state.trim().toUpperCase()
  if (!US_STATES.has(normalizedState)) return null

  const cacheKey = `${city.trim().toLowerCase()}|${normalizedState}`
  const cached = cache.get(cacheKey)
  if (cached !== undefined) return cached

  const url = new URL(NOMINATIM_URL)
  url.searchParams.set('q', `${city.trim()}, ${normalizedState}`)
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', '1')
  url.searchParams.set('countrycodes', 'us')

  let results: NominatimResult[]
  try {
    const response = await fetch(url.toString(), {
      headers: { 'User-Agent': USER_AGENT },
    })
    if (!response.ok) return null
    results = (await response.json()) as NominatimResult[]
  } catch {
    return null
  }

  if (!Array.isArray(results) || results.length === 0) return null

  const lat = parseFloat(results[0].lat)
  const lng = parseFloat(results[0].lon)
  if (isNaN(lat) || isNaN(lng)) return null

  const coords = { lat, lng }
  if (cache.size >= CACHE_MAX) {
    const firstKey = cache.keys().next().value
    if (firstKey !== undefined) cache.delete(firstKey)
  }
  cache.set(cacheKey, coords)

  return coords
}
