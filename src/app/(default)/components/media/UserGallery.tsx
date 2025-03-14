'use client'
import React, { useCallback, useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { basename } from 'path'
import clx from 'classnames'
import InfiniteScroll from 'react-infinite-scroll-component'

import UserMedia from '@/components/media/UserMedia'
import MobileMediaCard from '@/components/media/MobileMediaCard'
import UploadCTA from '@/components/media/UploadCTA'
import SlideViewer from '@/components/media/slideshow/SlideViewer'
import { TinyProfile } from '@/components/users/PublicProfile'
import { UserPublicPage } from '@/js/types/User'
import { useResponsive } from '@/js/hooks'
import TagList from '@/components/media/TagList'
import usePermissions from '@/js/hooks/auth/usePermissions'
import useMediaCmd from '@/js/hooks/useMediaCmd'
import { useUserGalleryStore } from '@/js/stores/useUserGalleryStore'
import { relayMediaConnectionToMediaArray } from '@/js/utils'
import { useSession } from 'next-auth/react'

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
 * See also:
 * - GQL pagination: https://graphql.org/learn/pagination/
 * - Apollo queries & caching: https://www.apollographql.com/docs/react/data/queries
 */
export default function UserGallery ({ uid, postId: initialPostId, userPublicPage }: UserGalleryProps): JSX.Element | null {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { status: sessionStatus } = useSession()
  const userProfile = userPublicPage.profile

  const { fetchMoreMediaForward } = useMediaCmd()

  const [selectedMediaId, setSlideNumber] = useState<number>(-1)

  const { isMobile } = useResponsive()

  const authz = usePermissions({ currentUserUuid: userProfile.userUuid })
  const { isAuthorized } = authz
  const mediaList = relayMediaConnectionToMediaArray(userPublicPage?.media?.mediaConnection)

  const baseUrl = `/u/${uid}`

  const isBase = useCallback((url: string) => {
    return baseUrl === url
  }, [baseUrl])

  useEffect(() => {
    const handlePopState = (): void => {
      if (isBase(pathname)) {
        setSlideNumber(-1)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isBase, pathname])

  const mediaConnection = useUserGalleryStore((state) => state.mediaConnection)
  const resetData = useUserGalleryStore((state) => state.reset)
  const appendMore = useUserGalleryStore((state) => state.append)

  /**
  * Initialize image data store
  */
  useEffect(() => {
    if (sessionStatus === 'loading') return // Wait for session data to load

    if (isAuthorized) {
      void fetchMoreMediaForward({
        userUuid: userPublicPage.profile.userUuid
      }).then(nextMediaConnection => {
        if (nextMediaConnection != null) resetData(nextMediaConnection)
      })
    } else {
      resetData(userPublicPage.media.mediaConnection)
    }
  }, [userPublicPage.media.mediaConnection, sessionStatus])

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
    if (pathname.length > baseUrl.length && selectedMediaId === -1) {
      const newPostId = basename(pathname)
      const found = imageList?.findIndex(entry => basename(entry.mediaUrl) === newPostId)
      if (found !== -1) {
        setSlideNumber(found)
      }
    }
  }, [initialPostId, imageList, router])

  const imageOnClickHandler = useCallback((props: any): void => {
    if (isMobile) return
    void navigateHandler(props.index)
  }, [imageList])

  const slideViewerCloseHandler = useCallback(() => {
    router.push(baseUrl)
    setSlideNumber(-1)
  }, [])

  const navigateHandler = (newIndex: number): void => {
    const currentImage = imageList[newIndex]
    const imagePathname = `${baseUrl}/${basename(currentImage.mediaUrl)}`
    const params = new URLSearchParams(searchParams.toString())
    params.set('gallery', 'true')

    if (selectedMediaId === -1 && newIndex !== selectedMediaId) {
      window.history.pushState({}, '', `${imagePathname}?${params.toString()}`)
    } else {
      window.history.replaceState({}, '', `${imagePathname}?${params.toString()}`)
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

  if (sessionStatus === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <>
      {isAuthorized && (
        <div className='flex justify-center mt-8 text-secondary text-sm whitespace-normal px-4 lg:px-0'>
          <div className='border rounded-md px-6 py-2 shadow'>
            <ul className='list-disc'>
              <li>
                Please upload 3 photos to complete your profile{' '}
                {mediaList?.length >= 3 && <span>&#10004;</span>}
              </li>
              <li>Upload only your own photos</li>
              <li>
                Keep it <b>Safe For Work</b> and climbing-related
              </li>
            </ul>
          </div>
        </div>
      )}

      <hr className='mt-8' />

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
                  className={clx(
                    !isAuthorized && entityTags.length === 0 ? 'hidden' : 'absolute inset-x-0 bottom-0 p-2 flex items-center bg-base-100 bg-opacity-60'
                  )}
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
          onNavigate={navigateHandler}
        />}

      {!isAuthorized && (
        <div className='mt-4 w-full mx-auto text-xs text-base-content text-center'>
          All photos are copyrighted by their respective owners. All Rights Reserved.
        </div>
      )}
    </>
  )
}
