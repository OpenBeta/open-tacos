import { NextPage, GetStaticProps } from 'next'
import { gql } from '@apollo/client'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { AreaType } from '../../js/types'
import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import AreaCard from '../../components/ui/AreaCard'
import Icon from '../../components/Icon'
import BreadCrumbs from '../../components/ui/BreadCrumbs'

import { getSlug } from '../../js/utils'
import InlineEditor from '../../components/editor/InlineEditor'
interface AreaPageProps {
  area: AreaType
}

const Area: NextPage<AreaPageProps> = ({ area }) => {
  const router = useRouter()
  return (
    <Layout contentContainerClass='content-default with-standard-y-margin'>
      {router.isFallback
        ? (
          <div className='px-4 max-w-screen-md'>
            <div>Loading...</div>
          </div>
          )
        : <Body area={area} />}
    </Layout>
  )
}

export default Area

const Body = ({ area }: AreaPageProps): JSX.Element => {
  const { id, areaName, children, metadata, content, pathTokens, ancestors } = area
  return (
    <>
      <SeoTags
        keywords={[areaName]}
        title={areaName}
        description='description'
      />
      <div className='px-4 max-w-screen-md'>
        <BreadCrumbs ancestors={ancestors} pathTokens={pathTokens} />
        <h1 className='title'>{areaName}</h1>
        <span className='flex items-center flex-shrink text-gray-500 text-xs gap-x-1'>
          <Icon type='droppin' />
          <a
            className='hover:underline hover:text-gray-800'
                /* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */
            href={`https://www.openstreetmap.org/#map=13/${metadata.lat}/${metadata.lng}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            {metadata.lat},{metadata.lng}
          </a>
        </span>
        {content.description !== '' &&
          <>
            <div
              className='pt-4 markdown'
            >
              <h2>Description</h2>
              <InlineEditor id={`area-${id}`} markdown={content.description} readOnly />
            </div>
            <hr className='my-8' />
          </>}

        <h2>Subareas</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 md:gap-x-3 gap-y-3'>
          {children.map((child) => {
            const { areaName, metadata } = child
            const { areaId, leaf } = metadata
            return (
              <div className='max-h-96' key={areaId}>
                <Link href={getSlug(areaId, leaf)} passHref>
                  <a>
                    <AreaCard areaName={areaName} />
                  </a>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
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
    paths: [
      { params: { id: 'bea6bf11-de53-5046-a5b4-b89217b7e9bc' } },
      { params: { id: 'decc1251-4a67-52b9-b23f-3243e10e93d0' } },
      { params: { id: '78da26bc-cd94-5ac8-8e1c-815f7f30a28b' } }
    ],
    fallback: true
  }
}

// This also gets called at build time
// Query graphql api for area by id
export const getStaticProps: GetStaticProps<AreaPageProps, {id: string}> = async ({ params }) => {
  if (params == null || params.id == null) {
    return {
      notFound: true
    }
  }

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
    const rs = await graphqlClient.query<{area: AreaType}>({
      query,
      variables: {
        uuid: params.id
      }
    })
    if (rs.data.area == null) {
      return {
        notFound: true
      }
    }
    // Pass Area data to the page via props
    return {
      props: {
        area: rs.data.area
      }
    }
  } catch (e) {
    console.log('GraphQL exception:', e)
    return {
      notFound: true
    }
  }
}
