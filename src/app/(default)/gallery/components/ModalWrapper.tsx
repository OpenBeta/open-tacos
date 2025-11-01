'use client'

import { ReactNode } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ModalWrapperProps {
  children: ReactNode
}

export default function ModalWrapper ({ children }: ModalWrapperProps): JSX.Element {
  const params = useParams()
  const searchParams = useSearchParams()

  const uuid = params.uuid as string
  const typeParam = searchParams.get('type')
  const entityType = (typeParam === 'area' || typeParam === 'climb') ? typeParam : 'area'
  const galleryUrl = `/gallery/${uuid}?type=${entityType}`

  const handleClose = (): void => {
    window.location.href = galleryUrl
  }

  const handleModalClick = (e: React.MouseEvent): void => {
    e.stopPropagation()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 z-40'
        onClick={handleClose}
      />

      {/* Modal */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4' onClick={handleClose}>
        <div className='relative bg-white rounded-lg max-h-[90vh] max-w-4xl w-full overflow-auto shadow-2xl' onClick={handleModalClick}>
          {/* Close button */}
          <button
            onClick={handleClose}
            className='absolute top-4 right-4 z-10 p-2 hover:bg-base-200 rounded-full transition-colors'
            aria-label='Close modal'
          >
            <XMarkIcon className='w-6 h-6' />
          </button>

          {/* Content */}
          <div className='p-6'>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
