import React from 'react'
import { GetStaticProps } from 'next'
import { gql } from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import { Climb } from '../../js/types'
import SeoTags from '../../components/SeoTags'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import RouteGradeChip from '../../components/ui/RouteGradeChip'
import RouteTypeChips from '../../components/ui/RouteTypeChips'
import { templateH1Css } from '../../js/styles'
import InlineEditor from '../../components/editor/InlineEditor'

interface ClimbProps {
  climb: Climb
}

function Climbs ({ climb }: ClimbProps): JSX.Element {
  const { name, fa, yds, type, content } = climb
  const pathTokens = []
  const ancestors = []
  const safety = undefined

  /* eslint-disable-next-line */
  console.log('# desc', JSON.stringify(content, null, 2))

  return (
    <Layout>
      <SeoTags
        keywords={[name]}
        title={name}
        description={buildMetaDescription({ pathTokens, fa, yds })}
      />
      <div>
        <BreadCrumbs pathTokens={pathTokens} ancestors={ancestors} isClimbPage />
        <h1 className={templateH1Css}>{name}</h1>
        <RouteGradeChip yds={yds} safety={safety} />
        <RouteTypeChips type={type} />
        <div className='pt-4 text-sm text-gray-600 italic'>FA: {fa}</div>
        <div className='float-right'>
          <button
            className='btn btn-secondary'
            onClick={() => {}} // navigate(`/edit?file=${rawPath}/${filename}.md`)
          >
            Improve this page
          </button>
        </div>
        <div
          className='markdown'
        >
          <h1>Description</h1>
          <InlineEditor id='1' markdown={content.description} readOnly />
          <h1>Location</h1>
          <InlineEditor id='2' markdown={content.location} readOnly />
          <h1>Protection</h1>
          <InlineEditor id='3' markdown={content.protection} readOnly />
        </div>
      </div>

    </Layout>
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
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = gql`query ClimbByUUID($uuid: String) {
    climb(uuid: $uuid) {
      name
      fa
      yds
      metadata {
        climb_id
      }
      content {
        description
        location
        protection
      }
    }
  }`

  const rs = await graphqlClient.query<Climb>({
    query,
    variables: {
      uuid: params.id
    }
  })

  // Pass post data to the page via props
  return { props: rs.data }
}

export default Climbs
