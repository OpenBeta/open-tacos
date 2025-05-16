import React from 'react'
import { getEntityDataForPhotoDisplay } from '@/app/(default)/gallery/util/galleryUtils'
import PhotoDialogWrapper from '@/app/(default)/gallery/components/PhotoDialogWrapper'

interface PhotoModalProps {
  params: {
    uuid: string
    photoId: string
  }
  searchParams: {
    type?: 'area' | 'climb'
  }
}

export default async function PhotoModal ({
  params,
  searchParams
}: PhotoModalProps): Promise<JSX.Element | null> {
  const { uuid, photoId: currentPhotoId } = params
  const type = searchParams.type

  if (uuid === '' || currentPhotoId === '' || (type !== 'area' && type !== 'climb')) {
    console.error(
      'PhotoModal: Missing uuid, currentPhotoId, or type from searchParams.',
      { params, searchParams }
    )
    return null
  }

  const entityData = await getEntityDataForPhotoDisplay(uuid, type)

  if ((entityData == null) || entityData.photos == null || entityData.photos.length === 0) {
    console.warn(
      `PhotoModal: No photos found for entity ${uuid} (type: ${type}).`
    )
    return (
      <PhotoDialogWrapper
        images={[]}
        currentIndex={-1}
        uuid={uuid}
        type={type}
      />
    )
  }

  const photos = entityData.photos
  const currentIndex = photos.findIndex((p) => p.id === currentPhotoId)

  if (currentIndex === -1) {
    console.warn(
      `PhotoModal: Photo ID ${currentPhotoId} not found in entity ${uuid}.`
    )
    return (
      <PhotoDialogWrapper
        images={photos}
        currentIndex={-1}
        uuid={uuid}
        type={type}
      />
    )
  }

  return (
    <PhotoDialogWrapper
      images={photos}
      currentIndex={currentIndex}
      uuid={uuid}
      type={type}
    />
  )
}
