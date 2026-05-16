import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Module isolation — reset per test so the in-module cache starts empty.
// ---------------------------------------------------------------------------
let geocodeUsAddress: (
  city: string,
  state: string,
) => Promise<{ lat: number; lng: number } | null>

beforeEach(async () => {
  vi.resetModules()
  ;({ geocodeUsAddress } = await import('@/lib/geocode/census'))
})

afterEach(() => vi.restoreAllMocks())

// ---------------------------------------------------------------------------
// fetch mock helper
// ---------------------------------------------------------------------------
function mockFetch(status: number, body: unknown, throws?: Error) {
  return vi.spyOn(globalThis, 'fetch').mockImplementationOnce(async () => {
    if (throws) throw throws
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => body,
    } as Response
  })
}

const NOMINATIM_PHOENIX = [{ lat: '33.4484', lon: '-111.9400' }]
const NOMINATIM_CHANDLER = [{ lat: '33.3062031', lon: '-111.8411850' }]

describe('geocodeUsAddress (Nominatim)', () => {
  // -------------------------------------------------------------------------
  // Success path
  // -------------------------------------------------------------------------
  it('returns lat/lng for a valid city + state', async () => {
    mockFetch(200, NOMINATIM_PHOENIX)
    const result = await geocodeUsAddress('Phoenix', 'AZ')
    expect(result).toEqual({ lat: 33.4484, lng: -111.9400 })
  })

  it('returns lat/lng for Chandler, AZ — the root-cause regression case', async () => {
    mockFetch(200, NOMINATIM_CHANDLER)
    const result = await geocodeUsAddress('Chandler', 'AZ')
    expect(result).not.toBeNull()
    expect(result?.lat).toBeCloseTo(33.3062, 3)
    expect(result?.lng).toBeCloseTo(-111.8412, 3)
  })

  it('accepts lowercase state code', async () => {
    mockFetch(200, NOMINATIM_PHOENIX)
    const result = await geocodeUsAddress('Phoenix', 'az')
    expect(result).toEqual({ lat: 33.4484, lng: -111.9400 })
  })

  // -------------------------------------------------------------------------
  // Null returns — no exceptions thrown
  // -------------------------------------------------------------------------
  it('returns null for an invalid state code — no exception', async () => {
    const result = await geocodeUsAddress('Springfield', 'ZZ')
    expect(result).toBeNull()
  })

  it('returns null when Nominatim returns empty array', async () => {
    mockFetch(200, [])
    const result = await geocodeUsAddress('Notaplace', 'CA')
    expect(result).toBeNull()
  })

  it('returns null on network failure — no exception', async () => {
    mockFetch(200, null, new TypeError('fetch failed'))
    const result = await geocodeUsAddress('Phoenix', 'AZ')
    expect(result).toBeNull()
  })

  it('returns null on non-2xx HTTP status — no exception', async () => {
    mockFetch(503, null)
    const result = await geocodeUsAddress('Phoenix', 'AZ')
    expect(result).toBeNull()
  })

  it('returns null when response is not valid JSON — no exception', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementationOnce(async () => ({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('Unexpected token')
      },
    } as unknown as Response))
    const result = await geocodeUsAddress('Phoenix', 'AZ')
    expect(result).toBeNull()
  })

  it('returns null when lat/lon values are not parseable numbers', async () => {
    mockFetch(200, [{ lat: 'bad', lon: 'data' }])
    const result = await geocodeUsAddress('Phoenix', 'AZ')
    expect(result).toBeNull()
  })

  // -------------------------------------------------------------------------
  // URL and User-Agent construction
  // -------------------------------------------------------------------------
  it('sends correct Nominatim query parameters', async () => {
    const fetchSpy = mockFetch(200, NOMINATIM_PHOENIX)
    await geocodeUsAddress('Scottsdale', 'AZ')
    const calledUrl = String(fetchSpy.mock.calls[0][0])
    expect(calledUrl).toContain('nominatim.openstreetmap.org/search')
    expect(calledUrl).toContain('format=json')
    expect(calledUrl).toContain('limit=1')
    expect(calledUrl).toContain('countrycodes=us')
    expect(calledUrl).toContain('Scottsdale')
  })

  it('sends a User-Agent header as required by Nominatim ToS', async () => {
    const fetchSpy = mockFetch(200, NOMINATIM_PHOENIX)
    await geocodeUsAddress('Phoenix', 'AZ')
    const init = fetchSpy.mock.calls[0][1] as RequestInit
    const userAgent = (init?.headers as Record<string, string>)?.['User-Agent']
    expect(userAgent).toBeTruthy()
    expect(userAgent).toContain('ProjectVintage')
  })

  // -------------------------------------------------------------------------
  // Caching — spy wraps fetch before any calls so both calls are observable
  // -------------------------------------------------------------------------
  it('only calls the network once for the same city+state pair', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async () => ({
        ok: true,
        status: 200,
        json: async () => [{ lat: '36.1716', lon: '-115.1391' }],
      } as Response))

    const first = await geocodeUsAddress('Las Vegas', 'NV')
    const second = await geocodeUsAddress('Las Vegas', 'NV')

    expect(first).not.toBeNull()
    expect(second).toEqual(first)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })
})
