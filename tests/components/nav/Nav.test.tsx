// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

const pushSpy = vi.fn()
const pathnameMock = vi.fn().mockReturnValue('/analyze/some-id')

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushSpy }),
  usePathname: () => pathnameMock(),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode; [k: string]: unknown }) =>
    React.createElement('a', { href, ...props }, children),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { signOut: vi.fn().mockResolvedValue({ error: null }) },
  }),
}))

vi.mock('@/lib/analyze-url', () => ({
  analyzeUrl: vi.fn().mockResolvedValue('listing-abc-123'),
  AnalyzeError: class AnalyzeError extends Error {},
}))

vi.mock('@/components/analyze/AnalyzeLoadingState', () => ({
  AnalyzeLoadingState: () => React.createElement('div', { 'data-testid': 'mock-loading-state' }),
}))

vi.mock('@/components/brand/PVMark', () => ({
  PVMark: () => React.createElement('svg', { 'data-testid': 'pv-mark' }),
}))

import { Nav } from '@/components/layout/Nav'

describe('Nav — submit button styling', () => {
  beforeEach(() => {
    pushSpy.mockClear()
    pathnameMock.mockReturnValue('/analyze/some-id')
  })

  afterEach(() => {
    cleanup()
  })

  it('renders the analyze submit button', () => {
    render(<Nav initials="BJ" />)
    expect(screen.getByRole('button', { name: /analyze listing/i })).toBeTruthy()
  })

  it('submit button is disabled when input is empty', () => {
    render(<Nav initials="BJ" />)
    const btn = screen.getByRole('button', { name: /analyze listing/i }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('submit button has bg-transparent and border-border-default when input is empty', () => {
    render(<Nav initials="BJ" />)
    const btn = screen.getByRole('button', { name: /analyze listing/i })
    expect(btn.className).toContain('bg-transparent')
    expect(btn.className).toContain('border-border-default')
    expect(btn.className).not.toContain('border-transparent')
  })

  it('aria-disabled is true when input is empty', () => {
    render(<Nav initials="BJ" />)
    const btn = screen.getByRole('button', { name: /analyze listing/i })
    expect(btn.getAttribute('aria-disabled')).toBe('true')
  })

  it('submit button has bg-accent-primary and border-transparent when input has content', async () => {
    const user = userEvent.setup()
    render(<Nav initials="BJ" />)
    await user.type(screen.getByPlaceholderText(/paste a listing url/i), 'https://bringatrailer.com/listing/test')
    const btn = screen.getByRole('button', { name: /analyze listing/i })
    expect(btn.className).toContain('bg-accent-primary')
    expect(btn.className).toContain('border-transparent')
    expect(btn.className).not.toContain('bg-transparent')
  })

  it('aria-disabled is false when input has content', async () => {
    const user = userEvent.setup()
    render(<Nav initials="BJ" />)
    await user.type(screen.getByPlaceholderText(/paste a listing url/i), 'https://bringatrailer.com/listing/test')
    const btn = screen.getByRole('button', { name: /analyze listing/i })
    expect(btn.getAttribute('aria-disabled')).toBe('false')
  })
})
