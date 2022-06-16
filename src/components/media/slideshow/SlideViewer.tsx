import React, { ReactElement, useEffect, useState } from 'react'
import { LightBulbIcon } from '@heroicons/react/outline'
import { Dictionary } from 'underscore'

import { MediaType, MediaTagWithClimb } from '../../../js/types'
import TagList from '../TagList'
import AddTag from '../AddTag'
import NextPreviousControl from './NextPreviousControl'
import ResponsiveImage from './ResponsiveImage'
import AddTagCta from './AddTagCta'
import { WithPermission } from '../../../js/types/User'
import DesktopModal from './DesktopModal'

interface SimpleModalProps {
  isOpen: boolean
  initialIndex: number
  onTagDeleted: (props?: any) => void
  onTagAdded: (data: any) => void
  onClose: () => void
  imageList: MediaType[]
  tagsByMediaId: Dictionary<MediaTagWithClimb[]>
  userinfo: JSX.Element
  auth: WithPermission
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
  onTagAdded
}: SimpleModalProps): JSX.Element {
  const [currentImageIndex, setCurrentIndex] = useState<number>(initialIndex)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  const currentImage = imageList[currentImageIndex]

  const tagList = tagsByMediaId?.[currentImage?.mediaId] ?? []

  return (
    <DesktopModal
      isOpen={isOpen}
      onClose={onClose}
      userProfileContainer={userinfo}
      mediaContainer={currentImageIndex >= 0
        ? <ResponsiveImage
            mediaUrl={imageList[currentImageIndex].filename}
            isHero
          />
        : null}
      footerContainer={<AddTagCta tagCount={tagList.length} auth={auth} />}
      controlContainer={
        <NextPreviousControl
          currentImageIndex={currentImageIndex}
          setCurrentIndex={setCurrentIndex}
          imageList={imageList}
        />
      }
      infoContainer={
        <InfoContainer
          currentImage={currentImage}
          onTagAdded={onTagAdded}
          onTagDeleted={onTagDeleted}
          tagList={tagList} auth={auth}
        />
}

    />
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
