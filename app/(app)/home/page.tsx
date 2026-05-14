import type { ReactNode } from 'react'
import Link from 'next/link'
import { GreetingHeader } from '@/components/GreetingHeader'
import type { GreetingAccount, GreetingNotifications } from '@/lib/greeting-engine/types'

export const metadata = {
  title: 'Home — Project Vintage',
}

// ─── Hardcoded account for V1 ─────────────────────────────────────────────────
// TODO: replace with real user object from session

const ACCOUNT: GreetingAccount = {
  firstName: 'Charles',
  lastName: 'Williamson',
  city: 'San Jose',
  timezone: 'America/Los_Angeles',
}

// ─── Hardcoded notifications for V1 ─────────────────────────────────────────
// TODO: replace with real notification counts from session / Supabase

const NOTIFICATIONS: GreetingNotifications = {
  unread: 4,
  priceDrop: 1,
  newMatch: 1,
  auctionEnding: 2,
}

// ─── Shared style helpers ─────────────────────────────────────────────────────

const SECTION_LABEL = 'font-serif text-[12px] font-medium uppercase tracking-[0.18em] text-accent-primary'
const FIELD_LABEL   = 'font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-text-quaternary'
const MORE_LINK     = 'font-sans text-[13px] font-medium text-text-tertiary hover:text-accent-primary'
const CTA_LINK      = 'font-sans text-[13px] font-medium text-accent-primary whitespace-nowrap'
const CARD_BASE     = 'bg-bg-surface border-[0.5px] border-border-default'
const DIVIDER       = '0.5px solid var(--border-subtle)'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-canvas">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 28px 72px' }}>

        {/* ── Greeting ──────────────────────────────────────────────────────── */}
        <GreetingHeader account={ACCOUNT} notifications={NOTIFICATIONS} />

        {/* ================================================================= */}
        {/* SECTION 1 — THIS WEEKEND NEAR YOU                                 */}
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
              <span className={SECTION_LABEL}>This weekend near you</span>
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
              Driveable distance from San Jose, picked because they line up with what you own.
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
                <span className={SECTION_LABEL}>Saturday &middot; 17 May &middot; 7 &ndash; 10 AM</span>
                <span className={FIELD_LABEL}>Carmel Plaza &middot; Carmel-by-the-Sea</span>
              </div>
              <h3
                className="font-serif font-normal text-text-primary"
                style={{ fontSize: 26, lineHeight: 1.3, marginBottom: 12 }}
              >
                Carmel Cars &amp; Coffee, the May meet.
              </h3>
              <p
                className="font-serif italic text-text-secondary"
                style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}
              >
                The May edition of the monthly Carmel gathering, which historically draws thirty
                to forty Porsches across the generations — the air-cooled cars dominate, and the
                993 community has had a particularly strong showing this season. The Plaza closes
                off two parking levels for the cars.{' '}
                <strong className="not-italic font-medium text-text-primary">
                  Coffee from the Plaza Caf&eacute; opens at six.
                </strong>
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
                A natural showing for the <em>993 Carrera</em> or the <em>930 Turbo</em>. Drive
                down Friday afternoon, stay at the Pine Inn, take the long way home through Carmel
                Valley Road.
              </div>
            </div>

            {/* Event detail column */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { l: 'Drive time', v: '1h 50m' },
                  { l: 'Last year',  v: '~40 Porsches' },
                  { l: 'Cost',       v: 'Free, no RSVP' },
                  { l: 'Forecast',   v: '62°F, fog clearing' },
                ].map(({ l, v }) => (
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
                <Link href="/events" className={CTA_LINK}>Add to calendar &rarr;</Link>
                <Link href="/events" className={CTA_LINK}>Route &amp; lodging &rarr;</Link>
              </div>
            </div>
          </article>

          {/* Secondary events — two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            <article className={CARD_BASE} style={{ padding: '22px 24px' }}>
              <div className="flex items-baseline justify-between gap-3" style={{ marginBottom: 10 }}>
                <span className={SECTION_LABEL}>Sunday &middot; 18 May &middot; 9 AM &ndash; 2 PM</span>
                <span className={FIELD_LABEL}>Blackhawk Auto Museum</span>
              </div>
              <h3
                className="font-serif font-normal text-text-primary"
                style={{ fontSize: 21, lineHeight: 1.3, marginBottom: 8 }}
              >
                Air-Cooled Sunday at Blackhawk.
              </h3>
              <p
                className="font-serif italic text-text-tertiary"
                style={{ fontSize: 14, lineHeight: 1.65 }}
              >
                Organized by the PCA Diablo region, with sixty-plus cars expected.{' '}
                <strong className="not-italic font-medium text-text-secondary">
                  The permanent collection is open with member admission
                </strong>{' '}
                — the 1939 Type 64 alone justifies the drive.
              </p>
              <div
                className="flex justify-between items-baseline gap-3"
                style={{ marginTop: 14, paddingTop: 12, borderTop: DIVIDER }}
              >
                <span className="font-serif italic text-text-secondary" style={{ fontSize: 13 }}>
                  Strong fit for the <em className="text-accent-primary font-medium">993</em> and{' '}
                  <em className="text-accent-primary font-medium">930</em>.
                </span>
                <Link href="/events" className={CTA_LINK}>Details &rarr;</Link>
              </div>
            </article>

            <article className={CARD_BASE} style={{ padding: '22px 24px' }}>
              <div className="flex items-baseline justify-between gap-3" style={{ marginBottom: 10 }}>
                <span className={SECTION_LABEL}>Saturday &middot; 17 May &middot; 11 AM &ndash; 4 PM</span>
                <span className={FIELD_LABEL}>Sonoma Raceway &middot; paddock open</span>
              </div>
              <h3
                className="font-serif font-normal text-text-primary"
                style={{ fontSize: 21, lineHeight: 1.3, marginBottom: 8 }}
              >
                PCA Zone 7 driver&rsquo;s-ed open paddock.
              </h3>
              <p
                className="font-serif italic text-text-tertiary"
                style={{ fontSize: 14, lineHeight: 1.65 }}
              >
                An open paddock day during a club DE — you don&rsquo;t need to drive to attend.{' '}
                <strong className="not-italic font-medium text-text-secondary">
                  Several GT3 RS examples expected on track
                </strong>{' '}
                from the Zone 7 instructor pool.
              </p>
              <div
                className="flex justify-between items-baseline gap-3"
                style={{ marginTop: 14, paddingTop: 12, borderTop: DIVIDER }}
              >
                <span className="font-serif italic text-text-secondary" style={{ fontSize: 13 }}>
                  Natural for the{' '}
                  <em className="text-accent-primary font-medium">991.1 GT3 RS</em>.
                </span>
                <Link href="/events" className={CTA_LINK}>Details &rarr;</Link>
              </div>
            </article>

          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 2 — FOR YOUR CARS                                         */}
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
              <span className={SECTION_LABEL}>For your cars</span>
              <Link href="/garage" className={MORE_LINK}>All four cars &rarr;</Link>
            </div>
            <h2
              className="font-serif font-normal text-text-primary"
              style={{ fontSize: 24, lineHeight: 1.3, marginTop: 6 }}
            >
              Three things, one for each of three of your cars.
            </h2>
            <p
              className="font-serif italic text-text-tertiary"
              style={{ fontSize: 15, lineHeight: 1.55, marginTop: 4, maxWidth: 680 }}
            >
              Articles, parts, and developments that found us this week because of what you have
              in the garage.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Personal item: 993 Carrera */}
            <PersonalItem
              tagLabel="For your"
              tagTarget="993 Carrera"
              tagSub="Polar Silver, manual, 1995"
              kicker="New reading · Stuttgart Market Letter"
              headline="A long read on the 993 as the last great daily-driver air-cooled."
              body={
                <>
                  David Whitlock&rsquo;s spring issue features a fifteen-page piece on the 993
                  Carrera position in the market, including{' '}
                  <strong className="not-italic font-medium text-text-primary">
                    mileage-banded valuation pages for the manual coupe specifically
                  </strong>{' '}
                  — your variant gets two dedicated pages with comp pool charts back to 2015.
                </>
              }
              ctaLabel="Read"
              ctaHref="/library"
            />

            {/* Personal item: 996.2 GT3 */}
            <PersonalItem
              tagLabel="For your"
              tagTarget="996.2 GT3"
              tagSub="Speed Yellow, manual, 2004"
              kicker="New product · Manthey-Racing"
              headline="A factory-blessed Cup-spec kit available through Manthey US."
              body={
                <>
                  Manthey announced a tribute Cup-spec aerodynamics kit for the 996.2 GT3,
                  available for installation through their US partner in Charlotte.{' '}
                  <strong className="not-italic font-medium text-text-primary">
                    Period-correct lower splitter, revised diffuser, factory-approved fitment
                    for MY04 with the deeper splitter you have.
                  </strong>{' '}
                  Reversible, fully documented.
                </>
              }
              ctaLabel="Details"
              ctaHref="/library"
            />

            {/* Personal item: 930 Turbo */}
            <PersonalItem
              tagLabel="For your"
              tagTarget="930 Turbo"
              tagSub="Marine Blue, 1986"
              kicker="New film · RM Sotheby's Heritage"
              headline="A twenty-eight-minute documentary on the Whale Tail years."
              body={
                <>
                  RM Sotheby&rsquo;s Heritage Series released{' '}
                  <strong className="not-italic font-medium text-text-primary">
                    &ldquo;The Whale Tail Years&rdquo;
                  </strong>{' '}
                  on Tuesday — a focused look at 1980 to 1986 Turbo development, the regulatory
                  pressures behind the design choices, and interviews with two of the original
                  engineers. The 1986 model year gets a full chapter.
                </>
              }
              ctaLabel="Watch"
              ctaHref="/library"
              isLast
            />

          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 3 — ON YOUR HUNTS                                         */}
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
              <Link href="/watchlist" className={MORE_LINK}>All six follows &rarr;</Link>
            </div>
            <h2
              className="font-serif font-normal text-text-primary"
              style={{ fontSize: 24, lineHeight: 1.3, marginTop: 6 }}
            >
              What moved on the cars you&rsquo;re looking for.
            </h2>
            <p
              className="font-serif italic text-text-tertiary"
              style={{ fontSize: 15, lineHeight: 1.55, marginTop: 4, maxWidth: 680 }}
            >
              New listings, market context, and the occasional surprise that aligns with one of
              your standing watches.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Hunt item: actionable — price drop */}
            <PersonalItem
              tagLabel="On the hunt"
              tagTarget="991.1 GT3 manual"
              tagSub="under 30,000 miles"
              kicker="Price drop · 8 hours ago"
              headline="A GT Silver example dropped overnight from $162,500 to $148,900."
              body={
                <>
                  The seller cut $13,600 on a manual GT3 with{' '}
                  <strong className="not-italic font-medium text-text-primary">
                    18,400 miles and the post-recall engine documented through Porsche.
                  </strong>{' '}
                  Verdict moved from Fair to Below market. Bring a Trailer, four days remaining,
                  twenty-one comments at last refresh.
                </>
              }
              ctaLabel="Open listing"
              ctaHref="/watchlist"
              actionable
            />

            {/* Hunt item: actionable — new match */}
            <PersonalItem
              tagLabel="On the hunt"
              tagTarget="993 Carrera S manual"
              tagSub="all years"
              kicker="New match · 1 day ago"
              headline="A Polar Silver Carrera S surfaced on PCARMARKET."
              body={
                <>
                  52,100 miles, Black leather,{' '}
                  <strong className="not-italic font-medium text-text-primary">
                    full service binder from new through a single PCA-region indie shop.
                  </strong>{' '}
                  Three days remaining. Verdict: Fair, slightly under pool median for a manual
                  coupe in this mileage band.
                </>
              }
              ctaLabel="Open listing"
              ctaHref="/watchlist"
              actionable
            />

            {/* Hunt item: market context */}
            <PersonalItem
              tagLabel="On the hunt"
              tagTarget="964 Turbo"
              tagSub="any condition"
              kicker="Market context · Hagerty Insider"
              headline="A piece this week on why 964 Turbo values continue to lead the 911 family."
              body={
                <>
                  A long-form analysis from Hagerty Insider on the production-rarity argument for
                  the 964 Turbo against the 993 Turbo.{' '}
                  <strong className="not-italic font-medium text-text-primary">
                    Useful read while you&rsquo;re hunting
                  </strong>{' '}
                  — the piece pulls auction data back to 2018 and breaks out the 3.3 versus 3.6
                  trajectories.
                </>
              }
              ctaLabel="Read"
              ctaHref="/library"
            />

            {/* Hunt item: auction announcement */}
            <PersonalItem
              tagLabel="On the hunt"
              tagTarget="997.2 GT3 RS"
              tagSub="PTS preferred"
              kicker="Auction announcement · RM Sotheby's"
              headline="A 997.2 GT3 RS 4.0 in Carrara White headed to Monaco in June."
              body={
                <>
                  RM Sotheby&rsquo;s added a 7,800-mile RS 4.0 to the Monaco catalog.{' '}
                  <strong className="not-italic font-medium text-text-primary">
                    Not a PTS car, but a useful market signal
                  </strong>{' '}
                  for what the top-of-pool looks like coming out of spring. Preview catalog drops
                  next week.
                </>
              }
              ctaLabel="Catalog"
              ctaHref="/research"
              isLast
            />

          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 4 — NEWLY OPENED NEARBY                                   */}
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
              <span className={SECTION_LABEL}>Newly opened nearby</span>
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
              New or newly-arrived specialists within reasonable driving distance, picked for what
              they do well.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            <ShopCard
              opened="Opened April 2026"
              location="Petaluma · 78 mi"
              name="Maierhof Restorations"
              body={
                <>
                  A new specialist focusing on{' '}
                  <strong className="not-italic font-medium text-text-secondary">
                    air-cooled-era trim and interior refresh
                  </strong>{' '}
                  — door cards, console wood, gauge faces, period-correct stitching. The
                  principal trained at Singer&rsquo;s Sun Valley facility for six years before
                  going independent.
                </>
              }
              tag={<>Relevant for your <em className="not-italic font-medium text-accent-primary">993</em> and <em className="not-italic font-medium text-accent-primary">930</em></>}
              ctaHref="/shops"
            />

            <ShopCard
              opened="Opened March 2026"
              location="San Carlos · 18 mi"
              name="Klassik 911 Service"
              body={
                <>
                  An air-cooled-only service shop opened by two former Stuttgart Porsche
                  technicians.{' '}
                  <strong className="not-italic font-medium text-text-secondary">
                    Engine-out major service, top-end refresh, original-spec component sourcing
                  </strong>{' '}
                  through a registry of period parts they&rsquo;ve cataloged from European
                  salvage yards over twenty years.
                </>
              }
              tag={<>Relevant for your <em className="not-italic font-medium text-accent-primary">993</em> and <em className="not-italic font-medium text-accent-primary">930</em></>}
              ctaHref="/shops"
            />

            <ShopCard
              opened="New location · February 2026"
              location="Mountain View · 4 mi"
              name="Cobalt Vintage Audio"
              body={
                <>
                  Expanded their Bay Area presence with a satellite shop in Mountain View.{' '}
                  <strong className="not-italic font-medium text-text-secondary">
                    Blaupunkt Bremen and Reno restoration, period-correct speaker conversion,
                    hidden modern amp installations
                  </strong>{' '}
                  for those who want a contemporary source without losing the original dash unit.
                </>
              }
              tag={<>Relevant for your <em className="not-italic font-medium text-accent-primary">993, 930, 996.2</em></>}
              ctaHref="/shops"
            />

            <ShopCard
              opened="Opened January 2026"
              location="Sebastopol · 92 mi"
              name="Achteinhalb Werkstatt"
              body={
                <>
                  A boutique restoration shop named for the eight-and-a-half-tenths principle —{' '}
                  <strong className="not-italic font-medium text-text-secondary">
                    preservation over restoration where possible.
                  </strong>{' '}
                  Currently taking on a limited number of 993 and 964 preservation projects with
                  three-to-six-month leadtimes.
                </>
              }
              tag={<>Relevant for your <em className="not-italic font-medium text-accent-primary">993</em></>}
              ctaHref="/shops"
            />

          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 5 — WORTH READING                                         */}
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
              <span className={SECTION_LABEL}>Worth reading this week</span>
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

            <ReadCard
              coverLabel="Excellence"
              coverTitle={<>The Early GT3 Issue<br />May 2026</>}
              kicker="Magazine · just landed"
              headline="Excellence, May 2026 — the early GT3 issue."
              body={
                <>
                  A long lead piece on the 996.1 and 996.2 GT3 as the market matures into them,
                  including a section on{' '}
                  <strong className="not-italic font-medium text-text-secondary">
                    why Speed Yellow examples have lagged the pool
                  </strong>{' '}
                  on the way up. Touches on your 996.2 generation directly with named comp
                  examples.
                </>
              }
              meta="22 minute read · 96 pages"
              ctaLabel="Open issue"
              ctaHref="/library"
            />

            <ReadCard
              coverLabel="Karl Ludvigsen"
              coverTitle={<>Porsche: Excellence Was Expected<br />Second printing 2026</>}
              kicker="Book · second printing"
              headline={'Karl Ludvigsen’s revised “Excellence Was Expected.”'}
              body={
                <>
                  The second printing of the revised three-volume set arrived this week.{' '}
                  <strong className="not-italic font-medium text-text-secondary">
                    Volume two covers your 993 and 996 generations in depth
                  </strong>{' '}
                  with new photography and three previously unpublished interviews with Wendelin
                  Wiedeking from 2018.
                </>
              }
              meta="Three volumes · 1,440 pages"
              ctaLabel="Order"
              ctaHref="/library"
            />

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

// ─── Sub-components ───────────────────────────────────────────────────────────
// Defined inline since they are page-specific and carry static V1 data.

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
