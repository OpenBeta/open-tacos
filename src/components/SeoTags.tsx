import React from 'react'
import { Helmet } from 'react-helmet'

interface SEOProps {
  title: string
  description?: string
  keywords?: string[]
  image?: string
}

function SeoTags ({ description = '', keywords = [], title, image = '' }: SEOProps): JSX.Element {
  const site = {
    siteMetadata: {
      title: 'OpenTacos',
      description: 'Open collaboration climbing platform',
      author: 'hello@openbeta.io',
      content_edit_branch: 'edit-test'
    }
  }

  const metaDescription = description ?? site.siteMetadata.description
  const metaTitle = title ?? site.siteMetadata.title
  const metaImage =
    image ??
    'https://res.cloudinary.com/openbeta-prod/image/upload/v1639562113/open-tacos/nc9dsf6aoitrnehe1cwo.jpg'

  return (
    <Helmet
      htmlAttributes={{
        lang: 'en'
      }}
      meta={[
        {
          name: 'description',
          content: metaDescription
        },
        {
          property: 'og:title',
          content: metaTitle
        },
        {
          property: 'og:description',
          content: metaDescription
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:image',
          content: metaImage
        },
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:creator',
          content: site.siteMetadata.author
        },
        {
          name: 'twitter:title',
          content: metaTitle
        },
        {
          name: 'twitter:description',
          content: metaDescription
        },
        {
          property: 'twitter:image',
          content: metaImage
        }
      ]
        .concat(
          keywords.length > 0
            ? {
                name: 'keywords',
                content: keywords.join(', ')
              }
            : []
        )}
      title={metaTitle}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
    />
  )
}

export default SeoTags
