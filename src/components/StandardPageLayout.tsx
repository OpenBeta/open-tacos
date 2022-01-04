import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import Layout from './layout'
import SEOTags from './SeoTags'
import { Header, h1, h2, p, a, ol, ul, pre, blockquote } from './ui/shortcodes'

const shortcodes = { Header, h1, h2, p, a, ol, ul, pre, blockquote }

export default ({ meta, children }): JSX.Element => {
  const { title, keywords } = meta
  return (
    <Layout>
      <>
        <SEOTags keywords={keywords} title={title} />
        <MDXProvider components={shortcodes}>
          <div className='markdown mt-8'>
            {children}
          </div>
        </MDXProvider>
      </>
    </Layout>
  )
}
