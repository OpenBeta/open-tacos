import React, { ReactNode } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XMarkIcon } from '@heroicons/react/24/outline'
import clx from 'classnames'
interface Props {
  title?: string | ReactNode
  fullScreen?: boolean
  small?: boolean
  children: ReactNode | ReactNode[]
  onInteractOutside?: (event: any) => void
}
/**
 * The main dialog contaner.
 * @param title Optional title
 * @param fullScreen Optional flag to expand the dialog to max screen width & height
 */
export const DialogContent = React.forwardRef<any, Props>(
  ({ title, children, small = false, fullScreen = false, ...props }, forwardedRef) =>
    (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='z-40 fixed inset-0 bg-black/60' />
        <DialogPrimitive.Content
          className={clx(fullScreen ? 'dialog-wide' : 'dialog-default', small ? 'dialog-small' : '')} {...props} ref={forwardedRef}
        >
          <DialogPrimitive.Title className='dialog-title'>
            {title}
          </DialogPrimitive.Title>
          {children}
          {/* Use absolute positioning to place the close button on the upper left corner */}
          <DialogPrimitive.Close aria-label='Close' asChild className='dialog-close-button'>
            <button className='btn btn-circle btn-ghost'>
              <XMarkIcon className='w-8 h-8' />
            </button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    )
)

// <div className='px-2 lg:px-4 h-16 fixed top-0 left-0 z-30 w-full flex justify-between items-center align-middle bg-base-100 bg-opacity-90 backdrop-blur-sm'>
// <DialogPrimitive.Close aria-label='Close' asChild>
//   <button className='btn btn-circle btn-ghost'>
//     <XMarkIcon className='w-8 h-8' />
//   </button>
// </DialogPrimitive.Close>
// <DialogPrimitive.Title asChild>
//   <h2 className=''>{title}</h2>
// </DialogPrimitive.Title>
// <div className='w-8 h-8' />
// </div>
// <div className={clx(fullScreen ? 'dialog-content-fullscreen' : 'dialog-content-default')}>
// {children}
// </div>

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
