import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { ResearchInputs } from '@/lib/research/types'
import {
  deriveGenerationId,
  deriveDrivetrain,
  deriveBodyStyle,
  deriveCooling,
  parseMileage,
  parseAskingPriceCents,
} from '@/lib/research/derive-generation'
import { isValidCombination, modelYearRange } from '@/lib/porsche/models'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

function err422(code: string, message: string, details?: string) {
  return NextResponse.json({ error: { code, message, ...(details ? { details } : {}) } }, { status: 422 })
}

export async function POST(request: Request) {
  let inputs: ResearchInputs
  try {
    inputs = await request.json()
  } catch {
    return NextResponse.json({ error: { code: 'INVALID_JSON', message: 'Invalid request body.' } }, { status: 400 })
  }

  const { year, model, trim, mileage, askingPrice, transmission, exteriorColor, interiorColor, vin } = inputs

  if (!year || !model || !trim) {
    return err422('MISSING_FIELDS', 'Year, model, and trim are required.')
  }

  const yearNum = parseInt(year, 10)
  if (isNaN(yearNum)) return err422('INVALID_YEAR', 'Year must be a number.')

  const range = modelYearRange(model)
  if (!range) return err422('INVALID_MODEL', `"${model}" is not a supported Porsche model.`)

  if (yearNum < range.start || yearNum > range.end) {
    const endLabel = range.end > new Date().getFullYear() ? 'present' : String(range.end)
    return err422(
      'INVALID_COMBINATION',
      `${yearNum} ${model} is not a valid combination.`,
      `The ${model} was produced from ${range.start} to ${endLabel}.`
    )
  }

  if (!isValidCombination(yearNum, model, trim)) {
    return err422('INVALID_TRIM', `"${trim}" is not a valid trim for the ${yearNum} ${model}.`)
  }

  const generationId = deriveGenerationId(yearNum, model)
  const drivetrain = deriveDrivetrain(model, trim)
  const bodyStyle = deriveBodyStyle(model, trim)
  const cooling = deriveCooling(generationId)
  const mileageNum = parseMileage(mileage)
  const askingCents = parseAskingPriceCents(askingPrice)

  const admin = adminClient()
  const { data, error } = await admin
    .from('research_records')
    .insert({
      year: yearNum,
      model,
      trim,
      mileage: mileageNum,
      asking_price_cents: askingCents,
      transmission: transmission || null,
      exterior_color: exteriorColor || null,
      interior_color: interiorColor || null,
      vin: vin && vin.length === 17 ? vin.toUpperCase() : null,
      generation_id: generationId,
      drivetrain,
      body_style: bodyStyle,
      cooling,
    })
    .select('id')
    .single()

  if (error || !data) {
    console.error('[research POST] insert error:', {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      model, year, trim,
    })
    return NextResponse.json(
      {
        error: {
          code: 'DB_ERROR',
          message: 'Failed to save research record — please try again.',
          details: error?.code ? `Supabase error ${error.code}: ${error.message}` : undefined,
        },
      },
      { status: 500 }
    )
  }

  return NextResponse.json({ id: data.id })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const admin = adminClient()
  const { data, error } = await admin
    .from('research_records')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
