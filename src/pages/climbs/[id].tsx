import React from 'react'
import { GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { gql } from '@apollo/client'

import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import { Climb } from '../../js/types'
import SeoTags from '../../components/SeoTags'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import RouteGradeChip from '../../components/ui/RouteGradeChip'
import RouteTypeChips from '../../components/ui/RouteTypeChips'
import InlineEditor from '../../components/editor/InlineEditor'
import PhotoMontage from '../../components/media/PhotoMontage'
interface ClimbProps {
  climb: Climb
}

const ClimbPage: NextPage<ClimbProps> = ({ climb }: ClimbProps) => {
  const router = useRouter()

  return (
    <Layout contentContainerClass='content-default with-standard-y-margin'>
      {router.isFallback
        ? (
          <div className='px-4 max-w-screen-md'>
            <div>Loading...</div>
          </div>
          )
        : <Body climb={climb} />}
    </Layout>
  )
}

export default ClimbPage

const Body = ({ climb }: ClimbProps): JSX.Element => {
  const { name, fa, yds, type, content, safety, metadata, ancestors, pathTokens, media } = climb
  const { climbId } = metadata
  return (
    <>
      <SeoTags
        keywords={[name]}
        title={name}
        description={buildMetaDescription({ pathTokens, fa, yds })}
      />
      <div className='px-4 max-w-screen-md'>
        <BreadCrumbs pathTokens={pathTokens} ancestors={ancestors} isClimbPage />
        <h1 className='title'>{name}</h1>
        <div className='flex items-center space-x-2'>
          <RouteGradeChip grade={yds} safety={safety} />
          <RouteTypeChips type={type} />
        </div>
        <div className='pt-4 text-sm text-gray-600 italic'>FA: {fa}</div>

        <PhotoMontage photoList={media} isHero />

        <div
          className='pt-4 markdown'
        >
          <h2 className='h2'>Description</h2>
          <InlineEditor id={`climb-desc-${climbId}`} markdown={content.description} readOnly />
          <h2>Location</h2>
          <InlineEditor id={`climb-loc-${climbId}`} markdown={content.location} readOnly />
          <h2>Protection</h2>
          <InlineEditor id={`climb-pro-${climbId}`} markdown={content.protection} readOnly />
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
      media {
        mediaUrl
        mediaUuid
      }
    }
  }`

  const rs = await graphqlClient.query<{climb: Climb}>({
    query,
    variables: {
      uuid: params.id
    }
  })

  // Pass climb data to the page via props
  return {
    props: {
      climb: rs.data.climb
    }
  }
}
