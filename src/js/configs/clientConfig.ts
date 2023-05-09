if (process.env.NEXT_PUBLIC_CDN_URL == null) throw new Error('NEXT_PUBLIC_CDN_URL not set')

export const CLIENT_CONFIG = {
  CDN_BASE_URL: process.env.NEXT_PUBLIC_CDN_URL
}
