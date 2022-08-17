import { useState, useCallback } from 'react'
import { useDropzone, DropzoneInputProps, FileRejection } from 'react-dropzone'

import { uploadPhoto } from '../userApi/media'

interface UploaderProps {
  /** what to do with the newly available image URL */
  onUploaded: (url: string) => Promise<void>
}

interface PhotoUploaderReturnType {
  uploading: boolean
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T
  getRootProps: <T extends DropzoneInputProps>(props?: T) => T
}

/**
 * Hook providing logic for handling all things photo-upload.
 * Essential logic for handling file data and uploading it to the provider
 * is all encapsulated here, as well as some other api shorthand.
 * */
export default function usePhotoUploader ({ onUploaded }: UploaderProps): PhotoUploaderReturnType {
  const [uploading, setUploading] = useState<boolean>(false)

  /** When a file is loaded by the browser (as in, loaded from the local filesystem,
   * not loaded from a webserver) we can begin to upload the bytedata to the provider */
  const onload = async (event: ProgressEvent<FileReader>, filename: string): Promise<void> => {
    if (event.target === null || event.target.result === null) return // guard this

    // Do whatever you want with the file contents
    let imageData = event.target.result
    if (typeof imageData === 'string') {
      imageData = Buffer.from(imageData)
    }

    let retry = 3
    while (retry !== 0) {
      try {
        const url = await uploadPhoto(filename, imageData)
        await onUploaded(url)
        return // success, no err
      } catch {

      } finally {
        retry -= 1
      }
    }

    console.error(filename, 'failed to upload: Exceeded retry limit')
  }

  const onDrop = useCallback(
    (files: File[], rejections: FileRejection[]) => {
      console.log('#number of files', files.length)
      if (rejections.length > 0) { console.warn('Rejected files: ', rejections) }

      // Do something with the files
      setUploading(true)

      files.forEach((file) => {
        if (file.size > 5242880) {
          window.alert('You tried to upload a photo larger than 5MB')
          return
        }

        const reader = new FileReader()
        reader.onabort = () => console.error('file reading was aborted')
        reader.onerror = () => console.error('file reading has failed')
        reader.onload = async (event) => await onload(event, file.name)
        // Starts reading the contents of the specified Blob, once finished,
        // the result attribute contains an ArrayBuffer representing the file's data.
        reader.readAsArrayBuffer(file)
      })

      setUploading(false)
    },
    []
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true, // support many
    maxFiles: 40, // For me, I would be wanting to do way more
    accept: { 'image/*': [] },
    useFsAccessApi: false
  })

  return { uploading, getInputProps, getRootProps }
}
