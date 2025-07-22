'use client'

import { useState } from 'react'
import Image from 'next/image'
import clx from 'classnames'
import MediaCard from '../../../components/ui/MediaCard'
import TagList from '../../../components/media/TagList'
import { MediaWithTags } from '../../../js/types'
import { getUploadDateSummary } from '../../../js/utils'
import { PostHeader } from './Post'
import { resolver as urlResolver } from '../../../components/media/Tag'
import { ATagWrapper } from '../../../components/Utils'

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
  const { mediaUrl, entityTags, username } = mediaWithTags
  const [firstUrl] = urlResolver(entityTags[0])

  return (
    <MediaCard
      bordered={bordered}
      header={<PostHeader username={username} />}
      image={
        <div className='relative w-full h-full'>
          <ATagWrapper href={firstUrl}>
            <Image
              src={mediaUrl}
              alt={`${entityTags[0]?.climbName ?? 'Climbing route'} photo by ${username ?? 'unknown user'}${
                (entityTags[0]?.areaName?.length ?? 0) > 0 ? ` at ${entityTags[0].areaName}` : ''
              }`}
              fill
              sizes='(max-width: 768px) 100vw, 600px'
              className='object-cover px-4'
              onLoad={() => setLoaded(true)}
            />
            <div
              className={clx(
                'absolute top-0 left-0 w-full h-full transition-colors duration-300',
                loaded
                  ? 'bg-transparent'
                  : 'bg-gray-50 bg-opacity-60 border animate-pulse'
              )}
            />
          </ATagWrapper>
        </div>
      }
      body={
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
      }
    />
  )
}
