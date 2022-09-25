import { useState, forwardRef, useImperativeHandle } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'

interface ToastProps {
  type?: 'foreground' | 'background'
  alertClass?: 'alert-info' | 'alert-success' | 'alert-warning' | 'alert-error'
  title?: string
  children?: JSX.Element[] | JSX.Element | string
}

/**
 * A reusable Toast for no
 */
const Toast = forwardRef((props: ToastProps, forwardedRef) => {
  const { children, title, alertClass = 'alert-info', type = 'foreground', ...toastProps } = props
  const [list, updateList] = useState<string[]>([])

  useImperativeHandle(forwardedRef, () => ({
    publish: (msg: string) => updateList(list => {
      list.push(msg)
      return list
    })
  }))

  return (
    <>
      {list.map((message, index) => (
        <ToastPrimitive.Root key={index} type={type} {...toastProps} className={`rounded-box p-4 drop-shadow-lg flex flex-col gap-1 ${alertClass}`}>
          {title != null && <ToastPrimitive.Title className='font-semibold text-sm'>{title}</ToastPrimitive.Title>}
          <ToastPrimitive.Description>{children ?? <span className='text-sm'>{message}</span>}</ToastPrimitive.Description>
          <ToastPrimitive.Close className='mt-2 btn btn-outline btn btn-sm'>Got it</ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
    </>
  )
})

export default Toast
