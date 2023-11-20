import { useState } from 'react'
import Image from 'next/image'
import clx from 'classnames'
import Card from '../ui/Card/Card'
import TagList from '../media/TagList'
import { MobileLoader } from '../../js/sirv/util'
import { MediaWithTags } from '../../js/types'
import { getUploadDateSummary } from '../../js/utils'
import { PostHeader } from '../home/Post'

const MOBILE_IMAGE_MAX_WIDITH = 600

interface GalleryImageCardProps {
  header?: JSX.Element
  mediaWithTags: MediaWithTags
  onImageClick?: (event: React.MouseEvent<HTMLImageElement>, mediaWithTags: MediaWithTags) => void
}

/**
 * Image card for the gallery page
 */
export const GalleryImageCard = ({
  mediaWithTags,
  onImageClick
}: GalleryImageCardProps): JSX.Element => {
  const [loaded, setLoaded] = useState(false)
  const { mediaUrl, width, height, username } = mediaWithTags
  const imageRatio = width / height
  return (
    <Card
      header={<PostHeader username={username} />}
      image={
        <div className='relative block w-full h-full'>
          <Image
            src={MobileLoader({
              src: mediaUrl,
              width: MOBILE_IMAGE_MAX_WIDITH
            })}
            width={MOBILE_IMAGE_MAX_WIDITH}
            height={MOBILE_IMAGE_MAX_WIDITH / imageRatio}
            sizes='100vw'
            objectFit='cover'
            onLoad={() => setLoaded(true)}
            className='rounded-md'
            onClick={(event) => {
              if (onImageClick != null) {
                console.log('onImageClick')
                event.stopPropagation()
                event.preventDefault()
                onImageClick(event, mediaWithTags)
              }
            }}
          />
          <div
            className={clx(
              'absolute top-0 left-0 w-full h-full',
              loaded
                ? 'bg-transparent'
                : 'bg-gray-50 bg-opacity-60 border animate-pulse'
            )}
          >
            {loaded}
          </div>
        </div>
      }
      body={
        <>
          <section className='flex flex-col gap-y-4 justify-between px-2'>
            <TagList
              mediaWithTags={mediaWithTags}
              showActions={false}
              isAuthorized={false}
              isAuthenticated={false}
            />
            <span className='uppercase text-xs text-base-200'>
              {getUploadDateSummary(mediaWithTags.uploadTime)}
            </span>
          </section>
        </>
      }
    />
  )
}
