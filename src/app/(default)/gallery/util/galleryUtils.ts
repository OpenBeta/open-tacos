import { getAreaRSC } from '@/js/graphql/getAreaRSC'
import { getClimbByIdRSC } from '@/js/graphql/getClimbRSC'
import { getFriendlySlug } from '@/js/utils'
import { MediaWithTags } from '@/js/types'

export interface GalleryData {
  type: 'area' | 'climb'
  uuid: string
  name: string
  slug: string
  mediaList: MediaWithTags[]
}

/**
 * Fetch area data with media for gallery display
 */
export async function fetchAreaGalleryData (areaUuid: string): Promise<GalleryData | null> {
  try {
    const response = await getAreaRSC(areaUuid)

    if (response.area == null) {
      return null
    }

    const area = response.area

    return {
      type: 'area',
      uuid: area.uuid,
      name: area.areaName,
      slug: getFriendlySlug(area.areaName),
      mediaList: area.media ?? []
    }
  } catch (error) {
    console.error('Failed to fetch area gallery data:', error)
    return null
  }
}

/**
 * Fetch climb data with media for gallery display
 */
export async function fetchClimbGalleryData (climbUuid: string): Promise<GalleryData | null> {
  try {
    const climb = await getClimbByIdRSC(climbUuid)

    if (climb == null) {
      return null
    }

    return {
      type: 'climb',
      uuid: climb.id,
      name: climb.name,
      slug: getFriendlySlug(climb.name),
      mediaList: climb.media ?? []
    }
  } catch (error) {
    console.error('Failed to fetch climb gallery data:', error)
    return null
  }
}

/**
 * Fetch gallery data based on type and UUID
 */
export async function fetchGalleryData (
  uuid: string,
  type: 'area' | 'climb' = 'area'
): Promise<GalleryData | null> {
  if (type === 'climb') {
    return await fetchClimbGalleryData(uuid)
  }
  return await fetchAreaGalleryData(uuid)
}
