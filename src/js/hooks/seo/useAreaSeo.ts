import { shuffle } from 'underscore'
import { SIRV_CONFIG } from '../../sirv/SirvClient'
import { AreaType, MediaBaseTag } from '../../types'
import { SeoHookType } from './index'
import { sanitizeName } from '../../utils'

interface AreaSeoProps {
  area: AreaType
  imageList: MediaBaseTag[]
}

export const useAreaSeo = ({ area, imageList = [] }: AreaSeoProps): SeoHookType => {
  const { areaName, totalClimbs, aggregate } = area
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

  const pageTitle = `${sanitizeName(areaName)}${totalClimbs > 1 ? ` • ${totalClimbs} climbs` : ''}`

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
