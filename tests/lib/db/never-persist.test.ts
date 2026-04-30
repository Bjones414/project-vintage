import { describe, it, expect } from 'vitest'
import { guardWrite, NEVER_PERSIST_FIELDS } from '@/lib/db/never-persist'

describe('NEVER_PERSIST_FIELDS', () => {
  it('includes vin and engine_serial', () => {
    expect(NEVER_PERSIST_FIELDS).toContain('vin')
    expect(NEVER_PERSIST_FIELDS).toContain('engine_serial')
  })
})

describe('guardWrite', () => {
  it('does not throw for a clean payload', () => {
    expect(() =>
      guardWrite({ source_platform: 'bring-a-trailer', year: 1993, make: 'Porsche' }, 'test'),
    ).not.toThrow()
  })

  it('throws loudly when vin is in the payload', () => {
    expect(() =>
      guardWrite({ make: 'Porsche', vin: 'WP0ZZZ93ZJS000001' }, 'test-caller'),
    ).toThrow('[NEVER_PERSIST_FIELDS]')
  })

  it('throws loudly when engine_serial is in the payload', () => {
    expect(() =>
      guardWrite({ make: 'Porsche', engine_serial: '6123456' }, 'test-caller'),
    ).toThrow('[NEVER_PERSIST_FIELDS]')
  })

  it('throw message includes the violating field name', () => {
    expect(() =>
      guardWrite({ vin: 'WP0ZZZ93ZJS000001' }, 'my-caller'),
    ).toThrow(/"vin"/)
  })

  it('throw message includes the caller context', () => {
    expect(() =>
      guardWrite({ vin: 'WP0ZZZ93ZJS000001' }, 'seed-corpus-bat'),
    ).toThrow('seed-corpus-bat')
  })

  it('does not throw when vin key is absent (undefined value is irrelevant)', () => {
    // Object with no vin key at all — should pass
    const payload: Record<string, unknown> = { source_platform: 'bring-a-trailer' }
    expect(() => guardWrite(payload, 'test')).not.toThrow()
  })

  it('throws even when vin value is null (key presence is the trigger)', () => {
    // vin: null is still a write of the vin field
    expect(() =>
      guardWrite({ make: 'Porsche', vin: null }, 'test-caller'),
    ).toThrow('[NEVER_PERSIST_FIELDS]')
  })
})
