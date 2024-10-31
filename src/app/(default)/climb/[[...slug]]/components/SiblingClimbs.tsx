import { ClimbList } from '@/app/(default)/editArea/[slug]/general/components/climb/ClimbListForm'
import { AreaType } from '@/js/types'

/**
 * Show sibling climbs
 */
export const SiblingClimbs: React.FC<{ parentArea: AreaType, climbId: string }> = ({
  parentArea,
  climbId
}) => {
  return (
    <>
      <h4>
        Routes in{' '}
        {parentArea.areaName.includes(', The')
          ? 'The '.concat(parentArea.areaName.slice(0, -5))
          : parentArea.areaName}
      </h4>
      <hr className='mt-2 mb-2 border-1 border-base-content' />
      <ClimbList
        gradeContext={parentArea.gradeContext}
        climbs={parentArea.climbs}
        areaMetadata={parentArea.metadata}
        routePageId={climbId}
        editMode={false}
      />
    </>
  )
}
