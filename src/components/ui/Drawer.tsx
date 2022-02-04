
import { AreaType } from '../../js/types'
import { GradeScales, isVScale } from '@openbeta/sandbag'
import GradeGraph from './Graphs/GradeGraphs'

interface DrawerProps {
  areas: AreaType[]
  className?: string
}

const Drawer = ({ areas, className = '' }: DrawerProps): JSX.Element => {
  const areaElem = areas.map(a => (
    <div key={a.metadata.area_id} className='pb-4'>
      {a.area_name}
      <div className='text-sm text-gray-600'>{a.totalClimbs} climbs</div>
      {/* <TypeBar /> */}
      <GradeGraph grades={a.aggregate.byGrade.filter(g => isVScale(g.label) === false)} total={a.totalClimbs} bucketType={GradeScales.Yds} />
      <GradeGraph
        grades={a.aggregate.byGrade.filter((g): boolean => isVScale(g.label))} total={a.totalClimbs} bucketType={GradeScales.VScale}
      />
    </div>
  ))
  return (
    <div style={{ width: '250px', height: '400px' }} className={`overflow-hidden overscroll-y-contain overflow-y-scroll p-2 border-2 border-slate-200 border-r-0 ${className}`}>
      {areaElem}
      {areas.length === 0 &&
        <div>Select an area on the map to see more info</div>}
    </div>
  )
}
export default Drawer
