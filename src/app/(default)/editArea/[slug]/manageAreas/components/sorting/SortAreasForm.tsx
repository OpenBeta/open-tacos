'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  MouseSensor as LibMouseSensor
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'
import clx from 'classnames'
import { DotsSixVertical } from '@phosphor-icons/react/dist/ssr'

import { SingleEntryForm } from '@/app/(default)/editArea/[slug]/components/SingleEntryForm'
import { AreaType } from '@/js/types'
import { areaLeftRightIndexComparator } from '@/js/utils'
import { SortableClimbItem } from '../../../manageClimbs/components/sorting/SortableClimbItem'
import useUpdateAreasCmd from '@/js/hooks/useUpdateAreasCmd'
import { AreaSortingInput } from '@/js/graphql/gql/contribs'

/**
 * Sort child areas form
 */
export const SortAreasForm: React.FC<{ parentAreaId: string, areas: AreaType[], canEdit: boolean }> = ({ parentAreaId, areas, canEdit }) => {
  const router = useRouter()
  const session = useSession({ required: true })
  const { updateAreasSortingOrderCmd } = useUpdateAreasCmd({
    areaId: parentAreaId,
    accessToken: session?.data?.accessToken as string
  })

  const [enabled, setEnabled] = useState(false)
  const [areaHashmap, setAreaHashmap] = useState<Map<string, AreaType>>(new Map())
  const [sortedList, setSortedList] = useState<string[]>([])

  useEffect(() => {
    reset()
  }, [enabled, areas])

  const reset = (): void => {
    const tempMap = new Map([...areas].sort(areaLeftRightIndexComparator).map(area => [area.uuid, area]))
    setAreaHashmap(tempMap)
    setSortedList(Array.from(tempMap.keys()))
  }

  const sensors = useSensors(
    useSensor(LibMouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function handleDragEnd (event: DragEndEvent): void {
    const { active, over } = event
    if (active.id != null && over?.id != null && active.id !== over.id) {
      const oldIndex = sortedList.indexOf(active.id as string)
      const newIndex = sortedList.indexOf(over.id as string)
      const newList = arrayMove(sortedList, oldIndex, newIndex)
      setSortedList(newList)
    }
  }

  const submitHandler = async (): Promise<void> => {
    const updatedList = sortedList.reduce<AreaSortingInput[]>((acc, curr, index) => {
      const area = areaHashmap.get(curr)
      if (area == null) return acc
      const { uuid, metadata: { leftRightIndex } } = area
      if (leftRightIndex !== index) {
        acc.push({ areaId: uuid, leftRightIndex: index })
      }
      return acc
    }, [])
    await updateAreasSortingOrderCmd(updatedList)
    router.refresh()
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedList}
        strategy={rectSortingStrategy}
      >
        <SingleEntryForm
          title='Sort child areas'
          validationMode='onSubmit'
          alwaysEnableSubmit
          submitHandler={submitHandler}
          helperText='Drag and drop child areas to set their left-to-right order.'
        >
          <div className='flex flex-col gap-6'>
            <div>
              <button
                type='button'
                className='btn btn-primary btn-outline'
                disabled={!canEdit}
                onClick={() => {
                  setEnabled(curr => !curr)
                }}
              >
                {enabled ? 'Cancel' : 'Sort areas'}
              </button>
            </div>
            {!canEdit &&
              <div className='alert alert-info'>
                <p className='text-sm'>Operation not available.  You're editing a crag or a boulder which can't contain child areas.</p>
              </div>}
          </div>
          {enabled &&
        (
          <div className='border-t'>
            <p className='mt-4'>Child areas are ordered from left to right.  Drag and drop areas to change their position.</p>

            <table className='mt-4 table-auto border-separate border-spacing-y-2'>

              <thead>
                <tr>
                  <th className='border-b border-base-300 py-2'>Position</th>
                  <th className='border-b border-base-300 py-2'>Name</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {sortedList.map((areaId, index) => {
                  const area = areaHashmap.get(areaId)
                  if (area == null) return null
                  const { uuid, areaName, metadata: { leftRightIndex } } = area
                  const hasChanged = leftRightIndex !== index
                  return (
                    <SortableClimbItem
                      key={uuid}
                      id={uuid}
                      className=''
                    >
                      <>
                        <td className={clx('text-center px-2 border-l-4', hasChanged ? 'italic font-medium border-l-warning' : 'text-secondary border-transparent')}>
                          {index + 1}
                        </td>
                        <td className='max-w-sm flex gap-x-4 items-center nowrap overflow-hidden'>
                          <span className='pl-2 truncate max-w-xs overflow-hidden font-medium'>{areaName}</span>
                        </td>
                        <td>
                          <DotsSixVertical />
                        </td>
                      </>
                    </SortableClimbItem>
                  )
                })}
              </tbody>

              <tfoot>
                <tr>
                  <td className='border-t border-base-300 py-2' />
                  <td className='border-t border-base-300 text-right py-2'>
                    <button className='btn btn-sm' onClick={reset} type='button'>Reset</button>
                  </td>
                </tr>
              </tfoot>
            </table>

          </div>
        )}
        </SingleEntryForm>
      </SortableContext>
    </DndContext>
  )
}
