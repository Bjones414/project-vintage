import { describe, it, expect } from 'vitest'
import { guardWrite, NEVER_PERSIST_FIELDS } from '@/lib/db/never-persist'

describe('NEVER_PERSIST_FIELDS', () => {
  it('includes engine_serial', () => {
    expect(NEVER_PERSIST_FIELDS).toContain('engine_serial')
  })

  it('does not include vin (VIN is now intentionally persisted for chassis identity)', () => {
    expect(NEVER_PERSIST_FIELDS).not.toContain('vin')
  })
})

describe('guardWrite', () => {
  it('does not throw for a clean payload', () => {
    expect(() =>
      guardWrite({ source_platform: 'bring-a-trailer', year: 1993, make: 'Porsche' }, 'test'),
    ).not.toThrow()
  })

  it('does not throw when vin is in the payload (VIN is now intentionally persisted)', () => {
    expect(() =>
      guardWrite({ make: 'Porsche', vin: 'WP0ZZZ93ZJS000001' }, 'test-caller'),
    ).not.toThrow()
  })

  it('throws loudly when engine_serial is in the payload', () => {
    expect(() =>
      guardWrite({ make: 'Porsche', engine_serial: '6123456' }, 'test-caller'),
    ).toThrow('[NEVER_PERSIST_FIELDS]')
  })

  it('throw message includes the violating field name', () => {
    expect(() =>
      guardWrite({ engine_serial: '6123456' }, 'my-caller'),
    ).toThrow(/"engine_serial"/)
  })

  it('throw message includes the caller context', () => {
    expect(() =>
      guardWrite({ engine_serial: '6123456' }, 'seed-corpus-bat'),
    ).toThrow('seed-corpus-bat')
  })

  it('does not throw when vin key is absent', () => {
    const payload: Record<string, unknown> = { source_platform: 'bring-a-trailer' }
    expect(() => guardWrite(payload, 'test')).not.toThrow()
  })

  it('does not throw when vin value is null (vin is allowed in payloads)', () => {
    expect(() =>
      guardWrite({ make: 'Porsche', vin: null }, 'test-caller'),
    ).not.toThrow()
  })
})
