import { GetStaticProps } from 'next'
import { useState } from 'react'
import { gql } from '@apollo/client'

import { AreaType } from '../../js/types'
import ClusterMap from '../../components/maps/ClusterMap'
import Drawer from '../../components/ui/Drawer'
import { graphqlClient } from '../../js/graphql/Client'
import Link from 'next/link'
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
const Area = ({ area }: AreaPageProps): JSX.Element => {
  const { id, area_name: areaName, children, metadata, content, pathTokens, ancestors } = area
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([])

  const handleClick = ({ object, objects }: {object: AreaType | any, objects: AreaType[]}): void => {
    if (objects === undefined || object?.cluster !== true) {
      setSelectedAreaIds([(object as AreaType).id])
    } else {
      setSelectedAreaIds(objects.map(o => { return o.id }))
    }
  }
  const selectedAreas = area.children.filter(c =>
    selectedAreaIds.includes(c.id)
  )
  return (
    <Layout layoutClz='layout-default'>
      <SeoTags
        keywords={[areaName]}
        title={areaName}
        description='description'
      />

      <div className='overflow-y'>
        <div className='xl:flex xl:flex-row xl:gap-x-4 xl:justify-center xl:items-stretch'>
          <div className='xl:flex-none xl:max-w-screen-md xl:w-full'>
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

            <div className='w-full relative mt-8 flex my-8'>
              <Drawer
                className='border border-slate-400'
                areas={selectedAreas.length === 0 ? area.children : selectedAreas}
              />
              <ClusterMap className='shadow-[-3px_0px_6px_-3px_rgba(0,0,0,0.3)]' onClick={handleClick} bbox={area.metadata.bbox}>
                {area.children}
              </ClusterMap>
            </div>

            <h2>Subareas</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 md:gap-x-3 gap-y-3'>
              {children.map((child) => {
                const { id, area_name: areaName, metadata } = child
                return (
                  <div className='max-h-96' key={metadata.area_id}>
                    <Link href={getSlug(id, metadata.leaf)} passHref>
                      <a>
                        <AreaCard areaName={areaName} />
                      </a>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
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
    fallback: 'blocking'
  }
}

// This also gets called at build time
// Query graphql api for area by id
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = gql`query getAreaById($id: ID) {
    area(id: $id) {
      id
      area_name
      ancestors
      pathTokens
      metadata {
        lat
        lng 
        leaf
        bbox
      } 
      content {
        description 
      } 
      children {
        id
        area_name
        totalClimbs
        metadata {
          area_id
          leaf
          lat
          lng
          bbox
        }
        aggregate {
          byGrade {
            count
            label
          }
          byType {
            count
            label
          }
        }
      }
    }
  }`

  try {
    const rs = await graphqlClient.query<AreaType>({
      query,
      variables: {
        id: params.id
      }
    })
    if (rs.data === null) throw new Error('Area not found')
    // Pass post data to the page via props
    return { props: rs.data }
  } catch (e) {
    return {
      notFound: true
    }
  }
}

export default Area
