import YDSFilter from './YDSFilter'
import DisciplineFilter from './DisciplineFilter'
import RadiusFilter from './RadiusFilter'
import Bar from '../../ui/Bar'
import BoulderRangeFilter from './BoulderRangeFilter'

export default function MobileFilters (): JSX.Element {
  return (
    <Bar className='px-4' borderBottom>
      <YDSFilter />
      <BoulderRangeFilter />
      <DisciplineFilter />
      <RadiusFilter />
    </Bar>
  )
}
