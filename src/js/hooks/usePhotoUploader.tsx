import { useRef } from 'react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { useDropzone, DropzoneInputProps, FileRejection } from 'react-dropzone'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react'
import { validate as isValidUuid } from 'uuid'

import { uploadPhoto, deleteMediaFromStorage } from '../userApi/media'
import useMediaCmd from './useMediaCmd'
import { MediaFormat } from '../types'
import { NewEmbeddedEntityTag } from '../graphql/gql/media'
import { useUserGalleryStore } from '../stores/useUserGalleryStore'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'

interface PhotoUploaderReturnType {
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
 * { onUploaded }: UsePhotoUploaderProps
 * */
export default function usePhotoUploader (): PhotoUploaderReturnType {
  const router = useRouter()
  const pageParams = useParams()
  const pathName = usePathname()
  const setUploading = useUserGalleryStore(store => store.setUploading)
  const isUploading = useUserGalleryStore(store => store.uploading)
  const { data: sessionData } = useSession()
  const { addMediaObjectsCmd } = useMediaCmd()

  // const [hasErrors, setHasErrors] = useState(false)

  const ref = useRef({
    hasErrors: false
  })
  /** When a file is loaded by the browser (as in, loaded from the local filesystem,
   * not loaded from a webserver) we can begin to upload the bytedata to the provider */
  const onload = async (event: ProgressEvent<FileReader>, file: File): Promise<void> => {
    if (event.target === null || event.target.result === null) return // guard this

    const userUuid = sessionData?.user.metadata.uuid
    if (userUuid == null) {
      // this shouldn't happen
      throw new Error('Login required.')
    }

    const imageData = event.target.result as ArrayBuffer

    const { width, height } = await getImageDimensions(imageData)
    const { name, type, size } = file
    const [entityTag, postUpdateFn] = await getEntityFromPageContext(pathName, pageParams)
    try {
      const url = await uploadPhoto(name, imageData)

      const res = await addMediaObjectsCmd([{
        userUuid,
        mediaUrl: url,
        format: mineTypeToEnum(type),
        width,
        height,
        size,
        ...(entityTag != null && { entityTag })
      }], sessionData?.accessToken)

      // if upload is successful but we can't update the database,
      // then delete the upload
      if (res == null) {
        ref.current.hasErrors = true
        await deleteMediaFromStorage(url)
      } else {
        if (postUpdateFn != null) {
          await postUpdateFn(router)
        }
      }
    } catch (e) {
      ref.current.hasErrors = true
    }
  }

  const onDrop = async (files: File[], rejections: FileRejection[]): Promise<void> => {
    if (rejections.length > 0) { console.warn('Rejected files: ', rejections) }

    setUploading(true)
    ref.current.hasErrors = false
    await Promise.all(files.map(async file => {
      if (file.size > 11534336) {
        toast.warn('¡Ay, caramba! one of your photos is too cruxy (please reduce the size to 11MB or under)')
        return true
      }
      const content = await readFile(file)
      await onload(content, file)
      return true
    }))

    setUploading(false)

    if (ref.current.hasErrors) {
      toast.error('Error uploading photos.  Please try again.')
    } else {
      toast.success(<div>Uploading completed! <button className='btn btn-link btn-sm' onClick={() => location.reload()}>Refresh</button></div>)
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
    accept: { 'image/*': [] },
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

/**
 * If photo is uploaded while on a climb or crag page,
 * obtain entity data to be added to the photo. Also return
 * a function to clear Next cache and refresh the page.
 */
const getEntityFromPageContext = async (pathName: string, pageParams: Params): Promise<[NewEmbeddedEntityTag | null, null | ((router: AppRouterInstance) => Promise<void>)]> => {
  const [id, destType, pageToInvalidate] = pagePathToEntityType(pathName, pageParams)

  const postUpdate = async (router: AppRouterInstance): Promise<void> => {
    try {
      // Request Next.js to re-generate the page being tagged
      if (pageToInvalidate != null) {
        await fetch(pageToInvalidate)
      }
      router.refresh()

      // if (urlToReload != null) {
      //   router.replace(urlToReload)
      // }
    } catch (e) { console.log(e) }
  }

  if (id != null && isValidUuid(id) && (destType === 0 || destType === 1)) {
    return [{
      entityId: id,
      entityType: destType
    }, postUpdate]
  }
  return [null, null]
}

/**
 * Convert current page path to a destination type for tagging.  Expect `path` to be in /areas|crag|climb/[id].
 * @param path `path` property as return from `Next.router()`
 */
const pagePathToEntityType = (pathName: string, pageParams: Params): [string, number, string, string] | [null, null, null, null] => {
  const nulls: [null, null, null, null] = [null, null, null, null]

  const tokens = pathName.split('/')

  // expect at least 2 tokens. Ex: /area or /climbs
  if (tokens.length < 2) return nulls

  const uuid: string = pageParams?.slug[0] as string ?? null
  if (uuid == null) return nulls

  switch (tokens[1]) {
    case 'climbs':
      return [uuid, 0, `/api/revalidate?c=${uuid}`, `/climbs/${uuid}`]
    case 'area':
      return [uuid, 1, `/api/updateAreaPage?uuid=${uuid}`, `/area/${uuid}`]
    default:
      return nulls
  }
}
