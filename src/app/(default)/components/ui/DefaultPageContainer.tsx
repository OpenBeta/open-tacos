import { GallerySkeleton } from '@/components/media/PhotoMontage'
import React from 'react'
import { AreaPageActionsSkeleton } from '../AreaAndClimb/AreaAndClimbPageActions'
import { Summary } from './Summary'

/**
 * Area & Climb page containter.  Show loading skeleton if no params are provided.
 */
export const DefaultPageContainer: React.FC<{
  heroAlert?: React.ReactNode
  photoGallery?: React.ReactNode
  pageActions?: React.ReactNode
  breadcrumbs?: React.ReactNode
  leftRightNav?: React.ReactNode
  map?: React.ReactNode
  summary?: { left: React.ReactNode, right: React.ReactNode }
  mapContainerClass?: string
  children?: React.ReactNode
}> = ({ heroAlert, photoGallery, pageActions, breadcrumbs, leftRightNav, map, summary, children, mapContainerClass = 'w-full mt-16 relative h-[90vh] border-t' }) => {
  return (
    <article>
      {heroAlert != null &&
        <div className='default-page-margins my-2'>
          {heroAlert}
        </div>}
      <div className='default-page-margins'>
        {photoGallery == null ? <GallerySkeleton /> : photoGallery}
        <div className='flex justify-end py-4 border-b'>
          {pageActions == null ? <AreaPageActionsSkeleton /> : pageActions}
        </div>
        {breadcrumbs == null ? <BreadCrumbsSkeleton /> : breadcrumbs}
        {leftRightNav != null && leftRightNav}
        {summary != null && <Summary columns={summary} />}
        {children == null ? <ContentSkeleton /> : children}
      </div>
      {map != null && (
        <div id='map' className={mapContainerClass}>
          {map}
        </div>)}
    </article>
  )
}

const BreadCrumbsSkeleton: React.FC = () => (<div className='w-full my-2 h-12 bg-base-200 rounded-box' />)
const ContentSkeleton: React.FC = () => (<div className='w-full mt-6 h-80 bg-base-200 rounded-box' />)
