import React from 'react'
import usePhotoUploader from '../../js/hooks/usePhotoUploader'

interface PhotoUploaderProps {
  className: string
  children: JSX.Element | JSX.Element []
  onUploaded: (url: string) => Promise<void>
}

export default function PhotoUploader ({ className = '', onUploaded, children }: PhotoUploaderProps): JSX.Element {
  const { uploading, getRootProps, getInputProps, openFileDialog } = usePhotoUploader({ onUploaded })
  return (
    <div {...getRootProps()} className={className} onClick={openFileDialog}>
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
