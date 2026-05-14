// @vitest-environment happy-dom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { AlphaBanner } from '@/components/chrome/AlphaBanner'

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
})

describe('AlphaBanner', () => {
  it('renders banner when ALPHA_BANNER_ENABLED is unset (default: enabled)', () => {
    render(<AlphaBanner />)
    expect(screen.getByText(/Invitation-only access/)).toBeTruthy()
  })

  it('renders banner when ALPHA_BANNER_ENABLED is "true"', () => {
    vi.stubEnv('ALPHA_BANNER_ENABLED', 'true')
    render(<AlphaBanner />)
    expect(screen.getByText(/Invitation-only access/)).toBeTruthy()
  })

  it('renders nothing when ALPHA_BANNER_ENABLED is "false"', () => {
    vi.stubEnv('ALPHA_BANNER_ENABLED', 'false')
    render(<AlphaBanner />)
    expect(screen.queryByText(/Invitation-only access/)).toBeNull()
    expect(screen.queryByText(/Project Vintage alpha/)).toBeNull()
  })

  it('renders prefix in a <strong> element', () => {
    render(<AlphaBanner />)
    const prefix = screen.getByText('Project Vintage alpha.')
    expect(prefix.tagName).toBe('STRONG')
  })

  it('renders the full banner copy', () => {
    render(<AlphaBanner />)
    expect(screen.getByText('Project Vintage alpha.')).toBeTruthy()
    expect(screen.getByText(/Invitation-only access while we tune the foundations/)).toBeTruthy()
  })
})
