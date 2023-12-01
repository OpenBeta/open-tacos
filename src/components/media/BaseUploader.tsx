'use client'
import React, { useCallback, MouseEventHandler } from 'react'
import { validate } from 'uuid'
import { useSession, signIn } from 'next-auth/react'

import usePhotoUploader from '../../js/hooks/usePhotoUploader'
import { usePathname } from 'next/navigation'
import { TagTargetType } from '@/js/types'

interface BaseUploaderProps {
  className: string
  children: React.ReactNode
  tagType?: TagTargetType
  uuid?: string
}

/** A drop-zone for uploading photos, with click-to-open a file explorer operation */
export const BaseUploader: React.FC<BaseUploaderProps> = ({ tagType, uuid, className, children }) => {
  const session = useSession()
  const { getRootProps, getInputProps } = usePhotoUploader({ tagType, uuid })
  const onClickHandler: MouseEventHandler<HTMLInputElement> = useCallback((event) => {
    if (session.status !== 'authenticated') {
      event.stopPropagation()
      void signIn('auth0')
    }
  }, [session])

  return (
    // Fiddling with syntax here seems to make dropzone clicking work.
    // (tested both FF and Chrome on Ubuntu)
    <div {...getRootProps({ className: `dropzone ${className}`, onClick: onClickHandler })}>
      <input {...getInputProps()} />
      {children}
    </div>
  )
}

/**
 * Inject current page type and uuid to the BaseUploader
 */
export const BaseUploaderWithNext13Context: React.FC<Omit<BaseUploaderProps, 'tagType' | 'uuid'>> = ({ className, children }) => {
  const pathname = usePathname()
  const tokens = pathname.split('/')
  if (tokens.length < 2) {
    return null
  }
  let tagType: number
  switch (tokens[1]) {
    case 'climb': {
      tagType = 0
      break
    }
    case 'area': {
      tagType = 1
      break
    }
    default: return null
  }
  const uuid = tokens[2]

  if (!validate(uuid)) {
    return null
  }

  return <BaseUploader tagType={tagType} uuid={uuid} className={className}>{children}</BaseUploader>
}
