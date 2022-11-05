import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { PlusIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'

import usePhotoUploader from '../js/hooks/usePhotoUploader'
import { userMediaStore } from '../js/stores/media'
import useReturnToProfile from '../js/hooks/useReturnToProfile'

interface ProfileNavButtonProps {
  isMobile?: boolean
  className?: string
}

export default function NewPost ({ isMobile = true, className = '' }: ProfileNavButtonProps): JSX.Element | null {
  const { status, data } = useSession()

  const { toMyProfile } = useReturnToProfile()

  const onUploaded = useCallback(async (url: string): Promise<void> => {
    if (data?.user?.metadata == null) {
      console.log('## Error: user metadata not found')
      return
    }
    const { nick, uuid } = data.user.metadata

    if (uuid != null && nick != null) {
      await toMyProfile()
      await userMediaStore.set.addImage(nick, uuid, url, true)
      console.log('uploaded', url)
    }
  }, [])

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
