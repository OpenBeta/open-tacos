import { ReactNode } from 'react'
import * as Popover from '@radix-ui/react-popover'

import { Card } from '@/components/core/Card'
import { ActiveFeature, CragFeatureProperties, CragGroupFeatureProps } from '../TileTypes'
import { CragDrawerContent } from './CragContent'
import { AreaDrawerContent } from './AreaContent'

/**
 * Side drawer panel
 */
export const Drawer: React.FC<{ feature: ActiveFeature | null, onClose?: () => void }> = ({ feature, onClose }) => {
  if (feature == null) return null
  let ContentComponent = null
  switch (feature.type) {
    case 'crag-markers':
    case 'crag-name-labels':
      ContentComponent = <CragDrawerContent {...(feature.data as CragFeatureProperties)} />
      break
    case 'area-boundaries':
      ContentComponent = <AreaDrawerContent {...(feature.data as CragGroupFeatureProps)} />
      break
    default:
      return null
  }
  return (
    <Popover.Root open={feature != null}>
      <Popover.Anchor className='absolute top-0 left-0 z-50' />
      <Popover.Content align='start' className='hover:outline-none z-50'>
        {ContentComponent}
      </Popover.Content>
    </Popover.Root>
  )
}

export const BaseDrawerContent: React.FC<{ media: ReactNode, heading: ReactNode, subheading: ReactNode, cta: ReactNode, children: ReactNode }> = ({ media, heading, subheading, cta, children }) => {
  return (
    <Card className='max-h-screen lg:w-[420px] rounded-none'>
      <div>
        {media}
      </div>
      <div className='flex flex-col gap-4 pb-6'>
        <section className='flex flex-col gap-y-2'>
          <div className='text-2xl font-semibold leading-snug tracking-tight hover:underline'>
            {heading}
          </div>
          {subheading}
        </section>

        {cta}

        <hr />

        {children}
      </div>
    </Card>
  )
}
