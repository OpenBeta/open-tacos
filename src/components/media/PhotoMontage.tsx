import Image from 'next/image'
import { shuffle } from 'underscore'
import classNames from 'classnames'
import { MediaTag } from '../../js/types'
import useResponsive from '../../js/hooks/useResponsive'
import { DefaultLoader, MobileLoader } from '../../js/sirv/util'
interface PhotoMontageProps {
  photoList: Array<Pick<MediaTag, 'mediaUuid'|'mediaUrl'>>
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
export default function PhotoMontage ({ photoList, isHero = false }: PhotoMontageProps): JSX.Element | null {
  const { isMobile } = useResponsive()

  if (photoList == null || photoList?.length === 0) { return null }

  const shuffledList = shuffle(photoList)

  if (isMobile) {
    return (
      <div className='block relative w-full h-60'>
        <Image
          src={shuffle(shuffledList)[0].mediaUrl}
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
      <div className='grid grid-cols-2 grid-flow-row-dense gap-1 rounded-xl overflow-hidden h-80'>
        {photoList.slice(0, 2).map(({ mediaUrl, mediaUuid }) => {
          return (
            <div
              key={mediaUuid}
              className={
                classNames(
                  'block relative',
                  photoList.length === 1 ? ' overflow-hidden rounded-r-xl' : '')
                }
            >
              <ResponsiveImage mediaUrl={mediaUrl} isHero={isHero} />
            </div>
          )
        })}
      </div>
    )
  }

  const first = shuffledList[0].mediaUrl
  const theRest = shuffledList.slice(1, 5)
  return (
    <div className='grid grid-cols-4 grid-flow-row-dense gap-1 rounded-xl overflow-hidden h-80'>
      <div className='block relative col-start-1 col-span-2 row-span-2 col-end-3'>
        <ResponsiveImage mediaUrl={first} isHero={isHero} />
      </div>
      {theRest.map(({ mediaUrl, mediaUuid }, i) => {
        return (
          <div key={`${mediaUuid}_${i}`} className='block relative'>
            <ResponsiveImage mediaUrl={mediaUrl} isHero={isHero} />
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
