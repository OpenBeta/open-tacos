import { useSession } from 'next-auth/react'
import { PlusIcon, DotsHorizontalIcon } from '@heroicons/react/solid'

import usePhotoUploader from '../js/hooks/usePhotoUploader'
import { Button, ButtonVariant } from './ui/BaseButton'
import { userMediaStore } from '../js/stores/media'

interface ProfileNavButtonProps {
  isMobile?: boolean
}

export default function NewPost ({ isMobile = true }: ProfileNavButtonProps): JSX.Element | null {
  const { status, data } = useSession()

  const onUploaded = async (url: string): Promise<void> => {
    if (data?.user?.metadata == null) {
      console.log('## Error: user metadata not found')
      return
    }
    const { nick, uuid } = data.user.metadata

    if (uuid != null && nick != null) {
      await userMediaStore.set.addImage(nick, uuid, url, false, true)
      console.log('uploaded', url)
    }
  }

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
            <>
              {uploading
                ? <DotsHorizontalIcon className='ml-3 w-4 h-4 stroke-white stroke-2 animate-pulse' />
                : <PlusIcon className='ml-3 stroke-white stroke-2 w-4 h-4' />}
              <span className='mt-0.5 pr-4'>Photo</span>
            </>
          }
          variant={ButtonVariant.SOLID_PRIMARY}
        />
      </div>

    )
  }

  return null
}
