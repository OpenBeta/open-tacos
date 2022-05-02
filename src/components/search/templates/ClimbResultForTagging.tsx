import { MiniCrumbs } from '../../ui/BreadCrumbs'
import RouteGradeChip from '../../ui/RouteGradeChip'
import RouteTypeChips from '../../ui/RouteTypeChips'
import { disciplineArrayToObj } from '../../../js/utils'

/**
 * Define how to render each search result entry
 */
export function MiniClimbItem ({ item }): JSX.Element {
  const { climbName, areaNames, grade, safety, disciplines } = item
  return (
    <div className='z-50 pointer-events-auto' onClick={() => console.log('#onClick')}>
      <a href='/'>Home</a>
      <div
        className='text-primary text-sm font-semibold' onClick={(event) => {
          console.log('#onClick')
        }}
      >{climbName}
      </div>
      <div className='inline-flex items-center space-x-0.5'>
        <RouteGradeChip grade={grade} safety={safety} size={RouteGradeChip.Size.sm} />
        <RouteTypeChips type={disciplineArrayToObj(disciplines)} size='sm' />
      </div>
      <MiniCrumbs pathTokens={areaNames} />
    </div>
  )
}
