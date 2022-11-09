import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'

const STORAGE_KEY = 'alert.main'

interface Props {
  message: JSX.Element
}

/**
 * Main alert to be display under the nav bar.  Users can disable or snooze the alert.
 * @param message alert content
 */
export default function MiniAlert ({ message }: Props): JSX.Element | null {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const disabledFlag = localStorage.getItem(STORAGE_KEY) // indefinitely in this browser
    const snoozedFlag = sessionStorage.getItem(STORAGE_KEY) // current session only
    if (snoozedFlag === '1' || disabledFlag === '1') {
      setOpen(false)
    } else {
      setOpen(true)
    }
  })
  return open
    ? (
      <div className='w-full z-40 alert alert-info lg:px-4 lg:py-0.5 rounded-none'>
        <div className='inline-block text-center'>
          {message}
        </div>
        <div className='inline-flex w-[210]px'>
          <button
            className='btn btn-link btn-sm btn-primary font-light text-opacity-60'
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, '1')
              setOpen(false)
            }}
          >
            Don't show this again
          </button>
          <button
            className='btn btn-circle btn-outline btn-sm'
            onClick={() => {
              sessionStorage.setItem(STORAGE_KEY, '1')
              setOpen(false)
            }}
          >
            <XMarkIcon className='w-4 h4' />
          </button>
        </div>
      </div>
      )
    : null
}
