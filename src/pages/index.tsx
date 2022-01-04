import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/layout'
import SeoTags from '../components/SeoTags'
import USToC from '../components/USToC'

import { gql } from '@apollo/client'
import { graphqlClient } from '../js/graphql/Client'
import { GetStaticProps } from 'next'
import { AreaResponseType } from '../js/types'

const Home: NextPage<AreaResponseType> = ({ areas }) => {
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

      <Layout>
        <USToC areas={areas} />
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = gql`query UsaAreas($filter: Filter) {
    areas(filter: $filter) {
      area_name
      
      metadata {
       area_id
       leaf
      }
    }
  }`

  const rs = await graphqlClient.query<AreaResponseType>({
    query,
    variables: {
      filter: {
        path_tokens: { tokens: ['USA'], exactMatch: true }
      }
    }
  })

  // Pass post data to the page via props
  return { props: rs.data }
}

export default Home
