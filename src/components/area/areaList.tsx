import * as React from 'react'
import { AreaType } from '../../js/types'
import SubAreaItem from './subAreaItem'

interface AreaListProps {
  subAreas: AreaType[]
  onFocus: (id: string | null) => void
  selected: string | null
}

export default function AreaList (props: AreaListProps): JSX.Element {
  function reFocusCheck (newId: string | null): void {
    if (props.selected !== newId) {
      props.onFocus(newId)
    } else {
      props.onFocus(null)
    }
  }

  return (
    <div className='p-1' onMouseLeave={() => props.onFocus(null)}>
      {props.subAreas.map(i => (
        <SubAreaItem
          onFocus={reFocusCheck}
          key={i.metadata.areaId}
          subArea={i}
          selected={props.selected === i.id}
        />))}
    </div>
  )
}
