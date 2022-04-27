import { IKImage, IKContext } from 'imagekitio-react'
import type { ListFileResponse } from 'imagekit/libs/interfaces'

interface ImageTableProps {
  imageList: ListFileResponse[]
}
export default function ImageTable ({ imageList }: ImageTableProps): JSX.Element {
  if (imageList == null) return null
  return (
    <div className='flex justify-center flex-wrap'>
      <IKContext
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL}
      >
        {imageList.map(imageInfo => <UserImage key={imageInfo.fileId} imageInfo={imageInfo} />)}
      </IKContext>
    </div>
  )
}

interface UserImageProps {
  imageInfo: ListFileResponse
}
const UserImage = ({ imageInfo }: UserImageProps): JSX.Element => {
  return (
    <div className='block px-0 py-4 md:p-4'>
      <IKImage
        path={imageInfo.filePath}
        transformation={[{
          height: '300',
          width: '300'
        }]}
        loading='lazy'
      />
    </div>
  )
}
