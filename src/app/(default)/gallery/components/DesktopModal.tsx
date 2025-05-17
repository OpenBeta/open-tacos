'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { XMarkIcon } from '@heroicons/react/24/outline'
import React, { ReactElement } from 'react'
import { Button, ButtonVariant } from '@/components/ui/BaseButton'

interface DesktopModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  mediaContainer: JSX.Element | null
  rhsContainer: ReactElement
  controlContainer?: JSX.Element | null
  onClose?: () => void
  dialogTitle?: string
}

/**
 * Full screen photo viewer using Radix UI Dialog
 * Layout: Media on left/main, RHS panel for info, optional controls.
 */
export default function DesktopModal ({
  isOpen,
  setIsOpen,
  mediaContainer,
  rhsContainer,
  controlContainer = null,
  dialogTitle = 'Gallery Viewer'
}: DesktopModalProps): JSX.Element {
  const dialogCloseRef = React.useRef<HTMLButtonElement>(null)
  return (
    <Dialog.Root
      open={isOpen}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className='fixed inset-0 z-40 bg-black/70 backdrop-blur-sm data-[state=open]:animate-overlayShow'
        />
        <Dialog.Content
          onPointerDownOutside={() => {
            setIsOpen(!isOpen)
          }}
          className='fixed left-1/2 top-1/2 z-50 flex h-[90vh] w-[95vw] max-w-screen-2xl -translate-x-1/2 -translate-y-1/2
                     items-stretch bg-neutral text-neutral-content shadow-lg data-[state=open]:animate-contentShow
                     focus:outline-none sm:rounded-lg overflow-hidden'
        >
          <Dialog.Title className='sr-only'>{dialogTitle}</Dialog.Title>

          <div className='flex h-full w-full flex-col lg:flex-row'> {/* Stack on mobile, row on lg */}
            <div className='relative flex-grow bg-black flex items-center justify-center overflow-hidden p-2 lg:p-0'>
              {mediaContainer}
            </div>
            <Dialog.Description asChild>
              <div className='w-full lg:w-[350px] xl:w-[400px] shrink-0 bg-base-100 text-base-content h-auto max-h-[50vh] lg:max-h-full lg:h-full flex flex-col border-t lg:border-t-0 lg:border-l border-base-300 overflow-y-auto'>
                {rhsContainer}
              </div>
            </Dialog.Description>
          </div>

          {/* Close Button (Top Right of the modal) */}
          <Dialog.Close asChild ref={dialogCloseRef}>
            <Button
              ariaLabel='Close dialog'
              label={<XMarkIcon className='h-5 w-5' />}
              variant={ButtonVariant.ROUNDED_ICON_SOLID}
            />
          </Dialog.Close>

          {(controlContainer != null) && (
            <div className='absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex justify-center'>
              {controlContainer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
