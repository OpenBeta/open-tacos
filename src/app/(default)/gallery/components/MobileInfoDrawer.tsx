'use client'

import { ReactNode } from 'react'
import { XIcon } from '@phosphor-icons/react'
import { useBodyScrollLock } from '@/js/hooks/useBodyScrollLock'

interface MobileInfoDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export default function MobileInfoDrawer ({ isOpen, onClose, children }: MobileInfoDrawerProps): JSX.Element {
  // Lock body scroll when drawer is open
  useBodyScrollLock(isOpen)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-[60] sm:hidden'
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-base-100 z-[70] sm:hidden transition-transform duration-300 ease-in-out rounded-t-2xl shadow-2xl max-h-[80vh] overflow-hidden ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle bar */}
        <div className='flex justify-center pt-3 pb-2'>
          <div className='w-12 h-1 bg-base-300 rounded-full' />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-3 right-3 p-2 hover:bg-base-200 rounded-full transition-colors'
          aria-label='Close info'
        >
          <XIcon className='w-5 h-5' />
        </button>

        {/* Content */}
        <div className='overflow-y-auto max-h-[calc(80vh-3rem)] pb-6 touch-auto'>
          {children}
        </div>
      </div>
    </>
  )
}
