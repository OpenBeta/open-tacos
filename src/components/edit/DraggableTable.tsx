import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React, { useState } from 'react'

export interface DraggableTableProps {
  rowIds: string[]
  editMode: boolean
  onDragEnd: (reorderedRows: string[]) => void
  renderRow: (rowId: string, idx: number) => JSX.Element
}

/**
 * Table that can be re-ordered by dragging rows about. The table is two-columned by default.
 * @param rowIds Unique string to identify each row.
 * @param editMode Enables rows in the table to be dragged.
 * @param onDragEnd Function that is executed when a drag is complete. Typically used for data submission.
 * @param renderRow Function that renders a row given the rowId and index of the row.
 */
export const DraggableTable = ({ rowIds, editMode, onDragEnd, renderRow }: DraggableTableProps): JSX.Element => {
  const [rowsSortedState, setRowsSortedState] = useState<string[]>(rowIds)
  const [draggedRow, setDraggedRow] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  function handleDragEnd (event): void {
    const { active, over } = event
    setDraggedRow(null)

    if (active.id !== over.id) {
      const oldIndex = rowsSortedState.indexOf(active.id)
      const newIndex = rowsSortedState.indexOf(over.id)
      const reorderedRows = arrayMove(rowsSortedState, oldIndex, newIndex)
      setRowsSortedState(reorderedRows)
      onDragEnd(reorderedRows)
    }
  }

  function handleDragStart (event): void {
    const { active } = event
    if (active.id != null) {
      setDraggedRow(active.id)
    }
  }

  return (
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
          items={rowsSortedState}
          strategy={rectSortingStrategy}
        >
          {rowsSortedState.map((rowId, idx) => (
            <SortableItem id={rowId} key={rowId} disabled={!editMode}>
              {renderRow(rowId, idx)}
            </SortableItem>
          ))}
        </SortableContext>
      </div>
      <DragOverlay>
        {draggedRow != null
          ? (
            <div className='bg-purple-100'>
              {renderRow(draggedRow, rowsSortedState.indexOf(draggedRow))}
            </div>
            )
          : null}
      </DragOverlay>
    </DndContext>
  )
}

interface SortableItemProps {
  id: string
  children: JSX.Element
  disabled: boolean
}

const SortableItem = (props: SortableItemProps): JSX.Element => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.id, disabled: props.disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </div>
  )
}
