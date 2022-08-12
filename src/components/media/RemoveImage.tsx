import { useSession } from 'next-auth/react'
import { XIcon } from '@heroicons/react/outline'

import { actions } from '../../js/stores'
import { removePhoto } from '../../js/userApi/media'
import { MediaType } from '../../js/types'
import { Button, ButtonVariant } from '../ui/BaseButton'

interface RemoveImageProps {
  imageInfo: MediaType
  tagCount: Number
}

export default function RemoveImage ({ imageInfo, tagCount }: RemoveImageProps): JSX.Element | null {
  const { data } = useSession()

  const onRemove = async (e): Promise<void> => {
    if (tagCount > 0) {
      // Additional safe-guard
      console.log('## Error: Remove tags first')
      return
    }
    if (data?.user?.metadata == null) {
      console.log('## Error: user metadata not found')
      return
    }

    const filename: string = imageInfo.filename
    e.preventDefault()
    if (window.confirm('Are you sure?')) {
      const isRemoved = await removePhoto(filename)
      if (isRemoved != null) {
        await actions.media.removeImage(imageInfo.mediaId)
      }
    }
  }

  return (
    <Button
      ariaLabel='remove'
      label={<XIcon className='w-4 h-4' />}
      onClick={onRemove}
      variant={ButtonVariant.ROUNDED_ICON_SOLID}
      disabled={tagCount > 0}
    />
  )
}
