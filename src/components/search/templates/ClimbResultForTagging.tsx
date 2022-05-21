import { MiniCrumbs } from '../../ui/BreadCrumbs'
import RouteGradeChip from '../../ui/RouteGradeChip'
import RouteTypeChips from '../../ui/RouteTypeChips'
import { disciplineArrayToObj } from '../../../js/utils'
import { TypesenseDocumentType } from '../../../js/types'

interface ItemProps {
  item: TypesenseDocumentType
}

/**
 * Define how to render each search result entry
 */
export function MiniClimbItem ({ item }: ItemProps): JSX.Element {
  const { climbName, areaNames, grade, safety, disciplines } = item
  return (
    <div>
      <div
        className='text-primary text-sm font-semibold'
      >
        {climbName}
      </div>
      <div className='inline-flex items-center space-x-0.5'>
        <RouteGradeChip grade={grade} safety={safety} size={RouteGradeChip.Size.sm} />
        <RouteTypeChips type={disciplineArrayToObj(disciplines)} size='sm' />
      </div>
      <MiniCrumbs pathTokens={areaNames} />
    </div>
  )
}
