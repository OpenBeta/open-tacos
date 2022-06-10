import React from 'react'
import Head from 'next/head'
// import { Helmet } from 'react-helmet'

interface SEOProps {
  title: string
  description?: string
  keywords?: string[]
  image?: string
}

export default function SeoTags ({ description = '', keywords = [], title, image }: SEOProps): JSX.Element {
  const site = {
    siteMetadata: {
      title: 'OpenTacos',
      description: 'Open collaboration climbing platform',
      author: 'hello@openbeta.io'
    }
  }

  const metaDescription = description ?? site.siteMetadata.description
  const metaTitle = title ?? site.siteMetadata.title
  const metaImage =
    image ??
    'https://tacos.openbeta.io/liberty-bell-hero.jpeg'

  return (
    <Head>
      <title>{title}</title>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <meta property='og:title' content={metaTitle} key='og-title' />
      <meta name='twitter:title' content={metaTitle} key='twt-title' />
      <meta property='og:image' content={metaImage} key='og-image' />
      <meta property='twitter:image' content={metaImage} key='twt-image' />
      <meta name='description' content={metaDescription} />
      <meta property='og:description' content={metaDescription} />
      <meta name='twitter:description' content={metaDescription} />
    </Head>
  )
}
