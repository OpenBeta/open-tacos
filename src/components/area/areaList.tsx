import * as React from 'react'
import { AreaType } from '../../js/types'
import SubAreaItem from './subAreaItem'

interface AreaListProps {
  subAreas: AreaType[]
  onHover: (id: string) => void
}

export default function AreaList (props: AreaListProps): JSX.Element {
  return (
    <div
      onMouseLeave={() => props.onHover(null)}
    >
      {props.subAreas.map(i => <SubAreaItem
        onHover={props.onHover}
        key={i.metadata.areaId}
        subArea={i}
                               />)}
    </div>
  )
}
