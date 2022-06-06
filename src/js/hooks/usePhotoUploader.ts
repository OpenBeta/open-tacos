import { useState, useCallback } from 'react'
import { useDropzone, DropzoneInputProps } from 'react-dropzone'

import { uploadPhoto } from '../userApi/media'

interface UploaderProps {
  onUploaded: (url: string) => Promise<void>
}

interface PhotoUploaderReturnType {
  uploading: boolean
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T
  getRootProps: <T extends DropzoneInputProps>(props?: T) => T
  openFileDialog: () => void

}

export default function usePhotoUploader ({ onUploaded }: UploaderProps): PhotoUploaderReturnType {
  const [uploading, setUploading] = useState<boolean>(false)

  const onload = async (event, filename: string): Promise<void> => {
  // Do whatever you want with the file contents
    const imageData = event.target.result
    setUploading(true)
    const url = await uploadPhoto(filename, imageData)
    setUploading(false)
    await onUploaded(url)
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
    accept: { 'image/jpeg': ['.jpeg', '.png'] },
    noClick: true
  })

  const openFileDialog = useCallback(() => {
    if (uploading) return
    open()
  }, [uploading])

  return { uploading, getInputProps, getRootProps, openFileDialog }
}
