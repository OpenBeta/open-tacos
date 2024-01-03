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

import { SingleEntryForm } from 'app/editArea/[slug]/components/SingleEntryForm'
import { ClimbType } from '@/js/types'
import { climbLeftRightIndexComparator } from '@/js/utils'
import { SortableClimbItem } from './SortableClimbItem'
import { disciplinesToCodes, gradesToString } from '@/js/grades/util'
import useUpdateClimbsCmd from '@/js/hooks/useUpdateClimbsCmd'
import { IndividualClimbChangeInput } from '@/js/graphql/gql/contribs'
import { GradeContexts } from '@/js/grades/Grade'

/**
 * Sort climbs form
 */
export const SortClimbsForm: React.FC<{ parentAreaId: string, climbs: ClimbType[], gradeContext: GradeContexts, canSortClimbs: boolean }> = ({ parentAreaId, climbs, gradeContext, canSortClimbs }) => {
  const router = useRouter()
  const session = useSession({ required: true })
  const { updateClimbCmd } = useUpdateClimbsCmd({
    parentId: parentAreaId,
    accessToken: session?.data?.accessToken as string
  })

  const [enabled, setEnabled] = useState(false)
  const [climbHashmap, setClimbHashmap] = useState<Map<string, ClimbType>>(new Map())
  const [sortedList, setSortedList] = useState<string[]>([])

  useEffect(() => {
    reset()
  }, [enabled, climbs])

  const reset = (): void => {
    const climbMap = new Map([...climbs].sort(climbLeftRightIndexComparator).map(climb => [climb.id, climb]))
    setClimbHashmap(climbMap)
    setSortedList(Array.from(climbMap.keys()))
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
    const updatedList = sortedList.reduce<IndividualClimbChangeInput[]>((acc, curr, index) => {
      const climb = climbHashmap.get(curr)
      if (climb == null) return acc
      const { id, metadata: { leftRightIndex } } = climb
      if (leftRightIndex !== index) {
        acc.push({ id, leftRightIndex: index })
      }
      return acc
    }, [])
    await updateClimbCmd({ parentId: parentAreaId, changes: updatedList })
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
        <SingleEntryForm<{ dummyField: string }>
          title='Sort climbs'
          validationMode='onSubmit'
          alwaysEnableSubmit
          submitHandler={submitHandler}
          helperText='Drag and drop climbs to set their left-to-right order.'
        >
          <div className='flex flex-col gap-6'>
            <div>
              <button
                type='button'
                className='btn btn-primary btn-outline'
                disabled={!canSortClimbs}
                onClick={() => {
                  setEnabled(curr => !curr)
                }}
              >
                {enabled ? 'Cancel' : 'Sort climbs'}
              </button>
            </div>
            {!canSortClimbs &&
              <div className='alert alert-info'>
                <p className='text-sm'>Operation not available.</p>
              </div>}
          </div>

          {enabled && sortedList.length < 2 && (<div>Please create at least 2 climbs.</div>)}

          {enabled && sortedList.length > 2 && (
            <div className='border-t'>
              <p className='mt-4'>Climbs are ordered from left to right.  Drag and drop climbs to change their position.</p>

              <table className='mt-4 table-auto border-separate border-spacing-y-2'>

                <thead>
                  <tr>
                    <th className='border-b border-base-300 py-2'>Position</th>
                    <th className='border-b border-base-300 py-2'>Name</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {sortedList.map((climbId, index) => {
                    const climb = climbHashmap.get(climbId)
                    if (climb == null) return null
                    const { id, name, type, grades, metadata: { leftRightIndex } } = climb
                    const gradeStr = gradesToString(grades, type, gradeContext)
                    const hasChanged = leftRightIndex !== index
                    return (
                      <SortableClimbItem
                        key={id}
                        id={id}
                        className=''
                      >
                        <>
                          <td className={clx('text-center px-2 border-l-4', hasChanged ? 'italic font-medium border-l-warning' : 'text-secondary border-transparent')}>
                            {index + 1}
                          </td>
                          <td className='max-w-sm flex gap-x-4 items-center nowrap overflow-hidden'>
                            <span className='pl-2 truncate max-w-xs overflow-hidden font-medium'>{name}</span>
                            <span className='text-secondary'>{gradeStr}&nbsp;{disciplinesToCodes(type)}</span>
                          </td>
                          <td className='px-2'><DotsSixVertical /></td>
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
