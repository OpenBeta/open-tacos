import { forwardRef } from 'react'
import Link from 'next/link'
import { Graph, ShareNetwork, LineSegments, Cube } from '@phosphor-icons/react/dist/ssr'
import { Icon, IconProps } from '@phosphor-icons/react'

import { AreaType } from '@/js/types'
import { DeleteAreaTrigger, DeleteAreaTriggerButtonSm } from '@/components/edit/Triggers'

type EType = 'area' | 'crag' | 'boulder' | 'climb'

const CragIcon = forwardRef<any, IconProps>((props, ref) => <ShareNetwork ref={ref} {...props} className='p-1 rotate-90' />)

const IconMap: Record<EType, Icon> = {
  area: Graph,
  crag: CragIcon,
  boulder: Cube,
  climb: LineSegments
}

export const EntityIcon: React.FC<{ type: EType, withLabel?: boolean }> = ({ type, withLabel = true }) => {
  const IconComponent = IconMap?.[type]
  if (IconComponent == null) return null
  return (
    <div className='flex gap-1.5 items-center'>
      <IconComponent size={20} weight='duotone' />
      <span className='text-xs text-secondary font-light'>{type.toUpperCase()}</span>
    </div>
  )
}

export const AreaItem: React.FC<{ area: AreaType, parentUuid: string, index: number }> = ({ area, index, parentUuid }) => {
  const { uuid, areaName } = area
  return (
    <div className='card card-compact w-full bg-base-100 shadow break-inside-avoid-column break-inside-avoid mb-4 p-2'>
      <div className='flex items-center gap-4 justify-between'>
        <div><div className='area-entity-box'>{index}</div></div>
        <div className='text-sm grow'>
          <div>{areaName}</div>
          <AreaIcon area={area} />
        </div>
        <Actions uuid={uuid} areaName={areaName} parentUuid={parentUuid} />
      </div>
    </div>
  )
}

export const AreaIcon: React.FC<{ area: AreaType }> = ({ area: { climbs, metadata: { isBoulder } } }) => {
  if ((climbs?.length ?? 0) > 0) {
    return <EntityIcon type='crag' />
  }
  if (isBoulder) {
    return <EntityIcon type='boulder' />
  }
  return <EntityIcon type='area' />
}

const Actions: React.FC<{ uuid: string, areaName: string, parentUuid: string }> = ({ uuid, parentUuid, areaName }) => {
  return (
    <div className='flex items-center divide-x'>
      <Link className='px-4' href={`/editArea/${uuid}`}>
        <button className='btn btn-link btn-primary btn-sm'>Edit</button>
      </Link>
      <Link className='px-4' href={`/area/${uuid}`} target='_new'><button className='btn btn-link btn-primary btn-sm'>View</button></Link>
      <span className='px-4'>
        <DeleteAreaTrigger
          areaName={areaName}
          areaUuid={uuid}
          parentUuid={parentUuid}
          returnToParentPageAfterDelete={false}
        >
          <DeleteAreaTriggerButtonSm disabled={false} />
        </DeleteAreaTrigger>
      </span>
    </div>
  )
}
