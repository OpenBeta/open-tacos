import { useCallback, useState, useRef, Dispatch, SetStateAction } from 'react'
import { Dictionary } from 'underscore'
import { TagIcon } from '@heroicons/react/outline'

import UserMedia from './UserMedia'
import ImageTagger from './ImageTagger'
import useImageTagHelper from './useImageTagHelper'
import { MediaTagWithClimb, MediaType, IUserProfile } from '../../js/types'
import UploadCTA from './UploadCTA'
import { actions } from '../../js/stores'
import SlideViewer from './slideshow/SlideViewer'
import { TinyProfile } from '../users/PublicProfile'
import { WithPermission } from '../../js/types/User'
import Bar from '../ui/Bar'
import Toggle from '../ui/Toggle'

export interface UserGalleryProps {
  loaded: boolean
  uid: string
  userProfile: IUserProfile
  initialImageList: MediaType[]
  initialTagsByMediaId: Dictionary<MediaTagWithClimb[]>
  auth: WithPermission
}

/**
 * Image gallery on user profile
 */
export default function UserGallery ({ loaded, uid, auth, userProfile, initialImageList, initialTagsByMediaId: initialTagMap }: UserGalleryProps): JSX.Element | null {
  const imageList = initialImageList

  const [selectedMediaId, setSlideNumber] = useState<number>(-1)
  const [tagModeOn, setTagMode] = useState<boolean>(false) // Bulk tagging

  const imageHelper = useImageTagHelper()

  const { onClick } = imageHelper

  // if (imageList == null) return null

  const { isAuthorized } = auth

  const pageUrl = `/u/${uid}`

  /**
   * Run after a tag has sucessfully added to the backend
   */
  const onCompletedHandler = useCallback(async (data?: any) => {
    await actions.media.addTag(data)
  }, [])

  /**
   * Run after a tag has sucessfully deleted from the backend
   */
  const onDeletedHandler = useCallback(async (data: any) => {
    await actions.media.removeTag(data)
  }, [])

  const onUploadHandler = async (imageUrl: string): Promise<void> => {
    await actions.media.addImage(uid, userProfile.uuid, imageUrl, true)
  }

  // Why useRef?
  // The image's onClick callback needs to access the latest value.
  // See https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
  const stateRef = useRef<boolean>()
  stateRef.current = tagModeOn

  /**
   * What happens to when the user clicks on the image depends on
   * whether bulk tagging is on/off.
   */
  const imageOnClickHandler = useCallback((props: any): void => {
    if (stateRef?.current ?? false) {
      onClick(props) // bulk tagging
    } else {
      const { index } = props
      setSlideNumber(index) // open slide viewer
    }
  }, [])

  // const { uuid } = userProfile

  // When logged-in user has fewer than 3 photos,
  // create empty slots for the call-to-action upload component.
  const placeholders = imageList?.length < 3 && isAuthorized
    ? [...Array(3 - imageList?.length).keys()]
    : []

  // console.log('#Gallery ', loaded, imageList)
  // console.log('#gallery', loaded, imageList?.length)
  return (
    <>
      <div className='self-start border-t border-gray-400 w-full'>
        <MediaActionToolbar
          isAuthorized={isAuthorized}
          imageList={imageList}
          setTagMode={setTagMode}
          tagModeOn={tagModeOn}
        />
      </div>
      <div className={`block w-full xl:grid xl:grid-cols-3 xl:gap-8 2xl:grid-cols-4 ${tagModeOn ? 'cursor-cell' : 'cursor-pointer'}`}>
        {imageList?.length >= 3 && isAuthorized && <UploadCTA key={-1} onUploadFinish={onUploadHandler} />}
        {imageList?.map((imageInfo, index) => {
          const tags = initialTagMap?.[imageInfo.mediaId] ?? []
          return (
            <UserMedia
              key={imageInfo.mediaId}
              uid={uid}
              index={index}
              tagList={tags}
              imageInfo={imageInfo}
              onClick={imageOnClickHandler}
              onTagDeleted={onDeletedHandler}
              isAuthorized={isAuthorized && (stateRef?.current ?? false)}
              useClassicATag
            />
          )
        })}

        {placeholders.map(index =>
          <UploadCTA key={index} onUploadFinish={onUploadHandler} />)}

      </div>

      {isAuthorized && imageList?.length > 0 &&
        <ImageTagger
          {...imageHelper} onCompleted={onCompletedHandler}
        />}

      <SlideViewer
        isOpen={selectedMediaId >= 0}
        initialIndex={selectedMediaId}
        imageList={imageList ?? []}
        tagsByMediaId={initialTagMap}
        userinfo={<TinyProfile userProfile={userProfile} onClick={() => setSlideNumber(-1)} />}
        onClose={() => setSlideNumber(-1)}
        auth={auth}
        pageUrl={pageUrl}
      />
    </>
  )
}

interface ActionToolbarProps {
  isAuthorized: boolean
  imageList: MediaType[]
  tagModeOn: boolean
  setTagMode: Dispatch<SetStateAction<boolean>>
}

const MediaActionToolbar = ({ isAuthorized, imageList, tagModeOn, setTagMode }: ActionToolbarProps): JSX.Element => {
  return (
    <Bar layoutClass={Bar.JUSTIFY_LEFT} paddingX={Bar.PX_DEFAULT_LG} className='space-x-4'>
      {isAuthorized &&
        <Toggle
          checked={tagModeOn}
          disabled={imageList.length === 0}
          label={
            <div className='flex items-center space-x-1'>
              <TagIcon className='w-5 h-5' /><span className='font-semibold'>Tag photo</span>
            </div>
          }
          onClick={() => setTagMode(current => !current)}
        />}
      {tagModeOn
        ? (
          <span className='hidden md:inline text-secondary align-text-bottom tracking-tight'>
            Power tagging mode is <b>On</b>.&nbsp;Click on the photo to tag a climb.
          </span>
          )
        : (<>{imageList?.length >= 3 && imageList?.length < 8 && <span className='hidden md:inline text-secondary mt-0.5 tracking-tight'>&#128072;&#127997;&nbsp;Activate Pro mode</span>}</>)}
    </Bar>
  )
}
