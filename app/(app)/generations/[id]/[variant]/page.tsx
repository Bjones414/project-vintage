import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getGenerationContent } from '@/lib/era-content/generation-content'

type PageProps = {
  params: { id: string; variant: string }
}

function variantSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function GenerationVariantPage({ params }: PageProps) {
  const { id, variant } = params
  const content = getGenerationContent(id)

  const matchedVariant = content?.variants?.find(
    (v) => variantSlug(v.name) === variant,
  )

  if (!matchedVariant) notFound()

  return (
    <main className="mx-auto max-w-7xl px-6 pb-16 pt-10 sm:px-8 lg:px-10">
      <Link
        href={`/generations/${id}`}
        className="font-sans text-[13px] text-text-tertiary hover:text-text-primary"
      >
        ← {id.toUpperCase()}
      </Link>

      <h1 className="mt-6 font-serif text-[38px] leading-[1.15] tracking-[-0.01em] text-text-primary">
        {matchedVariant.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        {matchedVariant.years && (
          <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-text-quaternary">
            {matchedVariant.years}
          </span>
        )}
        {matchedVariant.drivetrain && (
          <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-text-quaternary">
            · {matchedVariant.drivetrain}
          </span>
        )}
        {matchedVariant.power && (
          <span className="font-sans text-[11px] uppercase tracking-[0.12em] text-text-quaternary">
            · {matchedVariant.power}
          </span>
        )}
      </div>

      <p className="mt-6 max-w-[680px] font-sans text-[14px] leading-[1.65] text-text-secondary">
        {matchedVariant.description}
      </p>

      {matchedVariant.production && (
        <p className="mt-4 font-sans text-[11px] uppercase tracking-[0.08em] text-text-quaternary">
          {matchedVariant.production}
        </p>
      )}

      <div className="mt-12 border-[0.5px] border-border-default bg-bg-elevated px-6 py-5">
        <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
          Detailed variant guide
        </p>
        <p className="mt-3 font-sans text-[13px] text-text-tertiary">
          Buying guide, known issues, and comparable sales for this variant are under production.
        </p>
      </div>
    </main>
  )
}
