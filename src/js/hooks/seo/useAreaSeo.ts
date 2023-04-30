import { shuffle } from 'underscore'
import { SIRV_CONFIG } from '../../sirv/SirvClient'
import { AreaType, MediaWithTags } from '../../types'
import { SeoHookType } from './index'
import { sanitizeName } from '../../utils'

interface AreaSeoProps {
  area: AreaType
}

export const useAreaSeo = ({ area }: AreaSeoProps): SeoHookType => {
  const { areaName, aggregate, pathTokens } = area
  const { byDiscipline } = aggregate

  const sportCount = byDiscipline?.sport?.total ?? 0
  const tradCount = byDiscipline?.trad?.total ?? 0
  const boulderingCount = byDiscipline?.boulder?.total ?? 0
  const aidCount = byDiscipline?.aid?.total ?? 0

  const sportText = sportCount > 0 ? `Sport ${sportCount}` : null
  const tradText = tradCount > 0 ? `Trad ${tradCount}` : null
  const boulderingext = boulderingCount > 0 ? `Bouldering ${boulderingCount}` : null
  const aidText = aidCount > 0 ? `Aid ${aidCount}` : null

  const pageDescription = [sportText, tradText, boulderingext, aidText].filter(entry => entry != null).join(' · ')

  let wall = ''
  if (pathTokens.length >= 2) {
    wall = sanitizeName(pathTokens[pathTokens.length - 2]) + ' • '
  }

  const total = sportCount + tradCount + boulderingCount + aidCount
  const pageTitle = `${wall}${sanitizeName(areaName)} Area${total > 1 ? ` • ${total} climbs` : ''}`

  const imageList = area.media
  const pageImages = imageList.length > 0 ? getRandomPreviewImages(imageList) : []

  return { pageTitle, pageDescription, pageImages }
}

/**
 * Return some most recent photos
 */
export const getRandomPreviewImages = (list: MediaWithTags[]): string[] => {
  const shortList = shuffle(list.slice(0, 10)) // shuffle the first 10
  return shortList.slice(0, 4).map(image => (`${SIRV_CONFIG.baseUrl}${image.mediaUrl}?w=1200&ch=630&cy=center&format=jpg&q=85`))
}
