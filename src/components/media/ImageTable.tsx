import { useCallback, useState } from 'react'
import { Dictionary } from 'underscore'
import { v5 as uuidv5 } from 'uuid'

import UserMedia from './UserMedia'
import ImageTagger from './ImageTagger'
import useImageTagHelper from './useImageTagHelper'
import { MediaTag, MediaClimbTag, MediaType, IUserProfile } from '../../js/types'
import InitialUploadCTA from './InitialUploadCTA'

interface ImageTableProps {
  isAuthorized: boolean
  uid: string
  userProfile: IUserProfile
  initialImageList: MediaType[]
  initialTagsByMediaId: Dictionary<MediaTag[]>
}

/**
 * Image table on user profile
 */
export default function ImageTable ({ uid, isAuthorized, userProfile, initialImageList, initialTagsByMediaId }: ImageTableProps): JSX.Element | null {
  const [tagsByMediaId, updateTag] = useState(initialTagsByMediaId)
  const [imageList, updateImageList] = useState(initialImageList)

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

  const onUploadHandler = useCallback(async (imageUrl: string) => {
    const newMediaUuid = uuidv5(imageUrl, uuidv5.URL)
    let updated: boolean = false
    updateImageList((currentList) => {
      // Image already exists (same URL), don't add to current list
      const existed = currentList.findIndex(({ mediaId }) => mediaId === newMediaUuid)
      if (existed >= 0) { return currentList }
      updated = true
      return ([
        ...currentList,
        {
          ownerId: uuid,
          mediaId: newMediaUuid,
          filename: imageUrl,
          ctime: new Date(),
          mtime: new Date(),
          contentType: 'image/jpeg',
          meta: {}
        }
      ])
    })
    if (updated) {
      await revalidateServePage(uid)
    }
  }, [])

  const { uuid } = userProfile

  // When logged-in user has fewer than 3 photos,
  // create empty slots for the call-to-action upload component.
  const placeholders = imageList.length < 3 && isAuthorized ? [...Array(3 - imageList.length).keys()] : []

  return (
    <>
      <div className='flex flex-row flex-wrap md:gap-8 justify-center'>

        {imageList.map(imageInfo => {
          const tags = tagsByMediaId?.[imageInfo.mediaId] ?? []
          return (
            <UserMedia
              key={imageInfo.mediaId}
              tagList={tags}
              imageInfo={imageInfo}
              onClick={onClick}
              onTagDeleted={onDeletedHandler}
              isAuthorized={isAuthorized}
            />
          )
        })}

        {placeholders.map(index =>
          <InitialUploadCTA key={index} onUploadFinish={onUploadHandler} />)}

      </div>
      {isAuthorized && imageList.length > 0 &&
        <ImageTagger
          {...imageHelper} onCompleted={onCompletedHandler}
        />}

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
