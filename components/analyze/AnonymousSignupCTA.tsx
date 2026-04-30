const BENEFITS = [
  'Full confidence scores and methodology',
  'Complete comparable sales history',
  'Generation era guides',
  'All watch-outs for every generation',
  'Color rarity stats and context',
  'Save analyses for later review',
]

export function AnonymousSignupCTA() {
  return (
    <div className="mt-10 border-[0.5px] border-border-default bg-bg-elevated px-6 py-10 text-center">
      <h2 className="font-serif text-[22px] leading-[1.3] text-text-primary">
        Free account. Two free full reports. No card required.
      </h2>
      <p className="mt-2 font-sans text-[13px] text-text-tertiary">
        Sign up to unlock the full analysis for serious collectors.
      </p>
      <ul className="mx-auto mt-6 grid max-w-xl grid-cols-1 gap-2 text-left sm:grid-cols-2">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0 text-severity-positive" aria-hidden="true">
              &#10003;
            </span>
            <span className="font-sans text-[13px] text-text-secondary">{benefit}</span>
          </li>
        ))}
      </ul>
      <a
        href="/signup"
        className="mt-8 inline-flex items-center rounded-button bg-text-primary px-6 py-[10px] font-sans text-[13px] font-medium tracking-[0.02em] text-bg-canvas hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2"
      >
        Create a free account
      </a>
    </div>
  )
}
