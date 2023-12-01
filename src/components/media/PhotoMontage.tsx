'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import clx from 'classnames'
import { SquaresFour } from '@phosphor-icons/react/dist/ssr'

import PhotoFooter from './PhotoFooter'
import { MediaWithTags } from '../../js/types'
import useResponsive from '../../js/hooks/useResponsive'
import PhotoGalleryModal from './PhotoGalleryModal'
import { userMediaStore } from '../../js/stores/media'
import { UploadPhotoTextOnlyButton } from './PhotoUploadButtons'
import HikingIllustration from '@/assets/icons/hiking'

export interface PhotoMontageProps {
  photoList: MediaWithTags[]
}

/**
 * Responsive photo gallery.  Behavoirs:
 * - Mobile: show 1 random image
 * - 1..4 images: show 2 images
 * - 5 or more: show 5 random images
 *
 * @see https://nextjs.org/docs/api-reference/next/image
 */
const PhotoMontage = ({ photoList: initialList }: PhotoMontageProps): JSX.Element | null => {
  const { isMobile } = useResponsive()
  const [showPhotoGalleryModal, setShowPhotoGalleryModal] = useState<boolean>(false)
  useEffect(() => {
    void userMediaStore.set.setPhotoList(initialList)
  }, [initialList])

  const shuffledList = initialList

  const photoGalleryModal = <PhotoGalleryModal setShowPhotoGalleryModal={setShowPhotoGalleryModal} />
  const [hover, setHover] = useState(false)

  if (shuffledList == null || shuffledList?.length === 0) { return null }

  if (isMobile) {
    const firstMedia = shuffledList[0]
    return (
      <div className='block relative w-full h-60 fadeinEffect'>
        {showPhotoGalleryModal ? photoGalleryModal : undefined}
        <Image
          src={firstMedia.mediaUrl}
          fill
          sizes='25vw'
          priority
          onClick={() => setShowPhotoGalleryModal(!showPhotoGalleryModal)}
          alt=''
          style={{ objectFit: 'cover' }}
        />
        <PhotoFooter mediaWithTags={firstMedia} hover />
      </div>
    )
  }

  /**
   * Show 2 photos
   */
  if (shuffledList.length <= 4) {
    return (
      <div className='relative'>
        <div
          className='grid grid-cols-2 grid-flow-row-dense gap-1 rounded-xl overflow-hidden h-80 fadeinEffect'
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
                <Image
                  priority
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                  src={mediaUrl}
                  onClick={() => setShowPhotoGalleryModal(!showPhotoGalleryModal)}
                  alt=''
                  style={{ objectFit: 'cover' }}
                />
                <PhotoFooter mediaWithTags={media} hover={hover} />
              </div>
            )
          })}
          {shuffledList.length === 1 &&
            <div className='w-full h-full bg-base-300/20 rounded-xl grid grid-rows-1 place-items-center grayscale opacity-50'>
              <HikingIllustration className='w-80' />
            </div>}
        </div>
        {shuffledList.length === 1
          ? (<div className='absolute bottom-8 right-8 z-50'><UploadPhotoTextOnlyButton /></div>)
          : (<OpenGalleryButton count={shuffledList.length} onClick={() => setShowPhotoGalleryModal(true)} />)}
      </div>
    )
  }

  /**
   * Show the first 5
   */
  const first = shuffledList[0]
  const theRest = shuffledList.slice(1, 5)
  return (
    <div className='relative'>
      <div
        className='grid grid-cols-4 grid-flow-row-dense gap-1 rounded-xl overflow-hidden h-80 hover:cursor-pointer fadeinEffect'
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {showPhotoGalleryModal ? photoGalleryModal : undefined}
        <div className='block relative col-start-1 col-span-2 row-span-2 col-end-3'>
          <Image
            priority
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
            src={first.mediaUrl}
            onClick={() => setShowPhotoGalleryModal(!showPhotoGalleryModal)}
            alt=''
            style={{ objectFit: 'cover' }}
          />
          <PhotoFooter mediaWithTags={first} hover={hover} />
        </div>
        {theRest.map((media) => {
          const { mediaUrl } = media
          return (
            <div
              key={mediaUrl}
              className='block relative'
            >
              <Image
                priority
                fill
                sizes='15vw'
                src={mediaUrl}
                onClick={() => setShowPhotoGalleryModal(!showPhotoGalleryModal)}
                alt=''
                style={{ objectFit: 'cover' }}
              />
              <PhotoFooter mediaWithTags={media} hover={hover} />
            </div>
          )
        })}
      </div>
      <OpenGalleryButton count={shuffledList.length} onClick={() => setShowPhotoGalleryModal(true)} />
    </div>
  )
}

const OpenGalleryButton: React.FC<{ count: number, onClick: () => void }> = ({ count, onClick }) => (
  <div className='absolute right-8 top-[70%] drop-shadow-md'>
    <button className='btn btn-sm btn-outline bg-base-200/60' onClick={() => onClick()}>
      <SquaresFour size={16} />See {count} photos in gallery
    </button>
  </div>)

/**
 * Show this upload call-to-action when a page has no photos
 */
export const UploadPhotoCTA: React.FC = () => {
  return (
    <div className='bg-base-300/20 h-40 rounded-box relative flex items-center justify-center overflow-hidden'>
      <HikingIllustration className='h-60 opacity-50 grayscale' />
      <div className='absolute bottom-4 right-4'><UploadPhotoTextOnlyButton /></div>
    </div>
  )
}

/**
 * Loading skeleton
 */
export const GallerySkeleton: React.FC = () => (
  <div className='grid grid-cols-4 grid-flow-row-dense gap-1 rounded-xl overflow-hidden h-80 bg-base-200 lg:bg-transparent'>
    <div className='hidden lg:block relative col-start-1 col-span-2 row-span-2 col-end-3 bg-base-200 h-80' />
    <div className='hidden lg:block w-full h-[158px] bg-base-200 ' />
    <div className='hidden lg:block w-full h-[158px] bg-base-200' />
    <div className='hidden lg:block w-full h-[158px] bg-base-200' />
    <div className='hidden lg:block w-full h-[158px] bg-base-200' />
  </div>
)
export default PhotoMontage
