import React from 'react'
import Head from 'next/head'
// import { Helmet } from 'react-helmet'

interface SEOProps {
  title: string
  description?: string
  keywords?: string[]
  images?: string[]
  author?: string
}

const siteMetadata = {
  title: 'OpenTacos',
  description: 'Open collaboration climbing platform',
  author: 'hello@openbeta.io',
  keywords: 'rock climbing wiki, climbing api, climbing beta, climbing guidebooks, openbeta, open data'
}

export default function SeoTags ({ description = '', keywords = [], title, images = [], author }: SEOProps): JSX.Element {
  const metaDescription = description ?? siteMetadata.description
  const metaTitle = title ?? siteMetadata.title
  const metaImages = images.length > 0 ? images : ['https://tacos.openbeta.io/liberty-bell-hero.jpeg']
  const metaAuthor = author ?? siteMetadata.author
  const metaKeywords = keywords?.length > 0 ? keywords.join(',') : siteMetadata.keywords

  return (
    <Head>
      <title>{title}</title>

      <meta content='text/html; charset=UTF-8' name='Content-Type' key='ct' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' key='vp' />

      <meta name='author' content={metaAuthor} key='author' />
      <meta name='keywords' content={metaKeywords} key='keywords' />

      <meta property='og:title' content={metaTitle} key='og-title' />

      {metaImages.map((imageUrl, index) => (
        <React.Fragment key={index}>
          <meta property='og:image' content={imageUrl} key={`og-image${index}`} />
          <meta name='twitter:image' content={imageUrl} key={`twt-image${index}`} />
        </React.Fragment>
      ))}

      <meta property='og:image:width' content='1200' key='og-image-w' />
      <meta property='og:image:height' content='630' key='og-image-h' />

      <meta name='description' content={metaDescription} key='desc' />
      <meta property='og:description' content={metaDescription} key='og-desc' />

      <meta name='twitter:card' content='summary_large_image' key='twt-card' />

      <link rel='icon' type='image/x-icon' href='/favicon.ico' />
    </Head>
  )
}
