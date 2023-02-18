import clx from 'classnames'
import { AreaType } from '../../js/types'
import { AreaSummaryType } from '../crag/cragSummary'
import { DeleteAreaTrigger, AddAreaTrigger, AddAreaTriggerButtonMd, AddAreaTriggerButtonSm, DeleteAreaTriggerButtonSm } from './Triggers'
import { AreaEntityIcon } from '../EntityIcons'

export type AreaCRUDProps = Pick<AreaType, 'uuid' | 'areaName'> & {
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
          <h3 className='flex items-center gap-4'><AreaEntityIcon />Areas</h3>
          {editMode && (
            <AddAreaTrigger parentName={parentName} parentUuid={parentUuid} onSuccess={onChange}>
              <AddAreaTriggerButtonSm />
            </AddAreaTrigger>)}
        </div>
        <span className='text-base-300 text-sm'>{areaCount > 0 && `Total: ${areaCount}`}</span>
      </div>

      <hr className='mt-4 border-1 border-base-content' />

      {areaCount === 0 && (
        <div>
          <div className='mb-8 italic text-base-300'>This area doesn't have any child areas.</div>
          {editMode && <AddAreaTrigger parentName={parentName} parentUuid={parentUuid} onSuccess={onChange} />}
        </div>)}

      <div className='two-column-table'>
        {childAreas.map((props, index) => (
          <AreaItem
            key={props.uuid}
            index={index}
            borderBottom={false}
            parentUuid={parentUuid}
            {...props}
            editMode={editMode}
            onChange={onChange}
          />))}

        {/* A hack to add bottom border */}
        {areaCount > 1 && <div className='border-t' />}
      </div>
      {areaCount > 0 && editMode && (
        <div className='mt-8 md:text-right'>
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
 * @param borderBottom true add a bottom border
 */
export const AreaItem = ({ index, borderBottom, areaName, uuid, parentUuid, onChange, editMode = false, climbs, children, ...props }: AreaItemProps): JSX.Element => {
  // undefined array can mean we forget to include the field in GQL so let's make it not editable
  const canEdit = (children?.length ?? 1) === 0 && (climbs?.length ?? 1) === 0

  const { totalClimbs, metadata: { leaf, isBoulder } } = props
  const isLeaf = leaf || isBoulder
  return (
    <div className={clx('area-row', borderBottom ? 'border-b' : '')}>
      <a href={`/crag/${uuid}`} className='flex items-start items-stretch grow gap-y-1'>
        <div className='font-semibold uppercase thick-link mr-2'>
          {areaName}
        </div>
        <div className='flex gap-2 items-center'>
          <span className='mt-0.5 text-sm text-base-200'>
            {isBoulder && isLeaf && <span>Boulder • </span>}
            {!isBoulder && isLeaf && <span>Crag • </span>}
            {!isLeaf && <span>Area • </span>}
            <span>{totalClimbs ?? 0} climbs • {children?.length ?? 0} areas</span>
          </span>
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
