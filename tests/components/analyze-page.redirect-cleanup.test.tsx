// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

const replaceSpy = vi.fn()

// Capture the onSuccess callback that AnalyzePage passes down so the test can fire it directly,
// bypassing AnalyzeLoadingState's 12-second step timer.
let capturedOnSuccess: ((id: string) => void) | null = null

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceSpy, push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  notFound: () => { throw new Error('NEXT_NOT_FOUND') },
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/lib/analyze-url', () => ({
  analyzeUrl: vi.fn().mockResolvedValue('listing-uuid-999'),
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

import AnalyzePage from '@/app/(app)/analyze/page'

describe('AnalyzePage — post-redirect cleanup', () => {
  beforeEach(() => {
    replaceSpy.mockClear()
    capturedOnSuccess = null
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('clears loadingPromise before router.replace when onSuccess fires', async () => {
    const user = userEvent.setup()
    render(<AnalyzePage />)

    await user.type(screen.getByRole('textbox'), 'https://bringatrailer.com/listing/test')
    await user.click(screen.getByRole('button', { name: /Analyze/i }))

    // Mock loading state renders; capturedOnSuccess holds handleSuccess
    await waitFor(() => expect(screen.getByTestId('mock-loading-state')).toBeTruthy())
    expect(capturedOnSuccess).not.toBeNull()

    // Simulate AnalyzeLoadingState calling onSuccess after all four steps complete
    await act(async () => { capturedOnSuccess!('listing-uuid-999') })

    // setLoadingPromise(null) called before router.replace → loading overlay gone, form back
    expect(screen.queryByTestId('mock-loading-state')).toBeNull()
    expect(screen.getByRole('button', { name: /Analyze/i })).toBeTruthy()
    expect(replaceSpy).toHaveBeenCalledWith('/analyze/listing-uuid-999')
  })
})
