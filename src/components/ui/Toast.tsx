import { useState, forwardRef, useImperativeHandle } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { CheckIcon } from '@heroicons/react/24/outline'

interface ToastProps {
  type?: 'foreground' | 'background'
  alertClass?: 'alert-info' | 'alert-success' | 'alert-warning' | 'alert-error'
  title?: string
  children?: JSX.Element[] | JSX.Element | string
}

/**
 * A reusable Toast for sending notifcations to the screen.
 * Placement depends on whether it's mobile or desktop.  See Toast Viewport in _app.tsx.
 *
 * Usage:
 *
 * ```
 * // Show 'Loaded!' then 'Added!' for every click on Ok.
 * const Toaster = (): JSX.Element => {
 *    const toastRef = useRef<any>()
 *    useEffect(()=> {
 *      toastRef?.current.publish('Loaded!')
 *    })
 *
 *    return (
 *      <div>
 *        <button onClick={()=>
 *           toastRef?.current.publish('Added!')}>Ok</button>
 *        <Toast ref={toastRef} />
 *    </div>)
 * }
 * ```
 * @param title optional title
 * @param children default notification message
 * @see https://www.radix-ui.com/docs/primitives/components/toast#imperative-api
 */
const Toast = forwardRef((props: ToastProps, forwardedRef) => {
  const { children, title, alertClass = 'alert-info', type = 'foreground', ...toastProps } = props
  const [list, updateList] = useState<string[]>([])
  const [error, setError] = useState(false)

  useImperativeHandle(forwardedRef, () => ({
    publish: (msg: string, isError: boolean = false) => {
      setError(isError)
      updateList(list => {
        list.push(msg)
        return list
      })
    }
  }))

  const alertClz = error ? 'alert-warning' : alertClass
  return (
    <>
      {list.map((message, index) => (
        <ToastPrimitive.Root key={index} type={type} {...toastProps} className={`rounded-box p-4 drop-shadow-lg flex flex-col gap-1 ${alertClz}`}>
          {title != null && <ToastPrimitive.Title className='font-semibold text-sm'>{title}</ToastPrimitive.Title>}
          <ToastPrimitive.Description>{children ?? <span className='text-sm'>{message}</span>}</ToastPrimitive.Description>
          <ToastPrimitive.Close className='mx-auto mt-2 btn btn-circle btn-secondary'><CheckIcon className='w-6 h-6 delay-200 fadeinEffect' /></ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
    </>
  )
})

export default Toast
