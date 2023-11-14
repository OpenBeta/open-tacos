import React, { useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { basename } from 'path'
import clx from 'classnames'
import InfiniteScroll from 'react-infinite-scroll-component'

import UserMedia from './UserMedia'
import MobileMediaCard from './MobileMediaCard'
import UploadCTA from './UploadCTA'
import SlideViewer from './slideshow/SlideViewer'
import { TinyProfile } from '../users/PublicProfile'
import { UserPublicPage } from '../../js/types/User'
import { useResponsive } from '../../js/hooks'
import TagList from './TagList'
import usePermissions from '../../js/hooks/auth/usePermissions'
import useMediaCmd from '../../js/hooks/useMediaCmd'
import { useUserGalleryStore } from '../../js/stores/useUserGalleryStore'

export interface UserGalleryProps {
  uid: string
  userPublicPage: UserPublicPage
  postId: string | null
}

/**
 * Image gallery with infinite scroll on user profile.
 *
 * A. Data fetching strategy:
 * 1.  Component receives most recent 6 images from server-side function getStaticProps()
 *     (not cached in Apollo cache, but cached by Next.js page props)
 * 2.  When the user scrolls down, fetch the next 6 (cache these media objects)
 * 3.  Repeat (2) if the user keeps scrolling down
 * 4.  If the user scrolls up and then down again, repeat (2) but now we have a cache hit.
 *
 * B. When the user navigates away then revisits page:
 * 1. Component will start with the most recent 6 (see A.1 above)
 * 2. When the user scrolls down, fetch the next 6 (cache hit)
 *
 * Simplifying component Todos:
 *  - simplify back button logic with Next Layout in v13
 *
 * See also:
 * - GQL pagination: https://graphql.org/learn/pagination/
 * - Apollo queries & caching: https://www.apollographql.com/docs/react/data/queries
 */
export default function UserGallery ({ uid, postId: initialPostId, userPublicPage }: UserGalleryProps): JSX.Element {
  const router = useRouter()
  const userProfile = userPublicPage.profile

  const { fetchMoreMediaForward } = useMediaCmd()

  const [selectedMediaId, setSlideNumber] = useState<number>(-1)

  const { isMobile } = useResponsive()

  const authz = usePermissions({ currentUserUuid: userProfile.userUuid })
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

  const mediaConnection = useUserGalleryStore((state) => state.mediaConnection)
  const resetData = useUserGalleryStore((state) => state.reset)
  const appendMore = useUserGalleryStore((state) => state.append)

  /**
   * Initialize image data store
   */
  useEffect(() => {
    if (isAuthorized) {
      void fetchMoreMediaForward({
        userUuid: userPublicPage.profile.userUuid
      }).then(nextMediaConnection => {
        if (nextMediaConnection != null) resetData(nextMediaConnection)
      })
    } else {
      resetData(userPublicPage.media.mediaConnection)
    }
  }, [userPublicPage.media.mediaConnection])

  const imageList = mediaConnection.edges.map(edge => edge.node)

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

  interface ImageOnClickHandlerProps {
    index: number
  }

  const imageOnClickHandler = useCallback((props: ImageOnClickHandlerProps): void => {
    if (isMobile) return
    void navigateHandler(props.index)
  }, [imageList])

  const slideViewerCloseHandler = useCallback(() => {
    router.back()
    setSlideNumber(-1)
  }, [])

  const navigateHandler = (newIndex: number): void => {
    const currentImage = imageList[newIndex]
    const pathname = `${baseUrl}/${basename(currentImage.mediaUrl)}`

    if (selectedMediaId === -1 && newIndex !== selectedMediaId) {
      void router.push({ pathname, query: { gallery: true } }, pathname, { shallow: true })
    } else {
      void router.replace({ pathname, query: { gallery: true } }, pathname, { shallow: true })
    }

    setSlideNumber(newIndex)
  }

  // to load more images when user scrolls to the 'scrollThreshold' value of the page
  const fetchMoreData = async (): Promise<void> => {
    let lastCursor: string | undefined
    if (mediaConnection.edges.length > 0) {
      lastCursor = mediaConnection.edges[mediaConnection.edges.length - 1].cursor
    }
    const nextMediaConnection = await fetchMoreMediaForward({
      userUuid: userPublicPage?.profile.userUuid,
      after: lastCursor
    })

    if (nextMediaConnection == null) {
      return
    }

    appendMore(nextMediaConnection)
  }

  // When logged-in user has fewer than 3 photos,
  // create empty slots for the call-to-action upload component.
  const placeholders = mediaConnection.edges.length < 3 && isAuthorized
    ? [...Array(3 - mediaConnection.edges.length).keys()]
    : []

  return (
    <>
      <InfiniteScroll
        dataLength={mediaConnection.edges.length}
        next={fetchMoreData}
        hasMore={mediaConnection.pageInfo.hasNextPage}
        loader={null}
      >
        <div className='flex flex-col gap-x-6 gap-y-10 sm:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:grid-cols-4'>
          {imageList?.length >= 3 && isAuthorized && <UploadCTA key={-1} />}
          {mediaConnection.edges.map((edge, index: number) => {
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
            <UploadCTA key={index} />)}
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
