import * as React from 'react'
import { useEffect } from 'react'
import ListItem, { ListItemEntity } from './listItem'

interface PanelListProps {
  onFocus: (id: string | null) => void
  onSelect: (id: string | null) => void

  items: ListItemEntity[]
  selected: string | null
  focused: string | null
}

export default function PanelList (props: PanelListProps): JSX.Element {
  useEffect(() => {
    if (props.selected !== null) {
      const selectedElement = document.getElementById(`${props.selected}-xqoops98`)
      if (selectedElement === null) {
        return
      }
      selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [props.selected])

  function reFocusCheck (newId: string | null): void {
    if (props.focused !== newId) {
      props.onFocus(newId)
    } else {
      props.onFocus(null)
    }
  }

  function reClickCheck (newId: string | null): void {
    if (props.selected !== newId) {
      props.onSelect(newId)
    } else {
      props.onSelect(null)
    }
  }

  return (
    <div
      className='pr-3 p-2'
      onMouseLeave={() => props.onFocus(null)}
    >
      {props.items.map(item => (
        <div
          id={`${item.id}-xqoops98`}
          key={item.id}
        >
          <ListItem
            onFocus={reFocusCheck}
            onClick={reClickCheck}
            selected={props.selected === item.id}
            {...item}
          />
        </div>
      ))}
    </div>
  )
}
