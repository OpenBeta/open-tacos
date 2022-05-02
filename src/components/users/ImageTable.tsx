import { useCallback } from 'react'
import Imgix from 'react-imgix'

import { IMGIX_CONFIG } from '../../js/imgix/ImgixClient'
import ImageTagger from '../media/ImageTagger'
import useImageTagHelper from '../media/useImageTagHelper'

interface ImageTableProps {
  imageList: any[]
}
export default function ImageTable ({ imageList }: ImageTableProps): JSX.Element {
  const imageHelper = useImageTagHelper()
  const { onClick } = imageHelper
  if (imageList == null) return null
  return (
    <>
      <div className='flex justify-center flex-wrap'>
        {imageList.map(imageInfo =>
          <UserImage
            key={imageInfo.origin_path} imageInfo={imageInfo} onClick={onClick}
          />)}
      </div>
      <ImageTagger {...imageHelper} />
    </>

  )
}

interface UserImageProps {
  imageInfo: any
  onClick: (props: any) => void
}
const UserImage = ({ imageInfo, onClick }: UserImageProps): JSX.Element => {
  const imgUrl = `${IMGIX_CONFIG.sourceURL}${imageInfo.origin_path as string}`
  const onClickHandler = useCallback((event) => {
    onClick({ mouseXY: [event.clientX, event.clientY], imageInfo })
  }, [])
  return (
    <div className='cursor-pointer block mx-0 my-4 md:m-4 relative' onClick={onClickHandler}>
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
