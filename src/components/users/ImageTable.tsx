import { useCallback, useState } from 'react'
import Imgix from 'react-imgix'
import { useQuery } from '@apollo/client'
import { v5 as uuidv5 } from 'uuid'

import { IMGIX_CONFIG } from '../../js/imgix/ImgixClient'
import ImageTagger from '../media/ImageTagger'
import useImageTagHelper from '../media/useImageTagHelper'
import TagList from '../media/TagList'
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
    // Todo: call revalidate api
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
  const [hovered, setHover] = useState(false)
  const imgUrl = `${IMGIX_CONFIG.sourceURL}${imageInfo.origin_path as string}`

  const onClickHandler = useCallback((event) => {
    onClick({ mouseXY: [event.clientX, event.clientY], imageInfo })
  }, [])

  const { loading, data, refetch, called } = useQuery(QUERY_TAGS_BY_MEDIA_ID, {
    client: graphqlClient,
    variables: {
      uuidList: [uuidv5(imageInfo.origin_path, uuidv5.URL)]
    }
  })

  const onDeletedHandler = useCallback(async () => {
    if (!loading) await refetch()
  }, [])

  return (
    <div className='cursor-pointer block mx-0 my-4 md:m-4 relative' onClick={onClickHandler} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Imgix
        src={imgUrl}
        width={300}
        height={300}
        imgixParams={{
          fit: 'crop',
          ar: '1:1'
        }}
      />
      {called && data?.getTagsByMediaIdList != null && data?.getTagsByMediaIdList.length > 0 &&
        <div className='absolute inset-0 flex flex-col justify-end'>
          <TagList hovered={hovered} list={data?.getTagsByMediaIdList} onDeleted={onDeletedHandler} />
        </div>}
    </div>
  )
}
