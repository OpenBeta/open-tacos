import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { gql } from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'

interface AreaType {
  area_name: string
  content: {
    description: string
  }
  metadata: {
    area_id: string
  }
}
interface ResponseType {
  areas: AreaType[]
}
const Area = ({ area }): JSX.Element => {
  const router = useRouter()
  const { id } = router.query

  //   console.log('query ', router.query)

  return (<div><p>Area: {id}</p><p>{JSON.stringify(area, null, 2)}</p></div>)
}

// This function gets called at build time.
// Nextjs uses the result to decide which paths will get pre-rendered at build time
export async function getStaticPaths (): Promise<any> {
  console.log('getStaticPaths()')
  const rs = await graphqlClient.query<ResponseType>({
    query: gql`query LeafAreasQuery {
    areas(isLeaf: true) {
      metadata {
        area_id
      }
    }
  }`
  })

  // Get the paths we want to pre-render based on posts
  const paths = rs.data.areas.map((area: AreaType) => ({
    params: { id: area.metadata.area_id }
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: true } means render on first reques for those that are not in `paths`
  return {
    paths,
    fallback: true
  }
}

// This also gets called at build time
// Query graphql api for area by id
export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log('#Get Static Props', params)

  const query = gql`query AreaByUUID($uuid: String) {
        area(uuid: $uuid) {
          area_name
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
  console.log(rs.data)

  // Pass post data to the page via props
  return { props: { area: rs.data } }
}

export default Area
