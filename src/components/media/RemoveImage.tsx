import { useSession } from 'next-auth/react'

import { actions } from '../../js/stores'
import { removePhoto } from '../../js/userApi/media'
import { MediaType } from '../../js/types'
import { Button, ButtonVariant } from '../ui/BaseButton'

interface RemoveImageProps {
  imageInfo: MediaType
  tagCount: Number
  onImageDeleted: any
}

export default function RemoveImage ({ imageInfo, tagCount, onImageDeleted }: RemoveImageProps): JSX.Element | null {
  const { data } = useSession()

  const onRemove = async (e): Promise<void> => {
    if (data?.user?.metadata == null) {
      console.log('## Error: user metadata not found')
      return
    }

    const filename: string = imageInfo.filename
    e.preventDefault()
    if (window.confirm('Are you sure?')) {
      const isRemoved = await removePhoto(filename)
      await actions.media.removeImage(imageInfo.mediaId)
      if (isRemoved != null) {
        onImageDeleted()
      }
    }
  }

  return (
    <>
      <Button
        label='Remove Photo'
        onClick={onRemove}
        variant={ButtonVariant.OUTLINED_DEFAULT}
        disabled={tagCount > 0}
      />
      {tagCount > 0 && <p className='text-sm py-2'>Remove tags to delete image</p>}
    </>
  )
}
