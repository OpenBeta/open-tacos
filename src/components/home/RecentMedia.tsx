import { useState } from 'react'
import Link from 'next/link'
import { Dictionary } from 'underscore'

import PhotoFooter, { urlResolver } from '../media/PhotoFooter'
import { MediaBaseTag, MediaType } from '../../js/types'
import { ResponsiveImage2 } from '../media/slideshow/ResponsiveImage'
export interface RecentTagsProps {
  tags: Dictionary<MediaBaseTag[]>
  mediaList: MediaType[]
}

export default function RecentTags ({ tags, mediaList }: RecentTagsProps): JSX.Element {
  const [hover, setHover] = useState<boolean>(false)
  return (
    <>
      <div className='md:px-4 gap-4 columns-xs'>
        {mediaList?.map((image, index) => {
          const _tags = tags[image.filename]
          if (_tags?.[0].uid == null || _tags?.[0].destination == null) return null
          const destUrl = urlResolver(_tags[0].destType, _tags[0].destination)
          if (destUrl == null) return null

          const { filename, meta } = image
          return (
            <div
              key={`${filename}-${index}`}
              className='hover:brightness-75 rounded-md overflow-hidden mt-0 mb-4 break-inside-avoid-column break-inside-avoid relative block'
              onClick={(e) => e.preventDefault()}
              onMouseOver={() => setHover(true)}
              onMouseOut={() => setHover(false)}
            >
              <Link href={destUrl}>
                <a className='block relative w-full h-full'>
                  <ResponsiveImage2 mediaUrl={filename} naturalWidth={meta.width} naturalHeight={meta.height} isHero={index < 2} />
                </a>
              </Link>
              <PhotoFooter
                username={_tags[0].uid}
                destType={_tags[0].destType}
                destination={_tags[0].destination}
                hover={hover}
              />
            </div>
          )
        })}
      </div>
      <div className='my-6 w-full text-xs text-secondary text-center'>
        All photos are copyrighted by their respective owners.  All Rights Reserved.
      </div>
    </>
  )
}
