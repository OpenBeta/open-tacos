import React from 'react'
import { GetStaticProps } from 'next'
import { gql } from '@apollo/client'
import { graphqlClient } from '../../js/graphql/Client'
import Layout from '../../components/layout'
import { Climb, ClimbResponseType } from '../../js/types'
import SeoTags from '../../components/SeoTags'
import BreadCrumbs from '../../components/ui/BreadCrumbs'
import RouteGradeChip from '../../components/ui/RouteGradeChip'
import RouteTypeChips from '../../components/ui/RouteTypeChips'
import { templateH1Css } from '../../js/styles'

interface ClimbProps {
  climb: Climb
}

function Climbs ({ climb }: ClimbProps): JSX.Element {
  const { name, fa, yds, type, content } = climb
  const pathTokens = []
  const ancestors = []
  const safety = undefined;
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
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
          dangerouslySetInnerHTML={{ __html: content.description }}
        />
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
  const firstAscent = fa === undefined ? `First ascent by ${fa} - ` : ''
  return `${firstAscent}${yds} - Located in ${area}`
}

export async function getStaticPaths (): Promise<any> {
  const rs = await graphqlClient.query<ClimbResponseType>({
    query: gql`query {
    climbs {
      name
      metadata {
        climb_id
      }
    }
  }`
  })

  const paths = rs.data.climbs.map((area: Climb) => ({
    params: { id: area.metadata.climb_id }
  }))

  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log(params)
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
