// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

const pushSpy = vi.fn()

let capturedOnSuccess: ((id: string) => void) | null = null
let capturedOnError: ((e: Error) => void) | null = null

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushSpy }),
  usePathname: () => '/',
  notFound: () => { throw new Error('NEXT_NOT_FOUND') },
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/lib/analyze-url', () => ({
  analyzeUrl: vi.fn().mockResolvedValue('listing-abc-123'),
}))

vi.mock('@/components/analyze/AnalyzeLoadingState', () => ({
  AnalyzeLoadingState: ({ onSuccess, onError }: {
    promise: Promise<string>
    onSuccess: (id: string) => void
    onError: (e: Error) => void
  }) => {
    capturedOnSuccess = onSuccess
    capturedOnError = onError
    return React.createElement('div', { 'data-testid': 'mock-loading-state' })
  },
}))

import { HeroForm } from '@/components/home/HeroForm'

describe('HeroForm', () => {
  beforeEach(() => {
    pushSpy.mockClear()
    capturedOnSuccess = null
    capturedOnError = null
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders the URL paste field with correct placeholder', () => {
    render(<HeroForm />)
    expect(screen.getByPlaceholderText(/paste a listing url/i)).toBeTruthy()
  })

  it('renders the sample report link pointing to the 993 Turbo listing', () => {
    render(<HeroForm />)
    const link = screen.getByRole('link', { name: /see a sample report/i })
    expect(link).toBeTruthy()
    expect((link as HTMLAnchorElement).getAttribute('href')).toBe(
      '/analyze/86c5d062-e121-4173-bcfa-1983c058c95c',
    )
  })

  it('shows loading state on submit', async () => {
    const user = userEvent.setup()
    render(<HeroForm />)

    await user.type(
      screen.getByPlaceholderText(/paste a listing url/i),
      'https://bringatrailer.com/listing/test',
    )
    await user.keyboard('{Enter}')

    await waitFor(() => expect(screen.getByTestId('mock-loading-state')).toBeTruthy())
  })

  it('clears loading state and navigates on success', async () => {
    const user = userEvent.setup()
    render(<HeroForm />)

    await user.type(
      screen.getByPlaceholderText(/paste a listing url/i),
      'https://bringatrailer.com/listing/test',
    )
    await user.keyboard('{Enter}')

    await waitFor(() => expect(screen.getByTestId('mock-loading-state')).toBeTruthy())
    expect(capturedOnSuccess).not.toBeNull()

    await act(async () => { capturedOnSuccess!('listing-abc-123') })

    expect(screen.queryByTestId('mock-loading-state')).toBeNull()
    expect(screen.getByPlaceholderText(/paste a listing url/i)).toBeTruthy()
    expect(pushSpy).toHaveBeenCalledWith('/analyze/listing-abc-123')
  })

  it('shows error message and restores form on failure', async () => {
    const user = userEvent.setup()
    render(<HeroForm />)

    await user.type(
      screen.getByPlaceholderText(/paste a listing url/i),
      'https://ebay.com/item/123',
    )
    await user.keyboard('{Enter}')

    await waitFor(() => expect(screen.getByTestId('mock-loading-state')).toBeTruthy())
    expect(capturedOnError).not.toBeNull()

    await act(async () => { capturedOnError!(new Error('Unsupported platform')) })

    expect(screen.queryByTestId('mock-loading-state')).toBeNull()
    expect(screen.getByText('Unsupported platform')).toBeTruthy()
    expect(pushSpy).not.toHaveBeenCalled()
  })
})
