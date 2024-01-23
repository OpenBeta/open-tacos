import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import clx from 'classnames'

interface SortableItemProps {
  id: string
  children: JSX.Element
  className: string
}

export const SortableClimbItem: React.FC<SortableItemProps> = ({ id, className, children }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={
        clx(className,
          'drop-shadow',
          isDragging ? 'text-neutral-content bg-neutral cursor-move' : 'hover:bg-base-200')
      }
    >
      {children}
    </tr>
  )
}
