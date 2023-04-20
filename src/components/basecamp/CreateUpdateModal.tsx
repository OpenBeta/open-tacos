import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ReactElement, useRef } from 'react'

import { Button, ButtonVariant } from '../ui/BaseButton'

interface CreateUpdateModalProps {
  isOpen: boolean
  onClose?: () => void
  contentContainer: ReactElement
}

/**
 * Modal for updating and creating objects (areas, organizations, etc) in our datastores.
 */
export default function CreateUpdateModal ({
  isOpen,
  onClose,
  contentContainer,
}: CreateUpdateModalProps): JSX.Element {
  return (
    <Dialog
      open={isOpen}
      onClose={() => (onClose != null ? onClose() : null)}
      as='div'
      className='fixed inset-0 z-40 lg:flex items-center justify-center overflow-y-auto'
    >
      <Dialog.Panel className='relative flex items-center h-3/4 w-3/4 bg-white shadow-xl rounded-lg overflow-scroll'>
        <div className='z-50 absolute right-3 top-2 flex flex-col justify-center hover:font-bold'>
          <Button
            ariaLabel='close'
            label={<XMarkIcon className='w-4 h-4' />}
            variant={ButtonVariant.ROUNDED_ICON_SOLID}
            onClick={onClose}
          />
        </div>
        <Dialog.Description as='div' className='h-full w-full'>
          {contentContainer}
        </Dialog.Description>
      </Dialog.Panel>
    </Dialog>
  )
}
