// @vitest-environment happy-dom
//
// Integration tests for the signup client component (app/(signup-flow)/signup/page.tsx).
// Tests the form UI layer: client-side validation, fetch orchestration, error display,
// redirect on success, and the at-capacity → waitlist transition.
//
// The API route itself is tested separately in tests/api/auth/signup.test.ts.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ─── Capture router.push before vi.mock hoisting ─────────────────────────────
const pushSpy = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushSpy, replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

import SignupPage from '@/app/(signup-flow)/signup/page'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeFetchResponse(status: number, body: unknown) {
  return Promise.resolve({
    status,
    json: async () => body,
  })
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Email'), 'alpha@example.com')
  await user.type(screen.getByLabelText('Password'), 'password123')
  await user.type(screen.getByLabelText('First name'), 'Ada')
  await user.type(screen.getByLabelText('Last name'), 'Lovelace')
  await user.type(screen.getByLabelText('City'), 'Scottsdale')
  await user.selectOptions(screen.getByLabelText('State'), 'AZ')
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

// ─── A. Happy path ────────────────────────────────────────────────────────────

describe('SignupPage — happy path', () => {
  it('calls router.push("/home") on 201 response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(
      makeFetchResponse(201, { id: 'user-uuid', account_type: 'alpha', alpha_expires_at: new Date().toISOString() }),
    ))
    const user = userEvent.setup()
    render(<SignupPage />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    await waitFor(() => {
      expect(pushSpy).toHaveBeenCalledWith('/home')
    })
  })

  it('disables submit button while pending', async () => {
    // Keep fetch in-flight so we can inspect the pending state
    let resolveFetch!: (v: unknown) => void
    vi.stubGlobal(
      'fetch',
      vi.fn().mockReturnValueOnce(new Promise((r) => { resolveFetch = r })),
    )
    const user = userEvent.setup()
    render(<SignupPage />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Create account/i })).toHaveProperty('disabled', true)
    })
    // Resolve to avoid open handle
    resolveFetch({ status: 201, json: async () => ({}) })
  })
})

// ─── B. Alpha capacity reached ────────────────────────────────────────────────

describe('SignupPage — 403 alpha_capacity_reached', () => {
  it('switches to at-capacity surface with "Pencils down, for now." headline', async () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(
      makeFetchResponse(403, { error: 'alpha_capacity_reached' }),
    ))
    const user = userEvent.setup()
    render(<SignupPage />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    await waitFor(() => {
      expect(screen.getByText('Pencils down, for now.')).toBeTruthy()
    })
  })

  it('at-capacity surface pre-fills waitlist email from signup email', async () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(
      makeFetchResponse(403, { error: 'alpha_capacity_reached' }),
    ))
    const user = userEvent.setup()
    render(<SignupPage />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    await waitFor(() => expect(screen.getByText('Pencils down, for now.')).toBeTruthy())
    const waitlistInput = screen.getByLabelText('Email') as HTMLInputElement
    expect(waitlistInput.value).toBe('alpha@example.com')
  })

  it('at-capacity → waitlist submit: shows confirmation on 201 added', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockReturnValueOnce(makeFetchResponse(403, { error: 'alpha_capacity_reached' }))
      .mockReturnValueOnce(makeFetchResponse(201, { status: 'added' })),
    )
    const user = userEvent.setup()
    render(<SignupPage />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    await waitFor(() => expect(screen.getByText('Pencils down, for now.')).toBeTruthy())

    await user.click(screen.getByRole('button', { name: /Add me to the V1 list/i }))
    await waitFor(() => {
      expect(screen.getByText(/We have your email/)).toBeTruthy()
    })
  })

  it('at-capacity → waitlist: shows alternate copy on already_listed', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockReturnValueOnce(makeFetchResponse(403, { error: 'alpha_capacity_reached' }))
      .mockReturnValueOnce(makeFetchResponse(200, { status: 'already_listed' })),
    )
    const user = userEvent.setup()
    render(<SignupPage />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    await waitFor(() => expect(screen.getByText('Pencils down, for now.')).toBeTruthy())

    await user.click(screen.getByRole('button', { name: /Add me to the V1 list/i }))
    await waitFor(() => {
      expect(screen.getByText(/already on the V1 list/)).toBeTruthy()
    })
  })
})

// ─── C. Server-side validation errors ────────────────────────────────────────

