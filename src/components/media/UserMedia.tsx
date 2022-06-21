import { useState, useCallback } from 'react'
import classNames from 'classnames'

import { useResponsive } from '../../js/hooks'
import TagList from './TagList'
import { MediaTagWithClimb, MediaType } from '../../js/types'
import ResponsiveImage from '../media/slideshow/ResponsiveImage'
import { MobileLoader, DesktopPreviewLoader } from '../../js/sirv/util'

const MOBILE_IMAGE_MAX_WIDITH = 914
interface UserMediaProps {
  index: number
  imageInfo: MediaType
  onClick: (props: any) => void
  onTagDeleted: (props?: any) => void
  tagList: MediaTagWithClimb[]
  isAuthorized?: boolean
}

/**
 * Wrapper for user uploaded photo (maybe a short video in the future)
 * @param onClick Desktop only callback
 */
export default function UserMedia ({ index, imageInfo, onClick, tagList, onTagDeleted, isAuthorized = false }: UserMediaProps): JSX.Element {
  const [hovered, setHover] = useState(false)

  const onClickHandler = useCallback((event) => {
    onClick({ mouseXY: [event.clientX, event.clientY], imageInfo, index })
    event.preventDefault()
  }, [])

  const { isDesktop } = useResponsive()
  const loader = isDesktop ? DesktopPreviewLoader : MobileLoader

  return (
    <>
      <figure
        className={
        classNames(
          'cursor-inherit block relative',
          isDesktop ? 'w-[300px] h-[300px] hover:brightness-75' : 'max-w-screen-lg py-12'
        )
      }
        onClick={onClickHandler}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {isDesktop
          ? (<ResponsiveImage mediaUrl={imageInfo.filename} isHero={index === 0} loader={loader} />)
          : (<img
              src={loader({ src: imageInfo.filename, width: MOBILE_IMAGE_MAX_WIDITH })}
              width={MOBILE_IMAGE_MAX_WIDITH}
              sizes='100vw'
             />)}
        {tagList?.length > 0 &&
          <figcaption className='absolute block inset-0 flex flex-col justify-end'>
            <TagList
              hovered={hovered}
              list={tagList}
              onDeleted={onTagDeleted}
              isAuthorized={isAuthorized}
              className='px-2'
            />
          </figcaption>}
      </figure>
    </>
  )
}
