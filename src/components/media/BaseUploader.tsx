'use client'
import React from 'react'
import usePhotoUploader from '../../js/hooks/usePhotoUploader'

interface PhotoUploaderProps {
  className: string
  children: React.ReactNode
}

/** A drop-zone for uploading photos, with click-to-open a file explorer operation */
export default function BaseUploader ({ className, children }: PhotoUploaderProps): JSX.Element {
  const { getRootProps, getInputProps } = usePhotoUploader()
  return (
    // Fiddling with syntax here seems to make dropzone clicking work.
    // (tested both FF and Chrome on Ubuntu)
    <div {...getRootProps({ className: `dropzone ${className}` })}>
      <input {...getInputProps()} />
      {children}
    </div>
  )
}
