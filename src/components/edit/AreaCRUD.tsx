import type { MouseEvent } from 'react'
import clx from 'classnames'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  MouseSensor as LibMouseSensor
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

import { SortableItem } from './SortableItem'
import { DeleteAreaTrigger, AddAreaTrigger, AddAreaTriggerButtonMd, AddAreaTriggerButtonSm, DeleteAreaTriggerButtonSm } from './Triggers'
import { AreaSummaryType } from '../crag/cragSummary'
import { AreaEntityIcon } from '../EntityIcons'
import NetworkSquareIcon from '../../assets/icons/network-square-icon.svg'
import useUpdateAreasCmd from '../../js/hooks/useUpdateAreasCmd'
import { AreaType } from '../../js/types'

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

  const [areasSortedState, setAreasSortedState] = useState<string[]>(Array.from(areaStore.keys()))
  const [draggedArea, setDraggedArea] = useState<string | null>(null)

  useEffect(() => {
    setAreasSortedState(Array.from(areaStore.keys()))
  }, [childAreas])

  const { updateAreasSortingOrderCmd } = useUpdateAreasCmd({
    areaId: parentUuid,
    accessToken: session?.data?.accessToken as string ?? ''
  })

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function handleDragEnd (event: DragEndEvent): void {
    const { active, over } = event
    setDraggedArea(null)

    if (active.id != null && over?.id != null && active.id !== over.id) {
      const oldIndex = areasSortedState.indexOf(active.id as string)
      const newIndex = areasSortedState.indexOf(over.id as string)
      const reorderedChildAreas = arrayMove(areasSortedState, oldIndex, newIndex)
      void updateAreasSortingOrderCmd(reorderedChildAreas.map((uuid, idx) => ({ areaId: uuid, leftRightIndex: idx })))
      setAreasSortedState(reorderedChildAreas)
    }
  }

  function handleDragStart (event: DragStartEvent): void {
    const { active } = event
    if (active.id != null) {
      setDraggedArea(active.id as string)
    }
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h3 className='flex items-center gap-4'><AreaEntityIcon />Areas</h3>
          <AddAreaTrigger parentName={parentName} parentUuid={parentUuid} onSuccess={onChange}>
            <AddAreaTriggerButtonSm />
          </AddAreaTrigger>
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <div
            className={`two-column-table ${editMode ? '' : 'xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2'
              }  fr-2`}
          >
            <SortableContext
              items={areasSortedState}
              strategy={rectSortingStrategy}
            >
              {areasSortedState.map((uuid, idx) => {
                const areaProps = areaStore.get(uuid)
                if (areaProps == null || Object.keys(areaProps).length === 0) return null
                return (
                  <SortableItem id={uuid} key={uuid} disabled={!editMode}>
                    <AreaItem
                      index={idx}
                      borderBottom={[Math.ceil(areaCount / 2) - 1, areaCount - 1].includes(idx)}
                      parentUuid={parentUuid}
                      {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                      ...areaProps}
                      editMode={editMode}
                      onChange={onChange}
                    />
                  </SortableItem>
                )
              })}
            </SortableContext>
          </div>
          <DragOverlay>
            {draggedArea != null
              ? (
                <div className='bg-purple-100'>
                  <AreaItem
                    index={areasSortedState.indexOf(draggedArea)}
                    borderBottom
                    parentUuid={parentUuid}
                    {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                    ...areaStore.get(draggedArea)!}
                    editMode={editMode}
                    onChange={onChange}
                  />
                </div>
                )
              : null}
          </DragOverlay>
        </DndContext>
      )}
      {areaCount > 0 && editMode && (
        <div className='mt-8 md:text-right'>
          <AddAreaTrigger data-no-dnd='true' parentName={parentName} parentUuid={parentUuid} onSuccess={onChange}>
            <AddAreaTriggerButtonMd data-no-dnd='true' />
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
export const AreaItem = ({ index, borderBottom, areaName, uuid, parentUuid, onChange, editMode = false, climbs, children, ...props }: AreaItemProps): JSX.Element | null => {
  // undefined array can mean we forget to include the field in GQL so let's make it not editable
  const canEdit = (children?.length ?? 1) === 0 && (climbs?.length ?? 1) === 0

  const { totalClimbs, metadata: { leaf, isBoulder } } = props
  const isLeaf = leaf || isBoulder
  return (
    <div className={clx('area-row', borderBottom ? 'border-b' : '')}>
      <a href={`/crag/${uuid}`} className='area-entity-box' data-no-dnd='true'>
        {index + 1}
      </a>
      <a href={`/crag/${uuid}`} className='flex flex-col items-start items-stretch grow gap-y-1' data-no-dnd='true'>
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

/**
 * A custom MouseSensor for DnD to ignore elements with `data-no-dnd='true'` attribute.
 * Without this handler the DnD component will capture all mouse events on its items.
 * See https://github.com/clauderic/dnd-kit/pull/377#issuecomment-991842782
 */
export class MouseSensor extends LibMouseSensor {
  static activators = [
    {
      eventName: 'onMouseDown' as const,
      handler: ({ nativeEvent: event }: MouseEvent) => {
        return shouldHandleEvent(event.target as HTMLElement)
      }
    }
  ]
}

function shouldHandleEvent (element: HTMLElement | null): boolean {
  let cur = element

  while (cur != null) {
    if (cur.dataset?.noDnd === 'true') {
      return false
    }
    cur = cur.parentElement
  }

  return true
}
