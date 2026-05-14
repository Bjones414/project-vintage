'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','DC',
  'FL','GA','HI','ID','IL','IN','IA','KS','KY',
  'LA','ME','MD','MA','MI','MN','MS','MO','MT',
  'NE','NV','NH','NJ','NM','NY','NC','ND','OH',
  'OK','OR','PA','RI','SC','SD','TN','TX','UT',
  'VT','VA','WA','WV','WI','WY',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FieldErrors = Partial<Record<'email' | 'password' | 'firstName' | 'lastName' | 'city' | 'state', string>>

const inputBase =
  'w-full bg-bg-surface border-[0.5px] border-border-default rounded-none px-[14px] py-[13px] font-serif text-[16px] text-text-primary outline-none transition-colors duration-[120ms] focus:border-text-primary'
const inputErrorCls = 'border-severity-concern focus:border-severity-concern'
const labelCls =
  'block font-sans text-[10px] uppercase tracking-[0.06em] font-medium text-text-quaternary mb-2'
const hintCls = 'mt-1.5 font-serif italic text-[13px] text-text-tertiary'
const errorCls = 'mt-1.5 font-serif italic text-[13px] text-severity-concern'

function fieldCls(hasError: boolean) {
  return hasError ? `${inputBase} ${inputErrorCls}` : inputBase
}

const eyebrowCls =
  'font-serif text-[11px] uppercase tracking-[0.18em] font-medium text-accent-primary'
const h1Cls =
  'font-serif text-[42px] font-normal leading-[1.1] tracking-[-0.015em] text-text-primary'
const dekCls = 'font-serif italic text-[17px] leading-[1.55] text-text-secondary'

function TrustLine() {
  return (
    <div className="mt-8 border-t-[0.5px] border-border-subtle pt-6">
      <p className="font-serif italic text-[13px] text-text-quaternary">
        <span className="not-italic font-medium text-text-tertiary">Your data is yours.</span>{' '}
        We don&apos;t sell it. Ever.
      </p>
    </div>
  )
}

function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-[14px] rounded-none border-0 bg-text-primary px-[26px] py-[14px] font-sans text-[13px] font-medium uppercase tracking-[0.18em] text-bg-canvas transition-opacity disabled:cursor-default disabled:opacity-60"
    >
      <span>{label}</span>
      <span className="text-[15px] leading-none text-accent-primary">→</span>
    </button>
  )
}

