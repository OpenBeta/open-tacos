import Link from 'next/link'
import * as React from 'react'
import { AreaType } from '../../js/types'
import { getSlug } from '../../js/utils'

export default function SubAreaItem ({ subArea, onHover }:
{ subArea: AreaType, onHover: (id: string) => void }): JSX.Element {
  return (
    <Link
      href={getSlug(subArea.metadata.areaId, subArea.metadata.leaf)}
      passHref
    >
      <div
        title={subArea.content?.description}
        onMouseEnter={() => onHover(subArea.id)}
        className='p-3 border-b hover:bg-slate-100 cursor-pointer'
        id={subArea.id}
      >
        <h4 className='text-lg font-semibold'>{subArea.areaName}</h4>
        <div>{subArea.totalClimbs !== 0 ? subArea.totalClimbs : 'No'} Climbs in Area</div>
      </div>
    </Link>
  )
}
