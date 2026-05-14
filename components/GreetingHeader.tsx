'use client'

import Link from 'next/link'
import { computeGreeting } from '@/lib/greeting-engine'
import type { GreetingAccount, GreetingNotifications } from '@/lib/greeting-engine/types'

interface Props {
  account: GreetingAccount
  notifications: GreetingNotifications
}

export function GreetingHeader({ account, notifications }: Props) {
  const { metaStrip, salutation, headlineBody, standfirst } = computeGreeting(
    account,
    notifications,
    new Date(),
  )

  return (
    <section
      style={{
        paddingBottom: 24,
        borderBottom: '0.5px solid var(--border-default)',
        marginBottom: 28,
      }}
    >
      {/* Meta strip — day, time-of-day label, date, city */}
      <p
        className="font-sans text-[12px] text-text-quaternary"
        style={{ letterSpacing: '0.04em', marginBottom: 12 }}
      >
        {metaStrip}
      </p>

      {/* Greeting headline: "{salutation}, {firstName}. {headlineBody}" */}
      <h1
        className="font-serif font-normal text-text-primary"
        style={{ fontSize: 38, lineHeight: 1.15, letterSpacing: '-0.01em' }}
      >
        <span className="text-text-secondary">{salutation}, </span>
        {account.firstName}. {headlineBody}
      </h1>

      {/* Standfirst — italic editorial sentence */}
      <p
        className="font-serif italic text-text-secondary"
        style={{
          fontSize: 17,
          lineHeight: 1.7,
          marginTop: 14,
          maxWidth: 820,
        }}
      >
        {standfirst}
      </p>

      {/* Garage summary line — static for V1 */}
      {/* TODO: replace with real garage summary from session */}
      <div
        className="font-serif text-text-tertiary"
        style={{
          fontSize: 15,
          marginTop: 18,
          paddingTop: 16,
          borderTop: '0.5px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 24,
          lineHeight: 1.6,
        }}
      >
        <span className="italic">
          In the garage:{' '}
          <strong className="not-italic font-medium text-text-primary">
            four cars, all well.
          </strong>{' '}
          The 991.1 GT3 RS led the week and a top-end refresh on the 993 is the only thing
          approaching the horizon.
        </span>
        <Link
          href="/garage"
          className="font-sans text-[13px] font-medium text-accent-primary whitespace-nowrap"
          style={{ letterSpacing: '0.02em' }}
        >
          Open the garage &rarr;
        </Link>
      </div>
    </section>
  )
}
