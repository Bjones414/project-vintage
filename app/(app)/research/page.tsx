import { createClient } from '@supabase/supabase-js'
import { ResearchForm } from '@/components/research/ResearchForm'
import type { ResearchRecord, ResearchInputs } from '@/lib/research/types'
import { recordToInputs } from '@/lib/research/types'

export const metadata = {
  title: 'Research a Porsche — Project Vintage',
}

interface PageProps {
  searchParams: { prefill?: string; parse_failed?: string }
}

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export default async function ResearchPage({ searchParams }: PageProps) {
  const parseFailed = searchParams.parse_failed === '1'
  let initialValues: ResearchInputs | null = null

  if (searchParams.prefill) {
    const admin = adminClient()
    const { data } = await admin
      .from('research_records')
      .select('*')
      .eq('id', searchParams.prefill)
      .single()

    if (data) {
      initialValues = recordToInputs(data as ResearchRecord)
    }
  }

  return (
    <main className="min-h-screen bg-bg-canvas">
      {parseFailed && (
        <div className="mx-auto max-w-[800px] px-7 pt-8">
          <p className="border-l-[2px] border-accent-primary pl-4 font-serif text-[14px] italic text-text-tertiary">
            We couldn&apos;t analyze that URL — try entering the car details manually below.
          </p>
        </div>
      )}
      <ResearchForm initialValues={initialValues} />
    </main>
  )
}
