import React from 'react'
import { Dialog } from '@headlessui/react'
import { UploadIcon } from '@heroicons/react/24/outline'

export default function PhotoUploadProgress ({ open }) {
  return (
    <Dialog
      open={open}
      onClose={() => false}
      as='div'
      className='fixed inset-0 z-10 flex items-center justify-center overflow-y-auto'
    >
      <Dialog.Overlay className='pointer-events-none fixed inset-0 bg-black opacity-30' />
      <Dialog.Description className='rounded text-gray-800 flex items-center bg-custom-avery px-8 py-4'>
        <UploadIcon className='animate-bounce w-6 h-6 mr-4' />
        <span className='animate-pulse'>Uploading photo</span>
      </Dialog.Description>
    </Dialog>
  )
}
