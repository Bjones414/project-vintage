import type { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { GreetingHeader } from '@/components/GreetingHeader'
import type { GreetingAccount, GreetingNotifications } from '@/lib/greeting-engine/types'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import {
  SAMPLE_FEATURED_EVENT,
  SAMPLE_SECONDARY_EVENTS,
  SAMPLE_FOR_YOUR_CARS,
  SAMPLE_SHOPS,
  SAMPLE_READS,
} from '@/lib/sample-data'

export const metadata = {
  title: 'Home — Project Vintage',
}

// ─── Shared style helpers ─────────────────────────────────────────────────────

const SECTION_LABEL = 'font-serif text-[12px] font-medium uppercase tracking-[0.18em] text-accent-primary'
const FIELD_LABEL   = 'font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-text-quaternary'
const MORE_LINK     = 'font-sans text-[13px] font-medium text-text-tertiary hover:text-accent-primary'
const CTA_LINK      = 'font-sans text-[13px] font-medium text-accent-primary whitespace-nowrap'
const CARD_BASE     = 'bg-bg-surface border-[0.5px] border-border-default'
const DIVIDER       = '0.5px solid var(--border-subtle)'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/home')
  }

  // Fetch profile fields needed for greeting and first-login detection.
  // Uses service-role client to bypass RLS — public.users has no SELECT policy
  // for the anon key, so the authenticated session cannot read its own row.
  const supabaseAdmin = createAdminClient()
  const { data: profile } = await supabaseAdmin
    .from('users')
    .select('first_name, last_name, home_city')
    .eq('id', user.id)
    .single()

  // Count vehicles (proxy for "has garage entries")
  const { count: vehicleCount } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Count watched listings (proxy for "has hunts")
  const { count: watchlistCount } = await supabase
    .from('watched_listings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const hasVehicles  = (vehicleCount  ?? 0) > 0
  const hasWatchlist = (watchlistCount ?? 0) > 0

  // Welcome state shows until BOTH garage and watchlist are populated.
  const showWelcome = !(hasVehicles && hasWatchlist)

  const account: GreetingAccount = {
    firstName: profile?.first_name ?? 'there',
    lastName:  profile?.last_name  ?? '',
    city:      profile?.home_city  ?? '',
    timezone:  'America/Los_Angeles', // TODO: derive from home_lat/home_lng when needed
  }

  // All notification counts start at zero; real counts wired in a future session.
  const notifications: GreetingNotifications = {
    unread: 0,
    priceDrop: 0,
    newMatch: 0,
    auctionEnding: 0,
  }

  return (
    <main className="min-h-screen bg-bg-canvas">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 72px' }}>

        {/* ── Greeting ──────────────────────────────────────────────────────── */}
        <GreetingHeader
          account={account}
          notifications={notifications}
          showWelcome={showWelcome}
          hasVehicles={hasVehicles}
        />

        {/* ================================================================= */}
        {/* SECTION 1 — THIS WEEKEND NEAR YOU                                 */}
        {/* Events are sample for all logged-in users (V1.5 local events      */}
        {/* service not yet built). "· Sample" tag is permanent until V1.5.   */}
        {/* ================================================================= */}
        <section style={{ marginTop: 36 }}>
          <div
            style={{
              paddingBottom: 12,
              borderBottom: '0.5px solid var(--border-default)',
              marginBottom: 20,
            }}
          >
            <div className="flex items-baseline justify-between gap-6">
              <span className={SECTION_LABEL}>
                This weekend near you
                <SampleTag />
              </span>
              <Link href="/events" className={MORE_LINK}>Full calendar &rarr;</Link>
            </div>
            <h2
              className="font-serif font-normal text-text-primary"
              style={{ fontSize: 24, lineHeight: 1.3, marginTop: 6 }}
            >
              Three things on the calendar.
            </h2>
            <p
              className="font-serif italic text-text-tertiary"
              style={{ fontSize: 15, lineHeight: 1.55, marginTop: 4, maxWidth: 680 }}
            >
              {account.city
                ? <>Driveable distance from {account.city}, picked because they line up with what you own.</>
                : <>Picked because they line up with what you own.</>
              }
            </p>
          </div>

          {/* Featured event — verdict-style left rule */}
          <article
            className={CARD_BASE}
            style={{
              borderLeft: '3px solid var(--accent-primary)',
              padding: '26px 30px',
              display: 'grid',
              gridTemplateColumns: '1.6fr 1fr',
              gap: 48,
              alignItems: 'start',
              marginBottom: 14,
            }}
          >
            <div>
              <div className="flex items-baseline gap-4 flex-wrap" style={{ marginBottom: 12 }}>
                <span className={SECTION_LABEL}>
                  {SAMPLE_FEATURED_EVENT.dateLabel}
                </span>
                <span className={FIELD_LABEL}>{SAMPLE_FEATURED_EVENT.venue}</span>
              </div>
              <h3
                className="font-serif font-normal text-text-primary"
                style={{ fontSize: 26, lineHeight: 1.3, marginBottom: 12 }}
              >
                {SAMPLE_FEATURED_EVENT.headline}
              </h3>
              <p
                className="font-serif italic text-text-secondary"
                style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}
              >
                {SAMPLE_FEATURED_EVENT.body}
              </p>
              <div
                className="font-serif text-text-secondary"
                style={{
                  fontSize: 14,
                  paddingTop: 14,
                  borderTop: DIVIDER,
                  lineHeight: 1.65,
                }}
              >
                <span
                  className={SECTION_LABEL}
                  style={{ display: 'block', marginBottom: 4 }}
                >
                  Why you
                </span>
                {SAMPLE_FEATURED_EVENT.whyYou}
              </div>
            </div>

            {/* Event detail column */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {SAMPLE_FEATURED_EVENT.metrics.map(({ l, v }) => (
                  <div
                    key={l}
                    className="flex justify-between items-baseline gap-3"
                    style={{ padding: '11px 0', borderBottom: DIVIDER }}
                  >
                    <span className={FIELD_LABEL}>{l}</span>
                    <span
                      className="font-serif text-text-primary text-right"
                      style={{ fontSize: 15 }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 14,
                  borderTop: DIVIDER,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {SAMPLE_FEATURED_EVENT.ctas.map(({ label, href }) => (
                  <Link key={label} href={href} className={CTA_LINK}>
                    {label} &rarr;
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Secondary events — two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {SAMPLE_SECONDARY_EVENTS.map((ev) => (
              <article key={ev.headline} className={CARD_BASE} style={{ padding: '22px 24px' }}>
                <div className="flex items-baseline justify-between gap-3" style={{ marginBottom: 10 }}>
                  <span className={SECTION_LABEL}>{ev.dateLabel}</span>
                  <span className={FIELD_LABEL}>{ev.venue}</span>
                </div>
                <h3
                  className="font-serif font-normal text-text-primary"
                  style={{ fontSize: 21, lineHeight: 1.3, marginBottom: 8 }}
                >
                  {ev.headline}
                </h3>
                <p
                  className="font-serif italic text-text-tertiary"
                  style={{ fontSize: 14, lineHeight: 1.65 }}
                >
                  {ev.body}
                </p>
                <div
                  className="flex justify-between items-baseline gap-3"
                  style={{ marginTop: 14, paddingTop: 12, borderTop: DIVIDER }}
                >
                  <span className="font-serif italic text-text-secondary" style={{ fontSize: 13 }}>
                    {ev.fitNote}
                  </span>
                  <Link href={ev.ctaHref} className={CTA_LINK}>Details &rarr;</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 2 — FOR YOUR CARS                                         */}
        {/* Sample until user has garage entries. "· Sample" tag drops once   */}
        {/* hasVehicles is true (V1.5 will supply personalized content).      */}
        {/* ================================================================= */}
        <section style={{ marginTop: 36 }}>
          <div
            style={{
              paddingBottom: 12,
              borderBottom: '0.5px solid var(--border-default)',
              marginBottom: 20,
            }}
          >
            <div className="flex items-baseline justify-between gap-6">
              <span className={SECTION_LABEL}>
                For your cars
                {!hasVehicles && <SampleTag />}
              </span>
              <Link href="/garage" className={MORE_LINK}>Garage &rarr;</Link>
            </div>
            <h2
              className="font-serif font-normal text-text-primary"
              style={{ fontSize: 24, lineHeight: 1.3, marginTop: 6 }}
            >
              {hasVehicles
                ? 'Three things, one for each of three of your cars.'
                : 'Three things, once Project Vintage knows what you own.'
              }
            </h2>
            <p
              className="font-serif italic text-text-tertiary"
              style={{ fontSize: 15, lineHeight: 1.55, marginTop: 4, maxWidth: 680 }}
            >
              Articles, parts, and developments that found us this week because of
              what you have in the garage.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {SAMPLE_FOR_YOUR_CARS.map((item, idx) => (
              <PersonalItem
                key={item.tagTarget}
                tagLabel={item.tagLabel}
                tagTarget={item.tagTarget}
                tagSub={item.tagSub}
                kicker={item.kicker}
                headline={item.headline}
                body={item.body}
                ctaLabel={item.ctaLabel}
                ctaHref={item.ctaHref}
                isLast={idx === SAMPLE_FOR_YOUR_CARS.length - 1}
              />
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 3 — ON YOUR HUNTS                                         */}
        {/* Not sampled with placeholder hunts. Renders empty-state when user */}
        {/* has zero watched listings. Real data renders when hunts exist.    */}
        {/* ================================================================= */}
        <section style={{ marginTop: 36 }}>
          <div
            style={{
              paddingBottom: 12,
              borderBottom: '0.5px solid var(--border-default)',
              marginBottom: 20,
            }}
          >
            <div className="flex items-baseline justify-between gap-6">
              <span className={SECTION_LABEL}>On your hunts</span>
              {hasWatchlist && (
                <Link href="/watchlist" className={MORE_LINK}>
                  All {watchlistCount} {watchlistCount === 1 ? 'watch' : 'watches'} &rarr;
                </Link>
              )}
            </div>
            <h2
              className="font-serif font-normal text-text-primary"
              style={{ fontSize: 24, lineHeight: 1.3, marginTop: 6 }}
            >
              {hasWatchlist
                ? "What moved on the cars you're looking for."
                : "Tell us what you're looking for."
              }
            </h2>
            {hasWatchlist && (
              <p
                className="font-serif italic text-text-tertiary"
                style={{ fontSize: 15, lineHeight: 1.55, marginTop: 4, maxWidth: 680 }}
              >
                New listings, market context, and the occasional surprise that aligns
                with one of your standing watches.
              </p>
            )}
          </div>

          {!hasWatchlist ? (
            <div
              className={CARD_BASE}
              style={{ padding: '26px 30px' }}
            >
              <p
                className="font-serif italic text-text-secondary"
                style={{ fontSize: 15, lineHeight: 1.7 }}
              >
                Add a watch and we&rsquo;ll surface what moves on the cars you&rsquo;re
                looking for.{' '}
                {/* TODO: wire to watch-setup route once built (/watchlist/new or similar) */}
                <Link
                  href="/watchlist"
                  className="font-sans font-medium text-accent-primary whitespace-nowrap"
                  style={{ fontSize: 13, letterSpacing: '0.02em' }}
                >
                  Set up a watch &rarr;
                </Link>
              </p>
            </div>
          ) : (
            <div
              className={CARD_BASE}
              style={{ padding: '26px 30px' }}
            >
              <p
                className="font-serif italic text-text-secondary"
                style={{ fontSize: 15, lineHeight: 1.7 }}
              >
                You have {watchlistCount}{' '}
                {watchlistCount === 1 ? 'listing' : 'listings'} saved.{' '}
                <Link
                  href="/watchlist"
                  className="font-sans font-medium text-accent-primary whitespace-nowrap"
                  style={{ fontSize: 13, letterSpacing: '0.02em' }}
                >
                  View watchlist &rarr;
                </Link>
              </p>
            </div>
          )}
        </section>

        {/* ================================================================= */}
        {/* SECTION 4 — NEWLY OPENED NEARBY                                   */}
        {/* Sample for all logged-in users (V1.5 shop directory not yet built)*/}
        {/* "· Sample" tag is permanent until V1.5 ships.                    */}
        {/* ================================================================= */}
        <section style={{ marginTop: 36 }}>
          <div
            style={{
              paddingBottom: 12,
              borderBottom: '0.5px solid var(--border-default)',
              marginBottom: 20,
            }}
          >
            <div className="flex items-baseline justify-between gap-6">
              <span className={SECTION_LABEL}>
                Newly opened nearby
                <SampleTag />
              </span>
              <Link href="/shops" className={MORE_LINK}>Specialist directory &rarr;</Link>
            </div>
            <h2
              className="font-serif font-normal text-text-primary"
              style={{ fontSize: 24, lineHeight: 1.3, marginTop: 6 }}
            >
              Three shops worth knowing about.
            </h2>
            <p
              className="font-serif italic text-text-tertiary"
              style={{ fontSize: 15, lineHeight: 1.55, marginTop: 4, maxWidth: 680 }}
            >
              New or newly-arrived specialists within reasonable driving distance, picked
              for what they do well.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {SAMPLE_SHOPS.map((shop) => (
              <ShopCard
                key={shop.name}
                opened={shop.opened}
                location={shop.location}
                name={shop.name}
                body={shop.body}
                tag={shop.tag}
                ctaHref={shop.ctaHref}
              />
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 5 — WORTH READING                                         */}
        {/* Sample for all logged-in users (V1.5 library curation not built). */}
        {/* "· Sample" tag is permanent until V1.5 ships.                    */}
        {/* ================================================================= */}
        <section style={{ marginTop: 36 }}>
          <div
            style={{
              paddingBottom: 12,
              borderBottom: '0.5px solid var(--border-default)',
              marginBottom: 20,
            }}
          >
            <div className="flex items-baseline justify-between gap-6">
              <span className={SECTION_LABEL}>
                Worth reading this week
                <SampleTag />
              </span>
              <Link href="/library" className={MORE_LINK}>Library &rarr;</Link>
            </div>
            <h2
              className="font-serif font-normal text-text-primary"
              style={{ fontSize: 24, lineHeight: 1.3, marginTop: 6 }}
            >
              Two pieces landed.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {SAMPLE_READS.map((item) => (
              <ReadCard
                key={item.headline}
                coverLabel={item.coverLabel}
                coverTitle={item.coverTitle}
                kicker={item.kicker}
                headline={item.headline}
                body={item.body}
                meta={item.meta}
                ctaLabel={item.ctaLabel}
                ctaHref={item.ctaHref}
              />
            ))}
          </div>
        </section>

      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer
        style={{
          maxWidth: 1200,
          margin: '56px auto 0',
          padding: '28px 28px',
          borderTop: '0.5px solid var(--border-default)',
          display: 'flex',
          justifyContent: 'space-between',
          letterSpacing: '0.04em',
        }}
        className="font-sans text-[12px] text-text-quaternary"
      >
        <span>Project Vintage &middot; Home</span>
        <span>For collectors, by collectors</span>
      </footer>
    </main>
  )
}

// ─── SampleTag ────────────────────────────────────────────────────────────────
// Appended to section eyebrows where content is sample data.
// 9px Inter, uppercase, weight 500, accent-primary — separated by " · ".

function SampleTag() {
  return (
    <span
      className="font-sans font-medium uppercase text-accent-primary"
      style={{ fontSize: 9, letterSpacing: '0.18em' }}
    >
      {' '}&middot;{' '}Sample
    </span>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface PersonalItemProps {
  tagLabel: string
  tagTarget: string
  tagSub: string
  kicker: string
  headline: string
  body: ReactNode
  ctaLabel: string
  ctaHref: string
  actionable?: boolean
  isLast?: boolean
}

function PersonalItem({
  tagLabel, tagTarget, tagSub, kicker, headline, body,
  ctaLabel, ctaHref, actionable, isLast,
}: PersonalItemProps) {
  return (
    <article
      className="bg-bg-surface border-[0.5px] border-border-default"
      style={{
        padding: '22px 26px',
        marginBottom: isLast ? 0 : 10,
        display: 'grid',
        gridTemplateColumns: '220px 1fr auto',
        gap: 32,
        alignItems: 'start',
        ...(actionable ? { borderLeft: '3px solid var(--accent-primary)' } : {}),
      }}
    >
      {/* Tag block */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          paddingRight: 24,
          borderRight: '0.5px solid var(--border-subtle)',
        }}
      >
        <span
          className="font-serif font-medium uppercase text-accent-primary"
          style={{ fontSize: 11, letterSpacing: '0.18em' }}
        >
          {tagLabel}
        </span>
        <span className="font-serif text-text-primary" style={{ fontSize: 17, lineHeight: 1.3 }}>
          {tagTarget}
          <span
            className="font-serif italic text-text-tertiary block"
            style={{ fontSize: 13, marginTop: 2 }}
          >
            {tagSub}
          </span>
        </span>
      </div>

      {/* Content */}
      <div>
        <div
          className="font-sans font-medium uppercase text-text-quaternary"
          style={{ fontSize: 11, letterSpacing: '0.06em', marginBottom: 6 }}
        >
          {kicker}
        </div>
        <h3
          className="font-serif font-normal text-text-primary"
          style={{ fontSize: 19, lineHeight: 1.3, marginBottom: 8 }}
        >
          {headline}
        </h3>
        <p
          className="font-serif italic text-text-secondary"
          style={{ fontSize: 15, lineHeight: 1.7 }}
        >
          {body}
        </p>
      </div>

      {/* CTA */}
      <Link
        href={ctaHref}
        className="font-sans font-medium text-accent-primary whitespace-nowrap"
        style={{ fontSize: 13, letterSpacing: '0.02em', paddingTop: 24 }}
      >
        {ctaLabel} &rarr;
      </Link>
    </article>
  )
}

interface ShopCardProps {
  opened: string
  location: string
  name: string
  body: ReactNode
  tag: ReactNode
  ctaHref: string
}

function ShopCard({ opened, location, name, body, tag, ctaHref }: ShopCardProps) {
  return (
    <article
      className="bg-bg-surface border-[0.5px] border-border-default flex flex-col"
      style={{ padding: '22px 26px', gap: 10 }}
    >
      <div className="flex justify-between items-baseline gap-3">
        <span
          className="font-serif font-medium uppercase text-accent-primary"
          style={{ fontSize: 11, letterSpacing: '0.18em' }}
        >
          {opened}
        </span>
        <span
          className="font-sans text-text-quaternary"
          style={{ fontSize: 12, letterSpacing: '0.04em' }}
        >
          {location}
        </span>
      </div>
      <h3
        className="font-serif font-normal text-text-primary"
        style={{ fontSize: 22, lineHeight: 1.2, marginTop: 2 }}
      >
        {name}
      </h3>
      <p
        className="font-serif italic text-text-tertiary flex-1"
        style={{ fontSize: 15, lineHeight: 1.7 }}
      >
        {body}
      </p>
      <div
        className="flex justify-between items-baseline gap-3"
        style={{ marginTop: 8, paddingTop: 14, borderTop: '0.5px solid var(--border-subtle)' }}
      >
        <span className="font-serif italic text-text-secondary" style={{ fontSize: 13, lineHeight: 1.5 }}>
          {tag}
        </span>
        <Link
          href={ctaHref}
          className="font-sans font-medium text-accent-primary whitespace-nowrap"
          style={{ fontSize: 13, letterSpacing: '0.02em' }}
        >
          Visit &rarr;
        </Link>
      </div>
    </article>
  )
}

interface ReadCardProps {
  coverLabel: string
  coverTitle: ReactNode
  kicker: string
  headline: string
  body: ReactNode
  meta: string
  ctaLabel: string
  ctaHref: string
}

function ReadCard({ coverLabel, coverTitle, kicker, headline, body, meta, ctaLabel, ctaHref }: ReadCardProps) {
  return (
    <article
      className="bg-bg-surface border-[0.5px] border-border-default"
      style={{
        padding: '24px 26px',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        gap: 22,
        alignItems: 'start',
      }}
    >
      {/* Cover placeholder — dark book spine aesthetic */}
      <div
        style={{
          width: 96,
          aspectRatio: '3/4',
          background: 'linear-gradient(180deg,#3a3530 0%,#1c1a14 100%)',
          position: 'relative',
          border: '0.5px solid var(--border-default)',
          flexShrink: 0,
        }}
      >
        <span
          className="absolute inset-x-0 text-center font-serif font-medium uppercase"
          style={{
            top: 10,
            fontSize: 9,
            letterSpacing: '0.22em',
            color: '#B89C68',
          }}
        >
          {coverLabel}
        </span>
        <span
          className="absolute inset-x-0 text-center font-serif italic"
          style={{
            bottom: 12,
            fontSize: 11,
            color: '#F5F2EA',
            padding: '0 8px',
            lineHeight: 1.3,
          }}
        >
          {coverTitle}
        </span>
      </div>

      {/* Body */}
      <div>
        <div
          className="font-sans font-medium uppercase text-text-quaternary"
          style={{ fontSize: 11, letterSpacing: '0.06em', marginBottom: 6 }}
        >
          {kicker}
        </div>
        <h3
          className="font-serif font-normal text-text-primary"
          style={{ fontSize: 21, lineHeight: 1.25, marginBottom: 10 }}
        >
          {headline}
        </h3>
        <p
          className="font-serif italic text-text-tertiary"
          style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}
        >
          {body}
        </p>
        <div
          className="flex justify-between items-baseline font-sans text-text-tertiary"
          style={{
            paddingTop: 12,
            borderTop: '0.5px solid var(--border-subtle)',
            fontSize: 12,
            letterSpacing: '0.02em',
          }}
        >
          <span>{meta}</span>
          <Link
            href={ctaHref}
            className="font-sans font-medium text-accent-primary"
            style={{ fontSize: 13 }}
          >
            {ctaLabel} &rarr;
          </Link>
        </div>
      </div>
    </article>
  )
}
