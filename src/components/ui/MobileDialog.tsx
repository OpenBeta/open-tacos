import React, { ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from '@heroicons/react/outline'

interface Props {
  title?: string | ReactNode
  children: ReactNode
  onInteractOutside?: (event: any) => void
}

export const DialogContent = React.forwardRef<any, Props>(
  ({ title, children, ...props }, forwardedRef) =>
    (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='fixed inset-0 bg-black/60' />
        <DialogPrimitive.Content
          className='fixed z-40 inset-0 lg:top-16 mx-auto max-w-lg' {...props} ref={forwardedRef}
        >
          <div className='px-2 lg:px-4 py-4 md:rounded-box bg-base-200 w-full'>
            <div className='flex justify-between items-center align-middle mb-4'>
              <DialogPrimitive.Close aria-label='Close' asChild>
                <button className='btn btn-circle btn-ghost btn-sm'>
                  <XIcon className='w-6 h-6' />
                </button>
              </DialogPrimitive.Close>
              <DialogPrimitive.Title asChild>
                <h2 className=''>{title}</h2>
              </DialogPrimitive.Title>
              <div className='w-8 h-8' />
            </div>
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    )
)

export const MobileDialog = DialogPrimitive.Root
export const DialogTrigger = React.forwardRef<any, any>((props, forwardedRef) =>
  <DialogPrimitive.Trigger {...props} ref={forwardedRef} />)
export const MobileDialogClose = DialogPrimitive.Close
