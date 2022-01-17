import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/layout'
import SeoTags from '../components/SeoTags'

import { gql } from '@apollo/client'
import { graphqlClient } from '../js/graphql/Client'
import { GetStaticProps } from 'next'
import { IndexResponseType } from '../js/types'
import FeatureCard from '../components/ui/FeatureCard'

const Home: NextPage<IndexResponseType> = ({ areas, area }) => {
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

      <Layout layoutClz='layout-wide'>
        <h1 className='mt-12'>Explore</h1>
        <div className='grid grid-cols-1 md:grid-cols-3 md:gap-x-3 gap-y-3'>
          {areas.map(area => <FeatureCard key={area.metadata.area_id} area={area} />)}
        </div>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = gql`query UsaAreas( $filter: Filter) {
    areas(filter: $filter) {
      area_name
      pathTokens
      totalClimbs
      aggregate {
        byType {
          label
          count
        }
        byGrade {
          label
          count
        }
      }
      metadata {
        lat
        lng
        area_id
        
      }
    }
  }`

  const rs = await graphqlClient.query<IndexResponseType>({
    query,
    variables: {
      filter: {
        field_compare: [{
          field: 'totalClimbs',
          num: 200,
          comparison: 'gt'
        }, {
          field: 'density',
          num: 0.03,
          comparison: 'gt'
        }]
      }
    }
  })

  // Pass post data to the page via props
  return { props: rs.data }
}

export default Home
