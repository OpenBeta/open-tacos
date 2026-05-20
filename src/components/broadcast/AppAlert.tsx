'use client'
import Cookies from 'js-cookie'
import React, { useState, useEffect } from 'react'
import { SuppressButton } from './SuppressButton'

export interface AppAlertProps {
  message: JSX.Element
  cookieStorageKey: string
}

/**
 * Main alert to be displayed under the nav bar.  Users can snooze the alert.
 * @param message alert content
 */
export const AppAlert: React.FC<AppAlertProps> = ({ message, cookieStorageKey }) => {
  // 同步在初始渲染读取 cookie，避免挂载后再插入节点导致 CLS
  const [showAlert, setShowAlert] = useState<boolean>(() => {
    try {
      return Cookies.get(cookieStorageKey) == null
    } catch (e) {
      // 如果读取 cookie 失败，则默认不显示，避免意外布局抖动
      return false
    }
  })

  // 若 cookieStorageKey 在运行时发生变化，保持 state 同步
  useEffect(() => {
    const suppressed = Cookies.get(cookieStorageKey)
    setShowAlert(suppressed == null)
  }, [cookieStorageKey])

  const handleSuppress = (): void => {
    setShowAlert(false)
    Cookies.set(cookieStorageKey, '1', { strict: true, expires: 30 })
  }

  if (!showAlert) return null

  return (
    <div
      role='status'
      aria-live='polite'
      className='z-40 w-fit alert alert-info flex flex-wrap justify-center xl:p-4 gap-4'
    >
      <div className='flex flex-col gap-2 items-start'>{message}</div>
      <div className='inline-flex w-[210px] grow-1'>
        <SuppressButton onClick={handleSuppress} />
      </div>
    </div>
  )
}
