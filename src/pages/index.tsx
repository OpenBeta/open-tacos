import { useState } from 'react'
import type { NextPage, GetStaticProps } from 'next'
import * as Tabs from '@radix-ui/react-tabs'
import { gql } from '@apollo/client'

import Layout from '../components/layout'
import SeoTags from '../components/SeoTags'
import { graphqlClient } from '../js/graphql/Client'
import { getRecentMedia } from '../js/graphql/api'
import { IndexResponseType, MediaByAuthor } from '../js/types'
import useCanary from '../js/hooks/useCanary'
import DenseAreas from '../components/home/DenseAreas'
import TabsTrigger from '../components/ui/TabsTrigger'
import RecentMedia from '../components/home/RecentMedia'

interface HomePageType {
  exploreData: IndexResponseType
  recentMedia: MediaByAuthor[]
}
const Home: NextPage<HomePageType> = ({ exploreData, recentMedia }) => {
  useCanary()
  const [activeTab, setTab] = useState<string>('default')
  const { areas } = exploreData
  return (
    <>
      <SeoTags
        title='The open source rock climbing wiki'
        description='Share your climbing adventure photos and contribute to the climbing route wiki.'
      />
      <Layout
        contentContainerClass='content-default with-standard-y-margin'
      >
        <section className=''>
          <Tabs.Root defaultValue='default' value={activeTab} onValueChange={setTab} className=''>
            <Tabs.List aria-label='tabs explore' className='flex flex-row justify-center border-b border-gray-400 mb-4 mx-4'>
              <TabsTrigger tabKey='default' activeKey={activeTab}>
                Explore
              </TabsTrigger>
              <TabsTrigger tabKey='foo' activeKey={activeTab}>
                New Tags
              </TabsTrigger>
            </Tabs.List>
            <Tabs.Content value='default' className=''>
              <DenseAreas areas={areas} />
            </Tabs.Content>
            <Tabs.Content value='foo'>
              <RecentMedia list={recentMedia} />
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

  return { props: { exploreData: rs.data, recentMedia: await getRecentMedia() } }
}
export default Home
