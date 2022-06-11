import { useUserProfileSeo } from './useUserProfileSeo'
import { useAreaSeo } from './useAreaSeo'
import { useClimbSeo } from './useClimbSeo'
export interface SeoHookType {
  author?: string
  pageTitle: string
  pageDescription?: string
  pageImages: string[]
}

export { useUserProfileSeo, useAreaSeo, useClimbSeo }
