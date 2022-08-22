import { Transition } from '@headlessui/react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import cx from 'classnames'
import React, { Fragment, useState } from 'react'

interface Props {
  /**
    * What renders for the clickable element that opens the dialog.
    * if undefined, no clickable element is rendered and the dialog
    * state must be controlled by a parent state.
    */
  button?: string | JSX.Element

  title?: string
  description?: string

  confirmText?: string
  cancelText?: string

  children?: any
  onConfirm?: () => void

  hideTitle?: boolean

  /** If button is null, you need to supply this for controlling open state */
  open: boolean
  /**
   * If you want proper behavior, you will set this. Otherwise the dialog
   * cannot respond in the expected way.
  */
  onOpenChange: (open: boolean) => void
}

/**
 * Composes the children of this compoenent into the content of a dialog that is
 * shown to the user either based on a provided renderable trigger element or by
 * being controlled by parent state.
 *
 * Unlike an alert dialog, this is not a window asking the user for confirm-reject,
 * but rather a container for implmenting more complex behavior like internal forms
 * and suchlike.
 *
 * This kind of dialog may never hide the ability for the user to exit without
 * committing changes, and may also never hide the button that commits their changes
 */
export default function DialogWithContent (props: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
      <DialogPrimitive.Trigger asChild>
        <button>Click</button>
      </DialogPrimitive.Trigger>

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
          <DialogPrimitive.Overlay
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
          <DialogPrimitive.Content
            forceMount
            className={cx(
              'fixed z-50',
              'w-[95vw] max-w-md rounded-lg p-4 md:w-full',
              'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
              'bg-white dark:bg-gray-800',
              'focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
            )}
          >
            {props.title !== undefined && (
              <DialogPrimitive.Title className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                {props.title}
              </DialogPrimitive.Title>
            )}

            {props.description !== undefined && (
              <DialogPrimitive.Description className='mt-2 text-sm font-normal text-gray-700 dark:text-gray-400'>
                {props.description}
              </DialogPrimitive.Description>
            )}

            {props.children}

            <div className='mt-4 flex justify-end'>
              <DialogPrimitive.Close
                onClick={() => { if (props.onConfirm != null) props.onConfirm() }}
                className={cx(
                  'inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium',
                  'bg-ob-primary text-white hover:bg-ob-primary dark:bg-ob-primary dark:text-gray-100 dark:hover:ob-primary',
                  'border border-transparent',
                  'focus:outline-none focus-visible:ring focus-visible:ob-primary focus-visible:ring-opacity-75'
                )}
              >
                Save
              </DialogPrimitive.Close>
            </div>

            <DialogPrimitive.Close
              className={cx(
                'absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1',
                'focus:outline-none focus-visible:ring focus-visible:ring-ob-secondary focus-visible:ring-opacity-75'
              )}
            >
              <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </Transition.Child>
      </Transition.Root>
    </DialogPrimitive.Root>
  )
};
