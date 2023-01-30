import { useState } from 'react'
import { useDropzone, DropzoneInputProps, FileRejection } from 'react-dropzone'
import { userMediaStore } from '../stores/media'

import { uploadPhoto } from '../userApi/media'

interface UploaderProps {
  /** Called after a succesful upload */
  onUploaded: (url: string) => Promise<void>
}

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

    try {
      const url = await uploadPhoto(filename, imageData)
      void onUploaded(url)
    } catch (e) {
      console.log('#upload error', e)
      await userMediaStore.set.setPhotoUploadErrorMessage('Failed to upload: Exceeded retry limit.')
    }
  }

  const onDrop = async (files: File[], rejections: FileRejection[]): Promise<void> => {
    console.log('#number of files', files.length)
    if (rejections.length > 0) { console.warn('Rejected files: ', rejections) }

    // Do something with the files
    setUploading(true)

    for (const file of files) {
      if (file.size > 11534336) {
        await userMediaStore.set.setPhotoUploadErrorMessage('¡Ay, caramba! your photo is too large (max=11MB).')
        setUploading(false)
        return
      }

      await onload(await readFile(file), file.name)
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
