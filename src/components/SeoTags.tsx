import React from 'react'
import Head from 'next/head'
// import { Helmet } from 'react-helmet'

interface SEOProps {
  title: string
  description?: string
  keywords?: string[]
  image?: string
  author?: string
}

const siteMetadata = {
  title: 'OpenTacos',
  description: 'Open collaboration climbing platform',
  author: 'hello@openbeta.io',
  keywords: 'rock climbing wiki, climbing api, climbing beta, climbing guidebooks, openbeta, open data'
}

export default function SeoTags ({ description = '', keywords = [], title, image, author }: SEOProps): JSX.Element {
  const metaDescription = description ?? siteMetadata.description
  const metaTitle = title ?? siteMetadata.title
  const metaImage = image ?? 'https://tacos.openbeta.io/liberty-bell-hero.jpeg'
  const metaAuthor = author ?? siteMetadata.author
  const metaKeywords = keywords?.length > 0 ? keywords.join(',') : siteMetadata.keywords

  return (
    <Head>
      <title>{title}</title>

      <meta content='text/html; charset=UTF-8' name='Content-Type' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />

      <meta name='author' content={metaAuthor} />
      <meta name='keywords' content={metaKeywords} />

      <meta property='og:title' content={metaTitle} key='og-title' />

      <meta property='og:image' content={metaImage} key='og-image' />
      <meta name='twitter:image' content={metaImage} key='twt-image' />

      <meta name='description' content={metaDescription} key='desc' />
      <meta property='og:description' content={metaDescription} key='og-desc' />

      <meta name='twitter:card' content='summary_large_image' key='twt-card' />

      <link rel='icon' type='image/x-icon' href='/favicon.ico' />
    </Head>
  )
}
