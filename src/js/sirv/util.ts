import { ImageLoaderProps } from 'next/image'
import { CLIENT_CONFIG } from '../configs/clientConfig'

const DEFAULT_IMAGE_QUALITY = 90
/**
 * Custom NextJS image loader
 */
export const DefaultLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  return `${CLIENT_CONFIG.CDN_BASE_URL}${src}?w=${width}&q=${quality ?? DEFAULT_IMAGE_QUALITY}`
}

/**
 * Custom NextJS image loader for mobile
 */
export const MobileLoader = ({ src, width = 650, quality }: ImageLoaderProps): string => {
  return `${CLIENT_CONFIG.CDN_BASE_URL}${src}?w=${width}&q=${quality ?? DEFAULT_IMAGE_QUALITY}`
}
