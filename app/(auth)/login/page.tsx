'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { login } from '@/app/actions/auth'

function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? ''

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')
    const result = await login({ email, password, next: next || undefined })
    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
  }

  const signupHref = `/signup${next ? `?next=${encodeURIComponent(next)}` : ''}`

  return (
    <div>
      <h1 className="mb-6 text-center font-serif text-[24px] leading-[1.3] text-text-primary">
        Sign in
      </h1>

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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-[0.5px] border-border-default bg-bg-surface px-3.5 py-3 font-sans text-[14px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-6 w-full rounded-button bg-text-primary px-6 py-3 font-sans text-[13px] font-medium tracking-[0.02em] text-bg-canvas hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="mt-5 text-center font-sans text-[13px] text-text-tertiary">
        New to Project Vintage?{' '}
        <Link href={signupHref} className="text-text-primary hover:underline">
          Create an account →
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
