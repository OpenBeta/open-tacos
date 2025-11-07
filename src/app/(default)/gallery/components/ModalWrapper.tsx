'use client'

import { ReactNode, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useHotkeys } from 'react-hotkeys-hook'
import { XIcon, InfoIcon, CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import MobileInfoDrawer from './MobileInfoDrawer'
import { useBodyScrollLock } from '@/js/hooks/useBodyScrollLock'
import useResponsive from '@/js/hooks/useResponsive'
import type { MediaWithTags } from '@/js/types'

interface ModalWrapperProps {
  imageContainer: ReactNode
  sidebarContainer: ReactNode
  prevPhoto?: MediaWithTags | null
  nextPhoto?: MediaWithTags | null
  currentIndex?: number
  totalPhotos?: number
  uuid?: string
  entityType?: 'area' | 'climb'
  basePath?: string
}

export default function ModalWrapper ({
  imageContainer,
  sidebarContainer,
  prevPhoto,
  nextPhoto,
  currentIndex = 0,
  totalPhotos = 0,
  uuid = '',
  entityType = 'area',
  basePath = '/gallery'
}: ModalWrapperProps): JSX.Element {
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { isMobile } = useResponsive()

  // Lock body scroll when modal is open
  useBodyScrollLock(true)

  const handleNavigation = (photoId: string): void => {
    router.replace(`${basePath}/${photoId}?type=${entityType}`)
  }

  const handleClose = (): void => {
    router.back()
  }

  // Keyboard shortcuts for navigation
  useHotkeys('left', () => {
    if (prevPhoto != null) handleNavigation(prevPhoto.id)
  }, [prevPhoto, basePath, entityType])

  useHotkeys('right', () => {
    if (nextPhoto != null) handleNavigation(nextPhoto.id)
  }, [nextPhoto, basePath, entityType])

  useHotkeys('escape', () => {
    handleClose()
  }, [])

  const handleModalClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
  }

  // Mobile view
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className='fixed inset-0 bg-base-900/50 z-40'
          onClick={handleClose}
        />

        {/* Mobile: Full screen photo with overlays */}
        <div className='fixed inset-0 z-50 bg-base-200 overflow-hidden overscroll-none touch-none' onClick={handleModalClick}>
          {/* Photo - Full screen */}
          <div className='w-full h-full relative overflow-hidden'>
            {imageContainer}
          </div>

          {/* Top bar - Floating */}
          <div className='absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent'>
            <button
              onClick={handleClose}
              className='p-2 bg-base-100/80 backdrop-blur-sm rounded-full hover:bg-base-100 transition-colors'
              aria-label='Close'
            >
              <XIcon className='w-5 h-5' />
            </button>
            <div className='px-3 py-1 bg-base-100/80 backdrop-blur-sm rounded-full text-sm font-medium'>
              {currentIndex + 1} / {totalPhotos}
            </div>
          </div>

          {/* Navigation arrows - Overlay on sides */}
          {prevPhoto != null && (
            <button
              onClick={() => handleNavigation(prevPhoto.id)}
              className='absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-base-100/80 backdrop-blur-sm rounded-full hover:bg-base-100 transition-colors shadow-lg'
              aria-label='Previous photo'
            >
              <CaretLeftIcon className='w-6 h-6' weight='bold' />
            </button>
          )}
          {nextPhoto != null && (
            <button
              onClick={() => handleNavigation(nextPhoto.id)}
              className='absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-base-100/80 backdrop-blur-sm rounded-full hover:bg-base-100 transition-colors shadow-lg'
              aria-label='Next photo'
            >
              <CaretRightIcon className='w-6 h-6' weight='bold' />
            </button>
          )}

          {/* Info button - Floating bottom right */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className='absolute bottom-6 right-6 p-3 bg-ob-primary text-white rounded-full shadow-lg hover:opacity-90 transition-opacity'
            aria-label='Show photo info'
          >
            <InfoIcon className='w-6 h-6' weight='bold' />
          </button>

          {/* Info Drawer */}
          <MobileInfoDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            {sidebarContainer}
          </MobileInfoDrawer>
        </div>
      </>
    )
  }

  // Desktop view
  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-base-900/50 z-40'
        onClick={handleClose}
      />

      {/* Desktop: Modal with side-by-side layout */}
      <div className='flex fixed inset-0 z-50 items-center justify-center p-4' onClick={handleClose}>
        <div className='relative bg-base-100 max-h-[95vh] h-[95vh] w-full max-w-7xl shadow-2xl overflow-hidden rounded-xl' onClick={handleModalClick}>
          {/* Close button */}
          <button
            onClick={handleClose}
            className='absolute top-3 right-4 z-10 p-2 hover:bg-base-200 rounded-full transition-colors flex items-center justify-center'
            aria-label='Close modal'
          >
            <XIcon className='w-5 h-5' />
          </button>

          {/* Content - Side-by-side layout */}
          <div className='flex h-full'>
            {/* Left side - Image */}
            <div className='flex-1 bg-base-200 flex items-center justify-center relative min-h-0'>
              {imageContainer}
            </div>

            {/* Right side - Sidebar */}
            <div className='w-80 bg-base-100 overflow-y-auto border-l border-base-300'>
              {sidebarContainer}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
