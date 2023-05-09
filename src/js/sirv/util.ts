import { ImageLoaderProps } from 'next/image'
import { CLIENT_CONFIG } from '../configs/clientConfig'

/**
 * Custom NextJS image loader
 */
export const DefaultLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  return `${CLIENT_CONFIG.CDN_BASE_URL}${src}?format=webp&w=${width}&q=${quality ?? '90'}`
}

/**
 * Desktop preview loader
 */
export const DesktopPreviewLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  return `${CLIENT_CONFIG.CDN_BASE_URL}${src}?format=webp&thumbnail=300&q=${quality ?? '90'}`
}

/**
 * Custom NextJS image loader for mobile
 */
export const MobileLoader = ({ src, width = 650, quality }: ImageLoaderProps): string => {
  return `${CLIENT_CONFIG.CDN_BASE_URL}${src}?format=webp&w=${width}&q=${quality ?? '90'}`
}
