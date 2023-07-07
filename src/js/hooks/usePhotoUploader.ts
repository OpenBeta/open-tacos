import { useState } from 'react'
import { useDropzone, DropzoneInputProps, FileRejection } from 'react-dropzone'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'

import { userMediaStore } from '../stores/media'
import { uploadPhoto } from '../userApi/media'
import useMediaCmd from '../hooks/useMediaCmd'
import { MediaFormat } from '../types'

interface PhotoUploaderReturnType {
  uploading: boolean
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T
  getRootProps: <T extends DropzoneInputProps>(props?: T) => T
  openFileDialog: () => void
}

async function readFile (file: File): Promise<ProgressEvent<FileReader>> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onabort = () => reject(new Error('file reading was aborted'))
    reader.onerror = () => reject(new Error('file reading has failed'))
    reader.onload = async (event) => resolve(event)
    // Starts reading the contents of the specified Blob, once finished,
    // the result attribute contains an ArrayBuffer representing the file's data.
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Hook providing logic for handling all things photo-upload.
 * Essential logic for handling file data and uploading it to the provider
 * is all encapsulated here, as well as some other api shorthand.
 * */
export default function usePhotoUploader (): PhotoUploaderReturnType {
  const { data: sessionData } = useSession({ required: true })
  const { addMediaObjectsCmd } = useMediaCmd()
  const [uploading, setUploading] = useState<boolean>(false)

  /** When a file is loaded by the browser (as in, loaded from the local filesystem,
   * not loaded from a webserver) we can begin to upload the bytedata to the provider */
  const onload = async (event: ProgressEvent<FileReader>, file: File): Promise<void> => {
    if (event.target === null || event.target.result === null) return // guard this

    // Do whatever you want with the file contents
    const imageData = event.target.result as ArrayBuffer

    const blob = new Blob([imageData], { type: 'image/jpeg' })

    const image = new Image()
    image.src = URL.createObjectURL(blob)

    image.onload = async () => {
      const { name, type, size } = file
      const { width, height } = image
      const userUuid = sessionData?.user.metadata.uuid
      if (userUuid == null) {
        throw new Error('Login required.')
      }
      try {
        const url = await uploadPhoto(name, imageData)
        await addMediaObjectsCmd([{
          userUuid,
          mediaUrl: url,
          format: mineTypeToEnum(type),
          width,
          height,
          size
        }])
      } catch (e) {
        toast.error('Uploading error.  Please try again.')
        console.log('#upload error', e)
        await userMediaStore.set.setPhotoUploadErrorMessage('Failed to upload: Exceeded retry limit.')
      }
    }
  }

  const onDrop = async (files: File[], rejections: FileRejection[]): Promise<void> => {
    if (rejections.length > 0) { console.warn('Rejected files: ', rejections) }

    // Do something with the files
    setUploading(true)

    for (const file of files) {
      if (file.size > 11534336) {
        await userMediaStore.set.setPhotoUploadErrorMessage('¡Ay, caramba! your photo is too large (max=11MB).')
        setUploading(false)
        return
      }

      console.log('# file type', file)
      await onload(await readFile(file), file)
    }

    setUploading(false)
  }

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    multiple: true, // support many
    // When I get back from climbing trips, I have a huge pile of photos
    // also the queue is handled sequentially, with callbacks individually
    // for each file uploads... so it interops nicely with existing function
    maxFiles: 40,
    accept: { 'image/*': [] },
    useFsAccessApi: false,
    noClick: uploading
  })

  return { uploading, getInputProps, getRootProps, openFileDialog: open }
}

export const mineTypeToEnum = (mineType: string): MediaFormat => {
  switch (mineType) {
    case 'image/jpeg': return MediaFormat.jpg
    case 'image/png': return MediaFormat.png
    case 'image/webp': return MediaFormat.webp
    case 'image/avif': return MediaFormat.avif
  }
  throw new Error('Unsupported media type' + mineType)
}
