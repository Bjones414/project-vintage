import Link from 'next/link'

export function EmptyState() {
  return (
    <div>
      <p className="font-serif text-[17px] italic leading-[1.55] text-text-secondary">
        Nothing on the hunt yet. Add a car after your next analysis.
      </p>
      <Link
        href="/analyze"
        className="mt-3 inline-block font-serif text-[17px] italic text-accent-primary underline decoration-[0.5px] underline-offset-2 hover:opacity-70"
      >
        Find a car →
      </Link>
    </div>
  )
}
