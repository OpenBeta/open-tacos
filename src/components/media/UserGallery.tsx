import React, { useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { basename } from 'path'
import clx from 'classnames'

import UserMedia from './UserMedia'
import MobileMediaCard from './MobileMediaCard'
import { MediaWithTags, IUserProfile } from '../../js/types'
import UploadCTA from './UploadCTA'
import { actions } from '../../js/stores'
import SlideViewer from './slideshow/SlideViewer'
import { TinyProfile } from '../users/PublicProfile'
import { WithPermission } from '../../js/types/User'
import { useResponsive } from '../../js/hooks'
import TagList from './TagList'
import InfiniteScroll from 'react-infinite-scroll-component'

export interface UserGalleryProps {
  uid: string
  userProfile: IUserProfile
  initialImageList: MediaWithTags[]
  auth: WithPermission
  postId: string | null
}

/**
 * Image gallery on user profile.
 * Simplifying component Todos:
 *  - remove bulk taging mode
 *  - simplify back button logic with Next Layout in v13
 */
export default function UserGallery ({ uid, postId: initialPostId, auth, userProfile, initialImageList }: UserGalleryProps): JSX.Element | null {
  const router = useRouter()
  const imageList = initialImageList

  const [selectedMediaId, setSlideNumber] = useState<number>(-1)

  const { isMobile } = useResponsive()

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
      const found = imageList?.findIndex(entry => basename(entry.mediaUrl) === initialPostId)
      if (found !== -1) {
        setSlideNumber(found)
      }
      return
    }

    // Handle browser forward/back button
    if (router.asPath.length > baseUrl.length && selectedMediaId === -1) {
      const newPostId = basename(router.asPath)
      const found = imageList?.findIndex(entry => basename(entry.mediaUrl) === newPostId)
      if (found !== -1) {
        setSlideNumber(found)
      }
    }
  }, [initialPostId, imageList, router])

  const onUploadHandler = async (imageUrl: string): Promise<void> => {
    await actions.media.addImage(uid, userProfile.uuid, imageUrl, true)
  }

  const imageOnClickHandler = useCallback(async (props: any): Promise<void> => {
    if (isMobile) return
    await navigateHandler(props.index)
  }, [imageList])

  const slideViewerCloseHandler = useCallback(() => {
    router.back()
    setSlideNumber(-1)
  }, [])

  const navigateHandler = async (newIndex: number): Promise<void> => {
    const currentImage = imageList[newIndex]
    const pathname = `${baseUrl}/${basename(currentImage.mediaUrl)}`

    if (selectedMediaId === -1 && newIndex !== selectedMediaId) {
      await router.push({ pathname, query: { gallery: true } }, pathname, { shallow: true })
    } else {
      await router.replace({ pathname, query: { gallery: true } }, pathname, { shallow: true })
    }

    setSlideNumber(newIndex)
  }

  const [hasMore, setHasMore] = useState(true)
  const [imageListToShow, setImageListToShow] = useState<MediaWithTags[]>([])

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
      <InfiniteScroll
        dataLength={imageListToShow?.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={null}
      >
        <div className='flex flex-col gap-x-6 gap-y-10 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:grid-cols-4'>
          {imageList?.length >= 3 && isAuthorized && <UploadCTA key={-1} onUploadFinish={onUploadHandler} />}
          {imageListToShow?.map((mediaWithTags, index) => {
            const { mediaUrl, entityTags } = mediaWithTags
            const key = `${mediaUrl}${index}`
            if (isMobile) {
              return (
                <MobileMediaCard
                  key={key}
                  mediaWithTags={mediaWithTags}
                  showTagActions
                  {...auth}
                />
              )
            }

            return (
              <div className='relative' key={key}>
                <UserMedia
                  uid={uid}
                  index={index}
                  mediaWithTags={mediaWithTags}
                  onClick={imageOnClickHandler}
                  isAuthorized={isAuthorized}
                />
                <div
                  className={
                      clx(
                        !isAuthorized && entityTags.length === 0
                          ? 'hidden'
                          : 'absolute inset-x-0 bottom-0 p-2 flex items-center bg-base-100 bg-opacity-60'
                      )
                      }
                >
                  <TagList
                    key={key}
                    mediaWithTags={mediaWithTags}
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

      {!isMobile && selectedMediaId >= 0 &&
        <SlideViewer
          isOpen={selectedMediaId >= 0}
          initialIndex={selectedMediaId}
          imageList={imageList ?? []}
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
