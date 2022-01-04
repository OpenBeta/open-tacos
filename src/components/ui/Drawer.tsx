
import { AreaType } from '../../js/types'
import { getScoreForGrade } from '../../js/utils'
import GradeGraph from './Graphs/GradeGraphs'

interface DrawerProps {
  areas: AreaType[]
  className?: string
}

const Drawer = ({ areas, className = '' }: DrawerProps): JSX.Element => {
  const areaElem = areas.map(a => (
    <div key={a.metadata.area_id} className='pb-4'>
      {a.area_name}
      <div className='text-sm text-gray-600'>{a.aggregate.totalClimbs} climbs</div>
      {/* <TypeBar /> */}
      <GradeGraph grades={a.aggregate.byGrade.filter(g => getScoreForGrade(g.label) < getScoreForGrade('V-easy'))} total={a.aggregate.totalClimbs} bucketType='yds' />
      <GradeGraph grades={a.aggregate.byGrade.filter(g => getScoreForGrade(g.label) > getScoreForGrade('V-easy'))} total={a.aggregate.totalClimbs} bucketType='v-scale' />
    </div>
  ))
  return (
    <div style={{ width: '250px', height: '400px' }} className={`overflow-hidden overscroll-y-contain overflow-y-scroll p-2 border-2 border-slate-200 border-r-0 ${className}`}>
      {areaElem}
      {areaElem === undefined &&
        <div>Select an area on the map to see more info</div>}
    </div>
  )
}
export default Drawer
