import { TickType } from '../../js/types'
import ActivityHeat from './ActivityHeat'
import DifficultyPyramid from './DifficultyPyramid'
import OverviewChart from './OverviewChart'
import Stats from './Stats'
export interface ChartsSectionProps {
  tickList: TickType[]
}
const ChartsSection: React.FC<ChartsSectionProps> = ({ tickList }) => {
  const sortedList = tickList.sort((a, b) => a.dateClimbed - b.dateClimbed)
  return (
    <section className='flex flex-col gap-6'>
      <Stats tickList={sortedList} />
      <ActivityHeat tickList={sortedList} />
      <OverviewChart tickList={sortedList} />
      <DifficultyPyramid tickList={tickList} />
    </section>
  )
}

export default ChartsSection
