import type { ResearchRecord } from '@/lib/research/types'
import { formatGenerationDisplay } from '@/lib/era-content/generation-display'
import { lookupFactorySpecs } from '@/lib/era-content/factory-specs'

interface Props {
  record: ResearchRecord
}

function DerivedTag() {
  return (
    <span className="ml-1.5 font-serif text-[10px] italic text-text-quaternary">
      derived
    </span>
  )
}

type FieldDef = {
  label: string
  value: string | null
  derived?: boolean
  mono?: boolean
}

export function SubjectVehicleCard({ record }: Props) {
  const {
    year, model, trim, mileage, transmission,
    exterior_color, interior_color, vin,
    generation_id, drivetrain, body_style, cooling,
  } = record

  const genLabel = generation_id ? formatGenerationDisplay(generation_id) : null

  const rawFields: (FieldDef | null)[] = [
    { label: 'Year',        value: String(year) },
    { label: 'Generation',  value: genLabel,   derived: true },
    { label: 'Model',       value: model },
    { label: 'Trim',        value: trim },
    mileage != null
      ? { label: 'Mileage', value: `${mileage.toLocaleString('en-US')} mi` }
      : null,
    { label: 'Drivetrain',  value: drivetrain,  derived: true },
    { label: 'Body Style',  value: body_style,  derived: true },
    { label: 'Cooling',     value: cooling,     derived: true },
    transmission ? { label: 'Transmission', value: transmission } : null,
    exterior_color ? { label: 'Exterior Color', value: exterior_color } : null,
    interior_color ? { label: 'Interior Color', value: interior_color } : null,
  ]
  const fields = rawFields.filter(
    (f): f is FieldDef => f != null && f.value != null && f.value !== '',
  )

  const hasVin = vin && vin.length === 17

  const factorySpecs = lookupFactorySpecs(generation_id, trim)

  return (
    <div className="flex h-full flex-col border-[0.5px] border-border-default bg-bg-surface px-6 py-5">
      <p className="font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary">
        Subject Vehicle
      </p>

      {/* VIN — only when user provided one via the decode path */}
      {hasVin && (
        <p className="mt-4 hyphens-none break-all">
          <span className="font-sans text-[10px] uppercase tracking-[0.06em] text-accent-primary">
            VIN:{' '}
          </span>
          <span className="font-mono text-[13px] tracking-[0.04em] text-text-primary">
            {vin}
          </span>
        </p>
      )}

      {/* Field grid — 2 columns */}
      {fields.length > 0 && (
        <dl
          className={`${hasVin ? 'mt-4 border-t-[0.5px] border-border-subtle pt-4' : 'mt-4'} grid grid-cols-2 gap-x-6 gap-y-4`}
        >
          {fields.map(({ label, value, derived, mono }) => (
            <div key={label}>
              <dt className="font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">
                {label}
              </dt>
              <dd className="mt-1">
                <span
                  className={
                    mono
                      ? 'font-mono text-[12px] tracking-[0.04em] text-text-primary'
                      : 'font-serif text-[17px] text-text-primary'
                  }
                >
                  {value}
                </span>
                {derived && <DerivedTag />}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* Factory Specs */}
      {factorySpecs !== null && (
        <div className="mt-[22px] border-t-[0.5px] border-border-subtle pt-[18px]">
          <p className="mb-[14px] font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary">
            Factory Specs
          </p>
          <dl className="divide-y divide-border-subtle">
            <div className="flex items-center justify-between py-2">
              <dt className="font-serif text-[14px] text-text-secondary">Power</dt>
              <dd className="font-serif text-[15px] text-text-primary">{factorySpecs.hp}</dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="font-serif text-[14px] text-text-secondary">Torque</dt>
              <dd className="font-serif text-[15px] text-text-primary">{factorySpecs.torque}</dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="font-serif text-[14px] text-text-secondary">0–60 mph</dt>
              <dd className="font-serif text-[15px] text-text-primary">{factorySpecs.zero_to_sixty}</dd>
            </div>
            {factorySpecs.curb_weight_lb && (
              <div className="flex items-center justify-between py-2">
                <dt className="font-serif text-[14px] text-text-secondary">Curb Weight</dt>
                <dd className="font-serif text-[15px] text-text-primary">{factorySpecs.curb_weight_lb}</dd>
              </div>
            )}
            {factorySpecs.top_speed_mph && (
              <div className="flex items-center justify-between py-2">
                <dt className="font-serif text-[14px] text-text-secondary">Top Speed</dt>
                <dd className="font-serif text-[15px] text-text-primary">{factorySpecs.top_speed_mph}</dd>
              </div>
            )}
            {factorySpecs.redline_rpm && (
              <div className="flex items-center justify-between py-2">
                <dt className="font-serif text-[14px] text-text-secondary">Redline</dt>
                <dd className="font-serif text-[15px] text-text-primary">{factorySpecs.redline_rpm}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  )
}
