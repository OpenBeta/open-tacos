'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ModalWrapperProps {
  imageContainer: ReactNode
  sidebarContainer: ReactNode
}

export default function ModalWrapper ({ imageContainer, sidebarContainer }: ModalWrapperProps): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleClose = (): void => {
    router.back()
  }

  const handleModalClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-base-900/50 z-40'
        onClick={handleClose}
      />

      {/* Modal - Contained with left/right layout */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4' onClick={handleClose}>
        <div className='relative bg-base-100 max-h-[95vh] h-[95vh] w-full max-w-7xl shadow-2xl overflow-hidden rounded-xl' onClick={handleModalClick}>
          {/* Close button */}
          <button
            onClick={handleClose}
            className='absolute top-3 right-4 z-10 p-2 hover:bg-base-200 rounded-full transition-colors flex items-center justify-center'
            aria-label='Close modal'
          >
            <XMarkIcon className='w-5 h-5' />
          </button>

          {/* Content - Split layout */}
          <div className='flex h-full'>
            {/* Left side - Image */}
            <div className='flex-1 bg-base-200 flex items-center justify-center relative'>
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
