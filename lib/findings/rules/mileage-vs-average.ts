import type { RuleFn } from '../types'

// TODO: porsche_generations has no average_mileage_at_year column.
// This rule is dormant until reference data is populated.
export const mileageVsAverage: RuleFn = (_input) => null
