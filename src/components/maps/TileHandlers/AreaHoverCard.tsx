import * as Popover from '@radix-ui/react-popover'
import { getAreaPageFriendlyUrl } from '@/js/utils'
import { Card } from '../../core/Card'
import { EntityIcon } from '@/app/(default)/editArea/[slug]/general/components/AreaItem'
import { ActiveFeature, CragFeatureProperties, CragGroupFeatureProps } from '../TileTypes'
import { MiniCarousel } from '../CardGallery'
import { AreaHoverCardContent } from './AreaContent'

/**
 * Area hover card.
 * By default a mouse click on the panel will select the
 * underlying feature and activate the side drawer.  For links/buttons
 * we need to call event.stopPropagation() to prevent the panel from
 * receiving the click event.
 */
export const AreaHoverCard: React.FC<ActiveFeature & {
  /**
   * Handle click event on the popover
   */
  onClick: (data: ActiveFeature) => void
}> = (props) => {
  const { type, data, point, geometry, mapInstance, onClick } = props
  let screenXY
  let ContentComponent = null

  switch (type) {
    case 'crag-markers':
    case 'crag-name-labels':
      screenXY = mapInstance.project(geometry.coordinates)
      ContentComponent = <CragHoverCardContent {...(data as CragFeatureProperties)} />
      break
    case 'area-boundaries':
      screenXY = point
      ContentComponent = <AreaHoverCardContent {...(data as CragGroupFeatureProps)} />
      break
    default:
      return null
  }

  return (
    <Popover.Root defaultOpen>
      <Popover.Anchor style={{ position: 'absolute', left: screenXY.x, top: screenXY.y }} />
      <Popover.Content
        align='center'
        side='top'
        sideOffset={2}
        sticky='always'
        collisionPadding={24}
        className='z-50 focus:outline-none cursor-pointer'
        onClick={(e) => {
          e.stopPropagation()
          onClick(props)
        }}
      >
        {ContentComponent}
      </Popover.Content>
    </Popover.Root>
  )
}

export const CragHoverCardContent: React.FC<CragFeatureProperties> = ({ id, areaName, climbs, media }) => {
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
