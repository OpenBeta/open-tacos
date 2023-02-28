import React, { ReactElement } from 'react'

import { LightBulbIcon } from '@heroicons/react/24/outline'
import { Dictionary } from 'underscore'
import ContentLoader from 'react-content-loader'

import { MediaType, HybridMediaTag } from '../../../js/types'
import TagList from '../TagList'
import NextPreviousControl from './NextPreviousControl'
import ResponsiveImage from './ResponsiveImage'
import AddTagCta from './AddTagCta'
import { WithPermission } from '../../../js/types/User'
import DesktopModal from './DesktopModal'
import { DefaultLoader } from '../../../js/sirv/util'

interface SlideViewerProps {
  isOpen: boolean
  initialIndex: number
  onClose?: () => void
  imageList: MediaType[]
  tagsByMediaId: Dictionary<HybridMediaTag[]>
  userinfo: JSX.Element
  auth: WithPermission
  baseUrl: string
  onNavigate: (newIndex: number) => void
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
  baseUrl,
  onNavigate
}: SlideViewerProps): JSX.Element {
  const currentImage = imageList[initialIndex]

  const tagList = tagsByMediaId?.[currentImage?.mediaId] ?? []

  return (
    <DesktopModal
      isOpen={isOpen}
      onClose={onClose}
      mediaContainer={initialIndex >= 0
        ? <ResponsiveImage
            mediaUrl={imageList[initialIndex].filename}
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
              onClose={onClose}
            />
          }
          footer={<><AddTagCta tagCount={tagList.length} auth={auth} /></>}
        />
      }
      controlContainer={
        <NextPreviousControl
          currentImageIndex={initialIndex}
          onChange={onNavigate}
          max={imageList.length - 1}
        />
      }
    />
  )
}

interface SingleViewerProps {
  loaded: boolean
  media: MediaType | null
  tagList: HybridMediaTag[]
  userinfo: JSX.Element
  auth: WithPermission
  keyboardTip?: boolean
  onClose?: () => void
}

export const SingleViewer = ({ loaded, media, tagList, userinfo, auth, keyboardTip = true, onClose }: SingleViewerProps): JSX.Element => {
  return (
    <>
      <div className='block relative overflow-hidden min-w-[350px] min-h-[300px]'>
        {loaded && media?.filename != null
          ? (<img
              src={DefaultLoader({ src: media.filename, width: 1200 })}
              width={1200}
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
            keyboardTip={keyboardTip}
            onClose={onClose}
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
        <div className='grow flex-col flex'>
          <div className='border-b px-4 py-4'>
            {userinfo}
          </div>
          <div className='px-4 grow flex flex-col'>
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
  currentImage: MediaType | null
  tagList: HybridMediaTag[]
  auth: WithPermission
  keyboardTip?: boolean
  onClose?: () => void
}

export const keyboardTips = (
  <div className='mb-2 flex flex-col gap-4 text-sm text-base-300 font-semibold'>
    <div> Keyboard shortcuts:</div>
    <div className='flex flex-col gap-2'>
      <span><kbd className='mr-2 kbd'>◀︎</kbd>PREVIOUS</span>
      <span><kbd className='mr-2 kbd'>▶︎</kbd>NEXT</span>
    </div>
  </div>
)

const InfoContainer = ({ currentImage, tagList, auth, keyboardTip = true, onClose }: InfoContainerProps): ReactElement | null => {
  if (currentImage == null) return null

  return (
    <>
      <div className='my-8'>
        <div className='text-primary text-sm'>
          Climbs: {(tagList?.length ?? 0) === 0 && <span className='text-tertiary'>none</span>}
        </div>
        {tagList?.length > 0 &&
          <TagList
            list={tagList}
            imageInfo={currentImage}
            {...auth}
            showDelete
            className='my-2'
          />}
      </div>

      {tagList?.length === 0 &&
        <div className='my-8 text-secondary flex items-center space-x-1'>
          <LightBulbIcon className='w-6 h-6 stroke-1 stroke-ob-primary' />
          <span className='mt-1 text-xs'>Your tags help others learn more about the crag</span>
        </div>}

      <div className='flex-1' />
      {keyboardTip &&
        keyboardTips}
      {auth.isAuthorized &&
        <div className='my-8 flex items-center hover:bg-rose-50 p-2 rounded-lg transition'>
          <div className='text-primary text-sm flex-1'>Enable <b>Power mode</b> to delete this image</div>
        </div>}
    </>
  )
}
