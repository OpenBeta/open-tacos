'use client'

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MediaWithTags } from '@/js/types'
import { WithPermission } from '@/js/types/User'
import DesktopModal from './DesktopModal'
import ImageCarousel from './ImageCarousel'
import { InfoContainer } from './InfoContainer'
import { RhsContainer } from './RhsContainer'
import AddTagCta from '@/components/media/slideshow/AddTagCta'
import { EmblaCarouselType } from 'embla-carousel'
import { useGalleryNavigation } from '@/js/hooks/useGalleryNavigation'

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
}: SlideViewerProps): JSX.Element {
  const router = useRouter()
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>(undefined)

  const {
    activeIndex,
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
    navigateTo
  } = useGalleryNavigation({
    initialIndex,
    imageList,
    galleryType,
    uuid,
    emblaApi,
    hotkeysEnabled: true
  })

  // Callback to receive emblaApi from ImageCarousel
  const handleEmblaApiInit = useCallback((api: EmblaCarouselType) => {
    setEmblaApi(api)
  }, [])

  const currentImage = imageList?.[activeIndex]

  const handleClose = (): void => {
    router.back()
  }

  const mediaContainerContent = currentImage != null
    ? (
      <ImageCarousel
        index={activeIndex}
        closeModal={handleClose}
        images={imageList}
        navigation
        onApiInit={handleEmblaApiInit}
        onPrevButtonClick={onPrevButtonClick}
        onNextButtonClick={onNextButtonClick}
        prevBtnDisabled={prevBtnDisabled}
        nextBtnDisabled={nextBtnDisabled}
        navigateTo={navigateTo}
      />
      )
    : (
      <div className='flex items-center justify-center h-full text-neutral-content/50'>
        Image not found or invalid index.
      </div>
      )

  const effectiveDialogTitle = (currentImage != null && imageList.length > 0)
    ? `${(dialogTitle != null && dialogTitle !== '') ? dialogTitle : 'Gallery'}: Image ${activeIndex + 1} of ${imageList.length}`
    : ((dialogTitle != null && dialogTitle !== '') ? dialogTitle : 'Gallery')

  const rhsFooterContent = (currentImage?.entityTags != null)
    ? (
      <AddTagCta tagCount={currentImage.entityTags.length} auth={auth} />
      )
    : null

  return (
    <DesktopModal
      isOpen
      onOpenChange={(open) => {
        // If closing the modal, navigate back
        if (!open) {
          handleClose()
        }
      }}
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
    />
  )
}
