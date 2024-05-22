import * as Popover from '@radix-ui/react-popover'

import { ActiveFeature, CragFeatureProperties, CragGroupFeatureProps } from '../TileTypes'
import { CragPanelContent } from './CragPanelContent'
import { CragGroupPanelContent } from './CragGroupPanelContent'

/**
 * Area info panel
 */
export const AreaInfoDrawer: React.FC<{ feature: ActiveFeature | null, onClose?: () => void }> = ({ feature, onClose }) => {
  if (feature == null) return null
  let ContentComponent = null
  switch (feature.type) {
    case 'crag-markers':
    case 'crag-name-labels':
      ContentComponent = <CragPanelContent {...(feature.data as CragFeatureProperties)} />
      break
    case 'area-boundaries':
      ContentComponent = <CragGroupPanelContent {...(feature.data as CragGroupFeatureProps)} />
      break
    default:
      return null
  }
  return (
    <Popover.Root open={feature != null}>
      <Popover.Anchor className='absolute top-3 left-3 z-50' />
      <Popover.Content align='start' className='hover:outline-none'>
        {ContentComponent}
      </Popover.Content>
    </Popover.Root>
  )
}
