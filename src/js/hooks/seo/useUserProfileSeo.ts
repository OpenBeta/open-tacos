import { shuffle } from 'underscore'
import { CLIENT_CONFIG } from '../../configs/clientConfig'
import { MediaWithTags } from '../../types'
import { SeoHookType } from './index'

interface SeoTagsHookProps {
  username?: string
  fullName?: string
  imageList: MediaWithTags[]
}

/**
 * React hook for generating Html meta tags
 */
export const useUserProfileSeo = ({ username = '', fullName = '', imageList = [] }: SeoTagsHookProps): SeoHookType => {
  const author = `/u/${username}`
  const count = imageList?.length ?? 0
  const photoCountStr = `${count === 0 ? '' : count} Photo${count > 1 ? 's' : ''}`
  const pageTitle = `${fullName ?? ''} (${author}) •  ${photoCountStr} on OpenBeta`
  const pageImages = count > 0 ? getRandomPreviewImages(imageList) : []
  return { author, pageTitle, pageImages }
}

const getRandomPreviewImages = (list: MediaWithTags[]): string[] => {
  const shortList = shuffle(list.slice(0, 10))
  return shortList.slice(0, 4).map(image =>
    (`${CLIENT_CONFIG.CDN_BASE_URL}/${image.mediaUrl}?w=1200&ch=630&cy=center&format=jpg&q=90`)
  )
}
