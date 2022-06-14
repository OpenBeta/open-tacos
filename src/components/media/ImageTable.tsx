import { useCallback, useState } from 'react'
import { Dictionary } from 'underscore'

import UserMedia from './UserMedia'
import ImageTagger from './ImageTagger'
import useImageTagHelper from './useImageTagHelper'
import { MediaTagWithClimb, MediaType, IUserProfile } from '../../js/types'
import InitialUploadCTA from './InitialUploadCTA'
import { userMediaStore, revalidateServePage } from '../../js/stores/media'
import SimpleModal from '../../components/ui/SimpleModal'
import { TinyProfile } from '../users/PublicProfile'

interface ImageTableProps {
  isAuthorized: boolean
  uid: string
  userProfile: IUserProfile
  initialImageList: MediaType[]
  initialTagsByMediaId: Dictionary<MediaTagWithClimb[]>
}

/**
 * Image table on user profile
 */
export default function ImageTable ({ uid, isAuthorized, userProfile, initialImageList, initialTagsByMediaId }: ImageTableProps): JSX.Element | null {
  const imageList = initialImageList

  const [tagsByMediaId, updateTag] = useState(initialTagsByMediaId)
  const [selectedMediaId, setIsOpen] = useState(-1)

  const imageHelper = useImageTagHelper()
  // eslint-disable-next-line
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

    if (currentTagList.findIndex((tag: MediaTagWithClimb) => tag.climb.id === id) !== -1) {
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
      const idx = currTagList.findIndex((tag: MediaTagWithClimb) => tag.climb.id === destinationId)
      currTagList.splice(idx, 1)
      return ({
        ...curr,
        [removeTag.mediaUuid]: currTagList
      })
    })
    await revalidateServePage(uid)
  }, [tagsByMediaId])

  const onUploadHandler = async (imageUrl: string): Promise<void> => {
    await userMediaStore.set.addImage(uid, uuid, imageUrl, true, true)
  }

  const { uuid } = userProfile

  // When logged-in user has fewer than 3 photos,
  // create empty slots for the call-to-action upload component.
  const placeholders = imageList.length < 3 && isAuthorized ? [...Array(3 - imageList.length).keys()] : []

  return (
    <>
      <div className='flex flex-row flex-wrap md:gap-8 justify-center'>

        {imageList.map((imageInfo, index) => {
          const tags = tagsByMediaId?.[imageInfo.mediaId] ?? []
          return (
            <UserMedia
              key={imageInfo.mediaId}
              tagList={tags}
              imageInfo={imageInfo}
              onClick={() => {
                // onClick()
                setIsOpen(index)
              }}
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
      <SimpleModal
        isOpen={selectedMediaId >= 0}
        onClose={() => setIsOpen(-1)}
        initialIndex={selectedMediaId}
        imageList={imageList}
        userinfo={<TinyProfile userProfile={userProfile} />}
      />
    </>
  )
}
