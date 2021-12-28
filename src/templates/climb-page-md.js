import React from 'react'
import { graphql, navigate } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import BreadCrumbs from '../components/ui/BreadCrumbs'
import { pathOrParentIdToGitHubLink } from '../js/utils'
import LinkToGithub from '../components/ui/LinkToGithub'
import { templateH1Css } from '../js/styles'
import RouteGradeChip from '../components/ui/RouteGradeChip'
import RouteTypeChips from '../components/ui/RouteTypeChips'

/**
 * Templage for generating individual page for the climb
 */
export default function ClimbPage ({ data: { climb } }) {
  const { route_name: routeName, yds, type, safety, fa } = climb.frontmatter
  const { rawPath, filename, pathTokens, parent } = climb
  const githubLink = pathOrParentIdToGitHubLink(rawPath, filename)

  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO
        keywords={[routeName]}
        title={routeName}
        description={buildMetaDescription(pathTokens, fa, yds)}
      />
      <div>
        <BreadCrumbs pathTokens={pathTokens} isClimbPage />
        <h1 className={templateH1Css}>{routeName}</h1>
        <RouteGradeChip yds={yds} safety={safety} />
        <RouteTypeChips type={type} />
        <div className='pt-4 text-sm text-gray-600 italic'>FA: {fa}</div>
        <div className='float-right'>
          <button
            className='btn btn-secondary'
            onClick={() => navigate(`/edit?file=${rawPath}/${filename}.md`)}
          >
            Improve this page
          </button>
        </div>
        <div
          className='markdown'
          dangerouslySetInnerHTML={{ __html: parent.html }}
        />
      </div>
      <LinkToGithub link={githubLink} docType='climbs' />
    </Layout>
  )
}

function buildMetaDescription (pathTokens, fa, yds) {
  const pathLength = pathTokens.length
  const area = `${pathTokens[pathLength - 2]} at ${
    pathTokens[pathLength - 3]
  } `
  const firstAscent = fa ? `First ascent by ${fa} - ` : ''
  return `${firstAscent}${yds} - Located in ${area}`
}

export const query = graphql`
  query ($node_id: String!) {
    climb: climb(id: { eq: $node_id }) {
      ...ClimbDetailFragment
      parent {
        ... on MarkdownRemark {
          html
        }
      }
    }
  }
`
