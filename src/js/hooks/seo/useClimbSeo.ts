import { shuffle } from 'underscore'
import { SIRV_CONFIG } from '../../sirv/SirvClient'
import { Climb, MediaBaseTag, SafetyType } from '../../types'
import { SeoHookType } from './index'
import { sanitizeName } from '../../utils'
import { disciplineTypeToDisplay } from '../../grades/util'
import Grade from '../../grades/Grade'

interface ClimbSeoProps {
  climb: Climb
  imageList: MediaBaseTag[]
}

/**
 * Hook for generating dynamic page SEO data
 */
export const useClimbSeo = ({ climb, imageList = [] }: ClimbSeoProps): SeoHookType => {
  const { name, type, grades, parent, safety, fa, pathTokens } = climb

  const gradesObj = new Grade(parent.gradeContext, grades, type, parent.metadata.isBoulder)

  const faText = fa != null ? `FA: ${fa}` : ''
  let wall = ''
  if (pathTokens.length > 3) {
    wall = `${sanitizeName(pathTokens[pathTokens.length - 2])} · ${sanitizeName(pathTokens[pathTokens.length - 3])}`
  }

  const pageDescription = `${faText} · Located in ${wall}`

  const disciplinesText = disciplineTypeToDisplay(type).join(' ')

  const safetyText = safety != null && safety !== SafetyType.UNSPECIFIED ? ' ' + safety : ''
  const gradeText = `${gradesObj.toString() ?? ''}${safetyText}`

  const s1 = gradeText === '' ? '' : ' · ' + gradeText
  const s2 = disciplinesText === '' ? '' : ' · ' + disciplinesText

  const pageTitle = `${sanitizeName(name)}${s1}${s2}`

  const pageImages = imageList.length > 0 ? getRandomPreviewImages(imageList) : []

  return { pageTitle, pageDescription, pageImages }
}

/**
 * Return some most recent photos
 */
const getRandomPreviewImages = (list: MediaBaseTag[]): string[] => {
  const shortList = shuffle(list.slice(0, 10)) // shuffle the first 10
  return shortList.slice(0, 4).map(image => (`${SIRV_CONFIG.baseUrl}${image.mediaUrl}?w=1200&ch=630&cy=center&format=jpg&q=85`))
}
