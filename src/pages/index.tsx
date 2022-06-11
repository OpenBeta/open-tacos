import type { NextPage, GetStaticProps } from 'next'
import { gql } from '@apollo/client'

import Layout from '../components/layout'
import SeoTags from '../components/SeoTags'
import { StatsPanelProps } from '../components/ui/StatsPanel'
import { graphqlClient } from '../js/graphql/Client'
import { IndexResponseType } from '../js/types'
import FeatureCard from '../components/ui/FeatureCard'
import HomeHero from '../components/HomeHero'
import CTAEmailSignup from '../components/CTAEmailSignup'
import useCanary from '../js/hooks/useCanary'

interface HomePageType {
  exploreData: IndexResponseType
  stats: StatsPanelProps
}
const Home: NextPage<HomePageType> = ({ exploreData, stats }) => {
  useCanary()
  const { areas } = exploreData
  return (
    <>
      <SeoTags
        title='The open source rock climbing wiki'
        description='Share your climbing adventure photos and contribute to the climbing route wiki.'
      />
      <Layout
        contentContainerClass='content-default with-standard-y-margin'
        hero={<HomeHero statsProps={stats} />}
      >
        <section>
          <h2 className='mb-4 text-3xl px-4'>Explore</h2>
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-x-3 gap-y-3'>
            {areas.map(area => <FeatureCard key={area.id} area={area} />)}
          </div>
        </section>
        <section>
          <h2 className='mt-16 mb-4 text-3xl h-padding-wide'>Follow our progress</h2>
          <div className='horizontal-center pb-8'>
            <CTAEmailSignup />
          </div>
        </section>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let query = gql`query UsaAreas( $filter: Filter) {
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

  query = gql`query Stats {
    stats {
        totalClimbs
        totalCrags
    }
  }`
  const rsStats = await graphqlClient.query<StatsPanelProps>({ query })
  // Pass post data to the page via props
  return { props: { exploreData: rs.data, ...rsStats.data } }
}
export default Home
