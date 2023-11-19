import { forwardRef } from 'react'
import Link from 'next/link'
import { Graph, ShareNetwork, LineSegments, Cube } from '@phosphor-icons/react/dist/ssr'
import { Icon, IconProps } from '@phosphor-icons/react'

import { AreaType } from '@/js/types'
import { DeleteAreaTrigger, DeleteAreaTriggerButtonSm } from '@/components/edit/Triggers'

type EType = 'area' | 'crag' | 'boulder' | 'climb'

const CragIcon = forwardRef<any, IconProps>((props, ref) => <ShareNetwork ref={ref} {...props} className='p-1 rotate-90' />)

// type MyIconProps = Icon & {
//   class
// }
const IconMap: Record<EType, Icon> = {
  area: Graph,
  crag: CragIcon,
  boulder: Cube,
  climb: LineSegments
}

export const EntityIcon: React.FC<{ type: EType, withLabel?: boolean, className?: string }> = ({ type, withLabel = true, className = '' }) => {
  const IconComponent = IconMap?.[type]
  if (IconComponent == null) return null
  return (
    <div className='flex gap-1.5 items-center'>
      <IconComponent size={20} weight='duotone' className={className} />
      {withLabel && <span className='text-xs font-light'>{type.toUpperCase()}</span>}
    </div>
  )
}

export const AreaItem: React.FC<{ area: AreaType, parentUuid: string, index: number }> = ({ area, index, parentUuid }) => {
  const { uuid, areaName, children, climbs } = area

  // undefined array can mean we forget to include the field in GQL so let's make it not editable
  const canDelete = (children?.length ?? 1) === 0 && (climbs?.length ?? 1) === 0

  return (
    <div className='break-inside-avoid-column break-inside-avoid pb-8'>
      <div className='card card-compact card-bordered border-base-300/80 w-full bg-base-100 shadow  p-2'>
        <div className='flex items-center gap-4 justify-between'>
          <div>
            <div className='area-entity-box'>{index}</div>
          </div>
          <div className='grow space-y-2'>
            <Link
              className='uppercase font-semibold hover:underline underline-offset-4
'
              href={`/editArea/${uuid}`}
            >
              {areaName}
            </Link>
            <div className='flex items-center justify-between'>
              <AreaIcon area={area} />
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-end py-1'>
        <Actions uuid={uuid} areaName={areaName} parentUuid={parentUuid} canDelete={canDelete} />
      </div>
    </div>
  )
}

export const AreaIcon: React.FC<{ area: AreaType }> =
  ({ area: { climbs, metadata: { isBoulder } } }) => {
    if ((climbs?.length ?? 0) > 0) {
      return <EntityIcon type='crag' />
    }
    if (isBoulder) {
      return <EntityIcon type='boulder' />
    }
    return <EntityIcon type='area' className='text-secondary' />
  }

const Actions: React.FC<{
  uuid: string
  areaName: string
  parentUuid: string
  canDelete?: boolean
}> = ({ uuid, parentUuid, areaName, canDelete = false }) => {
  return (
    <div className='flex items-center divide-x'>
      <Link className='px-4' href={`/editArea/${uuid}`}>
        <button className='btn btn-link btn-primary btn-sm text-secondary'>Edit</button>
      </Link>
      <Link className='px-4' href={`/area/${uuid}`} target='_new'>
        <button className='btn btn-link btn-primary btn-sm text-secondary'>View</button>
      </Link>
      <div className='px-4 relative'>
        <DeleteAreaTrigger
          areaName={areaName}
          areaUuid={uuid}
          parentUuid={parentUuid}
          returnToParentPageAfterDelete={false}
        >
          <DeleteAreaTriggerButtonSm disabled={!canDelete} />
        </DeleteAreaTrigger>
      </div>
    </div>
  )
}
