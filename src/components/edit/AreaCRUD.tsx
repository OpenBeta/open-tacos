import clx from 'classnames'
import { useSession } from 'next-auth/react'
import React from 'react'

import { DeleteAreaTrigger, AddAreaTrigger, AddAreaTriggerButtonMd, AddAreaTriggerButtonSm, DeleteAreaTriggerButtonSm } from './Triggers'
import { AreaSummaryType } from '../crag/cragSummary'
import { AreaEntityIcon } from '../EntityIcons'
import NetworkSquareIcon from '../../assets/icons/network-square-icon.svg'
import useUpdateAreasCmd from '../../js/hooks/useUpdateAreasCmd'
import { AreaType } from '../../js/types'
import { DraggableTable } from './DraggableTable'

export type AreaCRUDProps = Pick<AreaType, 'uuid' | 'areaName'> & {
  childAreas: AreaType[]
  editMode: boolean
  onChange: () => void
}

/**
 * Responsible for rendering child areas table (Read) and Create/Update/Delete operations.
 * @param onChange notify parent of any changes
 */

export const AreaCRUD = ({ uuid: parentUuid, areaName: parentName, childAreas, editMode, onChange }: AreaCRUDProps): JSX.Element => {
  const session = useSession()
  const areaCount = childAreas.length
  // Prepare {uuid: <AreaType>} mapping to avoid passing entire areas around.
  const areaStore = new Map(childAreas.map(a => [a.uuid, a]))

  const { updateAreasSortingOrderCmd } = useUpdateAreasCmd({
    areaId: parentUuid,
    accessToken: session?.data?.accessToken as string ?? ''
  })

  function onDragEnd (reorderedChildAreas: string[]): void {
    void updateAreasSortingOrderCmd(reorderedChildAreas.map((uuid, idx) => ({ areaId: uuid, leftRightIndex: idx })))
  }

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
        {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
        <span className='text-base-300 text-sm'>{areaCount > 0 && `Total: ${areaCount}`}</span>
      </div>

      <hr className='mt-4 border-1 border-base-content' />

      {areaCount === 0 && (
        <div>
          <div className='mb-8 italic text-base-300'>This area doesn't have any child areas.</div>
          {editMode && <AddAreaTrigger parentName={parentName} parentUuid={parentUuid} onSuccess={onChange} />}
        </div>)}

      {areaCount > 0 && (
        <DraggableTable
          rowIds={Array.from(areaStore.keys())}
          editMode={editMode}
          onDragEnd={onDragEnd}
          renderRow={(areaId: string, idx: number) => {
            return (
              <AreaItem
                index={idx}
                borderBottom={[Math.ceil(areaCount / 2) - 1, areaCount - 1].includes(idx)}
                parentUuid={parentUuid}
                {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
              ...areaStore.get(areaId)!}
                editMode={editMode}
                onChange={onChange}
              />
            )
          }}
        />
      )}
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
      <a href={`/crag/${uuid}`} className='area-entity-box'>
        {index + 1}
      </a>
      <a href={`/crag/${uuid}`} className='flex flex-col items-start items-stretch grow gap-y-1'>
        <div className='font-semibold uppercase thick-link'>
          {areaName}
        </div>
        <div className='flex gap-2 items-center'>
          {!isLeaf && <NetworkSquareIcon className='stroke-base-200 w-6 h-6' />}
          <span className='mt-0.5 text-sm text-base-200'>
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
