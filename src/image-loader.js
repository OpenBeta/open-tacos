const BASE_URL = process.env.NEXT_PUBLIC_CDN_URL
const imageLoader = ({ src, width, quality }) => {
  if (src.includes(BASE_URL)) {
    return src
  }
  // The case below does not seem to be handled by this image-loader, it's here just in case:
  return `${process.env.NEXT_PUBLIC_CDN_URL}/${src}?w=${width}&q=${quality || 75}`
}

export default imageLoader
