import React from 'react'
import usePhotoUploader from '../../js/hooks/usePhotoUploader'

interface PhotoUploaderProps {
  className: string
  children: JSX.Element | JSX.Element []
  onUploaded: (url: string) => Promise<void>
}

/** A drop-zone for uploading photos, with click-to-open a file explorer operation */
export default function PhotoUploader ({ className, onUploaded, children }: PhotoUploaderProps): JSX.Element {
  const { uploading, getRootProps, getInputProps } = usePhotoUploader({ onUploaded })

  return (
    // Fiddling with syntax here seems to make dropzone clicking work.
    // (tested both FF and Chrome on Ubuntu)
    <div {...getRootProps({ className: `pointer-events-none cursor-not-allowed dropzone ${className}` })}>
      {uploading && <Progress />}
      <input {...getInputProps()} />
      {children}
    </div>
  )
}

const Progress = (): JSX.Element => (
  <div className='absolute top-0 bg-gray-100 w-full h-full flex items-center justify-center bg-opacity-90'>
    <span
      className='px-2 py-1 bg-gray-800 text-primary-contrast text-md font-semibold animate-pulse rounded-lg'
    >Loading...
    </span>
  </div>)
