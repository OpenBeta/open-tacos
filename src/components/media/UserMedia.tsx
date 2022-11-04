import { useCallback } from 'react'
import ContentLoader from 'react-content-loader'
import { basename } from 'path'
import Link from 'next/link'

import { MediaTagWithClimb, MediaType } from '../../js/types'
import ResponsiveImage from '../media/slideshow/ResponsiveImage'
import { DesktopPreviewLoader } from '../../js/sirv/util'
import RemoveImage from './RemoveImage'

interface UserMediaProps {
  uid: string
  index: number
  imageInfo: MediaType
  onClick?: (props: any) => void
  tagList: MediaTagWithClimb[]
  isAuthorized?: boolean
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
  isAuthorized = false
}: UserMediaProps): JSX.Element {
  const onClickHandler = useCallback((event) => {
    if (onClick != null) {
      // we want to show URL in browser status bar and let the user open link in a new tab,
      // but we don't want the default behavoir of <a href...>
      event.preventDefault()
      event.stopPropagation()

      onClick({ mouseXY: [event.clientX, event.clientY], imageInfo, index })
    }
  }, [])

  const shareableUrl = `/p/${uid}/${basename(imageInfo.filename)}`

  return (
    <figure
      key={imageInfo.filename}
      className='block relative rounded overflow-hidden hover:shadow transition w-[300px] h-[300px] hover:brightness-75'

    >
      <Link href={shareableUrl} onClick={onClickHandler}>

        <ResponsiveImage
          mediaUrl={imageInfo.filename}
          isHero={index === 0}
          loader={DesktopPreviewLoader}
        />

      </Link>

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
