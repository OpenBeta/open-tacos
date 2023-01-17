import { AreaType } from '../../js/types'
import { AreaSummaryType } from '../crag/cragLayout'
import { DeleteAreaTrigger, AddAreaTrigger, AddAreaTriggerButtonMd, AddAreaTriggerButtonSm, DeleteAreaTriggerButtonSm } from './Triggers'

export type AreaCRUDProps = Pick<AreaType, 'uuid'|'areaName'> & {
  childAreas: AreaSummaryType[]
  canEdit: boolean
  onChange: () => void
}

/**
 * Responsible for rendering child areas table (Read) and Create/Update/Delete operations.
 * @param onChange notify parent of any changes
 */
export const AreaCRUD = ({ uuid: parentUuid, areaName: parentName, childAreas, canEdit, onChange }: AreaCRUDProps): JSX.Element => {
  const areaCount = childAreas.length
  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h3>Areas</h3>
          {canEdit && (
            <AddAreaTrigger parentName={parentName} parentUuid={parentUuid} onSuccess={onChange}>
              <AddAreaTriggerButtonSm />
            </AddAreaTrigger>)}
        </div>
        <span className='text-base-300 text-sm'>{areaCount > 0 && `Total: ${areaCount}`}</span>
      </div>

      <hr className='mt-1 mb-8 border-1 border-base-content' />

      {areaCount === 0 && (
        <div>
          <div className='mb-8 italic text-base-300'>This area doesn't have any child areas.</div>
          {canEdit && <AddAreaTrigger parentName={parentName} parentUuid={parentUuid} onSuccess={onChange} />}
        </div>)}

      {/* Build the table */}
      <div className='mt-16 lg:gap-x-24 lg:columns-2 divide-y'>
        {childAreas.map((props, index) => <AreaItem key={props.uuid} index={index} parentUuid={parentUuid} {...props} canEdit={canEdit} onChange={onChange} />)}

        {/* A hack to add bottom border */}
        {areaCount > 2 && <div className='border-t' />}
      </div>

      {areaCount > 0 && canEdit && (
        <div className='mt-8 text-right'>
          <AddAreaTrigger parentName={parentName} parentUuid={parentUuid} onSuccess={onChange}>
            <AddAreaTriggerButtonMd />
          </AddAreaTrigger>
        </div>)}
    </>
  )
}

type AreaItemProps = AreaSummaryType & {
  index: number
  parentUuid: string
  canEdit?: boolean
  onChange: () => void
}

/**
 * Individual area entry
 */
export const AreaItem = ({ index, areaName, uuid, parentUuid, onChange, canEdit = false }: AreaItemProps): JSX.Element => {
  return (
    <div className='flex flex-rows flex-nowrap gap-4 items-center break-inside-avoid-column break-inside-avoid first:border-t'>
      {/* Use regular 'a' tag instead of Link because of a data caching issue with client-side routing. We'll revisit this in the future. */}
      <a className='flex items-center gap-4 grow py-6' href={`/crag/${uuid}`}>
        <div className='rounded h-8 w-8 grid place-content-center bg-base-content/80 text-base-100 text-sm hover:decoration-0 hover:no-underline'>{index + 1}</div>
        <div className='font-semibold uppercase'>
          {areaName}
        </div>
      </a>

      {canEdit && (
        <div className='text-base-300'>
          <DeleteAreaTrigger
            areaName={areaName}
            areaUuid={uuid}
            parentUuid={parentUuid}
            disabled={false}
            returnToParentPageAfterDelete={false}
            onSuccess={onChange}
          >
            <DeleteAreaTriggerButtonSm disabled={!canEdit} />
          </DeleteAreaTrigger>
        </div>)}
    </div>

  )
}
