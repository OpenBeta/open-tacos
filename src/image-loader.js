'use client'
const imageLoader = ({ src, width, quality }) => {
  return `${process.env.NEXT_PUBLIC_CDN_URL}${src}?w=${width}&q=${quality || 75}`
}

export default imageLoader
