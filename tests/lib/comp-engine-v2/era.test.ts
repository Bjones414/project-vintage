import { describe, it, expect } from 'vitest'
import { getEra, ERA_ORDINAL, type Era } from '@/lib/comp-engine-v2/era'

describe('getEra — air_cooled generation mapping', () => {
  it.each([
    ['pre-964', 'air_cooled'],
    ['964',     'air_cooled'],
    ['993',     'air_cooled'],
  ] as [string, Era][])('%s → %s', (genId, expected) => {
    expect(getEra(genId)).toBe(expected)
  })
})

describe('getEra — water_cooled_na generation mapping', () => {
  it.each([
    ['996.1', 'water_cooled_na'],
    ['996.2', 'water_cooled_na'],
    ['997.1', 'water_cooled_na'],
    ['997.2', 'water_cooled_na'],
    ['991.1', 'water_cooled_na'],
    ['991.2', 'water_cooled_na'],
    ['986',              'water_cooled_na'],
    ['987.1-boxster',    'water_cooled_na'],
    ['987.2-boxster',    'water_cooled_na'],
    ['981-boxster',      'water_cooled_na'],
    ['982-boxster',      'water_cooled_na'],
    ['987.1-cayman',     'water_cooled_na'],
    ['987.2-cayman',     'water_cooled_na'],
    ['981-cayman',       'water_cooled_na'],
    ['982-cayman',       'water_cooled_na'],
  ] as [string, Era][])('%s → %s', (genId, expected) => {
    expect(getEra(genId)).toBe(expected)
  })
})

describe('getEra — modern_turbo generation mapping', () => {
  it.each([
    ['992.1',        'modern_turbo'],
    ['992.2',        'modern_turbo'],
    ['cayenne-i',    'modern_turbo'],
    ['cayenne-ii',   'modern_turbo'],
    ['cayenne-iii',  'modern_turbo'],
    ['macan-i',      'modern_turbo'],
    ['macan-ii',     'modern_turbo'],
    ['panamera-i',   'modern_turbo'],
    ['panamera-ii',  'modern_turbo'],
    ['taycan-i',     'modern_turbo'],
  ] as [string, Era][])('%s → %s', (genId, expected) => {
    expect(getEra(genId)).toBe(expected)
  })
})

describe('getEra — water_cooled_gt via trim category', () => {
  it.each([
    ['997.2', 'gt3',       'water_cooled_gt'],
    ['997.2', 'gt3_rs',    'water_cooled_gt'],
    ['997.2', 'gt2',       'water_cooled_gt'],
    ['997.2', 'gt2_rs',    'water_cooled_gt'],
    ['991.1', 'gt3',       'water_cooled_gt'],
    ['991.2', 'gt3',       'water_cooled_gt'],
    ['991.2', 'r',         'water_cooled_gt'],
    ['991.2', 'st',        'water_cooled_gt'],
    ['991.2', 'gt3_rs',    'water_cooled_gt'],
    ['981-cayman', 'cayman_gt4',    'water_cooled_gt'],
    ['982-cayman', 'cayman_gt4',    'water_cooled_gt'],
    ['982-cayman', 'cayman_gt4_rs', 'water_cooled_gt'],
    ['981-boxster', 'boxster_gt4',  'water_cooled_gt'],
  ] as [string, string, Era][])('%s + %s → %s', (genId, trim, expected) => {
    expect(getEra(genId, trim)).toBe(expected)
  })
})

describe('getEra — GT trims do NOT promote air_cooled or modern_turbo', () => {
  it('993 gt2 stays air_cooled (993 GT2 is air-cooled era)', () => {
    expect(getEra('993', 'gt2')).toBe('air_cooled')
  })

  it('992.1 gt3 stays modern_turbo (992 GT3 is modern era)', () => {
    expect(getEra('992.1', 'gt3')).toBe('modern_turbo')
  })
})

describe('getEra — null/undefined trim does not break', () => {
  it('null trimCategory → generation-level era', () => {
    expect(getEra('997.2', null)).toBe('water_cooled_na')
  })

  it('undefined trimCategory → generation-level era', () => {
    expect(getEra('997.2', undefined)).toBe('water_cooled_na')
  })

  it('unknown trim → generation-level era', () => {
    expect(getEra('997.2', 'carrera_base')).toBe('water_cooled_na')
  })
})

describe('getEra — unknown generation_id throws', () => {
  it('throws for unknown generation_id', () => {
    expect(() => getEra('unknown-gen')).toThrow(/Unknown generation_id/)
  })

  it('throws with the generation_id in the message', () => {
    expect(() => getEra('abc-fake')).toThrow('abc-fake')
  })
})

describe('ERA_ORDINAL values', () => {
  it('air_cooled = 0', () => expect(ERA_ORDINAL.air_cooled).toBe(0))
  it('water_cooled_na = 1', () => expect(ERA_ORDINAL.water_cooled_na).toBe(1))
  it('water_cooled_gt = 2', () => expect(ERA_ORDINAL.water_cooled_gt).toBe(2))
  it('modern_turbo = 3', () => expect(ERA_ORDINAL.modern_turbo).toBe(3))

  it('ordinals are strictly ordered', () => {
    expect(ERA_ORDINAL.air_cooled).toBeLessThan(ERA_ORDINAL.water_cooled_na)
    expect(ERA_ORDINAL.water_cooled_na).toBeLessThan(ERA_ORDINAL.water_cooled_gt)
    expect(ERA_ORDINAL.water_cooled_gt).toBeLessThan(ERA_ORDINAL.modern_turbo)
  })
})
