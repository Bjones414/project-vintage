import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { decodeVin } from '../../lib/vin-decode/nhtsa'
import porscheFixture from './fixtures/nhtsa-porsche-992.json'
import ferrariFixture from './fixtures/nhtsa-ferrari-360.json'

// VINs used in tests
const PORSCHE_VIN = 'WP0AB2A9XMS200000' // 2021 911 Coupe, ErrorCode "0" from NHTSA
const FERRARI_VIN = 'ZFFYR51C000135555' // Ferrari 360, ErrorCode "1,11,14,400" — non-zero but Make/Model present

function mockOkFetch(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => body,
  } as unknown as Response
}

describe('decodeVin', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // (a) Modern Porsche VIN — clean ErrorCode "0" decode
  it('decodes a modern Porsche 911 VIN and maps all fields', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(mockOkFetch(porscheFixture))

    const result = await decodeVin(PORSCHE_VIN)

    expect(result).not.toBeNull()
    expect(result?.year).toBe(2021)
    expect(result?.make).toBe('PORSCHE')
    expect(result?.model).toBe('911')
    expect(result?.body_class).toBe('Coupe')
    expect(result?.plant).toBe('STUTTGART')
    expect(result?.transmission).toBe('Automatic')
    // EngineModel is empty in this fixture → composed from DisplacementL + EngineCylinders
    // EngineConfiguration also empty → "3.0L 6-cyl"
    expect(result?.engine).toBe('3.0L 6-cyl')
    // raw is the full NHTSA payload (not just Results[0])
    expect(result?.raw).toEqual(porscheFixture)

    expect(global.fetch).toHaveBeenCalledOnce()
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(PORSCHE_VIN),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  // (a) Whitespace / lowercase normalization
  it('strips whitespace and uppercases the VIN before decoding', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(mockOkFetch(porscheFixture))

    const result = await decodeVin(`  ${PORSCHE_VIN.toLowerCase()}  `)

    expect(result).not.toBeNull()
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(PORSCHE_VIN),
      expect.anything(),
    )
  })

  // (b) Pre-1981 short chassis number — no network call
  it('returns null for a sub-17-char chassis without hitting the network', async () => {
    const result = await decodeVin('9113201234') // 10 chars — pre-1981 911

    expect(result).toBeNull()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  // (c) Malformed VIN with disallowed characters — no network call
  it('returns null for a VIN containing I (disallowed) without hitting the network', async () => {
    const result = await decodeVin('WP0AI2A9XMS200000') // I at position 5

    expect(result).toBeNull()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns null for a VIN containing O (disallowed) without hitting the network', async () => {
    const result = await decodeVin('WP0AO2A9XMS200000') // O at position 5

    expect(result).toBeNull()
    expect(global.fetch).not.toHaveBeenCalled()
  })

  // (d) NHTSA 500 — returns null, does not throw
  it('returns null on NHTSA HTTP 500 without throwing', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    await expect(decodeVin(PORSCHE_VIN)).resolves.toBeNull()
  })

  // (d) Network timeout / AbortError — returns null, does not throw
  it('returns null on timeout (AbortError) without throwing', async () => {
    const abortErr = Object.assign(new Error('The operation was aborted'), {
      name: 'AbortError',
    })
    vi.mocked(global.fetch).mockRejectedValueOnce(abortErr)

    await expect(decodeVin(PORSCHE_VIN)).resolves.toBeNull()
  })

  // (d) Unexpected response shape — returns null
  it('returns null when NHTSA returns an empty Results array', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      mockOkFetch({ Count: 0, Results: [] }),
    )

    await expect(decodeVin(PORSCHE_VIN)).resolves.toBeNull()
  })

  // (d) Make absent from response — returns null even though HTTP 200
  it('returns null when NHTSA 200 response has no Make (unrecognized manufacturer)', async () => {
    const noMake = structuredClone(porscheFixture)
    noMake.Results[0].Make = ''

    vi.mocked(global.fetch).mockResolvedValueOnce(mockOkFetch(noMake))

    await expect(decodeVin(PORSCHE_VIN)).resolves.toBeNull()
  })

  // (e) Ferrari VIN — make-agnostic, succeeds despite non-zero NHTSA ErrorCode
  it('decodes a Ferrari 360 VIN correctly despite non-zero NHTSA error code', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(mockOkFetch(ferrariFixture))

    const result = await decodeVin(FERRARI_VIN)

    expect(result).not.toBeNull()
    expect(result?.make).toBe('FERRARI')
    expect(result?.model).toBe('360')
    expect(result?.body_class).toBe('Coupe')
    expect(result?.plant).toBe('MARANELLO')
    // EngineModel "F131 B" is present — used directly, no composition
    expect(result?.engine).toBe('F131 B')
    // ModelYear is empty in this fixture → null
    expect(result?.year).toBeNull()
    // TransmissionStyle is empty → null
    expect(result?.transmission).toBeNull()
    // Fetch was still called (VIN passed regex validation)
    expect(global.fetch).toHaveBeenCalledOnce()
  })
})
