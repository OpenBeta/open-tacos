import * as ToastPrimitive from '@radix-ui/react-toast'
import React, { useEffect, useState } from 'react'
import Toast from './Toast'
import toast, { ToastEvent } from './toastControl'

/**
 * Simply handles effects for toast events without leaking events
 * all over the place
 */
function useToastQueue (): [ToastEvent[]] {
  const [queue, setQueue] = useState<ToastEvent[]>(Array.from(toast.tq))

  const deleteToast = (id: string): void => {
    setQueue(queue.filter(y => y.id !== id))
  }

  // Handle effects inside this component
  useEffect(() => {
    // Always re-filter
    queue.forEach(t => {
      if (t.ttl !== undefined && new Date().getTime() > t.ttl.getTime()) {
        toast._removeToast(t)
      }
    })

    const handler = (t: ToastEvent): void => {
      if (t.lifecycle === 'mustdie') {
        deleteToast(t.id)
      } else {
        setQueue([...queue, t])
      }
    }

    toast._addListener(handler)

    return () => {
      toast._clearListener(handler)
    }
  }, [queue, setQueue, deleteToast])

  return [queue]
}

export default function ToastContainer (): JSX.Element {
  const [queue] = useToastQueue()

  return (
    <div className='right-0 top-4 fixed z-50 w-96'>
      <ToastPrimitive.Provider>
        {queue.map((t) => (
          <Toast key={t.id} toast={t} />
        ))}
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    </div>
  )
}
