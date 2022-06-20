import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { LightBulbIcon } from '@heroicons/react/outline'
import { Dictionary } from 'underscore'
import { basename } from 'path'

import { MediaType, MediaTagWithClimb } from '../../../js/types'
import TagList from '../TagList'
import AddTag from '../AddTag'
import NextPreviousControl from './NextPreviousControl'
import ResponsiveImage from './ResponsiveImage'
import AddTagCta from './AddTagCta'
import { WithPermission } from '../../../js/types/User'
import DesktopModal from './DesktopModal'
import { DefaultLoader } from '../../../js/sirv/util'

interface SlideViewerProps {
  isOpen: boolean
  initialIndex: number
  onTagDeleted: (props?: any) => void
  onTagAdded: (data: any) => void
  onClose?: () => void
  imageList: MediaType[]
  tagsByMediaId: Dictionary<MediaTagWithClimb[]>
  userinfo: JSX.Element
  auth: WithPermission
  pageUrl: string
}

/**
 * Full screen photo viewer with optional previous and next control.
 */
export default function SlideViewer ({
  isOpen,
  onClose,
  initialIndex,
  imageList,
  tagsByMediaId,
  userinfo,
  auth,
  onTagDeleted,
  onTagAdded,
  pageUrl
}: SlideViewerProps): JSX.Element {
  const [currentImageIndex, setCurrentIndex] = useState<number>(initialIndex)

  useEffect(() => {
    setCurrentIndex(initialIndex)
    if (initialIndex >= 0) {
      navChangeHandler(initialIndex)
    }
    return () => {
      if (initialIndex < 0) return
      window.history.replaceState(null, '', pageUrl)
    }
  }, [initialIndex, imageList])

  const currentImage = imageList[currentImageIndex]

  const tagList = tagsByMediaId?.[currentImage?.mediaId] ?? []

  /**
   * Update current image index and sharable URL
   */
  const navChangeHandler = useCallback((newIndex: number) => {
    setCurrentIndex(newIndex)
    const currentImage = imageList[newIndex]
    const pathname = `${pageUrl}/${basename(currentImage.filename)}`
    window.history.replaceState(null, '', pathname)
  }, [imageList])

  return (
    <DesktopModal
      isOpen={isOpen}
      onClose={onClose}
      mediaContainer={currentImageIndex >= 0
        ? <ResponsiveImage
            mediaUrl={imageList[currentImageIndex].filename}
            isHero
          />
        : null}
      rhsContainer={
        <RhsContainer
          userinfo={userinfo}
          content={
            <InfoContainer
              currentImage={currentImage}
              onTagAdded={onTagAdded}
              onTagDeleted={onTagDeleted}
              tagList={tagList}
              auth={auth}
            />
          }
          footer={<AddTagCta tagCount={tagList.length} auth={auth} />}
        />
      }
      controlContainer={
        <NextPreviousControl
          currentImageIndex={currentImageIndex}
          onChange={navChangeHandler}
          max={imageList.length - 1}
        />
      }
    />
  )
}

export const SingleViewer = ({ media, onTagAdded, onTagDeleted, tagList, userinfo, auth }): JSX.Element => {
  return (
    <>
      <div className='block relative overflow-hidden'>
        <img
          src={DefaultLoader({ src: media.filename, width: 750 })}
          width={750}
          sizes='100vw'
          className='bg-gray-100 w-auto h-[100%] max-h-[700px]'
        />
      </div>
      <RhsContainer
        userinfo={userinfo}
        content={
          <InfoContainer
            currentImage={media}
            onTagAdded={onTagAdded}
            onTagDeleted={onTagDeleted}
            tagList={tagList}
            auth={auth}
          />
        }
      />
    </>
  )
}

interface RhsContainerProps {
  userinfo: ReactElement
  content: ReactElement
  footer?: null | ReactElement
}

const RhsContainer = ({ userinfo, content, footer = null }: RhsContainerProps): JSX.Element => {
  return (
    <div className='flex flex-col justify-start h-[inherit] lg:max-w-[400px] min-w-[350px] bg-white'>
      <div className='grow'>
        <div className='border-b px-4 py-4'>
          {userinfo}
        </div>
        <div className='px-4'>
          {content}
        </div>
      </div>
      <div className='border-t'>
        {footer}
      </div>
    </div>
  )
}

interface InfoContainerProps {
  currentImage: MediaType
  tagList: MediaTagWithClimb[]
  auth: WithPermission
  onTagDeleted: (props?: any) => void
  onTagAdded: (data: any) => void
}

const InfoContainer = ({ currentImage, tagList, auth, onTagAdded, onTagDeleted }: InfoContainerProps): ReactElement => {
  const { isAuthorized } = auth
  return (
    <>
      <div className='my-8'>
        <div className='text-primary text-sm'>
          Climbs: {tagList.length === 0 && <span className='text-tertiary'>none</span>}
        </div>
        {tagList.length > 0 &&
          <TagList
            hovered
            list={tagList}
            onDeleted={onTagDeleted}
            isAuthorized={isAuthorized}
            className='my-2'
          />}
      </div>
      {isAuthorized &&
        <div className='my-8'>
          <div className='text-primary text-sm'>Tag this climb</div>
          <AddTag onTagAdded={onTagAdded} imageInfo={currentImage} className='my-2' />
        </div>}

      {tagList.length === 0 && isAuthorized &&
        <div className='my-8 text-secondary flex items-center space-x-1'>
          <LightBulbIcon className='w-6 h-6 stroke-1 stroke-ob-primary' />
          <span className='mt-1 text-xs'>Your tags help others learn more about the crag</span>
        </div>}
    </>
  )
}
