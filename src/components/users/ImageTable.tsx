import { useCallback, useState } from 'react'
import { Dictionary } from 'underscore'

import UserMedia from '../media/UserMedia'
import ImageTagger from '../media/ImageTagger'
import useImageTagHelper from '../media/useImageTagHelper'
import { MediaTag, MediaClimbTag, MediaType } from '../../js/types'

interface ImageTableProps {
  uid: string
  imageList: MediaType[]
  initialTagsByMediaId: Dictionary<MediaTag[]>
}

/**
 * Image table on user profile
 */
export default function ImageTable ({ uid, imageList, initialTagsByMediaId }: ImageTableProps): JSX.Element | null {
  const [tagsByMediaId, updateTag] = useState(initialTagsByMediaId)

  const imageHelper = useImageTagHelper()
  const { onClick } = imageHelper

  if (imageList == null) return null

  /**
   * Run after a tag has sucessfully added to the backend
   */
  const onCompletedHandler = useCallback(async (data?: any) => {
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
    await revalidateServePage(uid)
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
    await revalidateServePage(uid)
  }, [tagsByMediaId])

  return (
    <>
      <div className='mt-8 flex justify-center flex-wrap'>
        {imageList.map(imageInfo => {
          const tags = tagsByMediaId?.[imageInfo.mediaId] ?? []
          return (
            <UserMedia
              key={imageInfo.mediaId}
              tagList={tags}
              imageInfo={imageInfo}
              onClick={onClick}
              onTagDeleted={onDeletedHandler}
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

/**
 * Tell the backend to regenerate user profile page.
 * See https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
 * The token is URL encoded value of .env PAGE_REVALIDATE_TOKEN
 * @param uid user id
 */
const revalidateServePage = async (uid: string): Promise<any> => await fetch(`/api/revalidate?token=8b%26o4t%21xUqAN3Y%239&u=${uid}`)
