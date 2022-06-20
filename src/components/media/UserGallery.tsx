import { useCallback, useState, useRef } from 'react'
import { Dictionary } from 'underscore'
import { TagIcon } from '@heroicons/react/outline'

import UserMedia from './UserMedia'
import ImageTagger from './ImageTagger'
import useImageTagHelper from './useImageTagHelper'
import { MediaTagWithClimb, MediaType, IUserProfile } from '../../js/types'
import InitialUploadCTA from './InitialUploadCTA'
import { userMediaStore } from '../../js/stores/media'
import SlideViewer from './slideshow/SlideViewer'
import { TinyProfile } from '../users/PublicProfile'
import { WithPermission } from '../../js/types/User'
import Bar from '../ui/Bar'
import Toggle from '../ui/Toggle'

interface ImageTableProps {
  uid: string
  userProfile: IUserProfile
  initialImageList: MediaType[]
  initialTagsByMediaId: Dictionary<MediaTagWithClimb[]>
  auth: WithPermission
}

/**
 * Image table on user profile
 */
export default function UserGallery ({ uid, auth, userProfile, initialImageList, initialTagsByMediaId: initialTagMap }: ImageTableProps): JSX.Element | null {
  const imageList = initialImageList

  const [selectedMediaId, setIsOpen] = useState(-1)
  const [tagModeOn, setTagMode] = useState<boolean>(false)

  const imageHelper = useImageTagHelper()
  // eslint-disable-next-line
  const { onClick } = imageHelper

  if (imageList == null) return null

  const { isAuthorized } = auth

  const pageUrl = `/u/${uid}`
  /**
   * Run after a tag has sucessfully added to the backend
   * Todo: move tag handling out of local state and into a global store
   * to reduce prop drilling
   */
  const onCompletedHandler = useCallback(async (data?: any) => {
    await userMediaStore.set.addTag(data)
  }, [])

  /**
   * Run after a tag has sucessfully deleted from the backend
   */
  const onDeletedHandler = useCallback(async (data: any) => {
    await userMediaStore.set.removeTag(data)
  }, [])

  const onUploadHandler = async (imageUrl: string): Promise<void> => {
    await userMediaStore.set.addImage(uid, uuid, imageUrl, true, true)
  }

  // we need to store tagMode in a ref to give the image's onclick access
  // to the latest value.
  // See https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
  const stateRef = useRef<boolean>()
  stateRef.current = tagModeOn

  const imageOnClickHandler = useCallback((props: any): void => {
    if (stateRef?.current ?? false) {
      onClick(props)
    } else {
      const { index } = props
      setIsOpen(index)
    }
  }, [])

  const { uuid } = userProfile

  // When logged-in user has fewer than 3 photos,
  // create empty slots for the call-to-action upload component.
  const placeholders = imageList.length < 3 && isAuthorized
    ? [...Array(3 - imageList.length).keys()]
    : []

  return (
    <>
      <Bar layoutClass={Bar.JUSTIFY_LEFT} paddingX={Bar.PX_DEFAULT_LG} className='space-x-4'>
        {isAuthorized &&
          <Toggle
            enabled={tagModeOn}
            label={
              <div className='flex items-center space-x-1'>
                <TagIcon className='w-5 h-5' /><span>Tag photo</span>
              </div>
            }
            onClick={() => setTagMode(current => !current)}
          />}
        {tagModeOn && <span className='text-secondary align-text-bottom'>Power tagging mode is <b>On</b>.  Click on the photo to tag a climb.</span>}
      </Bar>
      <div className={`block w-full xl:grid xl:grid-cols-3 xl:gap-8  2xl:grid-cols-4 ${tagModeOn ? 'cursor-cell' : 'cursor-pointer'}`}>

        {imageList.map((imageInfo, index) => {
          const tags = initialTagMap?.[imageInfo.mediaId] ?? []
          return (
            <UserMedia
              key={imageInfo.mediaId}
              index={index}
              tagList={tags}
              imageInfo={imageInfo}
              onClick={imageOnClickHandler}
              onTagDeleted={onDeletedHandler}
              isAuthorized={isAuthorized && (stateRef?.current ?? false)}
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

      <SlideViewer
        isOpen={selectedMediaId >= 0}
        initialIndex={selectedMediaId}
        imageList={imageList}
        tagsByMediaId={initialTagMap}
        userinfo={<TinyProfile userProfile={userProfile} />}
        onClose={() => setIsOpen(-1)}
        auth={auth}
        pageUrl={pageUrl}
      />
    </>
  )
}
