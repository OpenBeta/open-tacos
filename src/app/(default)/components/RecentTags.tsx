import { RecentImageCard } from '@/components/home/RecentMediaCard'
import { SectionContainer } from './ui/SectionContainer'
import { getMediaForFeedSC } from '@/js/graphql/gql/serverApi'

/**
 * Horizontal gallery of recent images with tags
 */
export const RecentTags: React.FC = async () => {
  const recentTagsByUsers = await getMediaForFeedSC(20, 4)
  const testAreaIds = Array.from(new Set((process.env.NEXT_PUBLIC_TEST_AREA_IDS ?? '').split(',')))
  const mediaWithTags = recentTagsByUsers.flatMap(entry => entry.mediaWithTags)

  const recentMediaWithTags = mediaWithTags.filter(tag => {
    return tag.entityTags.some(entityTag => {
      return testAreaIds.every(testId => {
        const regex = new RegExp(testId, 'g')
        return !regex.test(entityTag.ancestors)
      })
    })
  })

  return (

    <SectionContainer header={<h2>Latest Photos</h2>}>
      <div className='overflow-hidden bg-base-200/20'>
        <div className='py-8 grid grid-flow-col auto-cols-max gap-x-4 overflow-x-auto'>
          {
            recentMediaWithTags.map(media => {
              const { mediaUrl } = media
              return (
                <div
                  key={mediaUrl} className='w-64 first:pl-6 2xl:first:ml-16 last:mr-16'
                >
                  <RecentImageCard mediaWithTags={media} bordered />
                </div>
              )
            }
            )
              }
        </div>
      </div>
    </SectionContainer>
  )
}
