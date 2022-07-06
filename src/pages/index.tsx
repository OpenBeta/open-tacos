import { useState } from 'react'
import type { NextPage, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import * as Tabs from '@radix-ui/react-tabs'
import { gql } from '@apollo/client'
import { groupBy, Dictionary } from 'underscore'
import { TagIcon, LightBulbIcon, LocationMarkerIcon } from '@heroicons/react/outline'

import Layout from '../components/layout'
import SeoTags from '../components/SeoTags'
import { graphqlClient } from '../js/graphql/Client'
import { getRecentMedia } from '../js/graphql/api'
import { IndexResponseType, MediaBaseTag, MediaType } from '../js/types'
import useCanary from '../js/hooks/useCanary'
import { ExploreProps } from '../components/home/DenseAreas'
import TabsTrigger from '../components/ui/TabsTrigger'
import { RecentTagsProps } from '../components/home/RecentMedia'
import { enhanceMediaListWithUsernames } from '../js/usernameUtil'
import { getImagesByFilenames } from '../js/sirv/SirvClient'

interface HomePageType {
  exploreData: IndexResponseType
  tagsByMedia: Dictionary<MediaBaseTag[]>
  mediaList: MediaType[]
}
const Home: NextPage<HomePageType> = ({ exploreData, tagsByMedia, mediaList }) => {
  useCanary()
  const [activeTab, setTab] = useState<string>('newTags')
  const { areas } = exploreData
  return (
    <>
      <SeoTags
        title='The open source rock climbing wiki'
        description='Share your climbing adventure photos and contribute to the climbing route wiki.'
      />
      <Layout
        contentContainerClass='content-default'
        showFilterBar={false}
      >
        <section className='mt-6 xl:mt-20 relative bg-white'>
          <Tabs.Root className='z-0 flex flex-col items-center justify-center' defaultValue='explore' value={activeTab} onValueChange={setTab}>
            <Tabs.List aria-label='tabs explore' className='block z-10 mb-6 mx-4 gap-x-4 relative px-4 bg-white'>
              <TabsTrigger tabKey='explore' activeKey={activeTab}>
                <div className='flex flex-col justify-center items-center no-underline'>
                  <div><LightBulbIcon className='w-6 h-6' /></div>
                  <div className='no-underline my-2 text-xs font-semibold'>Popular</div>
                </div>
              </TabsTrigger>
              <TabsTrigger tabKey='newTags' activeKey={activeTab}>
                <div className='flex flex-col justify-center items-center'>
                  <div><TagIcon className='w-6 h-6' /></div>
                  <div className=' no-underline my-2  text-xs font-semibold'>New tags</div>
                </div>
              </TabsTrigger>
              <TabsTrigger tabKey='map' activeKey={activeTab}>
                <div className='flex flex-col justify-center items-center'>
                  <div><LocationMarkerIcon className='w-6 h-6' /></div>
                  <div className=' no-underline my-2  text-xs font-semibold'>Map</div>
                </div>
              </TabsTrigger>
            </Tabs.List>
            <Tabs.Content value='explore' className='w-full'>
              <DynamicDenseAreas areas={areas} />
            </Tabs.Content>
            <Tabs.Content value='newTags' className='w-full'>
              <DynamicRecentTags tags={tagsByMedia} mediaList={mediaList} />
            </Tabs.Content>
            <Tabs.Content value='map' className='z-0 w-full'>
              <DynamicMap />
            </Tabs.Content>
          </Tabs.Root>
        </section>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = gql`query UsaAreas( $filter: Filter) {
    areas(filter: $filter, sort: { totalClimbs: -1 }) {
      id
      uuid
      areaName
      pathTokens
      totalClimbs
      density
      aggregate {
        byDiscipline {
            sport {
              total
            }
            trad {
              total
            }
            boulder {
              total
            }
            tr {
              total
            }
            alpine {
              total
            }
            mixed {
              total
            }
            aid {
              total
            }
          }
      }
      metadata {
        lat
        lng
        areaId
      }
      media {
        mediaUrl
        mediaUuid
      }
    }
  }`

  const rs = await graphqlClient.query<IndexResponseType>({
    query,
    variables: {
      filter: {
        field_compare: [{
          field: 'totalClimbs',
          num: 400,
          comparison: 'gt'
        }, {
          field: 'density',
          num: 0.5,
          comparison: 'gt'
        }]
      }
    }
  })

  const recentMediaList = await getRecentMedia()

  const allTags = recentMediaList?.flatMap(entry => entry.tagList.slice(0, 10))
  const tagsWithUsernames = await enhanceMediaListWithUsernames(allTags)
  const tagsByMedia = groupBy(tagsWithUsernames, 'mediaUrl')
  const list = await getImagesByFilenames(Object.keys(tagsByMedia))
  return {
    props: {
      exploreData: rs.data,
      tagsByMedia,
      mediaList: list.mediaList
    },
    revalidate: 1800
  }
}
export default Home

const DynamicRecentTags = dynamic<RecentTagsProps>(
  async () =>
    await import('../components/home/RecentMedia').then(
      module => module.default), { ssr: false }
)

const DynamicDenseAreas = dynamic<ExploreProps>(
  async () =>
    await import('../components/home/DenseAreas').then(
      module => module.default), { ssr: false }
)

const DynamicMap = dynamic(
  async () =>
    await import('../components/home/Map').then(
      module => module.default), { ssr: false }
)
