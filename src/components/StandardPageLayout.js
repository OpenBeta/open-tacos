import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import Layout from '../components/layout'
import SEOTags from '../components/seo'
import { Header, h1, h2, p, a, ol, ul, pre, blockquote } from '../components/ui/shortcodes'

const shortcodes = { Header, h1, h2, p, a, ol, ul, pre, blockquote }

export default ({ pageContext, children }) => {
  const { frontmatter } = pageContext
  const { title, keywords } = frontmatter
  return (
    <Layout>
      <SEOTags keywords={keywords} title={title} />
      <MDXProvider components={shortcodes}>{children}</MDXProvider>
    </Layout>
  )
}
