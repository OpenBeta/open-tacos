import { actions } from '../../js/stores'
import { removePhoto } from '../../js/userApi/media'
import { MediaType } from '../../js/types'
import { useSession } from 'next-auth/react'
import useReturnToProfile from '../../js/hooks/useReturnToProfile'

interface RemoveImageProps {
  imageInfo: MediaType
  tagCount: Number
  onImageDeleted: any
}

export default function RemoveImage ({ imageInfo, tagCount, onImageDeleted }: RemoveImageProps): JSX.Element | null {
  const { data } = useSession()
  const { toMyProfile } = useReturnToProfile()

  const onRemove = async (e): Promise<void> => {
    if (data?.user?.metadata == null) {
      console.log('## Error: user metadata not found')
      return
    }
    const { nick } = data.user.metadata

    const filename: string = imageInfo.filename
    e.preventDefault()
    if (window.confirm('Are you sure?')) {
      let isRemoved = await removePhoto(filename)
      await actions.media.removeImage(imageInfo.mediaId, nick)
      if (isRemoved) {
        onImageDeleted()
      }
    }
  }

  return (

    <>
      <div><button type='button' onClick={onRemove} disabled={tagCount > 0} className='inline-flex space-x-2 items-center bg-custom-primary whitespace-nowrap cursor-pointer disabled:cursor-auto disabled:opacity-20 border rounded-md border-gray-800 text-black drop-shadow-sm hover:ring-1 px-5 py-1 text-sm'>Remove Photo</button></div>
      {tagCount > 0 ? <p className='text-sm py-2'>Remove tags to delete image</p> : ''}
    </>

  )
}
