import { describe, it, expect } from 'vitest'
import { computeInitials } from '@/lib/initials'

describe('computeInitials', () => {
  it('uses first and last name initials when both are present', () => {
    expect(computeInitials('Blake', 'Jones', 'b@example.com')).toBe('BJ')
  })

  it('uses only the first name initial when last name is absent', () => {
    expect(computeInitials('Blake', null, 'b@example.com')).toBe('B')
  })

  it('falls back to email first character when no name is present', () => {
    expect(computeInitials(null, null, 'rangersfanaz@gmail.com')).toBe('R')
  })

  it('returns ? when all inputs are null', () => {
    expect(computeInitials(null, null, null)).toBe('?')
  })

  it('uppercases all outputs', () => {
    expect(computeInitials('blake', 'jones', null)).toBe('BJ')
    expect(computeInitials('blake', null, null)).toBe('B')
    expect(computeInitials(null, null, 'foo@bar.com')).toBe('F')
  })

  it('ignores last name when first name is empty string, falls back to email', () => {
    expect(computeInitials('', 'Jones', 'rangersfanaz@gmail.com')).toBe('R')
  })
})
