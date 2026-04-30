import { describe, it, expect } from 'vitest'
import { extractSourceMentions, platformToPublication } from '@/lib/extractors/source-mentions'

const SOURCE = 'Bring a Trailer'
const URL = 'https://bringatrailer.com/listing/1993-porsche-911'

describe('extractSourceMentions', () => {
  describe('mentioned_repaint', () => {
    it('detects "repainted" keyword', () => {
      const result = extractSourceMentions('This car was repainted in 2020.', SOURCE, URL)
      expect(result.mentioned_repaint).toBe(true)
    })

    it('detects "respray" keyword', () => {
      const result = extractSourceMentions('Full respray in factory color.', SOURCE, URL)
      expect(result.mentioned_repaint).toBe(true)
    })

    it('returns null when no repaint keywords present', () => {
      const result = extractSourceMentions('Original paint throughout.', SOURCE, URL)
      expect(result.mentioned_repaint).toBeNull()
    })
  })

  describe('mentioned_accident_history', () => {
    it('detects "accident-free"', () => {
      const result = extractSourceMentions('Accident-free carfax history.', SOURCE, URL)
      expect(result.mentioned_accident_history).toBe(true)
    })

    it('detects "no stories"', () => {
      const result = extractSourceMentions('Clean title, no stories.', SOURCE, URL)
      expect(result.mentioned_accident_history).toBe(true)
    })

    it('detects "no accidents"', () => {
      const result = extractSourceMentions('No accidents reported.', SOURCE, URL)
      expect(result.mentioned_accident_history).toBe(true)
    })

    it('returns null when not mentioned', () => {
      const result = extractSourceMentions('Beautiful Porsche 993 Carrera.', SOURCE, URL)
      expect(result.mentioned_accident_history).toBeNull()
    })
  })

  describe('mentioned_engine_service', () => {
    it('detects "engine rebuild"', () => {
      const result = extractSourceMentions('Engine rebuild completed at 80k miles.', SOURCE, URL)
      expect(result.mentioned_engine_service).toBe(true)
    })

    it('detects "IMS bearing"', () => {
      const result = extractSourceMentions('IMS bearing replaced preventatively.', SOURCE, URL)
      expect(result.mentioned_engine_service).toBe(true)
    })

    it('detects "bore scoring"', () => {
      const result = extractSourceMentions('No bore scoring found on inspection.', SOURCE, URL)
      expect(result.mentioned_engine_service).toBe(true)
    })

    it('returns null when not mentioned', () => {
      const result = extractSourceMentions('Manual transmission Porsche 993.', SOURCE, URL)
      expect(result.mentioned_engine_service).toBeNull()
    })
  })

  describe('mentioned_transmission_service', () => {
    it('detects "clutch replaced"', () => {
      const result = extractSourceMentions('Clutch replaced at 60k miles.', SOURCE, URL)
      expect(result.mentioned_transmission_service).toBe(true)
    })

    it('detects "gearbox rebuilt"', () => {
      const result = extractSourceMentions('Gearbox rebuilt by specialist.', SOURCE, URL)
      expect(result.mentioned_transmission_service).toBe(true)
    })

    it('returns null when not mentioned', () => {
      const result = extractSourceMentions('Great driving Porsche 993.', SOURCE, URL)
      expect(result.mentioned_transmission_service).toBeNull()
    })
  })

  describe('mentioned_matching_numbers', () => {
    it('detects "matching numbers"', () => {
      const result = extractSourceMentions('Matching numbers throughout.', SOURCE, URL)
      expect(result.mentioned_matching_numbers).toBe(true)
    })

    it('detects "Kardex confirms"', () => {
      const result = extractSourceMentions('Kardex confirms factory specification.', SOURCE, URL)
      expect(result.mentioned_matching_numbers).toBe(true)
    })

    it('detects "numbers-matching"', () => {
      const result = extractSourceMentions('Numbers-matching engine case.', SOURCE, URL)
      expect(result.mentioned_matching_numbers).toBe(true)
    })

    it('returns null when not mentioned', () => {
      const result = extractSourceMentions('Great example from California.', SOURCE, URL)
      expect(result.mentioned_matching_numbers).toBeNull()
    })
  })

  describe('mentioned_modifications', () => {
    it('detects "aftermarket"', () => {
      const result = extractSourceMentions('Aftermarket exhaust installed.', SOURCE, URL)
      expect(result.mentioned_modifications).toBe(true)
    })

    it('detects "modified"', () => {
      const result = extractSourceMentions('Lightly modified for track use.', SOURCE, URL)
      expect(result.mentioned_modifications).toBe(true)
    })

    it('returns null when not mentioned', () => {
      const result = extractSourceMentions('Stock example with service records.', SOURCE, URL)
      expect(result.mentioned_modifications).toBeNull()
    })
  })

  describe('mentioned_recent_ppi', () => {
    it('detects "PPI"', () => {
      const result = extractSourceMentions('PPI completed by Porsche specialist.', SOURCE, URL)
      expect(result.mentioned_recent_ppi).toBe(true)
    })

    it('detects "pre-purchase inspection"', () => {
      const result = extractSourceMentions('Pre-purchase inspection available.', SOURCE, URL)
      expect(result.mentioned_recent_ppi).toBe(true)
    })

    it('returns null when not mentioned', () => {
      const result = extractSourceMentions('Selling my 993 after 15 years.', SOURCE, URL)
      expect(result.mentioned_recent_ppi).toBeNull()
    })
  })

  describe('mentioned_original_owner', () => {
    it('detects "one owner"', () => {
      const result = extractSourceMentions('One-owner car from new.', SOURCE, URL)
      expect(result.mentioned_original_owner).toBe(true)
    })

    it('detects "original owner"', () => {
      const result = extractSourceMentions('Original owner selling reluctantly.', SOURCE, URL)
      expect(result.mentioned_original_owner).toBe(true)
    })

    it('detects "since new"', () => {
      const result = extractSourceMentions('Owned since new by a Porsche collector.', SOURCE, URL)
      expect(result.mentioned_original_owner).toBe(true)
    })

    it('returns null when not mentioned', () => {
      const result = extractSourceMentions('Well-maintained 993 with records.', SOURCE, URL)
      expect(result.mentioned_original_owner).toBeNull()
    })
  })

  describe('source_citation format', () => {
    it('stores "Publication|URL" format', () => {
      const result = extractSourceMentions('Repainted in 2020.', SOURCE, URL)
      expect(result.source_citation).toBe(`${SOURCE}|${URL}`)
    })
  })

  describe('multiple signals', () => {
    it('correctly identifies multiple signals in one text', () => {
      const text = 'One-owner car. Matching numbers. Clutch replaced at 70k. No accidents.'
      const result = extractSourceMentions(text, SOURCE, URL)
      expect(result.mentioned_original_owner).toBe(true)
      expect(result.mentioned_matching_numbers).toBe(true)
      expect(result.mentioned_transmission_service).toBe(true)
      expect(result.mentioned_accident_history).toBe(true)
    })
  })

  describe('empty / null text', () => {
    it('handles empty string gracefully — all signals null', () => {
      const result = extractSourceMentions('', SOURCE, URL)
      expect(result.mentioned_repaint).toBeNull()
      expect(result.mentioned_accident_history).toBeNull()
      expect(result.mentioned_engine_service).toBeNull()
    })
  })
})

describe('platformToPublication', () => {
  it('maps known platforms to human-readable names', () => {
    expect(platformToPublication('bring-a-trailer')).toBe('Bring a Trailer')
    expect(platformToPublication('cars-and-bids')).toBe('Cars & Bids')
    expect(platformToPublication('rm-sothebys')).toBe("RM Sotheby's")
    expect(platformToPublication('gooding')).toBe('Gooding & Company')
  })

  it('returns the raw platform string for unknown platforms', () => {
    expect(platformToPublication('unknown-platform')).toBe('unknown-platform')
  })
})
