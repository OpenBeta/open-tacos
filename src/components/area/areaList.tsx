import * as React from 'react'
import { AreaType } from '../../js/types'
import SubAreaItem from './subAreaItem'

interface AreaListProps {
  subAreas: AreaType[]
  onSelect: (id: string) => void
  selected: string | null
}

export default function AreaList (props: AreaListProps): JSX.Element {
  return (
    <div className='p-1'>
      {props.subAreas.map(i => (
        <SubAreaItem
          onClick={props.onSelect}
          key={i.metadata.areaId}
          subArea={i}
          selected={props.selected === i.id}
        />))}
    </div>
  )
}
