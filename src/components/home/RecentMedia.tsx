import { useState } from 'react'
import Link from 'next/link'
import { Dictionary } from 'underscore'

import PhotoFooter, { urlResolver } from '../media/PhotoFooter'
import { MediaBaseTag } from '../../js/types'
import { ResponsiveImage2 } from '../media/slideshow/ResponsiveImage'
export interface RecentTagsProps {
  tags: Dictionary<MediaBaseTag[]>
}

export default function RecentTags ({ tags }: RecentTagsProps): JSX.Element {
  const [hover, setHover] = useState<boolean>(false)
  return (
    <>
      <div className='gap-4 columns-1 md:px-4 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-6'>
        {Object.entries(tags).map(([key, entry], index) => {
          if (entry[0].uid == null || entry[0].destination == null) return null
          const destUrl = urlResolver(entry[0].destType, entry[0].destination)
          if (destUrl == null) return null

          // const mediaUrl = MobileLoader({ src: key, width: 914 })
          return (
            <div
              key={`${key}-${index}`}
              className='hover:brightness-75 mb-4 rounded-md overflow-hidden h-full w-full'
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <Link href={destUrl}>
                <a className='block w-full h-full'>
                  {/* <img src={mediaUrl} /> */}
                  <ResponsiveImage2 mediaUrl={key} isHero={false} />
                </a>
              </Link>
              <PhotoFooter
                username={entry[0].uid}
                destType={entry[0].destType}
                destination={entry[0].destination}
                hover={hover}
              />
            </div>
          )
        })}
      </div>
      <div className='mt-6 pt-6 w-full  text-xs text-secondary text-center'>
        All photos are copyrighted by their respective owners.  All Rights Reserved.
      </div>
    </>
  )
}
