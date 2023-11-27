'use client'
import { useState, useEffect, memo, MouseEventHandler } from 'react'
import Image from 'next/image'
import clx from 'classnames'

import PhotoFooter from './PhotoFooter'
import { MediaWithTags } from '../../js/types'
import useResponsive from '../../js/hooks/useResponsive'
import { DefaultLoader, MobileLoader } from '../../js/sirv/util'
import PhotoGalleryModal from './PhotoGalleryModal'
import { userMediaStore } from '../../js/stores/media'

export interface PhotoMontageProps {
  photoList: MediaWithTags[]
  /** set to `true` if gallery is placed above the fold */
  isHero?: boolean
  showSkeleton?: boolean
}

/**
 * Responsive photo gallery.  Behavoirs:
 * - Mobile: show 1 random image
 * - 1..4 images: show 2 images
 * - 5 or more: show 5 random images
 *
 * Set isHero=`true` when the gallery is placed visibly at the top of the page or when
 * you see a warning about *'Image was detected as the Largest Contentful Paint (LCP).'*
 *
 * @see https://nextjs.org/docs/api-reference/next/image
 */
const PhotoMontage = ({ photoList: initialList, isHero = false, showSkeleton = false }: PhotoMontageProps): JSX.Element | null => {
  const { isMobile } = useResponsive()
  const [showPhotoGalleryModal, setShowPhotoGalleryModal] = useState<boolean>(false)
  useEffect(() => {
    void userMediaStore.set.setPhotoList(initialList)
  }, [initialList])

  const shuffledList = initialList

  const photoGalleryModal = <PhotoGalleryModal setShowPhotoGalleryModal={setShowPhotoGalleryModal} />
  const [hover, setHover] = useState(false)

  if (showSkeleton) {
    return <GallerySkeleton />
  }

  if (!showSkeleton && (shuffledList == null || shuffledList?.length === 0)) { return null }

  if (isMobile) {
    const firstMedia = shuffledList[0]
    return (
      <div className='block relative w-full h-60 fadeinEffect'>
        {showPhotoGalleryModal ? photoGalleryModal : undefined}
        <Image
          src={firstMedia.mediaUrl}
          layout='fill'
          sizes='100vw'
          objectFit='cover'
          quality={90}
          loader={MobileLoader}
          priority={isHero}
          onClick={() => setShowPhotoGalleryModal(!showPhotoGalleryModal)}
          alt=''
        />
        <PhotoFooter mediaWithTags={firstMedia} hover />
      </div>
    )
  }

  if (shuffledList.length <= 4) {
    return (
      <div
        className={clx('grid grid-cols-2 grid-flow-row-dense gap-1 rounded-xl overflow-hidden h-80 fadeinEffect', showSkeleton ? 'animate-pulse bg-base-200/20' : '')}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {showPhotoGalleryModal ? photoGalleryModal : undefined}
        {shuffledList.slice(0, 2).map((media) => {
          const { mediaUrl } = media
          return (
            <div
              key={mediaUrl}
              className={
                clx(
                  'block relative hover:cursor-pointer',
                  shuffledList.length === 1 ? ' overflow-hidden rounded-r-xl' : '')
              }
            >
              <ResponsiveImage mediaUrl={mediaUrl} isHero={isHero} onClick={() => setShowPhotoGalleryModal(!showPhotoGalleryModal)} />
              <PhotoFooter mediaWithTags={media} hover={hover} />
            </div>
          )
        })}
      </div>
    )
  }

  const first = shuffledList[0]
  const theRest = shuffledList.slice(1, 5)
  return (
    <div
      className='grid grid-cols-4 grid-flow-row-dense gap-1 rounded-xl overflow-hidden h-80 hover:cursor-pointer fadeinEffect'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {showPhotoGalleryModal ? photoGalleryModal : undefined}
      <div className='block relative col-start-1 col-span-2 row-span-2 col-end-3'>
        <ResponsiveImage mediaUrl={first.mediaUrl} isHero={isHero} onClick={() => setShowPhotoGalleryModal(!showPhotoGalleryModal)} />
        <PhotoFooter mediaWithTags={first} hover={hover} />
      </div>
      {theRest.map((media, i) => {
        const { mediaUrl } = media
        return (
          <div
            key={mediaUrl}
            className='block relative'
          >
            <ResponsiveImage mediaUrl={mediaUrl} isHero={isHero} onClick={() => setShowPhotoGalleryModal(!showPhotoGalleryModal)} />
            <PhotoFooter mediaWithTags={media} hover={hover} />
          </div>
        )
      })}

    </div>
  )
}

interface ResponsiveImageProps {
  mediaUrl: string
  isHero?: boolean
  onClick: MouseEventHandler
}
/**
 * See https://nextjs.org/docs/api-reference/next/image
 * Set priority={true} if the photo montage is above the fold
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ mediaUrl, isHero = true, onClick }) => (
  <Image
    src={mediaUrl}
    loader={DefaultLoader}
    quality={90}
    layout='fill'
    sizes='50vw'
    objectFit='cover'
    priority={isHero}
    onClick={onClick}
    alt=''
  />)

export const GallerySkeleton: React.FC = () => (
  <div className='grid grid-cols-4 grid-flow-row-dense gap-1 rounded-xl overflow-hidden h-80 bg-base-200 lg:bg-transparent'>
    <div className='hidden lg:block relative col-start-1 col-span-2 row-span-2 col-end-3 bg-base-200 h-80' />
    <div className='hidden lg:block w-full h-[158px] bg-base-200 ' />
    <div className='hidden lg:block w-full h-[158px] bg-base-200' />
    <div className='hidden lg:block w-full h-[158px] bg-base-200' />
    <div className='hidden lg:block w-full h-[158px] bg-base-200' />
  </div>
)
export default memo(PhotoMontage)
