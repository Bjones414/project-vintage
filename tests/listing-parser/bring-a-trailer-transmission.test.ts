import { describe, it, expect } from 'vitest'
import { isTransmissionBullet, normalizeTransmission, parseBatHtml } from '@/lib/listing-parser/bring-a-trailer'

// ---------------------------------------------------------------------------
// isTransmissionBullet — should accept only bullets with transmission context
// ---------------------------------------------------------------------------
describe('isTransmissionBullet', () => {
  // Positives — must match
  it('matches "Six-Speed Manual Transaxle"', () => {
    expect(isTransmissionBullet('Six-Speed Manual Transaxle')).toBe(true)
  })
  it('matches "G50 Five-Speed Manual Transaxle"', () => {
    expect(isTransmissionBullet('G50 Five-Speed Manual Transaxle')).toBe(true)
  })
  it('matches "Seven-Speed PDK Dual-Clutch Automatic Transaxle"', () => {
    expect(isTransmissionBullet('Seven-Speed PDK Dual-Clutch Automatic Transaxle')).toBe(true)
  })
  it('matches "Four-Speed Tiptronic Automatic Transaxle"', () => {
    expect(isTransmissionBullet('Four-Speed Tiptronic Automatic Transaxle')).toBe(true)
  })
  it('matches "6-Speed Manual"', () => {
    expect(isTransmissionBullet('6-Speed Manual')).toBe(true)
  })
  it('matches "6-Speed Manual Transmission"', () => {
    expect(isTransmissionBullet('6-Speed Manual Transmission')).toBe(true)
  })
  it('matches "PDK Automatic Transaxle"', () => {
    expect(isTransmissionBullet('PDK Automatic Transaxle')).toBe(true)
  })
  it('matches "Tiptronic S Automatic"', () => {
    expect(isTransmissionBullet('Tiptronic S Automatic')).toBe(true)
  })

  // Negatives — must NOT match
  it('rejects "Automatic Climate Control"', () => {
    expect(isTransmissionBullet('Automatic Climate Control')).toBe(false)
  })
  it('rejects "Cruise Control & Automatic Climate Control"', () => {
    expect(isTransmissionBullet('Cruise Control & Automatic Climate Control')).toBe(false)
  })
  it('rejects "Automatic Braking Differential"', () => {
    expect(isTransmissionBullet('Automatic Braking Differential')).toBe(false)
  })
  it("rejects \"Owner's Manual & Tool Kit\"", () => {
    expect(isTransmissionBullet("Owner's Manual & Tool Kit")).toBe(false)
  })
  it("rejects \"Owner's Manual & Service Records\"", () => {
    expect(isTransmissionBullet("Owner's Manual & Service Records")).toBe(false)
  })
  it("rejects \"Window Sticker & Owner's Manual\"", () => {
    expect(isTransmissionBullet("Window Sticker & Owner's Manual")).toBe(false)
  })
  it('rejects "Manual Mirrors"', () => {
    expect(isTransmissionBullet('Manual Mirrors')).toBe(false)
  })
  it('rejects "Automatic Headlights"', () => {
    expect(isTransmissionBullet('Automatic Headlights')).toBe(false)
  })
  it('rejects "Lapis Blue Metallic Paint"', () => {
    expect(isTransmissionBullet('Lapis Blue Metallic Paint')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// normalizeTransmission — canonical form conversion
// ---------------------------------------------------------------------------
describe('normalizeTransmission', () => {
  it('"Six-Speed Manual Transaxle" → "6-Speed Manual"', () => {
    expect(normalizeTransmission('Six-Speed Manual Transaxle')).toBe('6-Speed Manual')
  })
  it('"G50 Five-Speed Manual Transaxle" → "5-Speed Manual (G50)"', () => {
    expect(normalizeTransmission('G50 Five-Speed Manual Transaxle')).toBe('5-Speed Manual (G50)')
  })
  it('"Getrag G50 Six-Speed Manual Transaxle" → "6-Speed Manual (G50)"', () => {
    expect(normalizeTransmission('Getrag G50 Six-Speed Manual Transaxle')).toBe('6-Speed Manual (G50)')
  })
  it('"Seven-Speed PDK Dual-Clutch Automatic Transaxle" → "7-Speed PDK"', () => {
    expect(normalizeTransmission('Seven-Speed PDK Dual-Clutch Automatic Transaxle')).toBe('7-Speed PDK')
  })
  it('"7-Speed PDK Automatic Transaxle" → "7-Speed PDK"', () => {
    expect(normalizeTransmission('7-Speed PDK Automatic Transaxle')).toBe('7-Speed PDK')
  })
  it('"Four-Speed Tiptronic Automatic Transaxle" → "4-Speed Tiptronic"', () => {
    expect(normalizeTransmission('Four-Speed Tiptronic Automatic Transaxle')).toBe('4-Speed Tiptronic')
  })
  it('"Four-Speed Tiptronic Transaxle" → "4-Speed Tiptronic"', () => {
    expect(normalizeTransmission('Four-Speed Tiptronic Transaxle')).toBe('4-Speed Tiptronic')
  })
  it('"Tiptronic S Automatic Transaxle" → "Tiptronic S"', () => {
    expect(normalizeTransmission('Tiptronic S Automatic Transaxle')).toBe('Tiptronic S')
  })
  it('"Five-Speed Tiptronic S Automatic Transaxle" → "5-Speed Tiptronic S"', () => {
    expect(normalizeTransmission('Five-Speed Tiptronic S Automatic Transaxle')).toBe('5-Speed Tiptronic S')
  })
  it('"6-Speed Manual" → "6-Speed Manual" (already canonical)', () => {
    expect(normalizeTransmission('6-Speed Manual')).toBe('6-Speed Manual')
  })
  it('"6-Speed Manual Transmission" → "6-Speed Manual"', () => {
    expect(normalizeTransmission('6-Speed Manual Transmission')).toBe('6-Speed Manual')
  })
  it('"6-Speed Manual Transaxle with LSD" → "6-Speed Manual"', () => {
    expect(normalizeTransmission('6-Speed Manual Transaxle with LSD')).toBe('6-Speed Manual')
  })
  it('"Eight-Speed Automatic Transaxle" → "8-Speed Automatic"', () => {
    expect(normalizeTransmission('Eight-Speed Automatic Transaxle')).toBe('8-Speed Automatic')
  })
  it('"Five-Speed Automatic Transaxle" → "5-Speed Automatic"', () => {
    expect(normalizeTransmission('Five-Speed Automatic Transaxle')).toBe('5-Speed Automatic')
  })
  it('"Rebuilt Five-Speed Manual Transaxle" → "5-Speed Manual"', () => {
    expect(normalizeTransmission('Rebuilt Five-Speed Manual Transaxle')).toBe('5-Speed Manual')
  })
  it('handles non-breaking hyphen in "Six‑Speed Manual Transaxle"', () => {
    expect(normalizeTransmission('Six‑Speed Manual Transaxle')).toBe('6-Speed Manual')
  })
  it('"Three-Speed Automatic Transaxle" → "3-Speed Automatic"', () => {
    expect(normalizeTransmission('Three-Speed Automatic Transaxle')).toBe('3-Speed Automatic')
  })
})

// ---------------------------------------------------------------------------
// Regression test — parseBatHtml must pick "Six-Speed Manual Transaxle" over
// "Automatic Climate Control" when both bullets appear in the Listing Details.
// This mirrors the exact bug on VIN WP0CA299X2S650260 (996.2 Carrera Cabriolet).
// ---------------------------------------------------------------------------
describe('parseBatHtml transmission regression', () => {
  it('extracts Six-Speed Manual, not Automatic Climate Control', () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "2002 Porsche 911 Carrera Cabriolet 6-Speed",
    "description": "A clean 996.2 Carrera Cabriolet.",
    "image": "https://example.com/img.jpg"
  }
  </script>
</head>
<body>
  <h3>Listing Details</h3>
  <ul>
    <li>Six-Speed Manual Transaxle</li>
    <li>Lapis Blue Metallic Paint</li>
    <li>Graphite Grey Leather Upholstery</li>
    <li>Gray Soft Top</li>
    <li>Technic Package</li>
    <li>17&quot; 10-Spoke Alloy Wheels</li>
    <li>Porsche Stability Management</li>
    <li>Xenon Headlights</li>
    <li>Heated Power-Adjustable Front Seats</li>
    <li>Porsche CDR-220 Stereo</li>
    <li>Cruise Control</li>
    <li>Automatic Climate Control</li>
  </ul>
  <p>84,000 Miles</p>
</body>
</html>`

    const result = parseBatHtml(html, 'https://bringatrailer.com/listing/2002-porsche-911-carrera-4-cabriolet-8/')
    expect(result.transmission).toBe('6-Speed Manual')
    expect(result.transmission).not.toBe('Automatic Climate Control')
  })

  it('returns null transmission when no bullet matches transmission patterns', () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Product","name":"2002 Porsche 911","description":"Test","image":"https://example.com/img.jpg"}
  </script>
</head>
<body>
  <h3>Listing Details</h3>
  <ul>
    <li>Guards Red Paint</li>
    <li>Black Leather Upholstery</li>
    <li>Automatic Climate Control</li>
    <li>Cruise Control</li>
  </ul>
</body>
</html>`

    const result = parseBatHtml(html, 'https://bringatrailer.com/listing/2002-porsche-911-1/')
    expect(result.transmission).toBeNull()
  })

  it('picks first transmission bullet when two valid transmission bullets appear', () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Product","name":"2010 Porsche 911","description":"Test","image":"https://example.com/img.jpg"}
  </script>
</head>
<body>
  <h3>Listing Details</h3>
  <ul>
    <li>Seven-Speed PDK Dual-Clutch Transaxle</li>
    <li>Guards Red Paint</li>
    <li>Six-Speed Manual Transaxle</li>
  </ul>
</body>
</html>`

    const result = parseBatHtml(html, 'https://bringatrailer.com/listing/2010-porsche-911-1/')
    expect(result.transmission).toBe('7-Speed PDK')
  })
})
