import YDSFilter from './YDSFilter'
import DisciplineFilter from './DisciplineFilter'
import RadiusFilter from './RadiusFilter'
import Bar from '../../ui/Bar'
import BoulderRangeFilter from './BoulderRangeFilter'

export default function MobileFilters (): JSX.Element {
  return (
    <Bar className='lg:hidden px-4'>
      <YDSFilter />
      <BoulderRangeFilter />
      <DisciplineFilter />
      <RadiusFilter />
    </Bar>
  )
}
