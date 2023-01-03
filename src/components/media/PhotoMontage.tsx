import { useState, useEffect, memo } from 'react'
import Image from 'next/image'
import { shuffle } from 'underscore'
import classNames from 'classnames'

import PhotoFooter from './PhotoFooter'
import { MediaBaseTag } from '../../js/types'
import useResponsive from '../../js/hooks/useResponsive'
import { DefaultLoader, MobileLoader } from '../../js/sirv/util'
import PhotoGalleryModal from './PhotoGalleryModal'
import { userMediaStore } from '../../js/stores/media'

export interface PhotoMontageProps {
  photoList: MediaBaseTag[]
  /** set to `true` if gallery is placed above the fold */
  isHero?: boolean
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
const PhotoMontage = ({ photoList: initialList, isHero = false }: PhotoMontageProps): JSX.Element | null => {
  const { isMobile } = useResponsive()
  const [shuffledList, setPhotoList] = useState<MediaBaseTag[]>([])
  const [showPhotoGalleryModal, setShowPhotoGalleryModal] = useState<boolean>(false)
  useEffect(() => {
    setPhotoList(shuffle(initialList))
    void userMediaStore.set.setPhotoList(initialList)
  }, [initialList])

  const photoGalleryModal = <PhotoGalleryModal setShowPhotoGalleryModal={setShowPhotoGalleryModal} />
  const [hover, setHover] = useState(false)

  if (shuffledList == null || shuffledList?.length === 0) { return null }

  if (isMobile) {
    const { uid, mediaUrl, destType, destination } = shuffledList[0]
    return (
      <div className='block relative w-full h-60'>
        {showPhotoGalleryModal && photoGalleryModal} {/* is there a better way to do this conditional rendering? */}
        <Image
          src={mediaUrl}
          layout='fill'
          sizes='100vw'
          objectFit='cover'
          quality={90}
          loader={MobileLoader}
          priority={isHero}
          onClick={() => setShowPhotoGalleryModal(!showPhotoGalleryModal)}
        />
        <PhotoFooter username={uid} destType={destType} destination={destination} hover />
      </div>
    )
  }

  if (shuffledList.length <= 4) {
    return (
      <div
        className='grid grid-cols-2 grid-flow-row-dense gap-1 rounded-xl overflow-hidden h-80'
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {showPhotoGalleryModal && photoGalleryModal} {/* is there a better way to do this conditional rendering? */}
        {shuffledList.slice(0, 2).map(({ mediaUrl, mediaUuid, uid, destination, destType }) => {
          return (
            <div
              key={mediaUuid}
              className={
                classNames(
                  'block relative hover:cursor-pointer',
                  shuffledList.length === 1 ? ' overflow-hidden rounded-r-xl' : '')
              }
            >
              <ResponsiveImage mediaUrl={mediaUrl} isHero={isHero} onClick={() => setShowPhotoGalleryModal(!showPhotoGalleryModal)} />
              <PhotoFooter username={uid} destType={destType} destination={destination} hover={hover} />
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
      className='grid grid-cols-4 grid-flow-row-dense gap-1 rounded-xl overflow-hidden h-80 hover:cursor-pointer'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {showPhotoGalleryModal && photoGalleryModal} {/* is there a better way to do this conditional rendering? */}
      <div className='block relative col-start-1 col-span-2 row-span-2 col-end-3'>
        <ResponsiveImage mediaUrl={first.mediaUrl} isHero={isHero} onClick={() => setShowPhotoGalleryModal(!showPhotoGalleryModal)} />
        <PhotoFooter username={first.uid} destType={first.destType} destination={first.destination} hover={hover} />
      </div>
      {theRest.map(({ mediaUrl, mediaUuid, uid, destination, destType }, i) => {
        return (
          <div
            key={`${mediaUuid}_${i}`}
            className='block relative'
          >
            <ResponsiveImage mediaUrl={mediaUrl} isHero={isHero} onClick={() => setShowPhotoGalleryModal(!showPhotoGalleryModal)} />
            <PhotoFooter username={uid} destType={destType} destination={destination} hover={hover} />
          </div>
        )
      })}

    </div>
  )
}

/**
 * See https://nextjs.org/docs/api-reference/next/image
 * Set priority={true} if the photo montage is above the fold
 */
const ResponsiveImage = ({ mediaUrl, isHero = true, onClick }): JSX.Element => (
  <Image
    src={mediaUrl}
    loader={DefaultLoader}
    quality={90}
    layout='fill'
    sizes='50vw'
    objectFit='cover'
    priority={isHero}
    onClick={onClick}
  />)

export default memo(PhotoMontage)
