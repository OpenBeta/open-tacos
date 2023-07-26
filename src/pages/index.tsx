import { useState, useEffect } from 'react'
import type { NextPage, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import * as Tabs from '@radix-ui/react-tabs'
import { gql } from '@apollo/client'
import { TagIcon, LightBulbIcon, MapPinIcon, PencilIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

import Layout from '../components/layout'
import SeoTags from '../components/SeoTags'
import { graphqlClient } from '../js/graphql/Client'
import { getMediaForFeed } from '../js/graphql/api'
import { IndexResponseType, MediaWithTags } from '../js/types'
import { ExploreProps } from '../components/home/DenseAreas'
import TabsTrigger from '../components/ui/TabsTrigger'
import RecentTaggedMedia from '../components/home/RecentMedia'
import { FRAGMENT_MEDIA_WITH_TAGS } from '../js/graphql/gql/tags'

const allowedViews = ['explore', 'newTags', 'map', 'edit', 'pulse']
const testAreaIds = new Set((process.env.NEXT_PUBLIC_TEST_AREA_IDS ?? '').split(','))

interface HomePageType {
  exploreData: IndexResponseType
  recentMediaWithTags: MediaWithTags[]
}

const Home: NextPage<HomePageType> = ({ exploreData, recentMediaWithTags }) => {
  const router = useRouter()
  const [activeTab, setTab] = useState<string>('')
  const { areas } = exploreData

  useEffect(() => {
    if (activeTab !== '' && allowedViews.includes(activeTab)) {
      if (activeTab === 'edit') {
        void router.replace('/edit')
        return
      }
      if (activeTab === 'pulse') {
        void router.replace('/pulse')
        return
      }
      const query = router.query
      query.v = activeTab
      const queryString = Object.keys(query).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(query[key] as string)
      }).join('&')

      void router.push(`/?${queryString}`, undefined, { shallow: true })
    }
  }, [activeTab])

  useEffect(() => {
    if (router.isReady) {
      const urlViewParam = router.query.v
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
        title='OpenBeta'
        description='Share your climbing adventure photos and contribute to the climbing route catalog.'
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
                  'z-10 mb-3 sm:mb-6 mx-4 flex gap-x-1 sm:gap-x-4 px-2 sm:px-4 py-1 w-full sm:w-auto',
                  activeTab === 'map'
                    ? 'bg-white ring-2 ring-gray-600 ring-offset-4 rounded w-[96%] sm:w-auto px-0'
                    : '')
              }
            >
              <TabsTrigger
                tabKey='edit'
                activeKey={activeTab}
                icon={<PencilIcon className='w-6 h-6' />}
                label='Edit'
              />
              <TabsTrigger
                tabKey='newTags'
                activeKey={activeTab}
                icon={<TagIcon className='w-6 h-6' />}
                label='New tags'
              />
              <TabsTrigger
                tabKey='explore'
                activeKey={activeTab}
                icon={<LightBulbIcon className='w-6 h-6' />}
                label='Popular'
              />
              <TabsTrigger
                tabKey='map'
                activeKey={activeTab}
                icon={<MapPinIcon className='w-6 h-6' />}
                label='Map'
              />
              <TabsTrigger
                tabKey='pulse'
                activeKey={activeTab}
                icon={<ArrowTrendingUpIcon className='w-6 h-6' />}
                label='Pulse'
              />
            </Tabs.List>
            <Tabs.Content value='explore' className='w-full'>
              <DynamicDenseAreas areas={areas} />
            </Tabs.Content>
            <Tabs.Content value='newTags' className='w-full'>
              <RecentTaggedMedia recentMediaWithTags={recentMediaWithTags ?? []} />
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
  const query = gql`
  ${FRAGMENT_MEDIA_WITH_TAGS}
  query UsaAreas( $filter: Filter) {
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
         ... MediaWithTagsFields
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

  const recentTagsByUsers = await getMediaForFeed(20, 3)

  const areaTags = recentTagsByUsers.flatMap(entry => entry.mediaWithTags)
  const recentTags = areaTags.filter(tag => {
    return !tag.entityTags.some(entityTag =>
      testAreaIds.has(entityTag.targetId))
  })

  return {
    props: {
      exploreData: rs.data,
      recentMediaWithTags: recentTags
    },
    revalidate: 60
  }
}
export default Home

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