describe('SignupPage — 400 validation_failed', () => {
  it('renders per-field error messages from server', async () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(
      makeFetchResponse(400, {
        error: 'validation_failed',
        fields: { email: 'Valid email address required' },
      }),
    ))
    const user = userEvent.setup()
    render(<SignupPage />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    await waitFor(() => {
      expect(screen.getByText('Valid email address required')).toBeTruthy()
    })
  })
})

// ─── D. Geocode errors ────────────────────────────────────────────────────────

describe('SignupPage — geocode errors', () => {
  it('400 geocode_invalid → city field error mentioning the selected state', async () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(
      makeFetchResponse(400, { error: 'geocode_invalid', message: 'No match' }),
    ))
    const user = userEvent.setup()
    render(<SignupPage />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    await waitFor(() => {
      expect(screen.getByText(/We couldn't find that city in AZ/)).toBeTruthy()
    })
  })

  it('503 geocode_unavailable → top-of-form banner', async () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(
      makeFetchResponse(503, { error: 'geocode_unavailable' }),
    ))
    const user = userEvent.setup()
    render(<SignupPage />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    await waitFor(() => {
      expect(screen.getByText(/Our location service is unavailable/)).toBeTruthy()
    })
  })
})

// ─── E. Email taken ───────────────────────────────────────────────────────────

describe('SignupPage — 409 email_taken', () => {
  it('shows "Sign in →" link when email is already registered', async () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValueOnce(
      makeFetchResponse(409, { error: 'email_taken' }),
    ))
    const user = userEvent.setup()
    render(<SignupPage />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    await waitFor(() => {
      expect(screen.getByText(/Sign in/)).toBeTruthy()
      expect(screen.getByText(/That email already has an account/)).toBeTruthy()
    })
  })
})

// ─── F. Network failure ───────────────────────────────────────────────────────

describe('SignupPage — network failure', () => {
  it('shows top-of-form banner when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValueOnce(new Error('Network error')))
    const user = userEvent.setup()
    render(<SignupPage />)
    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again.')).toBeTruthy()
    })
  })
})

// ─── G. Client-side validation (no fetch fires) ───────────────────────────────

describe('SignupPage — client-side validation', () => {
  it('empty email → "An email address — we\'ll send confirmation here."', async () => {
    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
    const user = userEvent.setup()
    render(<SignupPage />)
    // Submit without filling email (fill other fields to isolate the email error)
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.type(screen.getByLabelText('City'), 'Scottsdale')
    await user.selectOptions(screen.getByLabelText('State'), 'AZ')
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    expect(screen.getByText(/An email address/)).toBeTruthy()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('invalid email format → "That doesn\'t look like an email address."', async () => {
    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
    const user = userEvent.setup()
    render(<SignupPage />)
    await user.type(screen.getByLabelText('Email'), 'notanemail')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.type(screen.getByLabelText('City'), 'Scottsdale')
    await user.selectOptions(screen.getByLabelText('State'), 'AZ')
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    expect(screen.getByText("That doesn't look like an email address.")).toBeTruthy()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('password shorter than 8 chars → "Eight characters minimum."', async () => {
    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
    const user = userEvent.setup()
    render(<SignupPage />)
    await user.type(screen.getByLabelText('Email'), 'alpha@example.com')
    await user.type(screen.getByLabelText('Password'), 'short')
    await user.type(screen.getByLabelText('First name'), 'Ada')
    await user.type(screen.getByLabelText('Last name'), 'Lovelace')
    await user.type(screen.getByLabelText('City'), 'Scottsdale')
    await user.selectOptions(screen.getByLabelText('State'), 'AZ')
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    expect(screen.getByText('Eight characters minimum.')).toBeTruthy()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('clears previous field errors on a new submission attempt', async () => {
    // First submission: invalid email → error shown
    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
    const user = userEvent.setup()
    render(<SignupPage />)
    await user.type(screen.getByLabelText('Email'), 'bad')
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    expect(screen.getByText("That doesn't look like an email address.")).toBeTruthy()

    // Second submission: correct email, other fields missing → email error clears
    await user.clear(screen.getByLabelText('Email'))
    await user.type(screen.getByLabelText('Email'), 'good@example.com')
    await user.click(screen.getByRole('button', { name: /Create account/i }))
    expect(screen.queryByText("That doesn't look like an email address.")).toBeNull()
  })
})
