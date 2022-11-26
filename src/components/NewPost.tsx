import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { PlusIcon, StopIcon } from '@heroicons/react/24/outline'
import { validate as isValidUuid } from 'uuid'

import usePhotoUploader from '../js/hooks/usePhotoUploader'
import { userMediaStore, revalidateUserHomePage } from '../js/stores/media'
import useReturnToProfile from '../js/hooks/useReturnToProfile'
import usePhotoTag from '../js/hooks/usePhotoTagCmd'
import { mediaUrlHash } from '../js/sirv/util'
import { BlockingAlert } from '../components/ui/micro/AlertDialogue'

interface ProfileNavButtonProps {
  isMobile?: boolean
  className?: string
}

export default function NewPost ({ isMobile = true, className = '' }: ProfileNavButtonProps): JSX.Element | null {
  const { status, data } = useSession()
  const router = useRouter()
  const { tagPhotoCmd } = usePhotoTag()

  const { toMyProfile } = useReturnToProfile()

  const onUploaded = async (url: string): Promise<void> => {
    if (data?.user?.metadata == null) {
      console.log('## Error: user metadata not found')
      return
    }

    const { nick, uuid } = data.user.metadata

    const [id, destType, pageToInvalidate] = pagePathToEntityType(router.asPath)

    // let's see if we're viewing the climb or area page
    if (id != null && isValidUuid(id) && (destType === 0 || destType === 1)) {
      // yes! let's tag it
      await tagPhotoCmd({
        mediaUrl: url,
        mediaUuid: mediaUrlHash(url),
        destinationId: id,
        destType
      })
      // Tell Next to regenerate the page being tagged
      await fetch(pageToInvalidate)

      // Regenerate user profile page as well
      if (nick != null) {
        void revalidateUserHomePage(nick)
      }
      router.reload()
    } else {
      if (uuid != null && nick != null) {
        await toMyProfile()
        await userMediaStore.set.addImage(nick, uuid, url, true)
        console.log('uploaded', url)
      }
    }
  }

  const { uploading, getRootProps, getInputProps } = usePhotoUploader({ onUploaded })

  if (status === 'authenticated') {
    if (isMobile) {
      return (
        <div {...getRootProps()} className={className}>
          <input {...getInputProps()} />
          <button disabled={uploading} className='btn btn-square btn-ghost'>
            <PlusIcon className='border-2 rounded-md w-6 h-6 stroke-white stroke-2' />
          </button>
          {uploading &&
            <BlockingAlert
              icon={<StopIcon className='w-12 h-12 stroke-2 animate-spin' />}
              description='Uploading'
            />}
        </div>
      )
    }
    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <button disabled={uploading} className='btn btn-accent gap-2 px-8'>
          <PlusIcon className='stroke-white stroke-2 w-6 h-6' />
          <span className='mt-0.5'>Photo</span>
        </button>
        {uploading &&
          <BlockingAlert
            icon={<StopIcon className='w-12 h-12 stroke-2 animate-spin' />}
            description='Uploading'
          />}
      </div>
    )
  }

  return null
}

/**
 * Convert current page path to a destination type for tagging.  Expect `path` to be in /areas|crag|climb/[id].
 * @param path `path` property as return from `Next.router()`
 * @returns 0 if current page is climb, 1 for area and crag, null otherwise
 */
const pagePathToEntityType = (path: string): [string, number, string] | [null, null, null] => {
  if (path == null) return [null, null, null]
  const tokens = path.split('/')
  if (tokens.length >= 3) {
    const id = tokens[2]
    switch (tokens[1]) {
      case 'climbs':
        return [id, 0, `/api/revalidate?c=${id}`]
      case 'areas':
        return [id, 1, `/api/revalidate?a=${id}`]
      case 'crag':
        return [id, 1, `/api/revalidate?s=${id}`]
      default:
        return [null, null, null]
    }
  }
  return [null, null, null]
}
