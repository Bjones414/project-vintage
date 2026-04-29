// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { AnalyzeLoadingState } from '@/components/analyze/AnalyzeLoadingState'

function neverResolves(): Promise<string> {
  return new Promise(() => {})
}

function resolvesImmediately(id: string): Promise<string> {
  return Promise.resolve(id)
}

describe('AnalyzeLoadingState', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders all four steps on initial mount', () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    render(
      <AnalyzeLoadingState
        promise={neverResolves()}
        onSuccess={onSuccess}
        onError={onError}
      />,
    )
    expect(screen.getByText('Identifying the listing')).toBeTruthy()
    expect(screen.getByText('Parsing the details')).toBeTruthy()
    expect(screen.getByText('Pulling comparable sales')).toBeTruthy()
    expect(screen.getByText('Generating your analysis')).toBeTruthy()
  })

  it('step 1 is active on mount, steps 2-4 are pending', () => {
    const onSuccess = vi.fn()
    render(
      <AnalyzeLoadingState
        promise={neverResolves()}
        onSuccess={onSuccess}
        onError={vi.fn()}
      />,
    )
    // Use getAllByText to handle the li+span dual match, then find the span
    const step1Els = screen.getAllByText('Identifying the listing')
    const step1Span = step1Els.find((el) => el.tagName === 'SPAN')
    expect(step1Span?.className).toContain('font-semibold')

    const step4Els = screen.getAllByText('Generating your analysis')
    const step4Span = step4Els.find((el) => el.tagName === 'SPAN')
    expect(step4Span?.className).toContain('text-gray-400')
  })

  it('active step has animate-pulse class on indicator dot', () => {
    const { container } = render(
      <AnalyzeLoadingState
        promise={neverResolves()}
        onSuccess={vi.fn()}
        onError={vi.fn()}
      />,
    )
    const pulseDot = container.querySelector('.animate-pulse')
    expect(pulseDot).not.toBeNull()
  })

  it('active pulse dot carries motion-reduce:animate-none for reduced-motion', () => {
    const { container } = render(
      <AnalyzeLoadingState
        promise={neverResolves()}
        onSuccess={vi.fn()}
        onError={vi.fn()}
      />,
    )
    const pulseDot = container.querySelector('.animate-pulse')
    expect(pulseDot?.className).toContain('motion-reduce:animate-none')
  })

  it('step 2 becomes active and step 1 complete after 1125ms', async () => {
    const { container } = render(
      <AnalyzeLoadingState
        promise={neverResolves()}
        onSuccess={vi.fn()}
        onError={vi.fn()}
      />,
    )
    // Before advancing: step 1 active (amber indicator), no green indicators
    expect(container.querySelectorAll('.bg-green-100').length).toBe(0)
    expect(container.querySelectorAll('.bg-amber-100').length).toBe(1)

    await act(async () => {
      vi.advanceTimersByTime(1126)
      await Promise.resolve() // flush microtasks
    })

    // After advancing: step 1 complete (green), step 2 active (amber)
    expect(container.querySelectorAll('.bg-green-100').length).toBe(1)
    expect(container.querySelectorAll('.bg-amber-100').length).toBe(1)
  })

  it('does NOT call onSuccess before step 4 timer even if promise resolves first', async () => {
    const onSuccess = vi.fn()
    render(
      <AnalyzeLoadingState
        promise={resolvesImmediately('listing-123')}
        onSuccess={onSuccess}
        onError={vi.fn()}
      />,
    )
    // Flush microtask queue for the immediately-resolved promise
    await act(async () => {
      await Promise.resolve()
    })
    // Still should not have navigated — step 4 not done yet
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('calls onSuccess after step 4 timer when promise already resolved', async () => {
    const onSuccess = vi.fn()
    render(
      <AnalyzeLoadingState
        promise={resolvesImmediately('listing-123')}
        onSuccess={onSuccess}
        onError={vi.fn()}
      />,
    )
    await act(async () => {
      await Promise.resolve()
      vi.advanceTimersByTime(4501)
    })
    expect(onSuccess).toHaveBeenCalledWith('listing-123')
  })

  it('calls onError when promise rejects, and does not navigate', async () => {
    const onSuccess = vi.fn()
    const onError = vi.fn()
    render(
      <AnalyzeLoadingState
        promise={Promise.reject(new Error('network failure'))}
        onSuccess={onSuccess}
        onError={onError}
      />,
    )
    await act(async () => {
      await Promise.resolve()
    })
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'network failure' }))
    expect(onSuccess).not.toHaveBeenCalled()
  })
})
