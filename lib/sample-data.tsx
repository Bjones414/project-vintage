import type { ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
// Each type maps 1:1 to the section sub-component it feeds (PersonalItem,
// ShopCard, ReadCard). FeaturedEvent and SecondaryEvent match the events
// section layout in home/page.tsx.

export interface SampleFeaturedEvent {
  dateLabel: string
  venue: string
  headline: string
  body: ReactNode
  whyYou: ReactNode
  metrics: { l: string; v: string }[]
  ctas: { label: string; href: string }[]
}

export interface SampleSecondaryEvent {
  dateLabel: string
  venue: string
  headline: string
  body: ReactNode
  fitNote: ReactNode
  ctaHref: string
}

export interface SampleForYourCars {
  tagLabel: string
  tagTarget: string
  tagSub: string
  kicker: string
  headline: string
  body: ReactNode
  ctaLabel: string
  ctaHref: string
}

export interface SampleShop {
  opened: string
  location: string
  name: string
  body: ReactNode
  tag: ReactNode
  ctaHref: string
}

export interface SampleRead {
  coverLabel: string
  coverTitle: ReactNode
  kicker: string
  headline: string
  body: ReactNode
  meta: string
  ctaLabel: string
  ctaHref: string
}

// ─── Events ───────────────────────────────────────────────────────────────────
// Relative date labels ("This Saturday", "This Sunday") are used instead of
// hardcoded calendar dates so content doesn't need weekly updates.

export const SAMPLE_FEATURED_EVENT: SampleFeaturedEvent = {
  dateLabel: 'This Saturday · 7 – 10 AM',
  venue: 'Carmel Plaza · Carmel-by-the-Sea',
  headline: 'Carmel Cars & Coffee, the May meet.',
  body: (
    <>
      The May edition of the monthly Carmel gathering, which historically draws thirty
      to forty Porsches across the generations — the air-cooled cars dominate, and the
      993 community has had a particularly strong showing this season. The Plaza closes
      off two parking levels for the cars.{' '}
      <strong className="not-italic font-medium text-text-primary">
        Coffee from the Plaza Caf&eacute; opens at six.
      </strong>
    </>
  ),
  whyYou: (
    <>
      A natural showing for an <em>air-cooled 911</em>. Drive down Friday afternoon,
      stay at the Pine Inn, take the long way home through Carmel Valley Road.
    </>
  ),
  metrics: [
    { l: 'Drive time', v: '1h 50m from San Jose' },
    { l: 'Last year',  v: '~40 Porsches' },
    { l: 'Cost',       v: 'Free, no RSVP' },
    { l: 'Forecast',   v: '62°F, fog clearing' },
  ],
  ctas: [
    { label: 'Add to calendar', href: '/events' },
    { label: 'Route & lodging', href: '/events' },
  ],
}

export const SAMPLE_SECONDARY_EVENTS: SampleSecondaryEvent[] = [
  {
    dateLabel: 'This Sunday · 9 AM – 2 PM',
    venue: 'Blackhawk Auto Museum',
    headline: 'Air-Cooled Sunday at Blackhawk.',
    body: (
      <>
        Organized by the PCA Diablo region, with sixty-plus cars expected.{' '}
        <strong className="not-italic font-medium text-text-secondary">
          The permanent collection is open with member admission
        </strong>{' '}
        — the 1939 Type 64 alone justifies the drive.
      </>
    ),
    fitNote: (
      <>
        Strong fit for{' '}
        <em className="text-accent-primary font-medium">air-cooled 911s</em>.
      </>
    ),
    ctaHref: '/events',
  },
  {
    dateLabel: 'This Saturday · 11 AM – 4 PM',
    venue: 'Sonoma Raceway · paddock open',
    headline: "PCA Zone 7 driver’s-ed open paddock.",
    body: (
      <>
        An open paddock day during a club DE — you don&rsquo;t need to drive to attend.{' '}
        <strong className="not-italic font-medium text-text-secondary">
          Several GT3 RS examples expected on track
        </strong>{' '}
        from the Zone 7 instructor pool.
      </>
    ),
    fitNote: (
      <>
        Natural for the{' '}
        <em className="text-accent-primary font-medium">991-generation GT3 RS</em>.
      </>
    ),
    ctaHref: '/events',
  },
]

// ─── For Your Cars ────────────────────────────────────────────────────────────
// Sample content shown until the user has garage vehicles. Illustrates what the
// section looks like once Project Vintage knows what you own.

export const SAMPLE_FOR_YOUR_CARS: SampleForYourCars[] = [
  {
    tagLabel: 'For your',
    tagTarget: '993 Carrera',
    tagSub: 'Polar Silver, manual, 1995',
    kicker: 'New reading · Stuttgart Market Letter',
    headline: 'A long read on the 993 as the last great daily-driver air-cooled.',
    body: (
      <>
        David Whitlock&rsquo;s spring issue features a fifteen-page piece on the 993
        Carrera position in the market, including{' '}
        <strong className="not-italic font-medium text-text-primary">
          mileage-banded valuation pages for the manual coupe specifically
        </strong>{' '}
        — your variant gets two dedicated pages with comp pool charts back to 2015.
      </>
    ),
    ctaLabel: 'Read',
    ctaHref: '/library',
  },
  {
    tagLabel: 'For your',
    tagTarget: '996.2 GT3',
    tagSub: 'Speed Yellow, manual, 2004',
    kicker: 'New product · Manthey-Racing',
    headline: 'A factory-blessed Cup-spec kit available through Manthey US.',
    body: (
      <>
        Manthey announced a tribute Cup-spec aerodynamics kit for the 996.2 GT3,
        available for installation through their US partner in Charlotte.{' '}
        <strong className="not-italic font-medium text-text-primary">
          Period-correct lower splitter, revised diffuser, factory-approved fitment
          for MY04 with the deeper splitter.
        </strong>{' '}
        Reversible, fully documented.
      </>
    ),
    ctaLabel: 'Details',
    ctaHref: '/library',
  },
  {
    tagLabel: 'For your',
    tagTarget: '930 Turbo',
    tagSub: 'Marine Blue, 1986',
    kicker: "New film · RM Sotheby’s Heritage",
    headline: 'A twenty-eight-minute documentary on the Whale Tail years.',
    body: (
      <>
        RM Sotheby&rsquo;s Heritage Series released{' '}
        <strong className="not-italic font-medium text-text-primary">
          &ldquo;The Whale Tail Years&rdquo;
        </strong>{' '}
        on Tuesday — a focused look at 1980 to 1986 Turbo development, the regulatory
        pressures behind the design choices, and interviews with two of the original
        engineers. The 1986 model year gets a full chapter.
      </>
    ),
    ctaLabel: 'Watch',
    ctaHref: '/library',
  },
]

// ─── Shops ────────────────────────────────────────────────────────────────────
// Real public shops used by name (Singer, Manthey, BBI are referenced in text).
// "Newly opened" dates are relative to a spring 2026 launch window.

export const SAMPLE_SHOPS: SampleShop[] = [
  {
    opened: 'Opened April 2026',
    location: 'Petaluma · 78 mi',
    name: 'Maierhof Restorations',
    body: (
      <>
        A new specialist focusing on{' '}
        <strong className="not-italic font-medium text-text-secondary">
          air-cooled-era trim and interior refresh
        </strong>{' '}
        — door cards, console wood, gauge faces, period-correct stitching. The
        principal trained at Singer&rsquo;s Sun Valley facility for six years before
        going independent.
      </>
    ),
    tag: (
      <>
        Relevant for{' '}
        <em className="not-italic font-medium text-accent-primary">993</em> and{' '}
        <em className="not-italic font-medium text-accent-primary">930</em> owners
      </>
    ),
    ctaHref: '/shops',
  },
  {
    opened: 'Opened March 2026',
    location: 'San Carlos · 18 mi',
    name: 'Klassik 911 Service',
    body: (
      <>
        An air-cooled-only service shop opened by two former Stuttgart Porsche
        technicians.{' '}
        <strong className="not-italic font-medium text-text-secondary">
          Engine-out major service, top-end refresh, original-spec component sourcing
        </strong>{' '}
        through a registry of period parts cataloged from European salvage yards over
        twenty years.
      </>
    ),
    tag: (
      <>
        Relevant for{' '}
        <em className="not-italic font-medium text-accent-primary">air-cooled 911</em> owners
      </>
    ),
    ctaHref: '/shops',
  },
  {
    opened: 'New location · February 2026',
    location: 'Mountain View · 4 mi',
    name: 'Cobalt Vintage Audio',
    body: (
      <>
        Expanded their Bay Area presence with a satellite shop in Mountain View.{' '}
        <strong className="not-italic font-medium text-text-secondary">
          Blaupunkt Bremen and Reno restoration, period-correct speaker conversion,
          hidden modern amp installations
        </strong>{' '}
        for those who want a contemporary source without losing the original dash unit.
      </>
    ),
    tag: (
      <>
        Relevant for{' '}
        <em className="not-italic font-medium text-accent-primary">993, 930, 996</em> owners
      </>
    ),
    ctaHref: '/shops',
  },
  {
    opened: 'Opened January 2026',
    location: 'Sebastopol · 92 mi',
    name: 'Achteinhalb Werkstatt',
    body: (
      <>
        A boutique restoration shop named for the eight-and-a-half-tenths principle
        —{' '}
        <strong className="not-italic font-medium text-text-secondary">
          preservation over restoration where possible.
        </strong>{' '}
        Currently taking on a limited number of 993 and 964 preservation projects with
        three-to-six-month leadtimes.
      </>
    ),
    tag: (
      <>
        Relevant for{' '}
        <em className="not-italic font-medium text-accent-primary">993 and 964</em> owners
      </>
    ),
    ctaHref: '/shops',
  },
]

// ─── Reading ──────────────────────────────────────────────────────────────────
// Blurbs reference real publications (Excellence, Ludvigsen) without invented
// article URLs that might 404. No hardcoded issue numbers that require weekly
// updates — volume/edition references are stable.

export const SAMPLE_READS: SampleRead[] = [
  {
    coverLabel: 'Excellence',
    coverTitle: (
      <>
        The Early GT3 Issue
        <br />
        May 2026
      </>
    ),
    kicker: 'Magazine · just landed',
    headline: 'Excellence, May 2026 — the early GT3 issue.',
    body: (
      <>
        A long lead piece on the 996.1 and 996.2 GT3 as the market matures into them,
        including a section on{' '}
        <strong className="not-italic font-medium text-text-secondary">
          why Speed Yellow examples have lagged the pool
        </strong>{' '}
        on the way up. Touches on the 996.2 generation directly with named comp
        examples.
      </>
    ),
    meta: '22 minute read · 96 pages',
    ctaLabel: 'Open issue',
    ctaHref: '/library',
  },
  {
    coverLabel: 'Karl Ludvigsen',
    coverTitle: (
      <>
        Porsche: Excellence Was Expected
        <br />
        Second printing 2026
      </>
    ),
    kicker: 'Book · second printing',
    headline: 'Karl Ludvigsen’s revised “Excellence Was Expected.”',
    body: (
      <>
        The second printing of the revised three-volume set arrived this week.{' '}
        <strong className="not-italic font-medium text-text-secondary">
          Volume two covers the 993 and 996 generations in depth
        </strong>{' '}
        with new photography and three previously unpublished interviews with Wendelin
        Wiedeking from 2018.
      </>
    ),
    meta: 'Three volumes · 1,440 pages',
    ctaLabel: 'Order',
    ctaHref: '/library',
  },
]
