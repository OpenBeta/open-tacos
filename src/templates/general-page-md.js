import React from 'react'
import { graphql, navigate } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'

/**
 * Page template for non-climbing route and area
 */
export default function GeneralMPaage ({ data: { markdown } }) {
  const { title } = markdown.frontmatter
  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO title={title} />
      <div
        className='markdown mt-8'
        dangerouslySetInnerHTML={{ __html: markdown.html }}
      />
    </Layout>
  )
}

export const query = graphql`
  query ($node_id: String!) {
    markdown: markdownRemark(id: { eq: $node_id }) {
      html
      frontmatter {
        title
      }
    }
  }
`
