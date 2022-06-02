import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { uploadPhoto } from '../../js/userApi/media'

interface PhotoUploaderProps {
  uuid: string
  className: string
  children: JSX.Element | JSX.Element []
  onUploaded: (url: string) => void
}

export default function PhotoUploader ({ uuid, className = '', onUploaded, children }: PhotoUploaderProps): JSX.Element {
  const [uploading, setUploading] = useState<boolean>(false)

  const onload = async (event, filename: string): Promise<void> => {
    // Do whatever you want with the file contents
    const imageData = event.target.result
    setUploading(true)
    const url = await uploadPhoto(uuid, filename, imageData)
    setUploading(false)
    onUploaded(url)
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log('#number of files', acceptedFiles.length)
      // Do something with the files
      acceptedFiles.forEach((file) => {
        if (file.size > 5242880) {
          window.alert('You tried to upload a photo larger than 5MB')
          return
        }
        const reader = new FileReader()
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = async (event) => await onload(event, file.name)
        reader.readAsArrayBuffer(file)
      })
    },
    []
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    accept: 'image/jpeg, image/png',
    noClick: true
  })

  const onClickHandler = useCallback(() => {
    if (uploading) return
    open()
  }, [uploading])

  return (
    <div {...getRootProps()} className={className} onClick={onClickHandler}>
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
