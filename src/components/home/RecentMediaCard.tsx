'use client'
import { useState } from 'react'
import Image from 'next/image'
import clx from 'classnames'
import Card from '../ui/Card/Card'
import TagList from '../media/TagList'
import { MobileLoader } from '../../js/sirv/util'
import { MediaWithTags } from '../../js/types'
import { getUploadDateSummary } from '../../js/utils'
import { PostHeader } from './Post'
import { resolver as urlResolver } from '../media/Tag'
import { ATagWrapper } from '../Utils'

const MOBILE_IMAGE_MAX_WIDITH = 600

interface RecentImageCardProps {
  header?: JSX.Element
  mediaWithTags: MediaWithTags
  bordered?: boolean
}

/**
 * Image card for the home page
 */
export const RecentImageCard = ({
  mediaWithTags,
  bordered = false
}: RecentImageCardProps): JSX.Element => {
  const [loaded, setLoaded] = useState(false)
  const { mediaUrl, width, height, entityTags, username } = mediaWithTags
  const [firstUrl] = urlResolver(entityTags[0])
  const imageRatio = width / height
  return (
    <Card
      bordered={bordered}
      header={<PostHeader username={username} />}
      image={
        <div className='relative block w-full h-full'>
          <ATagWrapper href={firstUrl}>
            <Image
              src={MobileLoader({
                src: mediaUrl,
                width: MOBILE_IMAGE_MAX_WIDITH
              })}
              width={MOBILE_IMAGE_MAX_WIDITH}
              height={MOBILE_IMAGE_MAX_WIDITH / imageRatio}
              sizes={`${MOBILE_IMAGE_MAX_WIDITH}px`}
              onLoad={() => setLoaded(true)}
              alt=''
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
          </ATagWrapper>
        </div>
      }
      body={
        <>
          <section className='flex flex-col gap-y-4 justify-between'>
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
