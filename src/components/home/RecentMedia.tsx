import { Dictionary } from 'underscore'
import { HybridMediaTag, MediaType } from '../../js/types'
import { RecentImageCard } from './RecentMediaCard'
export interface RecentTagsProps {
  tags: Dictionary<HybridMediaTag[]>
  mediaList: MediaType[]
}

export default function RecentTags ({
  tags: allTags,
  mediaList
}: RecentTagsProps): JSX.Element {
  return (
    <>
      <div className='sm:px-6 gap-6 columns-xs'>
        {mediaList?.map((media, index) => {
          const { filename } = media
          const tagList = allTags[filename] ?? []
          const key = `${media.mediaId}${index}`
          return (
            <div
              key={`${filename}`}
              className='p-0 overflow-hidden mt-0 mb-4 break-inside-avoid-column break-inside-avoid relative block'
              onClick={(e) => e.preventDefault()}
            >
              <RecentImageCard
                key={key}
                tagList={tagList}
                imageInfo={media}
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
