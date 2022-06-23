import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { LightBulbIcon } from '@heroicons/react/outline'
import { Dictionary } from 'underscore'
import { basename } from 'path'
import ContentLoader from 'react-content-loader'

import { MediaType, MediaTagWithClimb } from '../../../js/types'
import TagList from '../TagList'
import AddTag from '../AddTag'
import NextPreviousControl from './NextPreviousControl'
import ResponsiveImage from './ResponsiveImage'
import AddTagCta from './AddTagCta'
import { WithPermission } from '../../../js/types/User'
import DesktopModal from './DesktopModal'
import { DefaultLoader } from '../../../js/sirv/util'
import { userMediaStore } from '../../../js/stores/media'

interface SlideViewerProps {
  isOpen: boolean
  initialIndex: number
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
          loaded
          userinfo={userinfo}
          content={
            <InfoContainer
              currentImage={currentImage}
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

interface SingleViewerProps {
  loaded: boolean
  media: MediaType
  tagList: MediaTagWithClimb[]
  userinfo: JSX.Element
  auth: WithPermission
}

export const SingleViewer = ({ loaded, media, tagList, userinfo, auth }: SingleViewerProps): JSX.Element => {
  return (
    <>
      <div className='block relative overflow-hidden min-w-[350px] min-h-[300px]'>
        {loaded
          ? (<img
              src={DefaultLoader({ src: media.filename, width: 750 })}
              width={750}
              sizes='100vw'
              className='bg-gray-100 w-auto h-[100%] max-h-[700px]'
             />)
          : (<ImagePlaceholder uniqueKey={123} />)}
      </div>
      <RhsContainer
        loaded={loaded}
        userinfo={userinfo}
        content={
          <InfoContainer
            currentImage={media}
            tagList={tagList}
            auth={auth}
          />
        }
      />
    </>
  )
}

const ImagePlaceholder = ({ uniqueKey }): JSX.Element => (
  <ContentLoader
    uniqueKey={uniqueKey}
    height={500}
    speed={0}
    backgroundColor='rgb(243 244 246)'
    viewBox='0 0 40 30'
  >
    <rect rx={0} ry={0} width='40' height='30' />
  </ContentLoader>)

const CardContentPlaceholder = (props): JSX.Element => (
  <ContentLoader
    uniqueKey={props.uniqueKey}
    height={500}
    speed={0}
    backgroundColor='rgb(243 244 246)'
    viewBox='0 0 300 400'
    {...props}
  >
    <circle cx='30' cy='30' r='15' />
    <rect x='58' y='24' rx='2' ry='2' width='140' height='10' />
    <rect x='15' y='80' rx='10' ry='10' width='80' height='16' />
    <rect x='105' y='80' rx='10' ry='10' width='80' height='16' />
  </ContentLoader>
)
interface RhsContainerProps {
  loaded: boolean
  userinfo: ReactElement
  content: ReactElement
  footer?: null | ReactElement
}

const RhsContainer = ({ loaded, userinfo, content, footer = null }: RhsContainerProps): JSX.Element => {
  return loaded
    ? (
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
    : (<CardContentPlaceholder uniqueKey={1} />)
}

interface InfoContainerProps {
  currentImage: MediaType
  tagList: MediaTagWithClimb[]
  auth: WithPermission
}

const InfoContainer = ({ currentImage, tagList, auth }: InfoContainerProps): ReactElement => {
  const { isAuthorized } = auth

  const onTagAddedHanlder = useCallback(async (data) => {
    if (isAuthorized) { // The UI shouldn't allow this function to be called, but let's check anyway.
      await userMediaStore.set.addTag(data)
    }
  }, [isAuthorized])

  const onTagDeletedHanlder = useCallback(async (data) => {
    if (isAuthorized) { // The UI shouldn't allow this function to be called, but let's check anyway.
      await userMediaStore.set.removeTag(data)
    }
  }, [isAuthorized])

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
            onDeleted={onTagDeletedHanlder}
            isAuthorized={isAuthorized}
            className='my-2'
          />}
      </div>
      {isAuthorized &&
        <div className='my-8'>
          <div className='text-primary text-sm'>Tag this climb</div>
          <AddTag onTagAdded={onTagAddedHanlder} imageInfo={currentImage} className='my-2' />
        </div>}

      {tagList.length === 0 && isAuthorized &&
        <div className='my-8 text-secondary flex items-center space-x-1'>
          <LightBulbIcon className='w-6 h-6 stroke-1 stroke-ob-primary' />
          <span className='mt-1 text-xs'>Your tags help others learn more about the crag</span>
        </div>}
    </>
  )
}
