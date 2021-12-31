import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { gql } from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'
import Link from 'next/link'
import Layout from '../../components/layout'
import SeoTags from '../../components/SeoTags'
import { templateH1Css } from '../../js/styles'

import EditButton from '../../components/ui/EditButton'
import Cta from '../../components/ui/Cta'
import AreaCard from '../../components/ui/AreaCard'
import Icon from '../../components/Icon'
interface AreaMetadataType {
  isLeaf: boolean
  lat: number
  lng: number
  left_right_index: number
  mp_id: string
  area_id: string
}

interface AreaType {
  area_name: string
  content: {
    description: string
  }
  metadata: AreaMetadataType
  children: {
    area_name: string
    metadata: {
      area_id: string
    }
  }
}

interface ResponseType {
  areas: AreaType[]
}

const Area = ({ area }): JSX.Element => {
  const router = useRouter()
  const { id } = router.query
  console.log('DATA', area)
  const { area_name: areaName, metadata, content } = area
  const children = []
  const rawPath = '/'
  const showEditCTA = content.description.length < 40
  return (
    <Layout layoutClz='layout-wide'>
      <SeoTags
        keywords={[areaName]}
        title={areaName}
        description='description'
      />

      <div className='overflow-y'>
        <div className='xl:flex xl:flex-row xl:gap-x-4 xl:justify-center xl:items-stretch'>
          <div className='xl:flex-none xl:max-w-screen-md xl:w-full'>
            {/* <BreadCrumbs pathTokens={pathTokens} /> */}
            <h1 className={templateH1Css}>{areaName}</h1>
            <span className='flex items-center flex-shrink text-gray-500 text-xs gap-x-1'>
              <Icon type='droppin' />
              <a
                className='hover:underline hover:text-gray-800'
                href={`https://www.openstreetmap.org/#map=13/${metadata.lat}/${metadata.lng}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {metadata.lat},{metadata.lng}
              </a>
            </span>
            {!showEditCTA && (
              <div className='flex justify-end'>
                <EditButton label='Improve this page' rawPath={rawPath} />
              </div>
            )}
            {showEditCTA && (
              <Cta isEmpty={content.description.words === 1} rawPath={rawPath} />
            )}
            <div
              className='markdown'
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
            <hr className='my-8' />
            <>
              <div className='divide-x markdown h1'>Subareas</div>
              <div className='grid grid-cols-1 md:grid-cols-3 md:gap-x-3 gap-y-3'>
                {children.map((node) => {
                  const { area_name: areaName, metadata, pathHash } = node
                  return (
                    <div className='max-h-96' key={metadata.area_id}>
                      <Link href={pathHash}>
                        <AreaCard areaName={areaName} />
                      </Link>
                    </div>
                  )
                })}
              </div>
            </>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// This function gets called at build time.
// Nextjs uses the result to decide which paths will get pre-rendered at build time
export async function getStaticPaths (): Promise<any> {
  console.log('get static path')
  const rs = await graphqlClient.query<ResponseType>({
    query: gql`query LeafAreasQuery {
    areas(isLeaf: true) {
      metadata {
        area_id
      }
      children {
        area_name
        metadata {
          area_id
        }
      }
      content {
        description 
      }
    }
  }`
  })

  // Get the paths we want to pre-render based on posts
  const paths = rs.data.areas.map((area: AreaType) => ({
    params: { id: area.metadata.area_id }
  }))
  console.log('RS', paths)
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
  const query = gql`query AreaByUUID($uuid: String) {
        area(uuid: $uuid) {
          area_name
          metadata {
            lat
            lng
          }
          children {
            area_name
            metadata {
              area_id
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

  // Pass post data to the page via props
  return { props: rs.data }
}

export default Area
