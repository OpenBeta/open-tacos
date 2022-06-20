import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { ReactElement } from 'react'

import { Button, ButtonVariant } from '../../ui/BaseButton'

interface DesktopModalProps {
  isOpen: boolean
  mediaContainer: JSX.Element | null
  rhsContainer: ReactElement
  controlContainer?: JSX.Element | null
  onClose?: () => void
}

/**
 * Full screen photo viewer with optional previous and next control.
 */
export default function DesktopModal ({
  isOpen,
  onClose,
  mediaContainer,
  rhsContainer,
  controlContainer = null
}: DesktopModalProps): JSX.Element {
  return (
    <Dialog
      open={isOpen}
      onClose={() => (onClose != null ? onClose() : null)}
      as='div'
      className='fixed inset-0 z-10 hidden lg:flex items-center justify-center overflow-y-auto'
    >
      <Dialog.Overlay className='pointer-events-none fixed inset-0 bg-black opacity-60' />
      <Dialog.Panel className='relative flex items-center h-screen w-screen bg-black max-w-screen-2xl'>
        <div className='block relative w-full h-full aspect-square'>
          {mediaContainer}
        </div>
        <div className='z-50 absolute right-3 top-2 flex flex-col justify-center hover:font-bold'>
          <Button
            ariaLabel='close'
            label={<XIcon className='w-4 h-4' />}
            variant={ButtonVariant.ROUNDED_ICON_SOLID}
            onClick={onClose}
          />
        </div>
        <Dialog.Description as='div' className='h-full '>
          {rhsContainer}
        </Dialog.Description>
        {controlContainer}
      </Dialog.Panel>
    </Dialog>
  )
}
