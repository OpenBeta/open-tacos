'use client'
import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'
import { SuppressButton } from './SuppressButton'

const STORAGE_KEY = 'suppress-main-banner'

export interface MiniAlertProps {
  message: JSX.Element
}

/**
 * Main alert to be displayed under the nav bar.  Users can snooze the alert.
 * @param message alert content
 */
export const MiniAlert: React.FC<MiniAlertProps> = ({ message }) => {
  const [showAlert, setShowAlert] = useState(false)
  useEffect(() => {
    const suppressed = Cookies.get(STORAGE_KEY)
    console.log('#cookie value', suppressed)
    setShowAlert(suppressed == null)
  }, [])

  console.log('## Alert state', message, showAlert)

  return showAlert
    ? (
      <div className='z-40 w-fit alert alert-info flex flex-wrap justify-center xl:p-4 gap-4'>
        <div className='flex flex-col gap-2 items-start'>
          {message}
        </div>
        <div className='inline-flex w-[210px] grow-1'>
          <SuppressButton
            onClick={() => {
              setShowAlert(false)
              Cookies.set(STORAGE_KEY, '1', { strict: true, expires: 30 })
            }}
          />
        </div>
      </div>
      )
    : null
}
