import * as Popover from '@radix-ui/react-popover'
import { getAreaPageFriendlyUrl } from '@/js/utils'
import { Card } from '../core/Card'
import { EntityIcon } from '@/app/(default)/editArea/[slug]/general/components/AreaItem'
import { SelectedPolygon } from './AreaActiveMarker'
import { HoverInfo, MapAreaFeatureProperties } from './GlobalMap'
import { MiniCarousel } from './CardGallery'

/**
 * Area info panel.
 * By default a mouse click on the panel will select the
 * underlying feature and activate the side drawer.  For links/buttons
 * we need to call event.stopPropagation() to prevent the panel from
 * receiving the click event.
 */
export const AreaInfoHover: React.FC<HoverInfo & {
  /**
   * Handle click event on the popover
   */
  onClick: (data: HoverInfo) => void
}> = ({ data, geometry, mapInstance, onClick }) => {
  let screenXY
  if (geometry.type === 'Point') {
    screenXY = mapInstance.project(geometry.coordinates)
  } else {
    return <SelectedPolygon geometry={geometry} />
  }

  return (
    <Popover.Root defaultOpen>
      <Popover.Anchor style={{ position: 'absolute', left: screenXY.x, top: screenXY.y }} />
      <Popover.Content
        align='center'
        side='top'
        sideOffset={8}
        collisionPadding={24}
        className='z-50 focus:outline-none cursor-pointer'
        onClick={(e) => {
          e.stopPropagation()
          onClick({ data, geometry, mapInstance })
        }}
      >
        {data != null && <Content {...data} />}
      </Popover.Content>
    </Popover.Root>
  )
}

export const Content: React.FC<MapAreaFeatureProperties> = ({ id, areaName, climbs, media }) => {
  return (
    <Card image={<MiniCarousel mediaList={media} />}>
      <div className='flex flex-col gap-y-1 text-xs'>
        <a
          href={getAreaPageFriendlyUrl(id, areaName)}
          className='text-base font-medium tracking-tight hover:underline'
          onClick={(e) => e.stopPropagation()}
        >
          {areaName}
        </a>
        <div className='font-sm text-secondary flex items-center gap-1'>
          <EntityIcon type='crag' size={16} />
          ·
          <span className='text-xs'>{climbs.length} climbs</span>
        </div>
      </div>
    </Card>
  )
}
