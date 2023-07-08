import React from 'react'
import usePhotoUploader from '../../js/hooks/usePhotoUploader'
import { useUserGalleryStore } from '../../js/stores/useUserGalleryStore'

interface PhotoUploaderProps {
  className: string
  children: JSX.Element | JSX.Element []
}

/** A drop-zone for uploading photos, with click-to-open a file explorer operation */
export default function PhotoUploader ({ className, children }: PhotoUploaderProps): JSX.Element {
  const { getRootProps, getInputProps } = usePhotoUploader()

  const uploading = useUserGalleryStore(store => store.uploading)
  return (
    // Fiddling with syntax here seems to make dropzone clicking work.
    // (tested both FF and Chrome on Ubuntu)
    <div {...getRootProps({ className: `dropzone ${className}` })}>
      {uploading && <Progress />}
      <input {...getInputProps()} />
      {children}
    </div>
  )
}

const Progress = (): JSX.Element => (
  <div className='absolute top-0 bg-base-100 w-full h-full flex items-center justify-center flex-col bg-opacity-100 '>
    <div
      className='px-2 py-1.5 text-base-content text-md font-semibold rounded-box  animate-pulse'
    >Uploading...
    </div>
  </div>)
