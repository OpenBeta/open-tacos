import YDSFilter from './YDSFilter'
import RadiusFilter from './RadiusFilter'
import BoulderRangeFilter from './BoulderRangeFilter'
import DisciplineFilter from './DisciplineFilter'
import Bar from '../../ui/Bar'

export function FilterBar (): JSX.Element {
  return (
    <Bar
      className='hidden z-20 fixed left-0 top-16 lg:flex gap-x-4 w-full'
      layoutClass={Bar.JUSTIFY_LEFT}
      backgroundClass='bg-slate-800'
    >
      <YDSFilter isMobile={false} />
      <VerticalDiv />
      <BoulderRangeFilter />
      <VerticalDiv />
      <DisciplineFilter isMobile={false} />
      <VerticalDiv />
      <RadiusFilter isMobile={false} />
    </Bar>
  )
}

const VerticalDiv = (): JSX.Element => <span className='w-0.5 h-4 border-l' />
