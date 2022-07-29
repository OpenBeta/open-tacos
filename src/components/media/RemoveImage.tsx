import { actions } from '../../js/stores'
import { removePhoto } from '../../js/userApi/media'
import { MediaType } from '../../js/types'

interface RemoveImageProps {
  imageInfo: MediaType
  tagCount: Number
}

export default function RemoveImage ({ imageInfo, tagCount }: RemoveImageProps): JSX.Element | null {
  const onRemove = async (e): Promise<void> => {
    const filename: string = imageInfo.filename
    e.preventDefault()
    console.log(imageInfo)
    console.log(tagCount)
    await removePhoto(filename)
    //   const photo = await remove(imageInfo.filename) // direct to Sirv
    //   console.log(photo)
    await actions.media.removeImage(imageInfo.mediaId)
  }

  return (

    <>
      {tagCount > 0 ? <span>Remove tags to delete image</span> : <button onClick={onRemove}>Delete Image</button>}
    </>

  )
}
