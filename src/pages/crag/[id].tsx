import { GetStaticProps, NextPage } from 'next'
import { gql } from '@apollo/client'
import { useRouter } from 'next/router'

import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import { AreaType, MediaBaseTag, ChangesetType, MediaType } from '../../js/types'
import CragLayout from '../../components/crag/cragLayout'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import AreaMap from '../../components/area/areaMap'
import { enhanceMediaListWithUsernames } from '../../js/usernameUtil'
import { PageMeta } from '../areas/[id]'
import { getImagesByFilenames } from '../../js/sirv/SirvClient'
import { indexBy } from 'underscore'

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
  const { uuid, areaName, aggregate, climbs, metadata, content, ancestors, pathTokens, children } = area

  return (
    <>
      <div className='px-4 py-6 max-w-screen-xl mx-auto w-full'>
        <BreadCrumbs ancestors={ancestors} pathTokens={pathTokens} />
        <div className='mt-6' />
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
    paths: [],
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
        metadata {
          leaf
          isBoulder
        }
      }
      content {
        description 
      } 
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

  let mediaListWithUsernames: MediaBaseTag[] = rs.data.area.media
  try {
    mediaListWithUsernames = await enhanceMediaListWithUsernames(rs.data.area.media)
  } catch (e) {
    console.log('Error when trying to add username to image data', e)
  }

  /**
 * Call Sirv API to get image metadata.  We should probably store metadata in the db.
 */
  const mediaListWithMetadata = await getImagesByFilenames(mediaListWithUsernames.map(entry => entry.mediaUrl))

  const mediaMetaDict = indexBy<MediaType[]>(mediaListWithMetadata.mediaList, 'mediaId')

  // Pass post data to the page via props
  return {
    props: {
      area: rs.data.area,
      history: [],
      mediaListWithUsernames: mediaListWithUsernames.map(entry => ({ ...entry, mediaInfo: mediaMetaDict?.[entry.mediaUuid] ?? null }))
    }
  }
}
