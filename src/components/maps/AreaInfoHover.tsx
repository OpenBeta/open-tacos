import * as Popover from '@radix-ui/react-popover'
import { HoverInfo, MapAreaFeatureProperties } from './AreaMap'
import { getAreaPageFriendlyUrl } from '@/js/utils'
import { Card } from '../core/Card'
import { EntityIcon } from '@/app/editArea/[slug]/general/components/AreaItem'
import { SelectedPolygon } from './AreaActiveMarker'
/**
 * Area info panel
 */
export const AreaInfoHover: React.FC<HoverInfo> = ({ data, geometry, mapInstance }) => {
  const parent = data?.parent == null ? null : JSON.parse(data.parent)
  const parentName = parent?.name ?? 'Unknown'
  const parentId = parent?.id ?? null

  let screenXY
  if (geometry.type === 'Point') {
    screenXY = mapInstance.project(geometry.coordinates)
  } else {
    return <SelectedPolygon geometry={geometry} />
  }
  return (
    <Popover.Root defaultOpen>
      <Popover.Anchor style={{ position: 'absolute', left: screenXY.x, top: screenXY.y }} />
      <Popover.Content align='center' side='top' alignOffset={12}>
        {data != null && <Content {...data} parentName={parentName} parentId={parentId} />}
        <Popover.Arrow />
      </Popover.Content>
    </Popover.Root>
  )
}

export const Content: React.FC<MapAreaFeatureProperties & { parentName: string, parentId: string | null }> = ({ id, name, parentName, parentId }) => {
  const url = parentId == null
    ? parentName
    : (
      <a
        href={getAreaPageFriendlyUrl(parentId, name)}
        className='inline-flex items-center gap-1.5'
      >
        <EntityIcon type='area' size={16} /><span className='text-secondary font-medium hover:underline '>{parentName}</span>
      </a>
      )
  return (
    <Card>
      <div className='flex flex-col gap-y-1 text-xs'>
        <div>{url}</div>
        <div className='ml-2'>
          <span className='text-secondary'>&#8735;</span><a href={getAreaPageFriendlyUrl(id, name)} className='text-sm font-medium hover:underline'>{name}</a>
        </div>
      </div>
    </Card>
  )
}
