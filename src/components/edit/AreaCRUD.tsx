import clx from 'classnames'
import { AreaType } from '../../js/types'
import { AreaSummaryType } from '../crag/cragLayout'
import { DeleteAreaTrigger, AddAreaTrigger, AddAreaTriggerButtonMd, AddAreaTriggerButtonSm, DeleteAreaTriggerButtonSm } from './Triggers'

export type AreaCRUDProps = Pick<AreaType, 'uuid'|'areaName'> & {
  childAreas: AreaSummaryType[]
  editMode: boolean
  onChange: () => void
}

/**
 * Responsible for rendering child areas table (Read) and Create/Update/Delete operations.
 * @param onChange notify parent of any changes
 */
export const AreaCRUD = ({ uuid: parentUuid, areaName: parentName, childAreas, editMode, onChange }: AreaCRUDProps): JSX.Element => {
  const areaCount = childAreas.length
  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h3>Areas</h3>
          {editMode && (
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
          {editMode && <AddAreaTrigger parentName={parentName} parentUuid={parentUuid} onSuccess={onChange} />}
        </div>)}

      {/* Build 2 column table on large screens */}
      <div className='two-column-table'>
        {childAreas.map((props, index) => (
          <AreaItem
            key={props.uuid}
            index={index}
            borderBottom={index === Math.ceil(areaCount / 2) - 1}
            parentUuid={parentUuid}
            {...props}
            editMode={editMode}
            onChange={onChange}
          />))}

        {/* A hack to add bottom border */}
        {areaCount > 2 && <div className='border-t' />}
      </div>
      {areaCount > 0 && editMode && (
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
  borderBottom: boolean
  parentUuid: string
  editMode?: boolean
  onChange: () => void
}

/**
 * Individual area entry
 * @param endOfFirstColumn true to indicate this is the last item in the first column
 */
export const AreaItem = ({ index, borderBottom, areaName, uuid, parentUuid, onChange, editMode = false, climbs, children }: AreaItemProps): JSX.Element => {
  // undefined array can mean we forget to include the field in GQL so make it not editable
  const canEdit = (children?.length ?? 1) === 0 && (climbs?.length ?? 1) === 0
  return (
    <div className={clx('flex flex-rows flex-nowrap gap-4 items-center border-t break-inside-avoid-column break-inside-avoid', borderBottom ? 'border-b' : '')}>
      {/* Use regular 'a' tag instead of Link because of a data caching issue with client-side routing. We'll revisit this in the future. */}
      <a className='flex items-center gap-4 grow py-6' href={`/crag/${uuid}`}>
        <div className='rounded h-8 w-8 grid place-content-center bg-base-content/80 text-base-100 text-sm hover:decoration-0 hover:no-underline'>{index + 1}</div>
        <div className='font-semibold uppercase'>
          {areaName}
        </div>
      </a>

      {editMode && (
        <div className='text-base-300'>
          <DeleteAreaTrigger
            areaName={areaName}
            areaUuid={uuid}
            parentUuid={parentUuid}
            returnToParentPageAfterDelete={false}
            onSuccess={onChange}
          >
            <DeleteAreaTriggerButtonSm disabled={!canEdit} />
          </DeleteAreaTrigger>
        </div>)}
    </div>

  )
}
