import React from 'react'
import { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { gql } from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import { Climb, MediaBaseTag } from '../../js/types'
import SeoTags from '../../components/SeoTags'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import RouteGradeChip from '../../components/ui/RouteGradeChip'
import RouteTypeChips from '../../components/ui/RouteTypeChips'
import InlineEditor from '../../components/editor/InlineEditor'
import PhotoMontage from '../../components/media/PhotoMontage'
import { enhanceMediaListWithUsernames } from '../../js/usernameUtil'

interface ClimbProps {
  climb: Climb
  mediaListWithUsernames: MediaBaseTag[]
}

const ClimbPage: NextPage<ClimbProps> = (props) => {
  const router = useRouter()

  return (
    <Layout
      showFilterBar={false}
      contentContainerClass='content-default with-standard-y-margin h-screen'
    >
      {router.isFallback
        ? (
          <div className='px-4 max-w-screen-md'>
            <div>Loading...</div>
          </div>
          )
        : <Body {...props} />}
    </Layout>
  )
}

export default ClimbPage

const Body = ({ climb, mediaListWithUsernames }: ClimbProps): JSX.Element => {
  const { name, fa, yds, type, content, safety, metadata, ancestors, pathTokens } = climb
  const { climbId } = metadata

  return (
    <>
      <SeoTags
        keywords={[name]}
        title={name}
        description={buildMetaDescription({ pathTokens, fa, yds })}
      />
      <div className='lg:flex lg:justify-center w-full'>
        <div className='px-4 max-w-screen-xl'>
          <BreadCrumbs
            pathTokens={pathTokens}
            ancestors={ancestors}
            isClimbPage
          />

          <div className='md:flex py-6 mt-32'>
            <PhotoMontage photoList={mediaListWithUsernames} />
            <div
              id='Title Information'
              style={{ minWidth: '300px' }}
            >
              <h1 className='text-4xl md:text-5xl'>{name}</h1>
              <div className='pl-1'>
                <div
                  className='flex items-center space-x-2 mt-6'
                >
                  <RouteGradeChip grade={yds} safety={safety} />
                  <RouteTypeChips type={type} />
                </div>

                <div
                  title='First Assent'
                  className='text-slate-700 mt-4 text-sm'
                >
                  <strong>FA: </strong>{fa}
                </div>
              </div>
            </div>

            <div id='border div' className='border border-slate-500 my-6' />

            <div id='Climb Content' />
            <div className='md:px-16 mb-16'>
              <h3 className='mb-3'>Description</h3>
              <InlineEditor id={`climb-desc-${climbId}`} markdown={content.description} readOnly />

              {content.location !== ''
                ? (
                  <>
                    <h3 className='mb-3 mt-6'>Location</h3>
                    <InlineEditor id={`climb-loc-${climbId}`} markdown={content.location} readOnly />
                  </>
                  )
                : ''}

              <h3 className='mb-3 mt-6'>Protection</h3>
              <InlineEditor id={`climb-pro-${climbId}`} markdown={content.protection} readOnly />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface MetaType {
  pathTokens: string[]
  fa?: string
  yds: string
}

function buildMetaDescription ({ pathTokens, fa, yds }: MetaType): string {
  const pathLength = pathTokens.length
  const area = `${pathTokens[pathLength - 2]} at ${
    pathTokens[pathLength - 3]
  } `
  const firstAscent = fa !== undefined ? `First ascent by ${fa} - ` : ''
  return `${firstAscent}${yds} - Located in ${area}`
}

export async function getStaticPaths (): Promise<any> {
  // Temporarily disable pre-rendering
  // https://github.com/OpenBeta/openbeta-graphql/issues/26
  // const rs = await graphqlClient.query<ClimbResponseType>({
  //   query: gql`query {
  //   climbs {
  //     name
  //     metadata {
  //       climb_id
  //     }
  //   }
  // }`
  // })

  // const paths = rs.data.climbs.map((area: Climb) => ({
  //   params: { id: area.metadata.climb_id }
  // }))

  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<ClimbProps, { id: string}> = async ({ params }) => {
  if (params == null || params.id == null) {
    return {
      notFound: true
    }
  }
  const query = gql`query ClimbByUUID($uuid: ID) {
    climb(uuid: $uuid) {
      id
      uuid
      name
      fa
      yds
      safety
      type {
        sport
        bouldering
        alpine
        tr
        trad
        mixed
        aid
      }
      media {
        mediaUrl
        mediaUuid
        destination
        destType
      }
      content {
        description
        location
        protection
      }
      pathTokens
      ancestors
      metadata {
        climbId
      }
    }
  }`

  const rs = await graphqlClient.query<{climb: Climb}>({
    query,
    variables: {
      uuid: params.id
    }
  })

  if (rs.data == null || rs.data.climb == null) {
    return {
      notFound: true,
      revalidate: 600
    }
  }

  let mediaListWithUsernames = rs.data.climb.media
  try {
    mediaListWithUsernames = await enhanceMediaListWithUsernames(mediaListWithUsernames)
  } catch (e) {
    console.log('Error when trying to add username to image data', e)
  }

  // Pass climb data to the page via props
  return {
    props: {
      climb: rs.data.climb,
      mediaListWithUsernames
    },
    revalidate: 600
  }
}
