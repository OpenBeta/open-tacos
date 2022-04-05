import YDSFilter from '../../YDSFilter'
import DisciplineFilter from './DisciplineFilter'
import Bar from '../../ui/Bar'

export default function MobileFilters (): JSX.Element {
  return (
    <Bar className='lg:hidden px-4'>
      <YDSFilter />
      <DisciplineFilter />
    </Bar>
  )
}
