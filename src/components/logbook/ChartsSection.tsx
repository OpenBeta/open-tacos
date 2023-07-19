import { TickType } from '../../js/types'
import DifficultyPyramid from './DifficultyPyramid'
import OverviewChart from './OverviewChart'

export interface ChartsSectionProps {
  tickList: TickType[]
}
const ChartsSection: React.FC<ChartsSectionProps> = ({ tickList }) => {
  return (
    <section className='flex flex-col gap-6'>
      <OverviewChart tickList={tickList} />
      <DifficultyPyramid tickList={tickList} />
    </section>
  )
}

export default ChartsSection
