// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

const pushSpy = vi.fn()
const pathnameMock = vi.fn().mockReturnValue('/')

// Capture the onSuccess callback that TopNav passes down so the test can fire it directly,
// bypassing AnalyzeLoadingState's 12-second step timer.
let capturedOnSuccess: ((id: string) => void) | null = null

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushSpy, replace: vi.fn(), back: vi.fn() }),
  usePathname: () => pathnameMock(),
  notFound: () => { throw new Error('NEXT_NOT_FOUND') },
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { signOut: vi.fn().mockResolvedValue({ error: null }) } }),
}))

vi.mock('@/lib/analyze-url', () => ({
  analyzeUrl: vi.fn().mockResolvedValue('listing-abc-123'),
}))

vi.mock('@/components/analyze/AnalyzeLoadingState', () => ({
  AnalyzeLoadingState: ({ onSuccess }: {
    promise: Promise<string>
    onSuccess: (id: string) => void
    onError: (e: Error) => void
  }) => {
    capturedOnSuccess = onSuccess
    return React.createElement('div', { 'data-testid': 'mock-loading-state' })
  },
}))

import { TopNav } from '@/components/nav/TopNav'

describe('TopNav — post-redirect cleanup', () => {
  beforeEach(() => {
    pushSpy.mockClear()
    pathnameMock.mockReturnValue('/')
    capturedOnSuccess = null
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('clears loadingPromise before router.push when onSuccess fires', async () => {
    const user = userEvent.setup()
    render(<TopNav userEmail={null} />)

    await user.type(
      screen.getByPlaceholderText(/paste an auction url/i),
      'https://bringatrailer.com/listing/test',
    )
    await user.keyboard('{Enter}')

    // Mock loading state renders; capturedOnSuccess holds handleSuccess
    await waitFor(() => expect(screen.getByTestId('mock-loading-state')).toBeTruthy())
    expect(capturedOnSuccess).not.toBeNull()

    // Simulate AnalyzeLoadingState calling onSuccess after all four steps complete
    await act(async () => { capturedOnSuccess!('listing-abc-123') })

    // setLoadingPromise(null) called before router.push → loading overlay gone, nav form back
    expect(screen.queryByTestId('mock-loading-state')).toBeNull()
    expect(screen.getByPlaceholderText(/paste an auction url/i)).toBeTruthy()
    expect(pushSpy).toHaveBeenCalledWith('/analyze/listing-abc-123')
  })
})
