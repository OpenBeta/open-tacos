import * as Popover from '@radix-ui/react-popover'
import { Card } from '../../core/Card'
import { ActiveFeature, CragFeatureProperties, CragGroupFeatureProps } from '../TileTypes'
import { MiniCarousel } from '../CardGallery'
import { AreaHoverCardContent } from './AreaContent'
import { CragHoverCardContent } from './CragContent'

/**
 * Hover card.
 * By default a mouse click on the panel will select the
 * underlying feature and activate the side drawer.  For links/buttons
 * we need to call event.stopPropagation() to prevent the drawer to open.
 */
export const HoverCard: React.FC<ActiveFeature & {
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

  const { media } = data
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
        <Card image={<MiniCarousel mediaList={media} />} className='hidden md:block'>
          {ContentComponent}
        </Card>
      </Popover.Content>
    </Popover.Root>
  )
}
