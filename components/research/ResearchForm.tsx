'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { ResearchInputs } from '@/lib/research/types'
import {
  ALL_MODELS,
  validModelsForYear,
  validTrimsForModelYear,
  allTrimsForModel,
  isValidCombination,
} from '@/lib/porsche/models'

const CURRENT_YEAR = new Date().getFullYear()
// 1965 is when the 911 launched — earliest generation in our data
const YEARS = Array.from({ length: CURRENT_YEAR + 1 - 1965 + 1 }, (_, i) => CURRENT_YEAR + 1 - i)

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = ResearchInputs

interface FieldErrors {
  year?: string
  model?: string
  trim?: string
  vin?: string
}

// ─── Chevron SVG ──────────────────────────────────────────────────────────────

function Chevron() {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <path d="M1 1L5 5L9 1" stroke="var(--text-quaternary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  initialValues?: ResearchInputs | null
}

export function ResearchForm({ initialValues }: Props) {
  const router = useRouter()

  const [form, setForm] = useState<FormState>({
    vin: initialValues?.vin ?? '',
    year: initialValues?.year ?? '',
    model: initialValues?.model ?? '',
    trim: initialValues?.trim ?? '',
    mileage: initialValues?.mileage ?? '',
    askingPrice: initialValues?.askingPrice ?? '',
    transmission: initialValues?.transmission ?? '',
    exteriorColor: initialValues?.exteriorColor ?? '',
    interiorColor: initialValues?.interiorColor ?? '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [detailOpen, setDetailOpen] = useState(false)
  const [decoding, setDecoding] = useState(false)
  const [decodeError, setDecodeError] = useState<string | null>(null)
  const [vinTouched, setVinTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<{ message: string; details: string | null } | null>(null)
  const [showErrorDetails, setShowErrorDetails] = useState(false)

  // ── Validation ──────────────────────────────────────────────────────────────

  const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/i

  function validateField(name: keyof FieldErrors, value: string, currentForm = form): string | undefined {
    if (name === 'year' && !value) return 'Required'
    if (name === 'model' && !value) return 'Required'
    if (name === 'trim') {
      if (!currentForm.model) return 'Select a model first'
      if (!value) return 'Required'
    }
    if (name === 'vin' && value && !VIN_RE.test(value)) return 'Must be 17 alphanumeric characters'
    return undefined
  }

  function handleBlur(name: keyof FieldErrors) {
    const value = name === 'vin' ? form.vin : form[name as keyof FormState]
    const err = validateField(name, value as string)
    setErrors((prev) => ({ ...prev, [name]: err }))
  }

  function isFormValid(): boolean {
    if (!form.year || !form.model || !form.trim) return false
    const yearNum = parseInt(form.year, 10)
    return !isNaN(yearNum) && isValidCombination(yearNum, form.model, form.trim)
  }

  // ── Field change handlers ────────────────────────────────────────────────────

  function handleChange(name: keyof FormState, value: string) {
    setSubmitError(null)
    setForm((prev) => {
      const next = { ...prev, [name]: value }

      if (name === 'year') {
        const yearNum = parseInt(value, 10)
        if (!value || isNaN(yearNum)) {
          next.model = ''
          next.trim = ''
          setErrors((e) => ({ ...e, model: undefined, trim: undefined }))
        } else if (prev.model) {
          const validModels = validModelsForYear(yearNum)
          if (!validModels.includes(prev.model)) {
            next.model = ''
            next.trim = ''
            setErrors((e) => ({ ...e, model: undefined, trim: undefined }))
          } else if (prev.trim) {
            const validTrims = validTrimsForModelYear(prev.model, yearNum)
            if (!validTrims.includes(prev.trim)) {
              next.trim = ''
              setErrors((e) => ({ ...e, trim: undefined }))
            }
          }
        }
      }

      if (name === 'model') {
        next.trim = ''
        setErrors((e) => ({ ...e, trim: undefined }))
      }

      return next
    })
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  // ── VIN decode ───────────────────────────────────────────────────────────────

  const handleDecode = useCallback(async () => {
    if (!VIN_RE.test(form.vin)) return
    setDecoding(true)
    setDecodeError(null)
    try {
      const res = await fetch(`/api/vin-decode?vin=${encodeURIComponent(form.vin.toUpperCase())}`)
      if (!res.ok) throw new Error('Decode failed')
      const data = await res.json() as {
        year?: string
        model?: string
        trim?: string
        transmission?: string
      }
      // Merge decoded fields — do not trigger model→trim cascade
      setForm((prev) => ({
        ...prev,
        ...(data.year ? { year: data.year } : {}),
        ...(data.model ? { model: data.model } : {}),
        ...(data.trim ? { trim: data.trim } : {}),
        ...(data.transmission ? { transmission: data.transmission } : {}),
      }))
      // Clear any errors on decoded fields
      setErrors((prev) => ({
        ...prev,
        year: data.year ? undefined : prev.year,
        model: data.model ? undefined : prev.model,
        trim: data.trim ? undefined : prev.trim,
      }))
    } catch {
      setDecodeError('Could not decode VIN — enter details manually below')
    } finally {
      setDecoding(false)
    }
  }, [form.vin])

  // ── Submit ───────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Final validation pass
    const yearErr = validateField('year', form.year)
    const modelErr = validateField('model', form.model)
    const trimErr = validateField('trim', form.trim)
    if (yearErr || modelErr || trimErr) {
      setErrors({ year: yearErr, model: modelErr, trim: trimErr })
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    setShowErrorDetails(false)
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        let message = 'Something went wrong — please try again.'
        let details: string | null = null
        try {
          const body = await res.json() as { error?: { message?: string; details?: string } }
          if (body.error?.message) message = body.error.message
          if (body.error?.details) details = body.error.details
        } catch { /* ignore parse error */ }
        setSubmitError({ message, details })
        setSubmitting(false)
        return
      }
      const { id } = await res.json() as { id: string }
      router.push(`/research/${id}`)
    } catch {
      setSubmitError({ message: 'Network error — check your connection and try again.', details: null })
      setSubmitting(false)
    }
  }

  // ─── Shared input/select class generators ────────────────────────────────────

  const inputBase =
    'w-full border-b-[0.5px] border-border-default bg-transparent px-0 py-2 font-serif text-[16px] text-text-primary placeholder:italic placeholder:text-text-muted focus:border-accent-primary focus:outline-none transition-colors'
  const selectBase =
    'w-full appearance-none border-b-[0.5px] border-border-default bg-transparent py-2 font-serif text-[16px] text-text-primary focus:border-accent-primary focus:outline-none transition-colors'
  const labelBase =
    'block font-sans text-[10px] uppercase tracking-[0.06em] text-text-quaternary mb-1.5'

  const vinValid = VIN_RE.test(form.vin)

  return (
    <div className="mx-auto max-w-[780px] px-7 pb-[88px] pt-[88px]">

      {/* ── 1. Search hero ──────────────────────────────────────────────────── */}
      <div className="mb-[44px] text-center">
        <p
          className="mb-[14px] font-serif text-[11px] uppercase tracking-[0.18em] text-accent-primary"
          style={{ fontVariant: 'small-caps' }}
        >
          Research
        </p>
        <h1 className="mb-4 font-serif text-[42px] font-normal leading-[1.15] tracking-[-0.01em] text-text-primary">
          Research a Porsche.
        </h1>
        <p className="mx-auto max-w-[560px] font-serif text-[16px] italic leading-[1.55] text-text-tertiary">
          Don&apos;t have a listing URL? Enter the car&apos;s details and get the same
          comp-driven analysis, drawn from auction sales of similar configurations.
        </p>
      </div>

      {/* ── 2. VIN bar ──────────────────────────────────────────────────────── */}
      <div className="mb-[14px]">
        <div
          className="grid"
          style={{ gridTemplateColumns: '1fr auto', border: '0.5px solid var(--border-default)', backgroundColor: 'var(--bg-surface)' }}
        >
          <input
            type="text"
            value={form.vin}
            onChange={(e) => {
              handleChange('vin', e.target.value.toUpperCase())
              setDecodeError(null)
            }}
            onBlur={() => {
              setVinTouched(true)
              handleBlur('vin')
            }}
            placeholder="Have a VIN? Paste it here — we'll fill in the rest."
            maxLength={17}
            className="bg-transparent px-[22px] py-[18px] font-mono text-[15px] tracking-[0.04em] text-text-primary placeholder:font-serif placeholder:text-[15px] placeholder:italic placeholder:not-italic placeholder:text-text-muted focus:outline-none"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
            aria-label="VIN"
          />
          <button
            type="button"
            onClick={handleDecode}
            disabled={!vinValid || decoding}
            className="border-l-[0.5px] border-border-default bg-text-primary px-[30px] font-sans text-[13px] font-medium uppercase tracking-[0.04em] text-bg-canvas disabled:cursor-not-allowed disabled:opacity-40"
          >
            {decoding ? 'Decoding…' : 'Decode →'}
          </button>
        </div>

        {/* VIN validation error */}
        {vinTouched && errors.vin && (
          <p className="mt-1 font-sans text-[11px] text-severity-concern">{errors.vin}</p>
        )}
        {/* Decode error */}
        {decodeError && (
          <p className="mt-1 font-sans text-[11px] text-severity-concern">{decodeError}</p>
        )}

        {/* Helper note */}
        <p className="mt-[10px] text-center font-sans text-[11px] tracking-[0.04em] text-text-quaternary">
          Decoded via NHTSA · 17-character standard VIN
        </p>
      </div>

      {/* ── 3. "or enter manually" divider ──────────────────────────────────── */}
      <div className="relative mb-[28px] flex items-center">
        <div className="h-px flex-1" style={{ height: '0.5px', backgroundColor: 'var(--border-default)' }} />
        <span className="mx-4 shrink-0 font-serif text-[13px] italic text-text-quaternary">
          or enter manually
        </span>
        <div className="flex-1" style={{ height: '0.5px', backgroundColor: 'var(--border-default)' }} />
      </div>

      {/* ── 4. Manual form ──────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} noValidate>
        <div
          className="px-[36px] py-[32px]"
          style={{ backgroundColor: 'var(--bg-surface)', border: '0.5px solid var(--border-default)' }}
        >
          {/* Required fields — 3-column */}
          <div className="mb-[24px] grid grid-cols-3 gap-[24px]">
            {/* Year */}
            <div>
              <label className={labelBase}>
                Year <span className="text-accent-primary">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  onBlur={() => handleBlur('year')}
                  className={selectBase}
                  style={{ paddingRight: '20px' }}
                  aria-required="true"
                >
                  <option value="" />
                  {YEARS.map((y) => (
                    <option key={y} value={String(y)}>
                      {y}
                    </option>
                  ))}
                </select>
                <Chevron />
              </div>
              {errors.year && (
                <p className="mt-1 font-sans text-[11px] text-severity-concern">{errors.year}</p>
              )}
            </div>

            {/* Model */}
            <div>
              <label className={labelBase}>
                Model <span className="text-accent-primary">*</span>
              </label>
              <div className="relative">
                {(() => {
                  const yearNum = parseInt(form.year, 10)
                  const modelOptions = form.year && !isNaN(yearNum)
                    ? validModelsForYear(yearNum)
                    : ALL_MODELS
                  return (
                    <select
                      value={form.model}
                      onChange={(e) => handleChange('model', e.target.value)}
                      onBlur={() => handleBlur('model')}
                      className={selectBase}
                      style={{ paddingRight: '20px' }}
                      aria-required="true"
                    >
                      <option value="" />
                      {modelOptions.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  )
                })()}
                <Chevron />
              </div>
              {errors.model && (
                <p className="mt-1 font-sans text-[11px] text-severity-concern">{errors.model}</p>
              )}
            </div>

            {/* Trim */}
            <div>
              <label className={labelBase}>
                Trim <span className="text-accent-primary">*</span>
              </label>
              <div className="relative">
                {(() => {
                  const yearNum = parseInt(form.year, 10)
                  const trimOptions = form.model && form.year && !isNaN(yearNum)
                    ? validTrimsForModelYear(form.model, yearNum)
                    : form.model
                      ? allTrimsForModel(form.model)
                      : []
                  return (
                    <select
                      value={form.trim}
                      onChange={(e) => handleChange('trim', e.target.value)}
                      onBlur={() => handleBlur('trim')}
                      disabled={!form.model}
                      className={`${selectBase} disabled:opacity-40`}
                      style={{ paddingRight: '20px' }}
                      aria-required="true"
                    >
                      <option value="" />
                      {trimOptions.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  )
                })()}
                <Chevron />
              </div>
              {errors.trim && (
                <p className="mt-1 font-sans text-[11px] text-severity-concern">{errors.trim}</p>
              )}
            </div>
          </div>

          {/* Mileage + Asking Price — 2-column */}
          <div className="mb-[24px] grid grid-cols-2 gap-[24px]">
            {/* Mileage */}
            <div>
              <label className={labelBase}>Mileage</label>
              <input
                type="text"
                inputMode="numeric"
                value={form.mileage}
                onChange={(e) => handleChange('mileage', e.target.value.replace(/[^0-9,]/g, ''))}
                placeholder="e.g. 62,000"
                className={inputBase}
              />
              <p className="mt-1 font-sans text-[11px] tracking-[0.04em] text-text-quaternary">
                Optional — adds precision to the verdict
              </p>
            </div>

            {/* Asking Price */}
            <div>
              <label className={labelBase}>Asking Price</label>
              <div className="relative flex items-end gap-1.5 border-b-[0.5px] border-border-default transition-colors focus-within:border-accent-primary">
                <span className="pb-2 font-serif text-[16px] text-text-quaternary">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.askingPrice}
                  onChange={(e) => handleChange('askingPrice', e.target.value.replace(/[^0-9,]/g, ''))}
                  placeholder="leave blank for market context only"
                  className="w-full bg-transparent py-2 font-serif text-[16px] text-text-primary placeholder:italic placeholder:text-text-muted focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* ── Add more detail expandable ────────────────────────────────── */}
          <div
            className="pt-[24px]"
            style={{ marginTop: '14px', borderTop: '0.5px solid var(--border-subtle)' }}
          >
            <button
              type="button"
              onClick={() => setDetailOpen((o) => !o)}
              className="font-serif text-[13px] italic text-accent-primary hover:opacity-70"
            >
              {detailOpen ? '− Hide additional detail' : '+ Add more detail (transmission, color)'}
            </button>

            {detailOpen && (
              <div className="mt-[20px] grid grid-cols-3 gap-[24px]">
                {/* Transmission */}
                <div>
                  <label className={labelBase}>Transmission</label>
                  <div className="relative">
                    <select
                      value={form.transmission}
                      onChange={(e) => handleChange('transmission', e.target.value)}
                      className={selectBase}
                      style={{ paddingRight: '20px' }}
                    >
                      <option value="" />
                      <option value="Manual">Manual</option>
                      <option value="PDK">PDK</option>
                      <option value="Tiptronic">Tiptronic</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                    <Chevron />
                  </div>
                </div>

                {/* Exterior Color */}
                <div>
                  <label className={labelBase}>Exterior Color</label>
                  <input
                    type="text"
                    value={form.exteriorColor}
                    onChange={(e) => handleChange('exteriorColor', e.target.value)}
                    placeholder="e.g. Guards Red"
                    className={inputBase}
                  />
                </div>

                {/* Interior Color */}
                <div>
                  <label className={labelBase}>Interior Color</label>
                  <input
                    type="text"
                    value={form.interiorColor}
                    onChange={(e) => handleChange('interiorColor', e.target.value)}
                    placeholder="e.g. Black"
                    className={inputBase}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Form actions ─────────────────────────────────────────────────── */}
          <div className="mt-[28px]">
            {submitError && (
              <div className="mb-3">
                <p className="font-sans text-[12px] text-severity-concern">{submitError.message}</p>
                {submitError.details && (
                  <>
                    {showErrorDetails && (
                      <p className="mt-1 font-sans text-[11px] text-text-quaternary">{submitError.details}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowErrorDetails((v) => !v)}
                      className="mt-1 font-sans text-[11px] text-text-quaternary underline hover:opacity-70"
                    >
                      {showErrorDetails ? 'Hide details' : 'Show details'}
                    </button>
                  </>
                )}
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!isFormValid() || submitting}
                className="rounded-button bg-text-primary px-[36px] py-[14px] font-sans text-[14px] font-medium text-bg-canvas transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {submitting ? 'Searching…' : 'Research this car →'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
