import { Transition } from '@headlessui/react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import cx from 'classnames'
import React, { Fragment, ReactNode, useState } from 'react'

interface Props {
  /** renderable button */
  button?: string | JSX.Element
  children?: any
  /** The title of this alert */
  title?: string

  /** The text displayed inside the cancel button */
  cancelText?: string
  /** The text displayed inside the confirm button */
  confirmText?: string
  /** Fired when user clicks cancel */
  onCancel?: () => void
  /** Fired when user clicks confirm */
  onConfirm?: () => void

  /** if set, cancel button is not shown */
  hideCancel?: boolean
  /** if set, confirm button is not shown */
  hideConfirm?: boolean
  /** if set, confirm button is not shown */
  hideTitle?: boolean
}

/**
 * Simple dialogue that asks the user for confimation / acknowledgement of something.
 * The message, title and button may all be easily subbed for anything you like.
 *
 * Supply the body of this dialog as a child
 * */
export default function AlertDialog (props: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  const title = props.title ?? 'Are you sure?'
  const body = props.children
  const cancelText = props.cancelText ?? 'Cancel'
  const confirmText = props.confirmText ?? 'Okay'

  return (
    <AlertDialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogPrimitive.Trigger asChild>
        <div onClick={() => setIsOpen(true)}>
          {props.button}
        </div>
      </AlertDialogPrimitive.Trigger>
      <AlertDialogPrimitive.Portal forceMount>

        <Transition.Root show={isOpen}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <AlertDialogPrimitive.Overlay
              forceMount
              className='fixed inset-0 z-20 bg-black/50'
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <AlertDialogPrimitive.Content
              forceMount
              className={cx(
                'fixed z-50',
                'w-[95vw] max-w-md rounded-lg p-4 md:w-full',
                'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
                'bg-white dark:bg-gray-800',
                'focus:outline-none focus-visible:ring focus-visible:ring-ob-primary focus-visible:ring-opacity-75'
              )}
            >
              {props.hideTitle !== true && (
                <AlertDialogPrimitive.Title className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                  {title}
                </AlertDialogPrimitive.Title>
              )}

              <AlertDialogPrimitive.Description className='mt-2 text-sm font-normal text-gray-700 dark:text-gray-400'>
                {body}
              </AlertDialogPrimitive.Description>
              <div className='mt-4 flex justify-end space-x-2'>
                {props.hideCancel !== true && (

                  <AlertDialogPrimitive.Cancel
                    onClick={() => {
                      if (props.onCancel !== undefined) props.onCancel()
                    }}
                    className={cx(
                      'inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium',
                      'bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100 hover:dark:bg-gray-600',
                      'border border-gray-300 dark:border-transparent',
                      'focus:outline-none focus-visible:ring focus-visible:ring-ob-primary focus-visible:ring-opacity-75'
                    )}
                  >
                    {cancelText}
                  </AlertDialogPrimitive.Cancel>
                )}

                {props.hideConfirm !== true && (
                  <AlertDialogPrimitive.Action
                    onClick={() => {
                      if (props.onConfirm !== undefined) props.onConfirm()
                    }}
                    className={cx(
                      'inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium',
                      'bg-ob-primary text-white hover:bg-ob-primary dark:bg-ob-primary',
                      'border border-transparent',
                      'focus:outline-none focus-visible:ring focus-visible:ring-ob-primar focus-visible:ring-opacity-75'
                    )}
                  >
                    {confirmText}
                  </AlertDialogPrimitive.Action>
                )}
              </div>
            </AlertDialogPrimitive.Content>
          </Transition.Child>
        </Transition.Root>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}

interface LeanAlertProps {
  closeOnEsc?: boolean // prevent Esc to close alert
  icon?: ReactNode
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  className?: string
  stackChildren?: boolean
  onEscapeKeyDown?: () => void
}
/**
 * A reusable popup alert
 * @param icon
 * @param title
 * @param cancelAction A button of type `AlertDialogPrimitive.Action` that closes the alert on click.  You can register an `onClick()` to perform some action.
 * @param noncancelAction Any kind of React component/button that doesn't close the alert on click.  Use this if you want to perform an action on click and keep the alert open.
 */
export const LeanAlert = ({ icon = null, title = null, description = null, children = DefaultOkButton, closeOnEsc = true, onEscapeKeyDown = () => {}, className = '', stackChildren = false }: LeanAlertProps): JSX.Element => {
  return (
    <AlertDialogPrimitive.Root defaultOpen>
      <AlertDialogPrimitive.Overlay className='fixed inset-0 bg-black/60 z-50' />
      <AlertDialogPrimitive.Content
        onEscapeKeyDown={e => {
          if (!closeOnEsc) {
            e.preventDefault()
          } else {
            onEscapeKeyDown()
          }
        }}
        className='z-50 fixed h-screen inset-0 mx-auto flex items-center justify-center px-2 lg:px-0 text-center overflow-y-auto max-w-xs md:max-w-md lg:max-w-lg'
      >
        <div className={`p-4 rounded-box bg-base-100 w-full ${className}`}>
          <AlertDialogPrimitive.Title className='flex flex-col items-center'>
            {icon}
            {title}
          </AlertDialogPrimitive.Title>
          <AlertDialogPrimitive.Description className='my-8 text-inherit'>{description}</AlertDialogPrimitive.Description>
          <div className={stackChildren ? 'flex-col items-center justify-center gap-x-6' : 'flex items-center justify-center gap-x-6'}>
            {children}
          </div>
        </div>
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Root>
  )
}

const DefaultOkButton = <AlertDialogPrimitive.Action className='btn btn-primary btn-md btn-wide'>OK</AlertDialogPrimitive.Action>

export const AlertAction = AlertDialogPrimitive.Action

/**
 * An alert with no close button.  Use this to temporarily block the screen during important operation such as photo uploading.
 */
export const BlockingAlert: React.FC<any> = ({ title, description }) => <LeanAlert title={title} description={description}><div /></LeanAlert>
