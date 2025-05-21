'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'
import { MediaWithTags } from '@/js/types'
import { WithPermission } from '@/js/types/User'
import DesktopModal from './DesktopModal'
import SharedModal from './Modal'
import { InfoContainer } from './InfoContainer'
import { RhsContainer } from './RhsContainer'
import AddTagCta from '@/components/media/slideshow/AddTagCta'

interface SlideViewerProps {
  initialIndex: number
  imageList: MediaWithTags[]
  userinfo: JSX.Element
  auth: WithPermission
  galleryType: 'area' | 'climb' | 'user'
  dialogTitle?: string
  uuid: string
}

export default function SlideViewer ({
  initialIndex,
  imageList,
  userinfo,
  auth,
  galleryType,
  dialogTitle,
  uuid
}: SlideViewerProps): JSX.Element | null {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(true)
  const currentImage = (imageList != null && imageList.length > 0 && initialIndex >= 0 && initialIndex < imageList.length)
    ? imageList[initialIndex]
    : null
  const hotkeysEnabled = isModalOpen && currentImage != null

  const internalNavigate = (newIndex: number): void => {
    if (imageList != null && newIndex >= 0 && newIndex < imageList.length) {
      const newPhoto = imageList[newIndex]
      if (newPhoto?.id != null && newPhoto.id !== '') {
        router.push(`/gallery/p/${uuid}/${newPhoto.id}?type=${galleryType}`)
      }
    }
  }

  const handleModalOpenChange = (open: boolean): void => {
    setIsModalOpen(open)
    if (!open) {
      router.back()
    }
  }

  useHotkeys('left', () => {
    if (currentImage != null && initialIndex > 0) {
      internalNavigate(initialIndex - 1)
    }
  }, { enabled: hotkeysEnabled }, [initialIndex, internalNavigate, hotkeysEnabled, currentImage])

  useHotkeys('right', () => {
    if (currentImage != null && imageList != null && initialIndex < imageList.length - 1) {
      internalNavigate(initialIndex + 1)
    }
  }, { enabled: hotkeysEnabled }, [initialIndex, imageList, internalNavigate, hotkeysEnabled, currentImage])

  if (!isModalOpen) {
    return null
  }

  if (imageList == null || imageList.length === 0) {
    return (
      <DesktopModal
        isOpen={isModalOpen}
        onOpenChange={handleModalOpenChange}
        dialogTitle='Error'
        mediaContainer={<div className='flex items-center justify-center h-full text-neutral-content/50'>No images available.</div>}
        rhsContainer={<div>Please select a gallery.</div>}
      />
    )
  }

  const mediaContainerContent = currentImage != null
    ? (
      <SharedModal
        index={initialIndex}
        closeModal={() => handleModalOpenChange(false)}
        images={imageList}
        changePhotoId={internalNavigate}
        navigation
      />
      )
    : (
      <div className='flex items-center justify-center h-full text-neutral-content/50'>
        Image not found or invalid index.
      </div>
      )

  // const controlContainerContent = (imageList.length > 1) ? ( // imageList confirmed non-null & non-empty
  //   <div className='flex gap-2'>
  //     <button className='btn btn-primary btn-sm' onClick={() => internalNavigate(initialIndex - 1)} disabled={initialIndex <= 0}>Prev</button>
  //     <button className='btn btn-primary btn-sm' onClick={() => internalNavigate(initialIndex + 1)} disabled={initialIndex >= imageList.length - 1}>Next</button>
  //   </div>
  // ) : null'

  const effectiveDialogTitle = (currentImage != null && imageList.length > 0)
    ? `${(dialogTitle != null && dialogTitle !== '') ? dialogTitle : 'Gallery'}: Image ${initialIndex + 1} of ${imageList.length}`
    : ((dialogTitle != null && dialogTitle !== '') ? dialogTitle : 'Gallery')

  const rhsFooterContent = (currentImage?.entityTags != null)
    ? (
      <AddTagCta tagCount={currentImage.entityTags.length} auth={auth} />
      )
    : null

  return (
    <DesktopModal
      isOpen={isModalOpen}
      onOpenChange={handleModalOpenChange}
      dialogTitle={effectiveDialogTitle}
      mediaContainer={mediaContainerContent}
      rhsContainer={
        <RhsContainer
          loaded={currentImage != null}
          userinfo={userinfo}
          content={
            <InfoContainer
              currentImage={currentImage}
              auth={auth}
            />
          }
          footer={rhsFooterContent}
        />
      }
      // controlContainer={controlContainerContent}
    />
  )
}
