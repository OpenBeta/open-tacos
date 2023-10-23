module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openbeta.sirv.com'
      },
      {
        protocol: 'https',
        hostname: 'openbeta-dev.sirv.com',
        pathname: '*'
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com'
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: false
  },
  generateEtags: false,
  webpack (config) { // required by @svgr/webpack lib
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'))

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer,

      // issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    })
    fileLoaderRule.exclude = /\.svg$/i
    return config
  },
  async rewrites () {
    return [
      { // A hack to pass ?gallery=true to getStaticProps()
        source: '/u/:uid/:postid',
        has: [
          {
            type: 'query',
            key: 'gallery',
            value: 'true'
          }],
        destination: '/u/:uid/:postid/gallery'
      }
    ]
  },
  async redirects () {
    return [
      {
        source: '/blog',
        destination: 'https://openbeta.substack.com/',
        permanent: false
      },
      {
        source: '/blog/openbeta-vs-mountain-project-vs-thecrag',
        destination: 'https://openbeta.substack.com/p/openbeta-vs-mountainproject-vs-thecrag',
        permanent: false
      }
    ]
  }
}
