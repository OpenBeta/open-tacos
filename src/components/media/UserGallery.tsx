import React, { useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { basename } from 'path'
import clx from 'classnames'
import InfiniteScroll from 'react-infinite-scroll-component'

import UserMedia from './UserMedia'
import MobileMediaCard from './MobileMediaCard'
import { MediaEdge } from '../../js/types'
import UploadCTA from './UploadCTA'
import { actions } from '../../js/stores'
import SlideViewer from './slideshow/SlideViewer'
import { TinyProfile } from '../users/PublicProfile'
import { UserPublicPage } from '../../js/types/User'
import { useResponsive } from '../../js/hooks'
import TagList from './TagList'
import usePermissions from '../../js/hooks/auth/usePermissions'
import useMediaCmd from '../../js/hooks/useMediaCmd'

export interface UserGalleryProps {
  uid: string
  userPublicPage: UserPublicPage
  postId: string | null
}

/**
 * Image gallery on user profile.
 * Simplifying component Todos:
 *  - simplify back button logic with Next Layout in v13
 */
export default function UserGallery ({ uid, postId: initialPostId, userPublicPage }: UserGalleryProps): JSX.Element | null {
  const router = useRouter()
  const userProfile = userPublicPage?.profile

  const [selectedMediaId, setSlideNumber] = useState<number>(-1)

  const { isMobile } = useResponsive()

  const authz = usePermissions({ currentUserUuid: userProfile?.userUuid })
  const { isAuthorized } = authz

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

  const [imageListToShow, setImageListToShow] = useState<MediaEdge[]>(userPublicPage.media.mediaConnection.edges)

  const imageList = imageListToShow.map(edge => edge.node)

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
    await actions.media.addImage(uid, userProfile.userUuid, imageUrl, true)
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

  // to load more images when user scrolls to the 'scrollThreshold' value of the page
  const fetchMoreData = async (): Promise<void> => {
    const foo = await fetchMore({
      variables: {
        userUuid: userPublicPage?.profile.userUuid,
        after: imageListToShow[imageListToShow.length - 1].cursor
      }
    })
    console.log('#fetchmore() ', foo)
    setImageListToShow(curr =>
      curr.concat(foo.data.getUserMediaPagination.mediaConnection.edges))
  }

  // When logged-in user has fewer than 3 photos,
  // create empty slots for the call-to-action upload component.
  const placeholders = imageList?.length < 3 && isAuthorized
    ? [...Array(3 - imageList?.length).keys()]
    : []

  const { fetchMore } = useMediaCmd({ media: userPublicPage?.media })

  return (
    <>
      <InfiniteScroll
        dataLength={imageListToShow?.length}
        next={fetchMoreData}
        hasMore
        loader={null}
      >
        <div className='flex flex-col gap-x-6 gap-y-10 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:grid-cols-4'>
          {imageList?.length >= 3 && isAuthorized && <UploadCTA key={-1} onUploadFinish={onUploadHandler} />}
          {imageListToShow?.map((edge, index) => {
            const mediaWithTags = edge.node
            const { mediaUrl, entityTags } = mediaWithTags
            const key = `${mediaUrl}${index}`
            if (isMobile) {
              return (
                <MobileMediaCard
                  key={key}
                  mediaWithTags={mediaWithTags}
                  showTagActions
                  {...authz}
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
                    {...authz}
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
          auth={authz}
          baseUrl={baseUrl}
          onNavigate={navigateHandler}
        />}
    </>
  )
}