export default function SignupPage() {
  const router = useRouter()

  // Stage: 'signup' | 'at-capacity'
  const [stage, setStage] = useState<'signup' | 'at-capacity'>('signup')

  // Signup form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formBanner, setFormBanner] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  // Waitlist form (shown when at-capacity)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistEmailError, setWaitlistEmailError] = useState<string | null>(null)
  const [waitlistPending, setWaitlistPending] = useState(false)
  const [waitlistConfirm, setWaitlistConfirm] = useState<string | null>(null)

  async function handleSignupSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFieldErrors({})
    setFormBanner(null)

    const errors: FieldErrors = {}
    if (!email.trim()) {
      errors.email = "An email address — we'll send confirmation here."
    } else if (!EMAIL_RE.test(email.trim())) {
      errors.email = "That doesn't look like an email address."
    }
    if (!password) {
      errors.password = 'A password — eight characters or more.'
    } else if (password.length < 8) {
      errors.password = 'Eight characters minimum.'
    }
    if (!firstName.trim()) errors.firstName = 'Your first name.'
    if (!lastName.trim()) errors.lastName = 'Your last name.'
    if (!city.trim()) errors.city = 'Your city — for regional context.'
    if (!state) errors.state = 'Your state.'

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setPending(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          city: city.trim(),
          state,
        }),
      })

      const json = await res.json() as Record<string, unknown>

      if (res.status === 201) {
        router.push('/home')
        return
      }

      if (res.status === 403 && json.error === 'alpha_capacity_reached') {
        setWaitlistEmail(email.trim())
        setStage('at-capacity')
        setPending(false)
        return
      }

      if (res.status === 400 && json.error === 'validation_failed') {
        const fields = (json.fields ?? {}) as Record<string, string>
        setFieldErrors({
          email: fields.email,
          password: fields.password,
          firstName: fields.firstName,
          lastName: fields.lastName,
          city: fields.city,
          state: fields.state,
        })
        setPending(false)
        return
      }

      if (res.status === 400 && json.error === 'geocode_invalid') {
        setFieldErrors({ city: `We couldn't find that city in ${state}. Try again?` })
        setPending(false)
        return
      }

      if (res.status === 503 && json.error === 'geocode_unavailable') {
        setFormBanner('Our location service is unavailable. Please try again in a moment.')
        setPending(false)
        return
      }

      if (res.status === 409 && json.error === 'email_taken') {
        // sentinel string signals the email_taken branch in the JSX
        setFieldErrors({ email: '__email_taken__' })
        setPending(false)
        return
      }

      setFormBanner('Something went wrong. Please try again.')
      setPending(false)
    } catch {
      setFormBanner('Something went wrong. Please try again.')
      setPending(false)
    }
  }

  async function handleWaitlistSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setWaitlistEmailError(null)

    if (!waitlistEmail.trim()) {
      setWaitlistEmailError("An email address — we'll write you when V1 opens.")
      return
    }
    if (!EMAIL_RE.test(waitlistEmail.trim())) {
      setWaitlistEmailError("That doesn't look like an email address.")
      return
    }

    setWaitlistPending(true)
    try {
      const res = await fetch('/api/auth/v1-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: waitlistEmail.trim() }),
      })
      const json = await res.json() as Record<string, unknown>

      if (json.status === 'already_listed') {
        setWaitlistConfirm("You're already on the V1 list. We'll write you.")
      } else {
        setWaitlistConfirm("We have your email. We'll write when V1 opens.")
      }
    } catch {
      setWaitlistEmailError('Something went wrong. Please try again.')
    } finally {
      setWaitlistPending(false)
    }
  }

  // ─── At-capacity surface ───────────────────────────────────────────────────
  if (stage === 'at-capacity') {
    return (
      <>
        <p className={`${eyebrowCls} mb-[22px]`}>Alpha currently full</p>
        <h1 className={`${h1Cls} mb-[18px]`}>Pencils down, for now.</h1>
        <p className={`${dekCls} mb-12`}>
          Alpha is limited to a small group of collectors while we tune the foundations.
          V1 opens later this year. Leave your email and we&apos;ll write you then.
        </p>

        {waitlistConfirm ? (
          <p className="font-serif italic text-[17px] leading-[1.55] text-text-primary">
            {waitlistConfirm}
          </p>
        ) : (
          <form onSubmit={handleWaitlistSubmit} noValidate>
            <div>
              <label htmlFor="waitlist-email" className={labelCls}>
                Email
              </label>
              <input
                id="waitlist-email"
                type="email"
                autoComplete="email"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                className={fieldCls(!!waitlistEmailError)}
              />
              {waitlistEmailError && <p className={errorCls}>{waitlistEmailError}</p>}
            </div>
            <div className="mt-[22px]">
              <SubmitButton label="Add me to the V1 list" pending={waitlistPending} />
            </div>
          </form>
        )}

        <TrustLine />
      </>
    )
  }

  // ─── Signup form ───────────────────────────────────────────────────────────
  return (
    <>
      <p className={`${eyebrowCls} mb-[22px]`}>Project Vintage</p>
      <h1 className={`${h1Cls} mb-[18px]`}>Open an account.</h1>
      <p className={`${dekCls} mb-12`}>Six fields. Then you&apos;re in.</p>

      {formBanner && (
        <div className="mb-6 border-[0.5px] border-severity-concern bg-bg-surface px-4 py-3">
          <p className="font-serif italic text-[13px] text-severity-concern">{formBanner}</p>
        </div>
      )}

      <form onSubmit={handleSignupSubmit} noValidate>
        <div className="flex flex-col gap-[22px]">
          {/* Row 1 — Email */}
          <div>
            <label htmlFor="email" className={labelCls}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldCls(!!fieldErrors.email)}
            />
            {fieldErrors.email === '__email_taken__' ? (
              <p className={errorCls}>
                That email already has an account.{' '}
                <Link href="/login" className="underline">
                  Sign in →
                </Link>
              </p>
            ) : fieldErrors.email ? (
              <p className={errorCls}>{fieldErrors.email}</p>
            ) : null}
          </div>

          {/* Row 2 — Password */}
          <div>
            <label htmlFor="password" className={labelCls}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldCls(!!fieldErrors.password)}
            />
            {fieldErrors.password ? (
              <p className={errorCls}>{fieldErrors.password}</p>
            ) : (
              <p className={hintCls}>Eight characters or more.</p>
            )}
          </div>

          {/* Row 3 — First + Last name */}
          <div className="grid grid-cols-2 gap-[18px]">
            <div>
              <label htmlFor="firstName" className={labelCls}>
                First name
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={fieldCls(!!fieldErrors.firstName)}
              />
              {fieldErrors.firstName && <p className={errorCls}>{fieldErrors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className={labelCls}>
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={fieldCls(!!fieldErrors.lastName)}
              />
              {fieldErrors.lastName && <p className={errorCls}>{fieldErrors.lastName}</p>}
            </div>
          </div>

          {/* Row 4 — City + State */}
          <div
            className="grid gap-[18px]"
            style={{ gridTemplateColumns: '1fr 120px' }}
          >
            <div>
              <label htmlFor="city" className={labelCls}>
                City
              </label>
              <input
                id="city"
                type="text"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={fieldCls(!!fieldErrors.city)}
              />
              {fieldErrors.city && <p className={errorCls}>{fieldErrors.city}</p>}
            </div>
            <div>
              <label htmlFor="state" className={labelCls}>
                State
              </label>
              <div className="relative">
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`${fieldCls(!!fieldErrors.state)} appearance-none pr-8`}
                >
                  <option value="" disabled />
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="#8B7D5E"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              {fieldErrors.state && <p className={errorCls}>{fieldErrors.state}</p>}
            </div>
          </div>
        </div>

        {/* Location explainer */}
        <p className="mt-[-6px] font-serif italic text-[13px] text-text-tertiary">
          For regional events, local specialists, and market context.
        </p>

        <div className="mt-[22px]">
          <SubmitButton label="Create account" pending={pending} />
        </div>
      </form>

      <TrustLine />
    </>
  )
}
