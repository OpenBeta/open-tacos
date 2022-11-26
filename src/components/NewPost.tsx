import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { PlusIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { validate as isValidUuid } from 'uuid'

import usePhotoUploader from '../js/hooks/usePhotoUploader'
import { userMediaStore } from '../js/stores/media'
import useReturnToProfile from '../js/hooks/useReturnToProfile'
import usePhotoTag from '../js/hooks/usePhotoTag'
import { mediaUrlHash } from '../js/sirv/util'
import { EntityType } from '../js/types'

interface ProfileNavButtonProps {
  isMobile?: boolean
  className?: string
}

export default function NewPost ({ isMobile = true, className = '' }: ProfileNavButtonProps): JSX.Element | null {
  const { status, data } = useSession()
  const router = useRouter()
  const { tagPhotoCmd } = usePhotoTag()

  const { toMyProfile } = useReturnToProfile()

  console.log('#ROUTER', router.query)

  const onUploaded = async (url: string): Promise<void> => {
    if (data?.user?.metadata == null) {
      console.log('## Error: user metadata not found')
      return
    }

    const id = router.query?.id as string
    const destType = pagePathToEntityType(router.pathname)

    console.log('#onuploaded', router, id, destType)

    if (id != null && isValidUuid(id) && (destType === 0 || destType === 1)) {
      console.log('#tagging photo')
      void tagPhotoCmd({
        mediaUrl: url,
        mediaUuid: mediaUrlHash(url),
        destinationId: id,
        destType
      })
      return
    }
    const { nick, uuid } = data.user.metadata

    if (uuid != null && nick != null) {
      await toMyProfile()
      await userMediaStore.set.addImage(nick, uuid, url, true)
      console.log('uploaded', url)
    }
  }

  const { uploading, getRootProps, getInputProps } = usePhotoUploader({ onUploaded })

  if (status === 'authenticated') {
    if (isMobile) {
      return (
        <div {...getRootProps()} className={className}>
          <input {...getInputProps()} />
          <button disabled={uploading} className='btn btn-square btn-ghost'>
            {uploading ? <EllipsisHorizontalIcon className='w-6 h-6 stroke-white' /> : <PlusIcon className='border-2 rounded-md w-6 h-6 stroke-white stroke-2' />}
          </button>
        </div>

      )
    }
    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <button disabled={uploading} className='btn btn-accent gap-2 px-8'>
          {uploading
            ? <EllipsisHorizontalIcon className='w-5 h-5 stroke-white stroke-2 animate-pulse' />
            : <PlusIcon className='stroke-white stroke-2 w-6 h-6' />}
          <span className='mt-0.5'>Photo</span>
        </button>
      </div>

    )
  }

  return null
}

/**
 * Convert current page path to a destination type for tagging.  Expect URL to be in /areas|crag|climb/[id].
 * @param path
 * @returns 0 if current page is climb, 1 for area and crag, null otherwise
 */
const pagePathToEntityType = (path: string): number | null => {
  if (path == null) return null
  const tokens = path.split('/')
  if (tokens.length >= 3) {
    switch (tokens[1]) {
      case 'climbs':
        return 0
      case 'areas':
      case 'crag':
        return 1
      default:
        return null
    }
  }
  return null
}
