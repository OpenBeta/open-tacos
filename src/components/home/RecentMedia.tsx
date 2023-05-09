import { MediaWithTags } from '../../js/types'
import { RecentImageCard } from './RecentMediaCard'

export interface RecentTagsProps {
  recentMediaWithTags: MediaWithTags[]
}

export default function RecentTags ({
  recentMediaWithTags
}: RecentTagsProps): JSX.Element {
  return (
    <>
      <div className='sm:px-6 gap-6 columns-xs'>
        {
          recentMediaWithTags.map(media => {
            const { mediaUrl } = media
            return (
              <div
                key={mediaUrl} className='p-0 overflow-hidden mt-0 mb-4 break-inside-avoid-column break-inside-avoid relative block'
              >
                <RecentImageCard mediaWithTags={media} />
              </div>
            )
          }
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
