export interface ResearchInputs {
  vin: string
  year: string
  model: string
  trim: string
  mileage: string
  askingPrice: string
  transmission: string
  exteriorColor: string
  interiorColor: string
}

export interface ResearchRecord {
  id: string
  year: number
  model: string
  trim: string
  mileage: number | null
  asking_price_cents: number | null
  transmission: string | null
  exterior_color: string | null
  interior_color: string | null
  vin: string | null
  generation_id: string | null
  drivetrain: string | null
  body_style: string | null
  cooling: string | null
  created_at: string
}

export function recordToInputs(record: ResearchRecord): ResearchInputs {
  return {
    vin: record.vin ?? '',
    year: String(record.year),
    model: record.model,
    trim: record.trim,
    mileage: record.mileage != null ? String(record.mileage) : '',
    askingPrice: record.asking_price_cents != null
      ? String(Math.round(record.asking_price_cents / 100))
      : '',
    transmission: record.transmission ?? '',
    exteriorColor: record.exterior_color ?? '',
    interiorColor: record.interior_color ?? '',
  }
}
