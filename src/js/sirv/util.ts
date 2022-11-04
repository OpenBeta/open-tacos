import { ImageLoaderProps } from 'next/legacy/image'
import { SIRV_CONFIG } from './SirvClient'

/**
 * Custom NextJS image loader
 */
export const DefaultLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  return `${SIRV_CONFIG.baseUrl ?? ''}${src}?format=webp&w=${width}&q=${quality ?? '90'}`
}

/**
 * Desktop preview loader
 */
export const DesktopPreviewLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  return `${SIRV_CONFIG.baseUrl ?? ''}${src}?format=webp&thumbnail=300&q=${quality ?? '90'}`
}

/**
 * Custom NextJS image loader for mobile
 */
export const MobileLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  return `${SIRV_CONFIG.baseUrl ?? ''}${src}?format=webp&w=914&q=${quality ?? '90'}`
}
