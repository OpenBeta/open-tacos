import Imgix from 'react-imgix'
import { useMutation } from '@apollo/client'

import { graphqlClient } from '../../js/graphql/Client'
import { TAG_CLIMB } from '../../js/graphql/fragments'
import { IMGIX_CONFIG } from '../../js/imgix/ImgixClient'

import ImageTagger from '../media/ImageTagger'
interface ImageTableProps {
  imageList: any[]
}
export default function ImageTable ({ imageList }: ImageTableProps): JSX.Element {
  if (imageList == null) return null
  return (
    <div className='flex justify-center flex-wrap'>
      {imageList.map(imageInfo => <UserImage key={imageInfo.origin_path} imageInfo={imageInfo} />)}
    </div>
  )
}

interface UserImageProps {
  imageInfo: any
}
const UserImage = ({ imageInfo }: UserImageProps): JSX.Element => {
  const [tagPhotoWithClimb, { data, loading, error }] = useMutation(TAG_CLIMB, { client: graphqlClient })

  const imgUrl = `${IMGIX_CONFIG.sourceURL}${imageInfo.origin_path as string}`
  console.log('#Photo object', imageInfo)

  const clickHandler = async (): Promise<void> => {
    await tagPhotoWithClimb({ variables: { mediaId: '4', mediaUrl: imgUrl, srcUuid: 'd8229afe-fc37-5126-8b11-85e96128723b' } })
  }
  return (
    <div className='block mx-0 my-4 md:m-4 relative' onClick={clickHandler}>
      <Imgix
        src={imgUrl}
        width={300}
        height={300}
        imgixParams={{
          fit: 'crop',
          ar: '1:1'
        }}
      />
      <ImageTagger />
    </div>
  )
}
