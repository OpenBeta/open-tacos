import React, { useState } from 'react'
import { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { gql } from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import { AreaType, Climb, MediaBaseTag } from '../../js/types'
import SeoTags from '../../components/SeoTags'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import RouteGradeChip from '../../components/ui/RouteGradeChip'
import RouteTypeChips from '../../components/ui/RouteTypeChips'
import InlineEditor from '../../components/editor/InlineEditor'
import PhotoMontage from '../../components/media/PhotoMontage'
import { enhanceMediaListWithUsernames } from '../../js/usernameUtil'
import { useClimbSeo } from '../../js/hooks/seo/useClimbSeo'
import { useHotkeys } from 'react-hotkeys-hook'
import { useSwipeable } from 'react-swipeable'

interface ClimbPageProps {
  climb: Climb
  mediaListWithUsernames: MediaBaseTag[]
  leftClimb: Climb | null
  rightClimb: Climb | null
}

const ClimbPage: NextPage<ClimbPageProps> = (props: ClimbPageProps) => {
  const router = useRouter()
  return (
    <>
      {!router.isFallback && <PageMeta {...props} />}
      <Layout
        showFilterBar={false}
        contentContainerClass='content-default with-standard-y-margin'
      >
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

export default ClimbPage

const Body = ({ climb, mediaListWithUsernames, leftClimb, rightClimb }: ClimbPageProps): JSX.Element => {
  const router = useRouter()
  const { name, fa, yds, type, content, safety, metadata, ancestors, pathTokens } = climb
  const { climbId } = metadata
  useState([leftClimb, rightClimb])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      leftClimb !== null && router.push(`/climbs/${leftClimb.id}`)
    },
    onSwipedRight: () => {
      rightClimb !== null && router.push(`/climbs/${rightClimb.id}`)
    },
    swipeDuration: 250,
    // touchEventOptions: { passive: true },
    preventScrollOnSwipe: false
  }
  )
  useHotkeys('left', () => {
    leftClimb !== null && router.push(`/climbs/${leftClimb.id}`)
  }, [leftClimb])
  useHotkeys('right', () => {
    rightClimb !== null && router.push(`/climbs/${rightClimb.id}`)
  }, [rightClimb])

  return (
    <div className='lg:flex lg:justify-center w-full' {...swipeHandlers}>
      <div className='px-4 max-w-screen-xl'>
        <BreadCrumbs
          pathTokens={pathTokens}
          ancestors={ancestors}
          isClimbPage
        />

        <div className='py-6'>
          <PhotoMontage photoList={mediaListWithUsernames} />
        </div>
        <div className='md:flex'>
          <div
            id='Title Information'
            style={{ minWidth: '300px' }}
          >
            <h1 className='text-4xl md:text-5xl mr-10'>{name}</h1>
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
  )
}

export async function getStaticPaths (): Promise<any> {
  return {
    paths: [],
    fallback: true
  }
}

export const getStaticProps: GetStaticProps<ClimbPageProps, { id: string}> = async ({ params }) => {
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

  const sortedClimbsInArea = await fetchSortedClimbsInArea(rs.data.climb.ancestors[rs.data.climb.ancestors.length - 1])
  let leftClimb
  let rightClimb

  for (const [index, climb] of sortedClimbsInArea.entries()) {
    if (climb.id === params.id) {
      leftClimb = (sortedClimbsInArea[index - 1] !== undefined) ? sortedClimbsInArea[index - 1] : null
      rightClimb = sortedClimbsInArea[index + 1] !== undefined ? sortedClimbsInArea[index + 1] : null
    }
  }

  // Pass climb data to the page via props
  return {
    props: {
      climb: rs.data.climb,
      mediaListWithUsernames,
      leftClimb,
      rightClimb
    },
    revalidate: 600
  }
}

/**
 * Fetch and sort the climbs in the area from left to right
 */
const fetchSortedClimbsInArea = async (uuid: string): Promise<Climb[]> => {
  const query = gql`query SortedNearbyClimbsByAreaUUID($uuid: ID) {
    area(uuid: $uuid) {
      uuid,
      climbs {
        uuid,
        id,
        metadata {
          climbId,
          left_right_index
        }
      }
    }
  }`

  const rs = await graphqlClient.query<{area: AreaType}>({
    query,
    variables: {
      uuid: uuid
    }
  })

  if (rs.data == null || rs.data.area == null) {
    return []
  }

  // Copy readonly array so we can sort
  const routes = [...rs.data.area.climbs]

  return routes.sort(
    (a, b) =>
      parseInt(a.metadata.left_right_index, 10) -
      parseInt(b.metadata.left_right_index, 10)
  )
}

/**
 * Generate dynamic meta tags for page
 */
const PageMeta = ({ climb, mediaListWithUsernames }: ClimbPageProps): JSX.Element => {
  const { pageImages, pageTitle, pageDescription } = useClimbSeo({ climb, imageList: mediaListWithUsernames })
  return (
    <SeoTags
      title={pageTitle}
      description={pageDescription}
      images={pageImages}
    />
  )
}
