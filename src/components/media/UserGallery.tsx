import React, { useCallback, useState, useRef, Dispatch, SetStateAction, useEffect } from 'react'
import { Dictionary } from 'underscore'
import { TagIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { basename } from 'path'
import clx from 'classnames'

import UserMedia from './UserMedia'
import MobileMediaCard from './MobileMediaCard'
import useImageTagHelper from './useImageTagHelper'
import { HybridMediaTag, MediaType, IUserProfile } from '../../js/types'
import UploadCTA from './UploadCTA'
import { actions } from '../../js/stores'
import SlideViewer from './slideshow/SlideViewer'
import { TinyProfile } from '../users/PublicProfile'
import { WithPermission } from '../../js/types/User'
import Bar from '../ui/Bar'
import Toggle from '../ui/Toggle'
import { useResponsive } from '../../js/hooks'
import TagList from './TagList'
import InfiniteScroll from 'react-infinite-scroll-component'

export interface UserGalleryProps {
  uid: string
  userProfile: IUserProfile
  initialImageList: MediaType[]
  initialTagsByMediaId: Dictionary<HybridMediaTag[]>
  auth: WithPermission
  postId: string | null
}

/**
 * Image gallery on user profile.
 * Simplifying component Todos:
 *  - remove bulk taging mode
 *  - simplify back button logic with NextJS Layout
 */
export default function UserGallery ({ uid, postId: initialPostId, auth, userProfile, initialImageList, initialTagsByMediaId: initialTagMap }: UserGalleryProps): JSX.Element | null {
  const router = useRouter()
  const imageList = initialImageList

  const [selectedMediaId, setSlideNumber] = useState<number>(-1)
  const [tagModeOn, setTagMode] = useState<boolean>(false) // Bulk tagging
  const [hoveredPicture, setHoveredPicture] = useState(-1)

  const showTagHandler = (index: number): void => {
    setHoveredPicture(index)
  }

  const hideTagHandler = (): void => {
    setHoveredPicture(-1)
  }

  const imageHelper = useImageTagHelper()
  const { isMobile } = useResponsive()

  const { onClick } = imageHelper

  const { isAuthorized } = auth

  const baseUrl = `/u/${uid}`

  const isBase = useCallback((url: string) => {
    return baseUrl === url
  }, [baseUrl])

  router.beforePopState((e) => {
    if (isBase(e.as)) {
      setSlideNumber(-1)
      return true
    }

    return true
  })

  useEffect(() => {
    if (initialPostId != null) {
      // we get here when the user navigates to other pages beyond the gallery, then hits the back button
      const found = imageList?.findIndex(entry => basename(entry.filename) === initialPostId)
      if (found !== -1) {
        setSlideNumber(found)
      }
      return
    }

    // Handle browser forward/back button
    if (router.asPath.length > baseUrl.length && selectedMediaId === -1) {
      const newPostId = basename(router.asPath)
      const found = imageList?.findIndex(entry => basename(entry.filename) === newPostId)
      if (found !== -1) {
        setSlideNumber(found)
      }
    }
  }, [initialPostId, imageList, router])

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
  const imageOnClickHandler = useCallback(async (props: any): Promise<void> => {
    if (isMobile) return
    if (stateRef?.current ?? false) {
      onClick(props) // bulk tagging
    } else {
      await navigateHandler(props.index)
    }
  }, [imageList])

  const slideViewerCloseHandler = useCallback(() => {
    router.back()
    setSlideNumber(-1)
  }, [])

  const navigateHandler = async (newIndex: number): Promise<void> => {
    const currentImage = imageList[newIndex]
    const pathname = `${baseUrl}/${basename(currentImage.filename)}`

    if (selectedMediaId === -1 && newIndex !== selectedMediaId) {
      await router.push({ pathname, query: { gallery: true } }, pathname, { shallow: true })
    } else {
      await router.replace({ pathname, query: { gallery: true } }, pathname, { shallow: true })
    }

    setSlideNumber(newIndex)
  }

  const [hasMore, setHasMore] = useState(true)
  const [imageListToShow, setImageListToShow] = useState<MediaType[]>([])

  // to load more images when user scrolls to the 'scrollThreshold' value of the page
  const fetchMoreData = (): void => {
    // all images are loaded
    if (imageListToShow?.length >= imageList?.length) {
      setHasMore(false)
      return
    }

    // delay fetching images by 1 second to simulate network request
    setTimeout(() => {
      // concatenate furhter images to imageListToShow
      setImageListToShow(imageListToShow.concat(imageList?.slice(imageListToShow?.length, imageListToShow?.length + 9)))
    }, 500)
  }

  useEffect(() => {
    // set initial images to be shown
    setImageListToShow(imageList?.slice(0, 10))
  }, [imageList])

  // When logged-in user has fewer than 3 photos,
  // create empty slots for the call-to-action upload component.
  const placeholders = imageList?.length < 3 && isAuthorized
    ? [...Array(3 - imageList?.length).keys()]
    : []

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
      <InfiniteScroll
        dataLength={imageListToShow?.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={null}
      >
        <div className='flex flex-col gap-x-6 gap-y-10 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:grid-cols-4'>
          {imageList?.length >= 3 && isAuthorized && <UploadCTA key={-1} onUploadFinish={onUploadHandler} />}
          {imageListToShow?.map((imageInfo, index) => {
            const tags = initialTagMap?.[imageInfo.mediaId] ?? []
            const key = `${imageInfo.mediaId}${index}`
            if (isMobile) {
              return (
                <MobileMediaCard
                  key={key}
                  tagList={tags}
                  imageInfo={imageInfo}
                  showTagActions
                  {...auth}
                />
              )
            }
            return (
              <div
                className='relative' key={key}
                onMouseOver={() => showTagHandler(index)}
                onMouseOut={() => hideTagHandler()}
              >
                <UserMedia
                  uid={uid}
                  index={index}
                  tagList={tags}
                  imageInfo={imageInfo}
                  onClick={imageOnClickHandler}
                  isAuthorized={isAuthorized && (stateRef?.current ?? false)}
                />
                <div
                  className={
                      clx(
                        !isAuthorized && tags.length === 0 ? 'hidden' : '',
                        'absolute inset-x-0 bottom-0 p-2 flex items-center opacity-90',
                        hoveredPicture === index ? 'transition-opacity duration-300 ease-in opacity-100 bg-base-100 bg-opacity-90 visible' : 'duration-300 ease-out opacity-0 invisible'
                      )
                      }
                >
                  <TagList
                    key={key}
                    list={tags}
                    imageInfo={imageInfo}
                    {...auth}
                    showDelete
                  />
                </div>
              </div>
            )
          })}
          {placeholders.map(index =>
            <UploadCTA key={index} onUploadFinish={onUploadHandler} />)}
        </div>
      </InfiniteScroll>

      {!isMobile &&
        <SlideViewer
          isOpen={selectedMediaId >= 0}
          initialIndex={selectedMediaId}
          imageList={imageList ?? []}
          tagsByMediaId={initialTagMap}
          userinfo={<TinyProfile
            userProfile={userProfile} onClick={slideViewerCloseHandler}
                    />}
          onClose={slideViewerCloseHandler}
          auth={auth}
          baseUrl={baseUrl}
          onNavigate={navigateHandler}
        />}
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
              <TagIcon className='w-5 h-5' /><span className='font-semibold'>Power mode</span>
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
        : (<>{imageList?.length >= 3 && imageList?.length < 8 && isAuthorized && <span className='hidden md:inline text-secondary mt-0.5 tracking-tight'>&#128072;&#127997;&nbsp;Activate Pro mode</span>}</>)}
    </Bar>
  )
}
