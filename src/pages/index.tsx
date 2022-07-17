import { useState, useEffect } from 'react'
import type { NextPage, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import * as Tabs from '@radix-ui/react-tabs'
import { gql } from '@apollo/client'
import { groupBy, Dictionary } from 'underscore'
import { TagIcon, LightBulbIcon, LocationMarkerIcon } from '@heroicons/react/outline'
import classNames from 'classnames'

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
  const router = useRouter()
  const [activeTab, setTab] = useState<string>()
  const { areas } = exploreData

  useEffect(() => {
    if (typeof activeTab === 'string') {
      void router.push(`/?v=${activeTab}`, undefined, { shallow: true })
    }
  }, [activeTab])

  useEffect(() => {
    if (router.isReady) {
      const urlViewParam = router.query.v
      const allowedViews = ['explore', 'newTags', 'map']
      let tabToSet = 'newTags'
      if (typeof urlViewParam === 'string' && allowedViews.includes(urlViewParam)) {
        tabToSet = urlViewParam
      }
      setTab(tabToSet)
    }
  }, [router.isReady, router.query])

  return (
    <>
      <SeoTags
        title='The open source rock climbing wiki'
        description='Share your climbing adventure photos and contribute to the climbing route wiki.'
      />
      <Layout
        contentContainerClass='content-default'
        showFilterBar={false}
        showFooter={activeTab !== 'map'}
      >
        <section className='relative'>
          <Tabs.Root
            className='z-0 mt-4 xl:mt-6 flex flex-col items-center justify-center'
            defaultValue='explore'
            value={activeTab}
            onValueChange={setTab}
          >
            <Tabs.List
              aria-label='tabs explore'
              className={
                classNames(
                  'z-10 mb-6 mx-4 flex gap-x-4 px-4 py-1',
                  activeTab === 'map'
                    ? 'backdrop-blur-sm drop-shadow-md bg-gray-100 bg-opacity-60 ring-2 ring-gray-600 ring-offset-4 rounded'
                    : '')
              }
            >
              <TabsTrigger
                tabKey='explore'
                activeKey={activeTab}
                icon={<LightBulbIcon className='w-6 h-6' />}
                label='Popular'
              />
              <TabsTrigger
                tabKey='newTags'
                activeKey={activeTab}
                icon={<TagIcon className='w-6 h-6' />}
                label='New tags'
              />
              <TabsTrigger
                tabKey='map'
                activeKey={activeTab}
                icon={<LocationMarkerIcon className='w-6 h-6' />}
                label='Map'
              />
            </Tabs.List>
            <Tabs.Content value='explore' className='w-full'>
              <DynamicDenseAreas areas={areas} />
            </Tabs.Content>
            <Tabs.Content value='newTags' className='w-full'>
              <DynamicRecentTags tags={tagsByMedia} mediaList={mediaList} />
            </Tabs.Content>
            <Tabs.Content value='map' className='z-0 h-full'>
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
