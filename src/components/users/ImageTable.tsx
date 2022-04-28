import Imgix from 'react-imgix'
import { IMGIX_CONFIG } from '../../js/imgix/ImgixClient'
interface ImageTableProps {
  imageList: any[]
}
export default function ImageTable ({ imageList }: ImageTableProps): JSX.Element {
  if (imageList == null) return null
  return (
    <div className='flex justify-center flex-wrap'>
      {imageList.map(imageInfo => <UserImage key={imageInfo.fileId} imageInfo={imageInfo} />)}
    </div>
  )
}

interface UserImageProps {
  imageInfo: any
}
const UserImage = ({ imageInfo }: UserImageProps): JSX.Element => {
  const imgUrl = `${IMGIX_CONFIG.sourceURL}${imageInfo.origin_path as string}`
  return (
    <div className='block px-0 py-4 md:p-4'>
      <Imgix
        src={imgUrl}
        width={300}
        height={300}
        imgixParams={{
          fit: 'crop',
          ar: '1:1'
        }}
      />
    </div>
  )
}
