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
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    })

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
