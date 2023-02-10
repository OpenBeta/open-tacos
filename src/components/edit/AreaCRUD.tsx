import clx from 'classnames'
import { AreaType } from '../../js/types'
import { AreaSummaryType } from '../crag/cragSummary'
import { DeleteAreaTrigger, AddAreaTrigger, AddAreaTriggerButtonMd, AddAreaTriggerButtonSm, DeleteAreaTriggerButtonSm } from './Triggers'
import { AreaEntityIcon } from '../EntityIcons'
import NetworkSquareIcon from '../../assets/icons/network-square-icon.svg'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

export type AreaCRUDProps = Pick<AreaType, 'uuid' | 'areaName'> & {
  childAreas: any
  editMode: boolean
  onChange: () => void
}

/**
 * Responsible for rendering child areas table (Read) and Create/Update/Delete operations.
 * @param onChange notify parent of any changes
 */

export const AreaCRUD = ({ uuid: parentUuid, areaName: parentName, childAreas, editMode, onChange }: AreaCRUDProps): JSX.Element => {
  const areaCount = childAreas.length

  const [state, setState] = useState<any | undefined>()

  useEffect(() => {
    if (childAreas !== undefined) {
      setState({ areas: childAreas })
    }
  }, [childAreas])

  const reorder = (list, startIndex, endIndex): object => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  function onDragEnd (result): void {
    /* if (!result.destination) {
      return
    } */

    if (result.destination.index === result.source.index) {
      return
    }

    const areas = reorder(
      state?.areas,
      result.source.index,
      result.destination.index
    )

    setState({ areas })
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

      <hr className='mt-4 mb-8 border-1 border-base-content' />

      {areaCount === 0 && (
        <div>
          <div className='mb-8 italic text-base-300'>This area doesn't have any child areas.</div>
          {editMode && <AddAreaTrigger parentName={parentName} parentUuid={parentUuid} onSuccess={onChange} />}
        </div>)}

      {state !== undefined && (
        <DragDropContext
          onDragEnd={onDragEnd}
        >
          <Droppable droppableId='cragTable'>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`two-column-table ${editMode ? '' : 'xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2'
                  }  fr-2`}
              >
                {state?.areas?.map((i, idx) => (
                  <Draggable
                    isDragDisabled={!editMode}
                    draggableId={i.uuid}
                    index={idx}
                    key={i.uuid}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={
                          `${snapshot.isDragging ? 'bg-purple-100' : 'bg-white'}`
}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <AreaItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          key={i.uuid}
                          index={idx}
                          borderBottom={idx === Math.ceil(areaCount / 2) - 1}
                          parentUuid={parentUuid}
                          {...i}
                          editMode={editMode}
                          onChange={onChange}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
    <div className={clx('area-row')}>
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
