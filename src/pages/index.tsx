import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/layout'
import SeoTags from '../components/SeoTags'
import USToC from '../components/USToC'

import { gql } from '@apollo/client'
import { graphqlClient } from '../js/graphql/Client'
import { GetStaticProps } from 'next'
import { IndexResponseType } from '../js/types'

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
        <USToC areas={areas} />
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = gql`query UsaAreas( $filter: Filter) {
    areas(filter: $filter) {
      area_name
      metadata {
        lat
        lng
        area_id
        leaf
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
