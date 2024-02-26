import * as Popover from '@radix-ui/react-popover'
import { getAreaPageFriendlyUrl } from '@/js/utils'
import { Card } from '../core/Card'
import { EntityIcon } from '@/app/(default)/editArea/[slug]/general/components/AreaItem'
import { SelectedPolygon } from './AreaActiveMarker'
import { HoverInfo, MapAreaFeatureProperties } from './GlobalMap'

/**
 * Area info panel
 */
export const AreaInfoHover: React.FC<HoverInfo> = ({ data, geometry, mapInstance }) => {
  let screenXY
  if (geometry.type === 'Point') {
    screenXY = mapInstance.project(geometry.coordinates)
  } else {
    return <SelectedPolygon geometry={geometry} />
  }

  return (
    <Popover.Root defaultOpen>
      <Popover.Anchor style={{ position: 'absolute', left: screenXY.x, top: screenXY.y }} />
      <Popover.Content align='center' side='top' sideOffset={8} collisionPadding={24} className='z-50'>
        {data != null && <Content {...data} />}
      </Popover.Content>
    </Popover.Root>
  )
}

export const Content: React.FC<MapAreaFeatureProperties> = ({ id, areaName, climbs }) => {
  return (
    <Card>
      <div className='flex flex-col gap-y-1 text-xs'>
        <a href={getAreaPageFriendlyUrl(id, areaName)} className='text-base font-medium hover:underline'>{areaName}</a>
        <div className='font-sm text-secondary flex items-center gap-1'>
          <EntityIcon type='crag' size={16} />
          ·
          <span className='text-xs'>{climbs.length} climbs</span>
        </div>
      </div>
    </Card>
  )
}
