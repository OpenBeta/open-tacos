import * as React from 'react'
import { AreaType } from '../../js/types'

export default function SubAreaItem ({ subArea, onHover }:
{subArea: AreaType, onHover: (id: string) => void}): JSX.Element {
  return (
    <div
      onMouseEnter={() => onHover(subArea.id)}
      className='p-3 border-b hover:bg-slate-100 cursor-pointer' id={subArea.id}
    >
      <h4 className='text-lg font-semibold'>{subArea.areaName}</h4>
      <div>{subArea.totalClimbs !== 0 ? subArea.totalClimbs : 'No'} Climbs in Area</div>
    </div>
  )
}
