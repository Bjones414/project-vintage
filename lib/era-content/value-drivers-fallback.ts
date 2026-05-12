import type { ValueDriver } from './generation-content'

export const UNIVERSAL_VALUE_DRIVERS: ValueDriver[] = [
  {
    name: 'Mileage',
    description: 'Lower-mileage examples typically command meaningful premiums in the collector market. Documented mileage history and consistent service intervals increase confidence.',
  },
  {
    name: 'Transmission',
    description: 'Manual transmission tends to be valued higher than automatic equivalents in the collector market. This premium has grown as modern cars default increasingly to automatics.',
  },
  {
    name: 'Service history',
    description: 'Full documented service history substantially increases value and buyer confidence. Gaps in records, especially around major service intervals, are a discount factor.',
  },
  {
    name: 'Originality',
    description: 'Unmodified, original-paint cars generally hold value better than modified or repainted examples. Factory Porsche Certificate of Authenticity confirms original configuration.',
  },
  {
    name: 'Color rarity',
    description: 'Rare exterior colors and paint-to-sample examples can add significant premiums over standard colors. Common fleet colors typically trade at a discount to period-correct and unusual options.',
  },
]
