import { describe, it, expect, afterEach, vi } from 'vitest'

const originalEnv = process.env.DATA_CAPTURE_ENABLED

afterEach(() => {
  // Restore env and clear module cache so each test gets a fresh import
  if (originalEnv === undefined) {
    delete process.env.DATA_CAPTURE_ENABLED
  } else {
    process.env.DATA_CAPTURE_ENABLED = originalEnv
  }
  vi.resetModules()
})

describe('dataCaptureEnabled', () => {
  it('defaults to false when DATA_CAPTURE_ENABLED is not set', async () => {
    delete process.env.DATA_CAPTURE_ENABLED
    vi.resetModules()
    const { dataCaptureEnabled } = await import('@/lib/data-capture/config')
    expect(dataCaptureEnabled).toBe(false)
  })

  it('is false when DATA_CAPTURE_ENABLED is "false"', async () => {
    process.env.DATA_CAPTURE_ENABLED = 'false'
    vi.resetModules()
    const { dataCaptureEnabled } = await import('@/lib/data-capture/config')
    expect(dataCaptureEnabled).toBe(false)
  })

  it('is true when DATA_CAPTURE_ENABLED is "true"', async () => {
    process.env.DATA_CAPTURE_ENABLED = 'true'
    vi.resetModules()
    const { dataCaptureEnabled } = await import('@/lib/data-capture/config')
    expect(dataCaptureEnabled).toBe(true)
  })
})
