import { SimpleUnauthHeader } from '@/components/chrome/SimpleUnauthHeader'

export const metadata = { title: 'About — Project Vintage' }

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-canvas">
      <SimpleUnauthHeader />
      <div className="flex flex-1 justify-center">
        <div className="w-full max-w-[720px] px-8 pb-20 pt-24">
          <p className="mb-[22px] font-serif text-[11px] font-medium uppercase tracking-[0.18em] text-accent-primary">
            About
          </p>
          <h1 className="mb-[18px] font-serif text-[42px] font-normal leading-[1.1] tracking-[-0.015em] text-text-primary">
            Project Vintage.
          </h1>
          {/* Marketing: replace dek and body paragraph below with finalized copy */}
          <p className="mb-12 font-serif italic text-[17px] leading-[1.55] text-text-secondary">
            Editorial-grade data and judgment for serious collectors. More to come from the team.
          </p>
          <p className="font-serif text-[16px] leading-[1.6] text-text-primary">
            [Marketing: replace this paragraph with your About copy. The page is ready for long-form prose. Use HTML or MDX as needed.]
          </p>
        </div>
      </div>
    </div>
  )
}
