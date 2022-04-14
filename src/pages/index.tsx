import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/layout'
import SeoTags from '../components/SeoTags'
import { StatsPanelProps } from '../components/ui/StatsPanel'

import { gql } from '@apollo/client'
import { graphqlClient } from '../js/graphql/Client'
import { GetStaticProps } from 'next'
import { IndexResponseType } from '../js/types'
import FeatureCard from '../components/ui/FeatureCard'
import HomeHero from '../components/HomeHero'
import CTAEmailSignup from '../components/CTAEmailSignup'

interface HomePageType {
  exploreData: IndexResponseType
  stats: StatsPanelProps
}
const Home: NextPage<HomePageType> = ({ exploreData, stats }) => {
  const { areas } = exploreData
  return (
    <>
      <Head>
        <title>Climbing Route Catalog</title>
        <meta name='description' content='Open license climbing route catalog' />
        <link rel='icon' href='/favicon.ico' />
        <SeoTags
          keywords={['openbeta', 'rock climbing', 'climbing api']}
          description='Climbing route catalog'
          title='Home'
        />
      </Head>

      <Layout
        contentContainerClass='content-2xl-center'
        hero={<HomeHero statsProps={stats} />}
      >
        <section>
          <h2 className='mb-4 text-3xl h-padding-wide'>Explore</h2>
          <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 lg:gap-x-3 gap-y-3'>
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
      area_name
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
