'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signup } from '@/app/actions/auth'

function SignupForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')
    const result = await signup({ email, password })
    if ('error' in result) {
      setError(result.error)
      setPending(false)
    } else {
      setConfirmed(true)
    }
  }

  const loginHref = `/login${next ? `?next=${encodeURIComponent(next)}` : ''}`

  if (confirmed) {
    return (
      <div>
        <h1 className="mb-6 text-center font-serif text-[24px] leading-[1.3] text-text-primary">
          Check your email
        </h1>
        <div className="border-[0.5px] border-border-default bg-bg-surface px-8 py-10 text-center">
          <p className="font-serif text-[15px] italic leading-[1.65] text-text-secondary">
            We sent a confirmation link to{' '}
            <span className="not-italic text-text-primary">{email}</span>. Click it to finish creating your account.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-2 text-center font-serif text-[24px] leading-[1.3] text-text-primary">
        Create an account
      </h1>
      <p className="mb-6 text-center font-serif text-[14px] italic leading-[1.65] text-text-tertiary">
        Free with sign-up · 3 reports per month · no card required
      </p>

      <div className="border-[0.5px] border-border-default bg-bg-surface px-8 py-8">
        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <p className="mb-4 font-sans text-[12px] text-severity-concern">{error}</p>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1 block font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-[0.5px] border-border-default bg-bg-surface px-3.5 py-3 font-sans text-[14px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="password"
              className="mb-1 block font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-[0.5px] border-border-default bg-bg-surface px-3.5 py-3 font-sans text-[14px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
              placeholder="Min. 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-6 w-full rounded-button bg-text-primary px-6 py-3 font-sans text-[13px] font-medium tracking-[0.02em] text-bg-canvas hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="mt-5 text-center font-sans text-[13px] text-text-tertiary">
        Already have an account?{' '}
        <Link href={loginHref} className="text-text-primary hover:underline">
          Sign in →
        </Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
