import React, { useEffect, useState } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import cx from 'classnames'
import toast, { ToastEvent } from './toastControl'

interface Props {
  toast: ToastEvent
}

export default function Toast (props: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean | null>(null)

  useEffect(() => {
    setIsOpen(true)

    // If we're not waiting for dismiss, then we close this toast automatically
    // after 6 seconds
    if (props.toast.ops.showDismiss !== true) {
      setTimeout(() => setIsOpen(false), 6000)
    }
  }, [])

  useEffect(() => {
    if (isOpen !== false) return

    setTimeout(() => toast._removeToast(props.toast), 500)
  }, [open])

  // More guardrails against weird behavior outside of bounds
  if (props.toast.ttl !== undefined && new Date().getTimezoneOffset() > props.toast.ttl.getTime()) {
    toast._removeToast(props.toast)
    return <div />
  }

  return (
    <ToastPrimitive.Root
      open={isOpen === true}
      onOpenChange={o => { if (!o) toast._removeToast(props.toast) }}
      className={cx(
        'relative z-50 inset-x-4 w-auto md:left-auto md:w-full md:max-w-sm shadow-lg rounded-lg',
        'bg-white mt-1',
        'radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right',
        'radix-state-closed:animate-toast-hide',
        'radix-swipe-end:animate-toast-swipe-out',
        'translate-x-radix-toast-swipe-move-x',
        'radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]',
        'focus:outline-none focus-visible:ring focus-visible:ring-ob-primary-500 focus-visible:ring-opacity-75',
        props.toast.className
      )}
    >
      <div className='flex'>
        <div className='w-0 flex-1 flex items-center pl-5 py-4'>
          <div className='w-full radix'>
            {props.toast.ops.title !== undefined && (
              <ToastPrimitive.Title className='text-sm font-medium text-gray-900'>
                {props.toast.ops.title}
              </ToastPrimitive.Title>
            )}

            <ToastPrimitive.Description className='mt-1 text-sm text-gray-700'>
              {props.toast.msg}
            </ToastPrimitive.Description>

          </div>
        </div>

        <div className='flex'>
          <div className='flex flex-col px-3 py-2 space-y-1'>
            <div className='h-0 flex-1 flex'>
              {props.toast.ops.onAccept !== undefined && (
                <ToastPrimitive.Action
                  altText='view now'
                  className='w-full border border-transparent rounded-lg px-3 py-2 flex items-center
                    justify-center text-sm font-medium text-ob-primary-600
                    hover:bg-gray-50 focus:z-10 focus:outline-none
                    focus-visible:ring focus-visible:ring-ob-primary-500 focus-visible:ring-opacity-75'
                  onClick={() => { if (props.toast.ops.onAccept !== undefined) props.toast.ops.onAccept() }}
                >
                  {props.toast.ops.actionButton}
                </ToastPrimitive.Action>
              )}
            </div>

            <div className='h-0 flex-1 flex'>
              <ToastPrimitive.Close
                className='w-full border border-transparent rounded-lg px-3 py-2 flex items-center
                justify-center text-sm font-medium text-gray-700 hover:bg-gray-50
                focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-ob-primary-500
                focus-visible:ring-opacity-75'
              >
                Dismiss
              </ToastPrimitive.Close>
            </div>
          </div>
        </div>
      </div>
    </ToastPrimitive.Root>
  )
}
