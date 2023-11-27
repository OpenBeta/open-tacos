import { forwardRef } from 'react'
import Link from 'next/link'
import { Graph, ShareNetwork, LineSegments, Cube } from '@phosphor-icons/react/dist/ssr'
import { Icon, IconProps } from '@phosphor-icons/react'

import { AreaType } from '@/js/types'
import { DeleteAreaTrigger, DeleteAreaTriggerButtonSm } from '@/components/edit/Triggers'
import { getFriendlySlug } from '@/js/utils'

export type EType = 'area' | 'crag' | 'boulder' | 'climb'

const CragIcon = forwardRef<any, IconProps>((props, ref) => <ShareNetwork ref={ref} {...props} className='rotate-90' />)

// type MyIconProps = Icon & {
//   class
// }
const IconMap: Record<EType, Icon> = {
  area: Graph,
  crag: CragIcon,
  boulder: Cube,
  climb: LineSegments
}

export const EntityIcon: React.FC<{ type: EType, withLabel?: boolean, size?: 20 | 24 | 28, className?: string }> = ({ type, withLabel = true, size = 24, className = '' }) => {
  const IconComponent = IconMap?.[type]
  if (IconComponent == null) return null
  return (
    <div className='flex gap-1.5 items-center'>
      <IconComponent size={size} weight='duotone' className={className} />
      {withLabel && <span className='text-xs font-light'>{type.toUpperCase()}</span>}
    </div>
  )
}

export const AreaItem: React.FC<{
  area: AreaType
  parentUuid: string
  index: number
  editMode: boolean
}> = ({ area, index, parentUuid, editMode = false }) => {
  const { uuid, areaName, children, climbs } = area

  // undefined array can mean we forget to include the field in GQL so let's make it not editable
  const canDelete = (children?.length ?? 1) === 0 && (climbs?.length ?? 1) === 0

  const url = editMode ? `/editArea/${uuid}` : `/area/${uuid}/${getFriendlySlug(areaName)}`
  return (
    <div className='break-inside-avoid-column break-inside-avoid pb-8'>
      <Link href={url} className='block hover:outline hover:outline-1 hover:rounded-box'>
        <div className='card card-compact card-bordered w-full bg-base-100 shadow  p-2'>
          <div className='flex items-center gap-4 justify-between'>
            <div className='px-2'>
              <div className='area-entity-box'>{index}</div>
            </div>
            <div className='grow uppercase'>
              {areaName}
              <div className='flex items-center justify-between'>
                <AreaIcon area={area} />
              </div>
            </div>
          </div>
        </div>
      </Link>
      {editMode &&
        <div className='flex justify-end py-1'>
          <Actions uuid={uuid} areaName={areaName} parentUuid={parentUuid} canDelete={canDelete} />
        </div>}
    </div>
  )
}

export const AreaIcon: React.FC<{ area: AreaType }> =
  ({ area: { climbs, metadata: { isBoulder } } }) => {
    if ((climbs?.length ?? 0) > 0) {
      return <EntityIcon type='crag' size={20} />
    }
    if (isBoulder) {
      return <EntityIcon type='boulder' size={20} />
    }
    return <EntityIcon type='area' size={20} />
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
        <button className='btn btn-link btn-primary btn-sm text-secondary font-semibold'>Edit</button>
      </Link>
      <Link className='px-4' href={`/area/${uuid}`} target='_new'>
        <button className='btn btn-link btn-primary btn-sm text-secondary font-light'>View</button>
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
