import type { NextPage, GetStaticProps } from 'next'
import { gql } from '@apollo/client'

import Layout from '../components/layout'
import SeoTags from '../components/SeoTags'
import { graphqlClient } from '../js/graphql/Client'
import { IndexResponseType } from '../js/types'
import FeatureCard from '../components/ui/FeatureCard'
import useCanary from '../js/hooks/useCanary'

interface HomePageType {
  exploreData: IndexResponseType
}
const Home: NextPage<HomePageType> = ({ exploreData }) => {
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
      >
        <section>
          <h2 className='mb-4 text-3xl px-4'>Explore</h2>
          <div className='grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 lg:gap-x-3 gap-y-3'>
            {areas.map(area => <FeatureCard key={area.id} area={area} />)}
          </div>
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

  // query = gql`query Stats {
  //   stats {
  //       totalClimbs
  //       totalCrags
  //   }
  // }`
  // const rsStats = await graphqlClient.query<StatsPanelProps>({ query })
  // Pass post data to the page via props
  return { props: { exploreData: rs.data } }
}
export default Home
