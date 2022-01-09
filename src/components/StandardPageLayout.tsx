import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import Layout from './layout'
import SEOTags from './SeoTags'

export const Header = (props): JSX.Element => (
  <header {...props}>
    <h1 className='text-4xl font-bold font-sans tracking-tight my-4'>{props.text}</h1>
  </header>
)
/**
 * <h1> short code to be used in templates
 */
export const h1 = (props): JSX.Element => (
  <h1 {...props} className='md-h1' />
)

export const h2 = (props): JSX.Element => (
  <h2 {...props} className='md-h2' />
)

export const p = (props): JSX.Element => <p {...props} className='md-p' />

export const a = (props): JSX.Element => <a {...props} className='underline' />

export const ul = (props): JSX.Element => (
  <ul {...props} className='list-inside list-disc' />
)

export const ol = (props): JSX.Element => (
  <ol {...props} className='list-inside list-decimal' />
)

export const blockquote = (props): JSX.Element => (<blockquote {...props} className='border-l-4 border-gray-200 pl-6 my-6' />)

export const pre = (props): JSX.Element => (<pre {...props} className='font-mono text-sm rounded-xl bg-yellow-50 p-4' />)

// const shortcodes = { Header, h1, h2, p, a, ol, ul, pre, blockquote }
const StandardPageLayout = ({ meta, children, hero }): JSX.Element => {
  const { title, keywords } = meta
  return (
    <Layout hero={hero}>
      <>
        <SEOTags keywords={keywords} title={title} />
        <MDXProvider>
          <div className='mt-8'>
            {children}
          </div>
        </MDXProvider>
      </>
    </Layout>
  )
}

export default StandardPageLayout
