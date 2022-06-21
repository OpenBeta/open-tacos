import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { PlusIcon, DotsHorizontalIcon } from '@heroicons/react/solid'

import usePhotoUploader from '../js/hooks/usePhotoUploader'
import { Button, ButtonVariant } from './ui/BaseButton'
import { userMediaStore } from '../js/stores/media'
import useReturnToProfile from '../js/hooks/useReturnToProfile'
interface ProfileNavButtonProps {
  isMobile?: boolean
}

export default function NewPost ({ isMobile = true }: ProfileNavButtonProps): JSX.Element | null {
  const { status, data } = useSession()

  const { toMyProfile } = useReturnToProfile()

  const onUploaded = useCallback(async (url: string): Promise<void> => {
    if (data?.user?.metadata == null) {
      console.log('## Error: user metadata not found')
      return
    }
    const { nick, uuid } = data.user.metadata

    if (uuid != null && nick != null) {
      await userMediaStore.set.addImage(nick, uuid, url, false, true)
      console.log('uploaded', url)
      await toMyProfile()
    }
  }, [])

  const { uploading, getRootProps, getInputProps, openFileDialog } = usePhotoUploader({ onUploaded })

  if (status === 'authenticated') {
    if (isMobile) {
      return (
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <Button
            disabled={uploading}
            onClick={openFileDialog}
            label={
              <span className='border-2 rounded-md border-black'>
                {uploading ? <DotsHorizontalIcon className='w-6 h-6' /> : <PlusIcon className='w-6 h-6' />}
              </span>
                }
          />
        </div>

      )
    }
    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Button
          disabled={uploading}
          onClick={openFileDialog}
          label={
            <div className='flex no-wrap items-center space-x-2 px-4'>
              {uploading
                ? <DotsHorizontalIcon className='w-5 h-5 stroke-white stroke-2 animate-pulse' />
                : <PlusIcon className='stroke-white stroke-2 w-5 h-5' />}
              <span className='mt-0.5 px-2'>Photo</span>
            </div>
          }
          variant={ButtonVariant.SOLID_PRIMARY}
        />
      </div>

    )
  }

  return null
}
