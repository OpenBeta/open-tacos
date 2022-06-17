import { useState, useCallback } from 'react'
import Image from 'next/image'

import { SIRV_CONFIG } from '../../js/sirv/SirvClient'
import TagList from './TagList'
import { MediaTagWithClimb, MediaType } from '../../js/types'

interface UserMediaProps {
  index: number
  imageInfo: MediaType
  onClick: (props: any) => void
  onTagDeleted: (props?: any) => void
  tagList: MediaTagWithClimb[]
  isAuthorized?: boolean
}

/**
 * Wrapper for user uploaded photo (maybe short video in the future)
 */
export default function UserMedia ({ index, imageInfo, onClick, tagList, onTagDeleted, isAuthorized = false }: UserMediaProps): JSX.Element {
  const [hovered, setHover] = useState(false)
  const imgUrl = `${SIRV_CONFIG.baseUrl ?? ''}${imageInfo.filename}?format=webp&thumbnail=300&q=90`

  const onClickHandler = useCallback((event) => {
    onClick({ mouseXY: [event.clientX, event.clientY], imageInfo, index })
    event.stopPropagation()
  }, [])

  return (
    <figure
      className='cursor-inherit block w-[300px] h-[300px] relative hover:brightness-75'
      onClick={onClickHandler}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image
        src={imgUrl}
        width={300}
        height={300}
      />
      {tagList?.length > 0 &&
        <figcaption className='absolute inset-0 flex flex-col justify-end'>
          <TagList
            hovered={hovered}
            list={tagList}
            onDeleted={onTagDeleted}
            isAuthorized={isAuthorized}
            className='px-2'
          />
        </figcaption>}
    </figure>
  )
}
