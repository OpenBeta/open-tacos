import { useState, useEffect, memo } from 'react'
import Image from 'next/image'
import { shuffle } from 'underscore'
import classNames from 'classnames'
import Link from 'next/link'
import { Transition } from '@headlessui/react'

import { MediaBaseTag } from '../../js/types'
import useResponsive from '../../js/hooks/useResponsive'
import { DefaultLoader, MobileLoader } from '../../js/sirv/util'
import { UserCircleIcon } from '@heroicons/react/outline'
export interface PhotoMontageProps {
  photoList: Array<Pick<MediaBaseTag, 'mediaUuid'|'mediaUrl'|'uid'>>
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
  const [shuffledList, setPhotoList] = useState<Array<Pick<MediaBaseTag, 'mediaUuid'|'mediaUrl'|'uid'>>>([])
  useEffect(() => {
    setPhotoList(shuffle(initialList))
  }, [initialList])

  const [hover, setHover] = useState(false)

  if (shuffledList == null || shuffledList?.length === 0) { return null }
  // const photoList = shuffle(list)

  if (isMobile) {
    return (
      <div className='block relative w-full h-60'>
        <Image
          src={shuffledList[0].mediaUrl}
          layout='fill'
          sizes='100vw'
          objectFit='cover'
          quality={90}
          loader={MobileLoader}
          priority={isHero}
        />
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
        {shuffledList.slice(0, 2).map(({ mediaUrl, mediaUuid, uid }) => {
          return (
            <div
              key={mediaUuid}
              className={
                classNames(
                  'block relative',
                  shuffledList.length === 1 ? ' overflow-hidden rounded-r-xl' : '')
                }
            >
              <ResponsiveImage mediaUrl={mediaUrl} isHero={isHero} />
              {uid != null && <PhotographerLink uid={uid} hover={hover} />}
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
      className='grid grid-cols-4 grid-flow-row-dense gap-1 rounded-xl overflow-hidden h-80'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className='block relative col-start-1 col-span-2 row-span-2 col-end-3'>
        <ResponsiveImage mediaUrl={first.mediaUrl} isHero={isHero} />
        {first?.uid != null && <PhotographerLink uid={first.uid} hover={hover} />}
      </div>
      {theRest.map(({ mediaUrl, mediaUuid, uid }, i) => {
        return (
          <div
            key={`${mediaUuid}_${i}`}
            className='block relative'
          >
            <ResponsiveImage mediaUrl={mediaUrl} isHero={isHero} />
            {uid != null && <PhotographerLink uid={uid} hover={hover} />}
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
const ResponsiveImage = ({ mediaUrl, isHero = true }): JSX.Element => (
  <Image
    src={mediaUrl}
    loader={DefaultLoader}
    quality={90}
    layout='fill'
    sizes='50vw'
    objectFit='cover'
    priority={isHero}
  />)

const PhotographerLink = ({ uid, hover }: {uid: string, hover: boolean}): JSX.Element => (
  <Transition
    show={hover}
    enter='transition-opacity duration-500'
    enterFrom='opacity-20'
    enterTo='opacity-100'
  >
    <Link href={`/u/${uid}`} passHref>
      <a>
        <span className='absolute bottom-2 right-2 rounded-full bg-gray-300 hover:ring p-1'>
          <UserCircleIcon className='text-secondary w-4 h-4' />
        </span>
      </a>
    </Link>

  </Transition>)

export default memo(PhotoMontage)
