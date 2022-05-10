import { useCallback, useState } from 'react'
import Imgix from 'react-imgix'
import { v5 as uuidv5 } from 'uuid'
import { Dictionary } from 'underscore'

import { IMGIX_CONFIG } from '../../js/imgix/ImgixClient'
import ImageTagger from '../media/ImageTagger'
import useImageTagHelper from '../media/useImageTagHelper'
import TagList from '../media/TagList'
import { MediaTag, MediaClimbTag } from '../../js/types'

interface ImageTableProps {
  imageList: any[]
  initialTagsByMediaId: Dictionary<MediaTag[]>
}

export default function ImageTable ({ imageList, initialTagsByMediaId }: ImageTableProps): JSX.Element {
  const [tagsByMediaId, updateTag] = useState(initialTagsByMediaId)

  const imageHelper = useImageTagHelper()
  const { onClick } = imageHelper

  if (imageList == null) return null

  /**
   * Run after a tag has sucessfully added to the backend
   */
  const onCompletedHandler = useCallback(async (data: any) => {
    const { setTag } = data
    if (setTag == null) return
    const { mediaUuid } = setTag
    const { id } = setTag.climb
    const currentTagList = tagsByMediaId?.[mediaUuid] ?? []

    if (currentTagList.findIndex((tag: MediaClimbTag) => tag.climb.id === id) !== -1) {
      // Tag for the same climb exists
      // We only allow 1 climb/area tag per media
      return
    }

    updateTag(curr => {
      const currTagList = curr?.[mediaUuid] ?? []
      return ({
        ...curr,
        [mediaUuid]: currTagList.length === 0 ? [setTag] : currTagList.concat([setTag])
      })
    })
    await fetch('/api/revalidate')
  }, [])

  /**
   * Run after a tag has sucessfully deleted from the backend
   */
  const onDeletedHandler = useCallback(async (data: any) => {
    const { removeTag } = data
    if (removeTag == null) return
    const { mediaUuid, destinationId } = removeTag

    if (tagsByMediaId?.[mediaUuid] == null) {
      // Try to remove a tag that doesn't exist in local state
      return
    }

    updateTag(curr => {
      const currTagList = curr[mediaUuid]
      const idx = currTagList.findIndex((tag: MediaClimbTag) => tag.climb.id === destinationId)
      currTagList.splice(idx, 1)
      return ({
        ...curr,
        [removeTag.mediaUuid]: currTagList
      })
    })
    await fetch('/api/revalidate')
  }, [tagsByMediaId])

  return (
    <>
      <div className='flex justify-center flex-wrap'>
        {imageList.map(imageInfo => {
          const tags = tagsByMediaId?.[uuidv5(imageInfo.origin_path, uuidv5.URL)] ?? []
          return (
            <UserImage
              key={imageInfo.origin_path} tagList={tags} imageInfo={imageInfo} onClick={onClick} onTagDeleted={onDeletedHandler}
            />
          )
        })}
      </div>
      <ImageTagger
        {...imageHelper} onCompleted={onCompletedHandler}
      />
    </>

  )
}

interface UserImageProps {
  imageInfo: any
  onClick: (props: any) => void
  onTagDeleted?: (props?: any) => void
  tagList: MediaTag[]
}

const UserImage = ({ imageInfo, onClick, tagList, onTagDeleted }: UserImageProps): JSX.Element => {
  const [hovered, setHover] = useState(false)
  const imgUrl = `${IMGIX_CONFIG.sourceURL}${imageInfo.origin_path as string}`

  const onClickHandler = useCallback((event) => {
    onClick({ mouseXY: [event.clientX, event.clientY], imageInfo })
  }, [])

  return (
    <div className='cursor-pointer block mx-0 my-4 md:m-4 relative' onClick={onClickHandler} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Imgix
        src={imgUrl}
        width={300}
        height={300}
        imgixParams={{
          fit: 'crop',
          ar: '1:1'
        }}
      />
      {tagList?.length > 0 &&
        <div className='absolute inset-0 flex flex-col justify-end'>
          <TagList hovered={hovered} list={tagList} onDeleted={onTagDeleted} />
        </div>}
    </div>
  )
}
