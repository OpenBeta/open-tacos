import { GetStaticProps } from 'next'
import { gql } from '@apollo/client'
import { useRouter } from 'next/router'
import { AreaType } from '../../js/types'
import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import AreaList from '../../components/area/areaList'
import CragSummary from '../../components/crag/cragSummary'
import AreaMap from '../../components/area/areaMap'
import { useState } from 'react'
interface AreaPageProps {
  area: AreaType
}

function Area ({ area }: AreaPageProps): JSX.Element {
  const [focused, setFocused] = useState<string | null>(null)
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  const { areaName, children, metadata, content, pathTokens, ancestors } = area

  return (
    <Layout contentContainerClass='content-default with-standard-y-margin'>
      <SeoTags
        keywords={[areaName]}
        title={areaName}
        description={content.description}
      />
      <div className='px-4 max-w-screen-md'>
        <BreadCrumbs ancestors={ancestors} pathTokens={pathTokens} />
      </div>

      <div className='px-2 md:px-16 pt-16'>
        <CragSummary
          title={areaName}
          latitude={metadata.lat}
          longitude={metadata.lng}
          description={content.description}
        />
      </div>

      <div className='flex mt-16 mx-16' style={{ height: '600px' }}>
        <div className='flex-1 mx-4  border border-slate-500 rounded-xl p-1'>
          <div className='overflow-y-auto h-full'>
            <AreaList subAreas={children} onHover={setFocused} />
          </div>
        </div>

        <div className='mx-8' style={{ width: '700px' }}>
          <AreaMap focused={focused} subAreas={children} area={area} />
        </div>
      </div>

    </Layout>
  )
}

// This function gets called at build time.
// Nextjs uses the result to decide which paths will get pre-rendered at build time
export async function getStaticPaths (): Promise<any> {
  // Temporarily disable pre-rendering
  // https://github.com/OpenBeta/openbeta-graphql/issues/26
  // const rs = await graphqlClient.query<AreaResponseType>({
  //   query: gql`query EdgeAreasQuery($filter:Filter) {
  //   areas(filter: $filter) {
  //     area_name
  //     metadata {
  //       area_id
  //     }
  //   }
  // }`,
  //   variables: {
  //     filter: { leaf_status: { isLeaf: false } }
  //   }
  // })

  // // Get the paths we want to pre-render based on posts
  // const paths = rs.data.areas.map((area: AreaType) => ({
  //   params: { id: area.metadata.area_id }
  // }))

  // We'll pre-render only these paths at build time.
  // { fallback: true } means render on first reques for those that are not in `paths`
  return {
    paths: [],
    fallback: true
  }
}

// This also gets called at build time
// Query graphql api for area by id
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = gql`query getAreaById($uuid: ID) {
    area(uuid: $uuid) {
      id
      uuid
      areaName
      ancestors
      pathTokens
      metadata {
        lat
        lng 
        leaf
        bbox
        areaId
      } 
      content {
        description 
      } 
      children {
        id
        uuid
        areaName
        totalClimbs
        metadata {
          areaId
          leaf
          lat
          lng
        }
      }
    }
  }`

  try {
    const rs = await graphqlClient.query<AreaType>({
      query,
      variables: {
        uuid: params.id
      }
    })
    if (rs.data === null) throw new Error('Area not found')
    // Pass post data to the page via props
    return { props: rs.data }
  } catch (e) {
    console.log('GraphQL exception:', e)
    return {
      notFound: true
    }
  }
}

export default Area
