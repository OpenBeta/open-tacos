import React, { ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from '@heroicons/react/outline'

export interface MobileCardProps {
  open?: boolean
  title?: string
  children: ReactNode
  onClose: () => void
  onOpenChange?: (state: boolean) => void
}

/**
 * A full screen card with a title and cancel (back) action
 */
export default function MobileScreen ({ title, children, onClose }: MobileCardProps): any {
  return (
    <div className='z-50 card card-compact bg-base-200'>
      <div className='card-body'>
        <div className='card-actions justify-between items-center align-middle'>
          <button className='btn btn-circle btn-ghost btn-sm' onClick={onClose}>
            <XIcon className='w-6 h-6' />
          </button>
          <h2 className='card-title'>{title}</h2>
          <div className='w-8 h-8' />
        </div>
        {children}
      </div>
    </div>
  )
}

interface Props {
  title?: string | ReactNode
  children: ReactNode
}
export const DialogContent = React.forwardRef<any, Props>(
  ({ title, children, ...props }, forwardedRef) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className='fixed z-10 inset-0 bg-black/60' />
      <DialogPrimitive.Content
        className='z-40 fixed inset-0 lg:top-16 mx-auto max-w-lg' {...props} ref={forwardedRef}
      >
        <div className='px-2 py-4 md:rounded-box bg-base-100 w-full'>
          <div className='flex justify-between items-center align-middle mb-4'>
            <DialogPrimitive.Close aria-label='Close' asChild>
              <button className='btn btn-circle btn-ghost btn-sm'>
                <XIcon className='w-6 h-6' />
              </button>
            </DialogPrimitive.Close>
            <h2 className='card-title' aria-label='title'>{title}</h2>
            <div className='w-8 h-8' />
          </div>
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
)

export const MobileDialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
