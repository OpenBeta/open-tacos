import { Dialog } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { ReactElement } from 'react'

import { Button, ButtonVariant } from '../../ui/BaseButton'

interface DesktopModalProps {
  isOpen: boolean
  mediaContainer: JSX.Element | null
  infoContainer: ReactElement
  footerContainer: ReactElement
  userProfileContainer: ReactElement
  controlContainer?: JSX.Element | null
  onClose: () => void
}

/**
 * Full screen photo viewer with optional previous and next control.
 */
export default function DesktopModal ({
  isOpen,
  onClose,
  mediaContainer,
  userProfileContainer,
  infoContainer,
  footerContainer,
  controlContainer = null
}: DesktopModalProps): JSX.Element {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      as='div'
      className='fixed inset-0 z-10 flex items-center justify-center overflow-y-auto'
    >
      <Dialog.Overlay className='pointer-events-none fixed inset-0 bg-black opacity-60' />
      <Dialog.Panel className='relative flex items-center w-full h-full bg-black max-w-screen-2xl'>
        <div className='block relative w-full h-full aspect-square'>
          {mediaContainer}
        </div>
        <Dialog.Description as='div' className='flex flex-col justify-between max-w-[400px] min-w-[350px] h-full w-full bg-white'>
          <div className='px-4 py-6'>
            <div>
              {userProfileContainer}
              <div className='absolute right-3 top-2'>
                <Button
                  label={<XIcon className='w-4 h-4' />}
                  variant={ButtonVariant.ROUNDED_ICON_SOLID}
                  onClick={onClose}
                />
              </div>
            </div>

            <div className='my-8'>
              {infoContainer}
            </div>
          </div>
          <div className='border-t'>
            {footerContainer}
          </div>
        </Dialog.Description>
        {controlContainer}
      </Dialog.Panel>
    </Dialog>
  )
}
