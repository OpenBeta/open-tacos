import { useUserProfileSeo } from './useUserProfileSeo'
import { useAreaSeo } from './useAreaSeo'

export interface SeoHookType {
  author?: string
  pageTitle: string
  pageDescription?: string
  pageImages: string[]
}

export { useUserProfileSeo, useAreaSeo }
