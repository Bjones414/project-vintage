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
    <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
      <h2 className="text-xl font-bold text-gray-900">
        Free account. Two free full reports. No card required.
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        Sign up to unlock the full analysis for serious collectors.
      </p>
      <ul className="mx-auto mt-6 grid max-w-xl grid-cols-1 gap-2 text-left sm:grid-cols-2">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="mt-0.5 shrink-0 text-green-500" aria-hidden="true">
              &#10003;
            </span>
            {benefit}
          </li>
        ))}
      </ul>
      <a
        href="/signup"
        className="mt-8 inline-flex items-center rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
      >
        Create a free account
      </a>
    </div>
  )
}
