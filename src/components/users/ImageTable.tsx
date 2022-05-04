import { useCallback, useEffect } from 'react'
import Imgix from 'react-imgix'
import { useQuery } from '@apollo/client'
import { v5 as uuidv5 } from 'uuid'

import { IMGIX_CONFIG } from '../../js/imgix/ImgixClient'
import ImageTagger from '../media/ImageTagger'
import useImageTagHelper from '../media/useImageTagHelper'
import { QUERY_TAGS_BY_MEDIA_ID } from '../../js/graphql/fragments'
import { graphqlClient } from '../../js/graphql/Client'

interface ImageTableProps {
  imageList: any[]
}
export default function ImageTable ({ imageList }: ImageTableProps): JSX.Element {
  const imageHelper = useImageTagHelper()
  const { onClick } = imageHelper
  if (imageList == null) return null

  const onCompletedHandler = useCallback((data: any) => {
    console.log('#Tagging completed', data)
    // Todo: call revalidate
  }, [])
  return (
    <>
      <div className='flex justify-center flex-wrap'>
        {imageList.map(imageInfo =>
          <UserImage
            key={imageInfo.origin_path} imageInfo={imageInfo} onClick={onClick}
          />)}
      </div>
      <ImageTagger
        {...imageHelper} onCompleted={onCompletedHandler}
      />
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

  const { loading, error, data, refetch, called } = useQuery(QUERY_TAGS_BY_MEDIA_ID, {
    client: graphqlClient,
    variables: {
      mediaUuid: uuidv5(imageInfo.origin_path, uuidv5.URL)
    }
  })

  if (called) {
    console.log('#tagging', data)
  }

  // useEffect(() => {
  //   const f = getTagsByMediaId(uuidv5(imageInfo.origin_path, uuidv5.URL)

  // })

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
      <div>
        {called && data?.getTagsByMediaId != null && <div> {data?.getTagsByMediaId.mediaUuid}</div>}
      </div>
    </div>
  )
}
