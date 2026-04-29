import type { Finding, RuleInput } from './types'
import { mileageVsAverage } from './rules/mileage-vs-average'
import { serviceRecords } from './rules/service-records'
import { modifications } from './rules/modifications'
import { titleStatus } from './rules/title-status'
import { generationWatchout } from './rules/generation-watchout'

const RULES = [
  mileageVsAverage,
  serviceRecords,
  modifications,
  titleStatus,
  generationWatchout,
]

export function runFindingsRules(input: RuleInput): Finding[] {
  const results: Finding[] = []
  for (const rule of RULES) {
    try {
      const finding = rule(input)
      if (finding !== null) results.push(finding)
    } catch (err) {
      console.error('[findings/dispatcher] rule threw unexpectedly', { rule: rule.name, err })
    }
  }
  return results
}
