import React, { ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface Props {
  title?: string | ReactNode
  children: ReactNode
  onInteractOutside?: (event: any) => void
}
/**
 * The main dialog contaner.
 */
export const DialogContent = React.forwardRef<any, Props>(
  ({ title, children, ...props }, forwardedRef) =>
    (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='z-40 fixed inset-0 bg-black/60' />
        <DialogPrimitive.Content
          className='fixed z-50 inset-0 lg:top-16 mx-auto max-w-screen md:max-w-screen-md lg:drop-shadow-lg overflow-y-scroll' {...props} ref={forwardedRef}
        >
          <div className='px-2 lg:px-4 py-4 md:rounded-box bg-base-100 w-full'>
            <div className='flex justify-between items-center align-middle mb-4'>
              <DialogPrimitive.Close aria-label='Close' asChild>
                <button className='btn btn-circle btn-ghost btn-sm'>
                  <XMarkIcon className='w-6 h-6' />
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

/**
 * A reusable mobile-first dialog.  Anatomy:
 * ```
 * <MobileDialog>
 *  <DialogTrigger>Click to open dialog</DialogTrigger>
 *   <DialogContent title='My dialog title' >
 *     <div>My content...<div>
 *     <MobileDialogClose>Close</MobileDialogClose>
 *   </DialogContent>
 * </MobileDialog>
 * ```
 * The dialog can used as an uncontrolled (default) or controlled component.
 * - Uncontrolled: the dialog internal state is managed for you.  Use this if you just want users to click on a button (`DialogTrigger`) to activate the dialog, and hit Esc or the X button to close.
 * - Controlled: You manage the dialog state yourself with `useState()`.  Use this if you want to know when the dialog is open/close.
 * @param modal true|false.  Set to true to prevent interaction outside the dialog.
 * @param onOnOpenChange an event handler
 * @param open control state of the dialog.  Must use with `onOpenChange()`.
 * @see https://www.radix-ui.com/docs/primitives/components/dialog
 */
export const MobileDialog = DialogPrimitive.Root

/**
 * A button used to trigger the dialog.
 */
export const DialogTrigger = React.forwardRef<any, any>((props, forwardedRef) =>
  <DialogPrimitive.Trigger {...props} ref={forwardedRef} />)

/**
 * A button used to close the dialog
 */
export const MobileDialogClose = DialogPrimitive.Close
