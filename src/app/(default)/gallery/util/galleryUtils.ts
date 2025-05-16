import { getAreaRSC } from '@/js/graphql/getAreaRSC'
import { getClimbByIdRSC } from '@/js/graphql/getClimbRSC'
import { MediaWithTags } from '@/js/types'
import { getAreaPageFriendlyUrl, getClimbPageFriendlyUrl } from '@/js/utils'

interface EntityGalleryData {
  id: string
  name: string
  photos: MediaWithTags[]
  pageUrl: string
  type: 'area' | 'climb'
}

type AreaDataRSC = NonNullable<Awaited<ReturnType<typeof getAreaRSC>>['area']>
type ClimbDataRSC = NonNullable<Awaited<ReturnType<typeof getClimbByIdRSC>>>

const formatAreaData = (area: AreaDataRSC): EntityGalleryData => {
  return {
    type: 'area',
    id: area.uuid,
    name: area.areaName,
    photos: area.media,
    pageUrl: getAreaPageFriendlyUrl(area.uuid, area.areaName)
  }
}

const formatClimbData = (climb: ClimbDataRSC): EntityGalleryData => {
  return {
    type: 'climb',
    id: climb.id,
    name: climb.name,
    photos: climb.media,
    pageUrl: getClimbPageFriendlyUrl(climb.id, climb.name)
  }
}

// Main Data Fetcher Utility
export async function getEntityDataForPhotoDisplay (
  entityId: string,
  entityType: 'area' | 'climb'
): Promise<EntityGalleryData | null> {
  if (entityId === undefined || (entityType !== 'area' && entityType !== 'climb')) {
    console.error('getEntityDataForPhotoDisplay: entityId or entityType is missing.')
    return null
  }

  let galleryData: EntityGalleryData | null = null

  try {
    if (entityType === 'area') {
      const areaDataContainer = await getAreaRSC(entityId)
      if ((areaDataContainer?.area) != null) {
        galleryData = formatAreaData(areaDataContainer.area)
      }
    } else if (entityType === 'climb') {
      const climbData = await getClimbByIdRSC(entityId)
      if (climbData != null) {
        galleryData = formatClimbData(climbData)
      }
    }
  } catch (error) {
    console.error(`Failed to fetch or format data for ${entityType} ${entityId}:`, error)
    return null
  }

  if (galleryData == null) {
    console.warn(`No gallery data resolved for ${entityType} ${entityId}.`)
  }

  return galleryData
}
