module.exports = {
  output: process.env.DEPLOYMENT_ENV === 'kubernetes' ? 'standalone' : undefined,
  images: {
    loader: 'custom',
    loaderFile: './src/image-loader.js'
  },
  typescript: {
    ignoreBuildErrors: false
  },
  webpack (config, { isServer }) { // required by @svgr/webpack lib
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'))

    config.externals = [...config.externals, isServer ? { canvas: 'canvas', jsdom: 'jsdom', paper: 'paper' } : {}]

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer,

      // issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    })
    fileLoaderRule.exclude = /\.svg$/i
    return config
  },
  async headers () {
    return [
      {
        source: '/area/:id*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=600'
          }
        ]
      },
      {
        source: '/climb/:id*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=600'
          }
        ]
      }
    ]
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
        source: '/map',
        destination: '/maps',
        permanent: true
      },
      {
        source: '/areas/:uuid',
        destination: '/area/:uuid/',
        permanent: true
      },
      {
        source: '/crag/:uuid',
        destination: '/area/:uuid/',
        permanent: true
      },
      {
        source: '/blog',
        destination: 'https://openbeta.substack.com/',
        permanent: false
      },
      {
        source: '/blog/openbeta-vs-mountain-project-vs-thecrag',
        destination: 'https://openbeta.substack.com/p/openbeta-vs-mountainproject-vs-thecrag',
        permanent: false
      },
      {
        source: '/partner-with-us',
        destination: '/Become-OpenBeta-Partner-Dec-2024.pdf',
        permanent: false
      }
    ]
  },
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react']
  },
  cacheHandler: process.env.DEPLOYMENT_ENV === 'kubernetes' ? require.resolve('./cache-handler.mjs') : undefined,
  cacheMaxMemorySize: process.env.DEPLOYMENT_ENV === 'kubernetes' ? 0 : 512 // disable default caching because we have Redis in kubernetes deployment
}
