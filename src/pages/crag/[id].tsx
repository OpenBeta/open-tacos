import { GetStaticProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import { gql } from '@apollo/client'
import { useRouter } from 'next/router'

import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import { AreaType, MediaBaseTag, ChangesetType } from '../../js/types'
import CragLayout from '../../components/crag/cragLayout'
import { enhanceMediaListWithUsernames } from '../../js/usernameUtil'
import { PageMeta } from '../areas/[id]'
import { getImageDimensionsHack } from '../../js/utils/hacks'

interface CragProps {
  area: AreaType
  history: ChangesetType[]
  mediaListWithUsernames: MediaBaseTag[]
}

const CragPage: NextPage<CragProps> = (props) => {
  const router = useRouter()
  return (
    <>
      {!router.isFallback && <PageMeta {...props} />}
      <Layout contentContainerClass='content-default' showFilterBar={false}>
        {router.isFallback
          ? (
            <div className='px-4 max-w-screen-md'>
              <div>Loading...</div>
            </div>
            )
          : <Body {...props} />}
      </Layout>
    </>
  )
}
export default CragPage

const Body = ({ area, mediaListWithUsernames }: CragProps): JSX.Element => {
  const { uuid, areaName, aggregate, climbs, metadata, content, ancestors, pathTokens, children, updatedAt, updatedBy, createdAt, createdBy } = area

  console.log('#crag page', uuid, mediaListWithUsernames)
  return (
    <>
      <div className='px-4 py-4 lg:py-8 max-w-screen-xl mx-auto w-full'>
        <CragLayout
          uuid={uuid}
          title={areaName}
          description={content.description}
          latitude={metadata.lat}
          longitude={metadata.lng}
          climbs={climbs}
          areaMeta={metadata}
          ancestors={ancestors}
          pathTokens={pathTokens}
          aggregate={aggregate.byGrade}
          media={mediaListWithUsernames}
          childAreas={children}
          updatedAt={updatedAt}
          updatedBy={updatedBy}
          createdAt={createdAt}
          createdBy={createdBy}
        />
      </div>

      <div id='#map' className='w-full mt-16' style={{ height: '30rem' }}>
        <AreaMap
          focused={null}
          selected={area.id}
          subAreas={[{ ...area }]}
          area={area}
        />
      </div>
    </>
  )
}

export async function getStaticPaths (): Promise<any> {
  return {
    paths: [
      // { params: { id: 'bea6bf11-de53-5046-a5b4-b89217b7e9bc' } }, // Red Rock
      // { params: { id: '78da26bc-cd94-5ac8-8e1c-815f7f30a28b' } }, // Red River Gorge
      // { params: { id: '1db1e8ba-a40e-587c-88a4-64f5ea814b8e' } }, // USA
      // { params: { id: 'ab48aed5-2e8d-54bb-b099-6140fe1f098f' } }, // Colorado
      // { params: { id: 'decc1251-4a67-52b9-b23f-3243e10e93d0' } }, // Boulder
      // { params: { id: 'f166e672-4a52-56d3-94f1-14c876feb670' } } // Indian Creek

    ],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<CragProps, { id: string }> = async ({ params }) => {
  if (params == null || params.id == null) {
    return {
      notFound: true
    }
  }
  const query = gql`query AreaByID($uuid: ID) {
    area(uuid: $uuid) {
      id
      uuid
      areaName
      media {
        mediaUrl
        mediaUuid
        destination
        destType
      }
      totalClimbs
      aggregate {
        byGrade {
          count
          label
        }
        byDiscipline {
            sport {
              total
            }
            trad {
              total
            }
            boulder {
              total
            }
            aid {
              total
            }
          }        
      }
      metadata {
        areaId
        leaf
        isBoulder
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
          leftRightIndex
        }
        content {
          description
        }
      }
      children {
        uuid
        areaName
        totalClimbs
        metadata {
          leaf
          isBoulder
        }
        children {
          uuid
        }
      }
      content {
        description 
      }
      updatedAt
      updatedBy
      createdAt
      createdBy 
    }
  }`

  const rs = await graphqlClient.query<{ area: AreaType }>({
    query,
    variables: {
      uuid: params.id
    },
    fetchPolicy: 'no-cache'
  })

  if (rs.data == null || rs.data.area == null) {
    return {
      notFound: true
    }
  }

  const mediaListWithUsernames = await enhanceMediaListWithUsernames(rs.data.area.media)
  const mediaListWithDimensions = await getImageDimensionsHack(mediaListWithUsernames)

  return {
    props: {
      area: rs.data.area,
      history: [],
      mediaListWithUsernames: mediaListWithDimensions
    },
    revalidate: 30
  }
}

export const AreaMap = dynamic<any>(async () => await import('../../components/area/areaMap'), {
  ssr: false
})
