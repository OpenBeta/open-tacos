import { useState } from 'react'
import Link from 'next/link'
import clx from 'classnames'
import Card from '../ui/Card/Card'
import TagList from '../media/TagList'
import { MobileLoader } from '../../js/sirv/util'
import { MediaType, HybridMediaTag } from '../../js/types'
import { getUploadDateSummary } from '../../js/utils'
import { PostHeader } from './Post'
import { resolver as urlResolver } from '../media/Tag'

const MOBILE_IMAGE_MAX_WIDITH = 600

interface RecentImageCardProps {
  header?: JSX.Element
  imageInfo: MediaType
  tagList: HybridMediaTag[]
}
/**
 * Image card for the home page
 */
export const RecentImageCard = ({
  imageInfo,
  tagList
}: RecentImageCardProps): JSX.Element => {
  const [loaded, setLoaded] = useState(false)
  const { filename, meta } = imageInfo
  const { width, height } = meta
  const [firstUrl] = urlResolver(tagList[0])
  const imageRatio = width / height
  return (
    <Card
      header={<PostHeader username={tagList[0].uid} />}
      image={
        <Link href={firstUrl ?? '#'}>
          <a className='relative'>
            <img
              src={MobileLoader({
                src: filename,
                width: MOBILE_IMAGE_MAX_WIDITH
              })}
              width={MOBILE_IMAGE_MAX_WIDITH}
              height={MOBILE_IMAGE_MAX_WIDITH * imageRatio}
              sizes='100vw'
              onLoad={() => setLoaded(true)}
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
          </a>
        </Link>
      }
      body={
        <>
          <section className='flex flex-col gap-y-4 justify-between'>
            <TagList
              list={tagList}
              showActions={false}
              isAuthorized={false}
              isAuthenticated={false}
              imageInfo={imageInfo}
            />
            <span className='uppercase text-xs text-base-200'>
              {getUploadDateSummary(imageInfo.ctime)}
            </span>
          </section>
        </>
      }
    />
  )
}
