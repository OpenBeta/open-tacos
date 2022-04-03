import YDSFilter from '../../YDSFilter'
import RadiusFilter from '../../RadiusFilter'
import DisciplineFilter from './DisciplineFilter'

const index = (): JSX.Element => {
  return (
    <div className='z-0 hidden bg-slate-800 w-full pt-4 pb-2 lg:flex no-wrap  items-center space-x-4'>
      <YDSFilter />
      <VerticalDiv />
      <DisciplineFilter />
      <VerticalDiv />
      <RadiusFilter />
    </div>
  )
}

export default index

const VerticalDiv = (): JSX.Element => <span className='w-0.5 h-4 border-l' />
