import { Dictionary } from 'underscore'
import { HybridMediaTag } from '../../js/types'
import { RecentImageCard } from './RecentMediaCard'

export interface RecentTagsProps {
  tags: Dictionary<HybridMediaTag[]>
}

export default function RecentTags ({
  tags: allTags
}: RecentTagsProps): JSX.Element {
  return (
    <>
      <div className='sm:px-6 gap-6 columns-xs'>
        {
          Object.entries(allTags).map(([key, tags]) => (
            <div
              key={key} className='p-0 overflow-hidden mt-0 mb-4 break-inside-avoid-column break-inside-avoid relative block'
              onClick={(e) => e.preventDefault()}
            >
              <RecentImageCard
                key={key}
                tagList={tags}
              />
            </div>
          )

          )
        }
      </div>
      <div className='my-6 w-full text-xs text-secondary text-center'>
        All photos are copyrighted by their respective owners. All Rights
        Reserved.
      </div>
    </>
  )
}
