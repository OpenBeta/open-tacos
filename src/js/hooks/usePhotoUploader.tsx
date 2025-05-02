'use client'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone, DropzoneInputProps, FileRejection } from 'react-dropzone'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'
import Compressor from 'compressorjs'

import { uploadPhoto, deleteMediaFromStorage } from '../userApi/media'
import useMediaCmd, { invalidateAncestorPagesWithEntity } from './useMediaCmd'
import { MediaFormat, TagTargetType } from '../types'
import { NewEmbeddedEntityTag } from '../graphql/gql/media'
import { useUserGalleryStore } from '../stores/useUserGalleryStore'
import useUserProfileCmd from './useUserProfileCmd'

interface UsePhotoUploaderProps {
  tagType?: TagTargetType
  uuid?: string
  isProfilePhoto?: boolean
}
interface PhotoUploaderReturnType {
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T
  getRootProps: <T extends DropzoneInputProps>(props?: T) => T
  openFileDialog: () => void
}

async function readFile (file: File | Blob): Promise<ProgressEvent<FileReader>> {
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
 * { onUploaded }: UsePhotoUploaderProps
 * */
export default function usePhotoUploader ({ tagType, uuid, isProfilePhoto = false }: UsePhotoUploaderProps): PhotoUploaderReturnType {
  const router = useRouter()
  const setAvatarUrl = useUserGalleryStore(store => store.setAvatarUrl)
  const setUploading = useUserGalleryStore(store => store.setUploading)
  const isUploading = useUserGalleryStore(store => store.uploading)
  const { data: sessionData, status: sessionStatus } = useSession()
  const { addMediaObjectsCmd } = useMediaCmd()
  const { updatePublicProfileCmd } = useUserProfileCmd({ accessToken: sessionData?.accessToken as string })

  const ref = useRef({
    hasErrors: false
  })

  /** When a file is loaded by the browser (as in, loaded from the local filesystem,
   * not loaded from a webserver) we can begin to upload the bytedata to the provider */
  const onload = async (event: ProgressEvent<FileReader>, file: File | Blob): Promise<void> => {
    if (event.target === null || event.target.result === null) return // guard this

    const userUuid = sessionData?.user.metadata.uuid
    if (sessionStatus !== 'authenticated' || userUuid == null) {
      // this shouldn't happen
      throw new Error('Login required.')
    }

    const imageData = event.target.result as ArrayBuffer

    const { width, height } = await getImageDimensions(imageData)
    const { name, type, size } = file

    let entityTag: NewEmbeddedEntityTag | undefined

    if (uuid != null && tagType != null) {
      entityTag = {
        entityId: uuid,
        entityType: tagType
      }
    }
    try {
      const url = await uploadPhoto(name, imageData)
      if (isProfilePhoto) {
        updatePublicProfileCmd({ userUuid, avatar: url }).catch(console.error)
        setAvatarUrl(url)
      }
      const res = await addMediaObjectsCmd([{
        userUuid,
        mediaUrl: url,
        format: mineTypeToEnum(type),
        width,
        height,
        size,
        ...entityTag != null && { entityTag } // entityTag != null means uploading from a climb or area page
      }], sessionData?.accessToken)

      // if upload is successful but we can't update the database,
      // then delete the upload
      if (res == null || res.length !== 1) {
        ref.current.hasErrors = true
        await deleteMediaFromStorage(url)
      } else if (!isProfilePhoto && res[0].entityTags?.length === 1) {
        // Newly uploaded photo from climb or area page should only has 1 entity tag.
        // We need to invalidate the current and all ancestor pages.
        const media = res[0]
        const { targetId, type, ancestors } = media.entityTags[0]
        await invalidateAncestorPagesWithEntity({ entityId: targetId, entityType: type, ancestorList: ancestors.split(',') })
        router.refresh() // Ask NextJS to update current page props
      }
    } catch (e) {
      ref.current.hasErrors = true
    }
  }

  const compressImage = async (file: File | Blob): Promise<File | Blob> => {
    return await new Promise((resolve, reject) => {
      void new Compressor(file, {
        quality: 0.9,
        success: (compressedFile: File) => resolve(compressedFile),
        error: (err: Error) => reject(err)
      })
    })
  }

  const onDrop = async (files: File[], rejections: FileRejection[]): Promise<void> => {
    if (rejections.length > 0) { console.warn('Rejected files: ', rejections) }

    setUploading(true)
    ref.current.hasErrors = false
    const SIZE_LIMIT = 11 * 1024 * 1024 // 11 MB
    const COMPRESSION_THRESHOLD = 30 * 1024 * 1024 // 30 MB

    const processFile = async (file: File | Blob): Promise<void> => {
      try {
        let processedFile = file

        if (file.size >= COMPRESSION_THRESHOLD) {
          toast.warn('¡Ay, caramba! one of your photos is too cruxy (please reduce the size to 30MB or under)')
          ref.current.hasErrors = true
          return
        }
        if (file.size >= SIZE_LIMIT) {
          processedFile = await compressImage(file)
        }

        const content = await readFile(processedFile)

        await onload(content, processedFile)
      } catch (error) {
        ref.current.hasErrors = true
        console.error('Upload error:', error)
      }
    }

    await Promise.all(files.map(async file => await processFile(file)))

    setUploading(false)

    if (ref.current.hasErrors) {
      toast.error('Error uploading photos.  Please try again.')
    } else {
      toast.success('Uploaded!')
      ref.current.hasErrors = false
    }
  }

  const { getRootProps, getInputProps, open } = useDropzone({
    /* eslint-disable-next-line */
    onDrop,
    multiple: true, // support many
    // When I get back from climbing trips, I have a huge pile of photos
    // also the queue is handled sequentially, with callbacks individually
    // for each file uploads... so it interops nicely with existing function
    maxFiles: 40,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/gif': [],
      'image/png': [],
      'image/webp': [],
      'image/avif': []
    },
    useFsAccessApi: false,
    noClick: isUploading
  })

  return { getInputProps, getRootProps, openFileDialog: open }
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

interface Dimensions {
  width: number
  height: number
}

/**
 * Get image width x height from image upload data.
 * https://stackoverflow.com/questions/46399223/async-await-in-image-loading
 */
const getImageDimensions = async (imageData: ArrayBuffer): Promise<Dimensions> => {
  return await new Promise((resolve, reject) => {
    const blob = new Blob([imageData], { type: 'image/jpeg' })

    const image = new Image()
    image.src = URL.createObjectURL(blob)
    image.onload = () => resolve({
      height: image.naturalHeight,
      width: image.naturalWidth
    })
    image.onerror = reject
  })
}
