import { redirect } from 'next/navigation'

type PageProps = { params: { id: string } }

// Full analysis page — placeholder until the dedicated report view is built.
// The TeaserBlock CTA links here for all authenticated tiers.
export default function FullAnalysisPage({ params }: PageProps) {
  redirect(`/analyze/${params.id}`)
}
