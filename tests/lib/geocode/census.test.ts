import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  geocodeUsAddress,
  InvalidAddressError,
  GeocodeUnavailableError,
} from '@/lib/geocode/census'

// ---------------------------------------------------------------------------
// fetch mock helpers
// ---------------------------------------------------------------------------
function mockFetch(
  status: number,
  body: unknown,
  throws?: Error,
) {
  return vi.spyOn(globalThis, 'fetch').mockImplementationOnce(async () => {
    if (throws) throw throws
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    } as Response
  })
}

const HAPPY_BODY = {
  result: {
    addressMatches: [
      { coordinates: { x: -111.9400, y: 33.4484 } }, // Phoenix, AZ (lng, lat)
    ],
  },
}

const AMBIGUOUS_BODY = {
  result: {
    addressMatches: [
      { coordinates: { x: -111.9400, y: 33.4484 } },
      { coordinates: { x: -112.0000, y: 33.5000 } },
    ],
  },
}

const NO_MATCH_BODY = {
  result: { addressMatches: [] },
}

afterEach(() => vi.restoreAllMocks())

describe('geocodeUsAddress', () => {
  it('returns lat/lng for a valid city + state', async () => {
    mockFetch(200, HAPPY_BODY)
    const result = await geocodeUsAddress('Phoenix', 'AZ')
    expect(result).toEqual({ lat: 33.4484, lng: -111.9400 })
  })

  it('accepts lowercase state code', async () => {
    mockFetch(200, HAPPY_BODY)
    const result = await geocodeUsAddress('Phoenix', 'az')
    expect(result).toEqual({ lat: 33.4484, lng: -111.9400 })
  })

  it('throws InvalidAddressError for an invalid state code', async () => {
    await expect(geocodeUsAddress('Springfield', 'ZZ')).rejects.toThrow(
      InvalidAddressError,
    )
  })

  it('throws InvalidAddressError when no matches returned', async () => {
    mockFetch(200, NO_MATCH_BODY)
    await expect(geocodeUsAddress('Notaplace', 'CA')).rejects.toThrow(
      InvalidAddressError,
    )
  })

  it('uses first match and warns when response is ambiguous', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mockFetch(200, AMBIGUOUS_BODY)
    const result = await geocodeUsAddress('Tempe', 'AZ')
    expect(result).toEqual({ lat: 33.4484, lng: -111.9400 })
    expect(warnSpy).toHaveBeenCalledOnce()
    expect(warnSpy.mock.calls[0][0]).toContain('Ambiguous')
  })

  it('throws GeocodeUnavailableError on network failure', async () => {
    mockFetch(200, null, new TypeError('fetch failed'))
    await expect(geocodeUsAddress('Phoenix', 'AZ')).rejects.toThrow(
      GeocodeUnavailableError,
    )
  })

  it('throws GeocodeUnavailableError on non-2xx HTTP status', async () => {
    mockFetch(503, null)
    await expect(geocodeUsAddress('Phoenix', 'AZ')).rejects.toThrow(
      GeocodeUnavailableError,
    )
  })

  it('throws GeocodeUnavailableError when response is not valid JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementationOnce(async () => ({
      ok: true,
      status: 200,
      json: async () => { throw new SyntaxError('Unexpected token') },
    } as Response))
    await expect(geocodeUsAddress('Phoenix', 'AZ')).rejects.toThrow(
      GeocodeUnavailableError,
    )
  })

  it('throws GeocodeUnavailableError when match has no coordinates', async () => {
    const body = { result: { addressMatches: [{ coordinates: null }] } }
    mockFetch(200, body)
    await expect(geocodeUsAddress('Phoenix', 'AZ')).rejects.toThrow(
      GeocodeUnavailableError,
    )
  })

  it('builds the Census API URL with correct query parameters', async () => {
    const fetchSpy = mockFetch(200, HAPPY_BODY)
    await geocodeUsAddress('Scottsdale', 'AZ')
    const calledUrl = String(fetchSpy.mock.calls[0][0])
    expect(calledUrl).toContain('benchmark=Public_AR_Current')
    expect(calledUrl).toContain('format=json')
    expect(calledUrl).toContain('address=')
    expect(calledUrl).toContain('Scottsdale')
  })
})
