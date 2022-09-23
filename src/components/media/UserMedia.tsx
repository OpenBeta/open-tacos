import { useState, useCallback } from 'react'
import ContentLoader from 'react-content-loader'
import classNames from 'classnames'
import { basename } from 'path'
import Link from 'next/link'
import { getUploadDateSummary } from '../../js/utils'
import { useResponsive } from '../../js/hooks'
import TagList from './TagList'
import { MediaTagWithClimb, MediaType } from '../../js/types'
import ResponsiveImage from '../media/slideshow/ResponsiveImage'
import { MobileLoader, DesktopPreviewLoader } from '../../js/sirv/util'
import RemoveImage from './RemoveImage'

const MOBILE_IMAGE_MAX_WIDITH = 914
interface UserMediaProps {
  uid: string
  index: number
  imageInfo: MediaType
  onClick?: (props: any) => void
  onTagDeleted: (props?: any) => void
  tagList: MediaTagWithClimb[]
  isAuthorized?: boolean
  useClassicATag?: boolean
}

/**
 * Wrapper for user uploaded photo (maybe a short video in the future)
 * @param onClick Desktop only callback.
 */
export default function UserMedia ({
  index,
  uid,
  imageInfo,
  onClick,
  tagList,
  onTagDeleted,
  isAuthorized = false,
  useClassicATag = false
}: UserMediaProps): JSX.Element {
  const [hovered, setHover] = useState(false)

  const onClickHandler = useCallback((event) => {
    if (onClick != null) {
      // we want to show URL in browser status bar and let the user open link in a new tab,
      // but we don't want the default behavoir of <a href...>
      event.preventDefault()
      event.stopPropagation()

      onClick({ mouseXY: [event.clientX, event.clientY], imageInfo, index })
    }
  }, [])

  const { isDesktop } = useResponsive()
  const loader = isDesktop ? DesktopPreviewLoader : MobileLoader
  const shareableUrl = `/p/${uid}/${basename(imageInfo.filename)}`

  return (
    <figure
      key={imageInfo.filename}
      className={classNames(
        'block relative rounded overflow-hidden hover:shadow transition',
        isDesktop
          ? 'w-[300px] h-[300px] hover:brightness-75'
          : 'max-w-screen-lg py-12'
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Link href={shareableUrl}>
        <a onClick={onClickHandler}>
          {isDesktop
            ? (
              <ResponsiveImage
                mediaUrl={imageInfo.filename}
                isHero={index === 0}
                loader={loader}
              />
              )
            : (
              <>
                <img
                  src={loader({
                    src: imageInfo.filename,
                    width: MOBILE_IMAGE_MAX_WIDITH
                  })}
                  width={MOBILE_IMAGE_MAX_WIDITH}
                  sizes='100vw'
                />
                <div className='text-zinc-600 indent-1 font-light text-sm'>
                  {getUploadDateSummary(imageInfo.ctime)}
                </div>
              </>
              )}
        </a>
      </Link>

      {tagList?.length > 0 && (
        <figcaption className='absolute inset-x-0 bottom-0 flex flex-col justify-end'>
          <TagList
            hovered={hovered}
            list={tagList}
            onDeleted={onTagDeleted}
            isAuthorized={isAuthorized}
            className='px-2'
          />
        </figcaption>
      )}

      {tagList?.length === 0 && isAuthorized && (
        <div className='absolute top-0 right-0 p-1.5'>
          <RemoveImage imageInfo={imageInfo} tagCount={tagList?.length ?? 0} />
        </div>
      )}
    </figure>
  )
}

export const ImagePlaceholder = (props): JSX.Element => (
  <ContentLoader
    uniqueKey={props.uniqueKey}
    height={300}
    speed={0}
    backgroundColor='rgb(243 244 246)'
    viewBox='0 0 40 40'
  >
    <rect rx={0} ry={0} width='40' height='40' />
  </ContentLoader>
)
