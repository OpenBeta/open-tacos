import { useState, useEffect } from 'react'
import type { NextPage, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import * as Tabs from '@radix-ui/react-tabs'
import { gql } from '@apollo/client'
import { groupBy, Dictionary } from 'underscore'
import { TagIcon, LightBulbIcon, LocationMarkerIcon, PencilIcon, CurrencyDollarIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import Link from 'next/link'

import Layout from '../components/layout'
import SeoTags from '../components/SeoTags'
import { graphqlClient, openCollectiveClient } from '../js/graphql/Client'
import { getRecentMedia } from '../js/graphql/api'
import { IndexResponseType, MediaBaseTag, MediaType, FinancialBackerAccountType, FinancialBackersResponseType } from '../js/types'
import useCanary from '../js/hooks/useCanary'
import { ExploreProps } from '../components/home/DenseAreas'
import TabsTrigger from '../components/ui/TabsTrigger'
import { RecentTagsProps } from '../components/home/RecentMedia'
import { enhanceMediaListWithUsernames } from '../js/usernameUtil'
import { getImagesByFilenames } from '../js/sirv/SirvClient'
import FinancialBackers from '../components/home/FinancialBackers'

const allowedViews = ['explore', 'newTags', 'map', 'edit', 'backers']

interface HomePageType {
  exploreData: IndexResponseType
  tagsByMedia: Dictionary<MediaBaseTag[]>
  mediaList: MediaType[]
  donors: FinancialBackerAccountType[]
  totalRaised: string
}

const Home: NextPage<HomePageType> = ({ exploreData, tagsByMedia, mediaList, donors, totalRaised }) => {
  const canaryOn = useCanary()
  const router = useRouter()
  const [activeTab, setTab] = useState<string>('')
  const { areas } = exploreData

  useEffect(() => {
    if (activeTab !== '' && allowedViews.includes(activeTab)) {
      if (activeTab === 'edit') {
        if (canaryOn) void router.replace('/contribs')
      }
      const query = router.query
      query.v = activeTab
      const queryString = Object.keys(query).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(query[key] as string)
      }).join('&')

      void router.push(`/?${queryString}`, undefined, { shallow: true })
    }
  }, [activeTab, canaryOn])

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
                  'z-10 mb-6 mx-4 flex gap-x-4 px-4 py-1',
                  activeTab === 'map'
                    ? 'bg-white ring-2 ring-gray-600 ring-offset-4 rounded'
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
                icon={<LocationMarkerIcon className='w-6 h-6' />}
                label='Map'
              />
              <TabsTrigger
                tabKey='backers'
                activeKey={activeTab}
                icon={<CurrencyDollarIcon className='w-6 h-6' />}
                label='Backers'
              />
            </Tabs.List>
            <Tabs.Content value='edit' className='h-60'>
              <div className='alert shadow-lg'><b>Sorry this feature is not yet available.</b><span>Activate pre-released features?<Link href='/?next=true'><a><button className='btn btn-primary btn-sm'>Activate</button></a></Link></span></div>
            </Tabs.Content>
            <Tabs.Content value='explore' className='w-full'>
              <DynamicDenseAreas areas={areas} />
            </Tabs.Content>
            <Tabs.Content value='newTags' className='w-full'>
              <DynamicRecentTags tags={tagsByMedia} mediaList={mediaList} />
            </Tabs.Content>
            <Tabs.Content value='map' className='z-0 h-full'>
              <DynamicMap />
            </Tabs.Content>
            <Tabs.Content value='backers' className='z-0 h-full'>
              <FinancialBackers donors={donors} totalRaised={totalRaised} />
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
  console.log('#getRecentMedia() ', recentMediaList.length)

  const allTags = recentMediaList?.flatMap(entry => entry.tagList.slice(0, 10)) ?? []

  const tagsWithUsernames = await enhanceMediaListWithUsernames(allTags)
  console.log('#enhanceMediaList()', tagsWithUsernames.length)

  const tagsByMedia = groupBy(tagsWithUsernames, 'mediaUrl')

  const list = await getImagesByFilenames(Object.keys(tagsByMedia).slice(0, 30))
  console.log('#getImagesByFilenames() ', Object.keys(tagsByMedia).length)

  const openCollectiveQuery = gql`query account($slug: String) {
    account(slug: $slug) {
      members(role: BACKER) {
        nodes {
          account {
            name
            imageUrl
          }
        }
      }
      stats {
        totalNetAmountReceived {
          value
          currency
        }
      }
    }
  }
  `
  const ocResponse = await openCollectiveClient.query<FinancialBackersResponseType>({
    query: openCollectiveQuery,
    variables: {
      slug: 'openbeta'
    }
  })

  const donors = ocResponse.data.account.members.nodes
  const totalRaised = ocResponse.data.account.stats.totalNetAmountReceived.value.toString()

  return {
    props: {
      exploreData: rs.data,
      tagsByMedia,
      mediaList: list.mediaList,
      donors,
      totalRaised
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
