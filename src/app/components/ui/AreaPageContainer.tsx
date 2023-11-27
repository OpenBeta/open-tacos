import { GallerySkeleton } from '@/components/media/PhotoMontage'
import React from 'react'

/**
 * Area page containter.  Show loading skeleton if no params are provided.
 */
export const AreaPageContainer: React.FC<{
  photoGallery?: React.ReactNode
  breadcrumbs?: React.ReactNode
  map?: React.ReactNode
  children?: React.ReactNode
}> = ({ photoGallery, breadcrumbs, map, children }) => {
  return (
    <article>
      <div className='p-4 mx-auto max-w-5xl xl:max-w-7xl'>
        {photoGallery == null ? <GallerySkeleton /> : photoGallery}
        {breadcrumbs == null ? <BreadCrumbsSkeleton /> : breadcrumbs}
        {children == null ? <ContentSkeleton /> : children}
      </div>
      <div id='#map' className='w-full mt-16 relative h-[90vh] border-t'>
        {map != null && map}
      </div>
    </article>
  )
}

const BreadCrumbsSkeleton: React.FC = () => (<div className='w-full my-2 h-12 bg-base-200 rounded-box' />)
const ContentSkeleton: React.FC = () => (<div className='w-full mt-6 h-80 bg-base-200 rounded-box' />)
