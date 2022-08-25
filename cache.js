'use strict'

// Workbox RuntimeCaching config: https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-build#.RuntimeCachingEntry
module.exports = [
  {
    urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-font-assets',
      expiration: {
        maxEntries: 4,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
      }
    }
  },
  {
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-image-assets',
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: 24 * 60 * 60 // 24 hours
      }
    }
  },

  // Only used by the about page
  // {
  //   urlPattern: /\/_next\/image\?url=.+$/i,
  //   handler: 'StaleWhileRevalidate',
  //   options: {
  //     cacheName: 'next-image',
  //     expiration: {
  //       maxEntries: 64,
  //       maxAgeSeconds: 24 * 60 * 60 // 24 hours
  //     }
  //   }
  // },
  {
    urlPattern: /\.(?:mp3|wav|ogg)$/i,
    handler: 'CacheFirst',
    options: {
      rangeRequests: true,
      cacheName: 'static-audio-assets',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60 // 24 hours
      }
    }
  },

  // We're not using videos
  // {
  //   urlPattern: /\.(?:mp4)$/i,
  //   handler: 'CacheFirst',
  //   options: {
  //     rangeRequests: true,
  //     cacheName: 'static-video-assets',
  //     expiration: {
  //       maxEntries: 32,
  //       maxAgeSeconds: 24 * 60 * 60 // 24 hours
  //     }
  //   }
  // },
  {
    urlPattern: /\.(?:js)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-js-assets',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60 // 24 hours
      }
    }
  },
  {
    urlPattern: /\.(?:css|less)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-style-assets',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60 // 24 hours
      }
    }
  },

  // getStaticProps data
  // {
  //   urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
  //   handler: 'StaleWhileRevalidate',
  //   options: {
  //     cacheName: 'next-data',
  //     expiration: {
  //       maxEntries: 32,
  //       maxAgeSeconds: 24 * 60 * 60 // 24 hours
  //     }
  //   }
  // },

  // We'll decide what to cache from the api when we get to it
  // {
  //   urlPattern: ({ url }) => {
  //     const isSameOrigin = self.origin === url.origin
  //     if (!isSameOrigin) return false
  //     const pathname = url.pathname
  //     // Exclude /api/auth/callback/* to fix OAuth workflow in Safari without impact other environment
  //     // Above route is default for next-auth, you may need to change it if your OAuth workflow has a different callback route
  //     // Issue: https://github.com/shadowwalker/next-pwa/issues/131#issuecomment-821894809
  //     if (pathname.startsWith('/api/auth/')) return false
  //     if (pathname.startsWith('/api/')) return true
  //     return false
  //   },
  //   handler: 'NetworkFirst',
  //   method: 'GET',
  //   options: {
  //     cacheName: 'apis',
  //     expiration: {
  //       maxEntries: 16,
  //       maxAgeSeconds: 24 * 60 * 60 // 24 hours
  //     },
  //     networkTimeoutSeconds: 10 // fall back to cache if api does not response within 10 seconds
  //   }
  // },

  // For some reason data is requested with ?id=<id> appended, which triggers this one, which we don't want
  // {
  //   urlPattern: ({ url }) => {
  //     const isSameOrigin = self.origin === url.origin
  //     if (!isSameOrigin) return false
  //     const pathname = url.pathname
  //     if (pathname.startsWith('/api/')) return false
  //     return true
  //   },
  //   handler: 'NetworkFirst',
  //   options: {
  //     cacheName: 'others',
  //     expiration: {
  //       maxEntries: 32,
  //       maxAgeSeconds: 24 * 60 * 60 // 24 hours
  //     },
  //     networkTimeoutSeconds: 10
  //   }
  // },

  // Really only sirv images
  // {
  //   urlPattern: ({ url }) => {
  //     const isSameOrigin = self.origin === url.origin
  //     return !isSameOrigin
  //   },
  //   handler: 'NetworkFirst',
  //   options: {
  //     cacheName: 'cross-origin',
  //     expiration: {
  //       maxEntries: 32,
  //       maxAgeSeconds: 60 * 60 // 1 hour
  //     },
  //     networkTimeoutSeconds: 10
  //   }
  // }
]