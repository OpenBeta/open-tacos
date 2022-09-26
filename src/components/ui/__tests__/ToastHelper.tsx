import { useRef, useEffect } from 'react'
import { ToastProvider, ToastViewport } from '@radix-ui/react-toast'
import Toast from '../Toast'

export default function ToastHelper ({ message }): JSX.Element {
  const toastRef = useRef<any>()

  useEffect(() => {
    toastRef?.current.publish(message)
  }, [message])
  return (
    <ToastProvider>
      <button onClick={() => {
        console.log('#toastRef', toastRef?.current)
        toastRef?.current.publish('hello')
      }}
      >Activate
      </button>
      <Toast ref={toastRef} />
      <ToastViewport className='fixed top-0 right-0' />
    </ToastProvider>
  )
}
it('Do nothing test to make jest happy', () => {})
