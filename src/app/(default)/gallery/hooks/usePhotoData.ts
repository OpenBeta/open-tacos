import { fetchGalleryData } from '@/app/(default)/gallery/util/galleryUtils'
import type { MediaWithTags } from '@/js/types'
import type { GalleryData } from '@/app/(default)/gallery/util/galleryUtils'

interface PhotoDataResult {
  entityData: GalleryData
  photos: MediaWithTags[]
  currentPhoto: MediaWithTags
  currentIndex: number
  prevPhoto: MediaWithTags | null
  nextPhoto: MediaWithTags | null
}

export async function usePhotoData (uuid: string, photoId: string, entityType: 'area' | 'climb'): Promise<PhotoDataResult | null> {
  // Validate inputs
  if (photoId === undefined || uuid === undefined || (entityType !== 'area' && entityType !== 'climb')) {
    return null
  }

  // Fetch gallery data
  const entityData = await fetchGalleryData(uuid, entityType)

  if ((entityData == null) || entityData.mediaList == null || entityData.mediaList.length === 0) {
    return null
  }

  const photos = entityData.mediaList
  const currentIndex = photos.findIndex((p) => p.id === photoId)

  if (currentIndex === -1) {
    return null
  }

  const currentPhoto = photos[currentIndex]
  const prevPhoto = currentIndex > 0 ? photos[currentIndex - 1] : null
  const nextPhoto = currentIndex < photos.length - 1 ? photos[currentIndex + 1] : null

  return {
    entityData,
    photos,
    currentPhoto,
    currentIndex,
    prevPhoto,
    nextPhoto
  }
}
