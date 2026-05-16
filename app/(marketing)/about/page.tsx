import { SimpleUnauthHeader } from '@/components/chrome/SimpleUnauthHeader'

export const metadata = { title: 'About — Project Vintage' }

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-canvas [&>header>div]:max-w-none">
      <SimpleUnauthHeader />

      <div className="flex flex-1 justify-center px-6">
        <div className="w-full max-w-[560px] pb-10 pt-12">

          {/* Block 1 */}
          <p className="font-serif text-[16px] leading-[1.7] text-text-secondary">
            A passion project, inspired by my father, an avid Porsche collector. Over the past few
            years, I&rsquo;ve spent hours with him at Porsche dealerships, watching him point out
            cars by era and hunt for the right one to drive. Always a manual. The information he
            needed always existed. It was just scattered.
          </p>
          <p className="mt-6 font-serif text-[16px] leading-[1.7] text-text-secondary">
            Project Vintage is the answer to what one place would look like. Hand-collected comp data on
            every generation, a working catalog of what to watch for, real-time tracking on the cars
            you own, alerts on the cars you&rsquo;re hunting, the events and specialists worth knowing
            about, the reading worth your time, and a small bench of real experts when an algorithm
            reaches its limit.
          </p>

          {/* Hairline breaker with centered gold dot */}
          <div className="relative my-10" aria-hidden="true">
            <div className="border-t-[0.5px] border-border-subtle" />
            <div
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-primary"
              style={{ width: 7, height: 7 }}
            />
          </div>

          {/* Block 2 */}
          <p className="font-serif text-[16px] leading-[1.7] text-text-secondary">
            Project Vintage doesn&rsquo;t sell user data. Ever. Not in pieces, not aggregated, not in
            some &ldquo;anonymized&rdquo; form. The comp database is collected by hand, with respect
            for the sources it draws from. No scraping.
          </p>
          <p className="mt-6 font-serif text-[16px] leading-[1.7] text-text-secondary">
            Project Vintage will never host auctions. There&rsquo;s already a strong ecosystem of
            platforms, registries, and communities serving collectors. This product is built to
            complement that work, not compete with it.
          </p>

          {/* Tagline */}
          <p className="mt-8 text-center font-serif text-[14px] italic text-text-secondary">
            Algorithms have their place. Nothing beats a manual.
          </p>

        </div>
      </div>
    </div>
  )
}
