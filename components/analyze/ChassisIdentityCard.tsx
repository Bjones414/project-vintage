import type { Tables } from '@/lib/supabase/types'
import { Card } from '@/components/ui/card'

type Props = {
  listing: Tables<'listings'>
  generation: Tables<'porsche_generations'> | null
}

export function ChassisIdentityCard({ listing, generation }: Props) {
  const fields: Array<{ label: string; value: string | null | undefined }> = [
    { label: 'VIN', value: listing.vin },
    {
      label: 'Generation',
      value: listing.generation ?? generation?.generation_id ?? null,
    },
    {
      label: 'Model Year',
      value: listing.decoded_year != null
        ? String(listing.decoded_year)
        : String(listing.year),
    },
    { label: 'Variant', value: listing.trim },
    { label: 'Engine', value: listing.decoded_engine },
    { label: 'Assembly Plant', value: listing.decoded_plant },
    {
      label: 'Body',
      value: listing.decoded_body_class ?? listing.body_style,
    },
    {
      label: 'Transmission',
      value: listing.decoded_transmission ?? listing.transmission,
    },
  ]

  const present = fields.filter(({ value }) => value != null && value !== '')

  return (
    <Card title="Chassis Identity">
      {present.length === 0 ? (
        <p className="text-sm text-gray-500">No chassis data available.</p>
      ) : (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          {present.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-medium text-gray-500">{label}</dt>
              <dd className="mt-0.5 break-all text-sm font-medium text-gray-900">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Card>
  )
}
