
const withMDX = require('@next/mdx')({
  reactStrictMode: true,
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: []
  }
})
module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    domains: ['live.staticflickr.com', 'upload.wikimedia.org', 'openbeta.sirv.com']
  },
  typescript: {
    ignoreBuildErrors: false
  }
})
