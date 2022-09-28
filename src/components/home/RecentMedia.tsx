import { Dictionary } from 'underscore'
import { MediaBaseTag, MediaType } from '../../js/types'
import Card from '../ui/Card/Card'
import { PostBody, PostHeader } from './Post'
import { ResponsiveImage2 } from '../media/slideshow/ResponsiveImage'
import { urlResolver } from '../../js/utils'
export interface RecentTagsProps {
  tags: Dictionary<MediaBaseTag[]>
  mediaList: MediaType[]
}

export default function RecentTags ({
  tags,
  mediaList
}: RecentTagsProps): JSX.Element {
  return (
    <>
      <div className='md:px-4 gap-4 columns-xs'>
        {mediaList?.map((image, index) => {
          const _tags = tags[image.filename]

          if (_tags?.[0].uid == null || _tags?.[0].destination == null) {
            return null
          }

          const destUrl = urlResolver(_tags[0].destType, _tags[0].destination)
          if (destUrl == null) return null

          const { filename, meta, mtime } = image
          return (
            <div
              key={`${filename}-${index}`}
              className='p-2 rounded-md overflow-hidden mt-0 mb-4 break-inside-avoid-column break-inside-avoid relative block'
              onClick={(e) => e.preventDefault()}
            >
              <Card
                image={
                  <ResponsiveImage2
                    mediaUrl={filename}
                    naturalWidth={meta.width}
                    naturalHeight={meta.height}
                    isHero={index < 2}
                  />
                }
                header={<PostHeader username={_tags[0].uid} />}
                body={
                  <PostBody destUrl={destUrl} mtime={mtime} title='Route' />
                }
              />
            </div>
          )
        })}
      </div>
      <div className='my-6 w-full text-xs text-secondary text-center'>
        All photos are copyrighted by their respective owners. All Rights
        Reserved.
      </div>
    </>
  )
}
