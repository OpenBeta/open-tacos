import { GallerySkeleton } from '@/components/media/PhotoMontage'
import React from 'react'
import { AreaPageActionsSkeleton } from '../AreaPageActions'
import { HeroAlert } from '../LandingHero'

/**
 * Area page containter.  Show loading skeleton if no params are provided.
 */
export const AreaPageContainer: React.FC<{
  photoGallery?: React.ReactNode
  pageActions?: React.ReactNode
  breadcrumbs?: React.ReactNode
  map?: React.ReactNode
  children?: React.ReactNode
}> = ({ photoGallery, pageActions, breadcrumbs, map, children }) => {
  return (
    <article>
      <div className='default-page-margins my-2'>
        <HeroAlert />
      </div>
      <div className='default-page-margins'>
        {photoGallery == null ? <GallerySkeleton /> : photoGallery}
        <div className='flex justify-end py-4 border-b'>
          {pageActions == null ? <AreaPageActionsSkeleton /> : pageActions}
        </div>
        {breadcrumbs == null ? <BreadCrumbsSkeleton /> : breadcrumbs}
        {children == null ? <ContentSkeleton /> : children}
      </div>
      <div id='map' className='w-full mt-16 relative h-[90vh] border-t'>
        {map != null && map}
      </div>
    </article>
  )
}

const BreadCrumbsSkeleton: React.FC = () => (<div className='w-full my-2 h-12 bg-base-200 rounded-box' />)
const ContentSkeleton: React.FC = () => (<div className='w-full mt-6 h-80 bg-base-200 rounded-box' />)
