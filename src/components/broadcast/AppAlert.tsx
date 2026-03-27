'use client'
import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'
import { SuppressButton } from './SuppressButton'

export interface AppAlertProps {
  message: JSX.Element
  cookieStorageKey: string
}

/**
 * Main alert to be displayed under the nav bar.  Users can snooze the alert.
 * @param message alert content
 */
export const AppAlert: React.FC<AppAlertProps> = ({
  message,
  cookieStorageKey
}) => {
  const [showAlert, setShowAlert] = useState(true)

  useEffect(() => {
    const suppressed = Cookies.get(cookieStorageKey)

    setShowAlert(suppressed == null)
  }, [cookieStorageKey])

  return (
    showAlert && (
      <div className='z-40 w-fit alert alert-info flex flex-wrap justify-center xl:p-4 gap-4'>
        <div className='flex flex-col gap-2 items-start'>{message}</div>
        <div className='inline-flex w-[210px] grow-1'>
          <SuppressButton
            onClick={() => {
              setShowAlert(false)
              Cookies.set(cookieStorageKey, '1', { strict: true, expires: 30 })
            }}
          />
        </div>
      </div>
    )
  )
}
