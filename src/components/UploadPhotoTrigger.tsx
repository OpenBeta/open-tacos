import { useRef } from 'react'
import { useSession, signIn } from 'next-auth/react'
import clx from 'classnames'

import usePhotoUploader from '../js/hooks/usePhotoUploader'
import { useUserGalleryStore } from '../js/stores/useUserGalleryStore'

interface UploadPhotoTriggerProps {
  children: JSX.Element | JSX.Element []
  className?: string
  onUploaded?: () => void
}

/**
 * Wrapper component that uploads photo to our image provider.
 * If the user is viewing a climb or an area page, also tag
 * the climb/area.
 */
export default function UploadPhotoTrigger ({ className = '', onUploaded, children }: UploadPhotoTriggerProps): JSX.Element | null {
  const { data, status } = useSession()

  /**
   * Why useRef?
   * Even though render is called multiple times, the callback function is
   * only generated once, with a stale session object.
   * See https://stackoverflow.com/questions/57847594/react-hooks-accessing-up-to-date-state-from-within-a-callback
  */
  const sessionRef = useRef<any>()
  sessionRef.current = data?.user

  const { getRootProps, getInputProps, openFileDialog } = usePhotoUploader()
  const uploading = useUserGalleryStore(store => store.uploading)

  return (
    <div
      className={clx(className, uploading ? 'pointer-events-none' : '')} {...getRootProps()} onClick={(e) => {
        if (status === 'authenticated' && !uploading) {
          openFileDialog()
        } else {
          void signIn('auth0')
        }
      }}
    >
      <input {...getInputProps()} />
      {children}
    </div>
  )
}
