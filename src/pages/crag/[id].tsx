import { GetStaticProps } from 'next'
import { gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import { AreaType } from '../../js/types'
import CragLayout from '../../components/crag/cragLayout'

interface CragProps {
  area: AreaType
}

const Crag = ({ area }: CragProps): JSX.Element => {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  const { areaName, climbs, metadata, content, ancestors, pathTokens } = area

  return (
    <Layout contentContainerClass='content-default with-standard-y-margin'>
      <SeoTags
        keywords={[areaName]}
        title={areaName}
        description='description'
      />
      <div className='px-4'>
        <BreadCrumbs ancestors={ancestors} pathTokens={pathTokens} />
        <div className='py-32 lg:px-32 md:px-16'>

          <CragLayout
            title={areaName}
            description={content.description}
            latitude={metadata.lng}
            longitude={metadata.lat}
            climbs={climbs}
            areaMeta={metadata}
          />
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticPaths (): Promise<any> {
  // Temporarily disable pre-rendering
  // https://github.com/OpenBeta/openbeta-graphql/issues/26
  // const rs = await graphqlClient.query<AreaResponseType>({
  //   query: gql`query EdgeAreasQuery($filter: Filter) {
  //   areas(filter: $filter) {
  //     area_name
  //     metadata {
  //       area_id
  //     }
  //   }
  // }`,
  //   variables: {
  //     filter: { leaf_status: { isLeaf: true } }
  //   }
  // })

  // const paths = rs.data.areas.map((area: AreaType) => ({
  //   params: { id: area.metadata.area_id }
  // }))

  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = gql`query AreaByID($uuid: ID) {
    area(uuid: $uuid) {
      id
      uuid
      areaName
      metadata {
        areaId
        lat
        lng 
        left_right_index
      }
      pathTokens
      
      ancestors
      climbs {
        id
        name
        fa
        yds
        safety
        type {
          trad
          tr
          sport
          mixed
          bouldering
          alpine
          aid
        }
        metadata {
          climbId
        }
      }
      content {
        description 
      } 
    }
  }`

  const rs = await graphqlClient.query<AreaType>({
    query,
    variables: {
      uuid: params.id
    }
  })

  if (rs.data === null) throw new Error('Area not found')

  // Pass post data to the page via props
  return { props: rs.data }
}

export default Crag
