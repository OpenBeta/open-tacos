'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'
import { MediaWithTags } from '@/js/types'
import { WithPermission } from '@/js/types/User'

import DesktopModal from './DesktopModal'
import SharedModal from './Modal'
import { InfoContainer } from './InfoContainer'
import AddTagCta from '@/components/media/slideshow/AddTagCta'
import { RhsContainer } from './RhsContainer'

interface SlideViewerProps {
  // isOpen: boolean
  initialIndex: number
  imageList: MediaWithTags[]
  userinfo: JSX.Element
  auth: WithPermission
  galleryType: 'area' | 'climb' | 'user'
  dialogTitle?: string
  uuid: string
}

export default function SlideViewer ({
  // isOpen,
  initialIndex,
  imageList,
  userinfo,
  auth,
  galleryType,
  dialogTitle = 'Image Gallery',
  uuid
}: SlideViewerProps): JSX.Element | null {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(true)
  const currentImage = imageList?.[initialIndex] ?? null
  const hotkeysEnabled = isOpen && currentImage != null

  const internalNavigate = (newIndex: number): void => {
    if (newIndex >= 0 && newIndex < imageList.length) {
      const newPhoto = imageList[newIndex]
      router.replace(`/gallery/p/${uuid}/${newPhoto.id}?type=${galleryType}`)
    }
  }

  const internalOnClose = (): void => {
    router.back()
  }

  useHotkeys('left', () => {
    if (currentImage != null && initialIndex > 0) {
      internalNavigate(initialIndex - 1)
    }
  }, { enabled: hotkeysEnabled }, [initialIndex, internalNavigate, hotkeysEnabled, currentImage])

  useHotkeys('right', () => {
    if (currentImage != null && initialIndex < imageList.length - 1) {
      internalNavigate(initialIndex + 1)
    }
  }, { enabled: hotkeysEnabled }, [initialIndex, imageList?.length, internalNavigate, hotkeysEnabled, currentImage])

  if (!isOpen) {
    return null
  }

  const mediaContainerContent = currentImage != null
    ? (
      <SharedModal
        index={initialIndex}
        closeModal={internalOnClose}
        images={imageList}
        changePhotoId={internalNavigate}
        navigation={false}
      />
      )
    : (
      <div className='flex items-center justify-center h-full text-neutral-content/50'>
        {imageList != null && imageList.length > 0 ? 'Invalid image index.' : 'No images to display.'}
      </div>
      )

  const controlContainerContent = imageList != null && imageList.length > 1
    ? (
      <div className='flex gap-2'>
        <button
          className='btn btn-primary btn-sm'
          onClick={() => internalNavigate(initialIndex - 1)}
          disabled={initialIndex <= 0}
        >
          Previous
        </button>
        <button
          className='btn btn-primary btn-sm'
          onClick={() => internalNavigate(initialIndex + 1)}
          disabled={initialIndex >= imageList.length - 1}
        >
          Next
        </button>
      </div>
      )
    : null

  const effectiveDialogTitle = currentImage !== null && imageList.length > 1
    ? `${dialogTitle}: Image ${initialIndex + 1} of ${imageList.length}`
    : dialogTitle

  return (
    <DesktopModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onClose={internalOnClose}
      dialogTitle={effectiveDialogTitle}
      mediaContainer={mediaContainerContent}
      rhsContainer={
        <RhsContainer
          loaded
          userinfo={userinfo}
          content={
            <InfoContainer
              currentImage={currentImage}
              auth={auth}
            />
          }
          footer={
            <>
              <AddTagCta tagCount={currentImage.entityTags.length} auth={auth} />
            </>
          }
        />
}
      controlContainer={controlContainerContent}
    />
  )
}
