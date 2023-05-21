import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'

interface SortableItemProps {
  id: string
  children: JSX.Element
  disabled: boolean
}

export const SortableItem = (props: SortableItemProps): JSX.Element => {
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
