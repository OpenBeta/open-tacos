import { shuffle } from 'underscore'
import { SIRV_CONFIG } from '../../sirv/SirvClient'
import { MediaType } from '../../types'
import { SeoHookType } from './index'

interface SeoTagsHookProps {
  username?: string
  fullName?: string
  imageList: MediaType[]
}

/**
 * React hook for generating Html meta tags
 */
export const useUserProfileSeo = ({ username = '', fullName = '', imageList = [] }: SeoTagsHookProps): SeoHookType => {
  const author = `/u/${username}`
  const count = imageList?.length ?? 0
  const photoCountStr = `${count === 0 ? '' : count} Photo${count > 1 ? 's' : ''}`
  const pageTitle = `${fullName} (${author}) •  ${photoCountStr} on OpenTacos`
  const pageImages = count > 0 ? getRandomPreviewImages(imageList) : []
  return { author, pageTitle, pageImages }
}

const getRandomPreviewImages = (list: MediaType[]): string[] => {
  const shortList = shuffle(list.slice(0, 10))
  return shortList.slice(0, 4).map(image =>
    (`${SIRV_CONFIG.baseUrl}${image.filename}?w=1200&ch=630&cy=center&format=jpg&q=90`)
  )
}
