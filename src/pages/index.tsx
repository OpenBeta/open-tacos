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
        <USToC areas={area.children} />
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = gql`query UsaAreas( $uuid: String) {
    area(uuid: $uuid) {
      area_name
      metadata {
        lat
        lng
        area_id
        leaf
      }
      children {
        area_name
        metadata {
          lat
          lng
          area_id
          leaf
        }
      }
    }
  }`

  const rs = await graphqlClient.query<IndexResponseType>({
    query,
    variables: {
      uuid: 'd5599113-a4cb-4a68-b588-bd2c1185d131'
    }
  })

  // Pass post data to the page via props
  return { props: rs.data }
}

export default Home
