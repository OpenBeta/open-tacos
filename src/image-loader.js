'use client'
const dev = process.env.NODE_ENV !== 'production'
const imageLoader = ({ src, width, quality }) => {
  if (dev && src.startsWith('/_next')) {
    return src
  }
  return `${process.env.NEXT_PUBLIC_CDN_URL}${src}?w=${width}&q=${quality || 75}`
}

export default imageLoader
