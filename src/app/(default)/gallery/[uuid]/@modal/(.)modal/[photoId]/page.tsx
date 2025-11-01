import ModalWrapper from '@/app/(default)/gallery/components/ModalWrapper'
import ModalContent from '@/app/(default)/gallery/components/ModalContent'
import { usePhotoData } from '@/app/(default)/gallery/hooks/usePhotoData'
import type { GalleryPageProps } from '@/app/(default)/gallery/types'

export default async function Modal ({ params, searchParams }: GalleryPageProps): Promise<JSX.Element | null> {
  const { uuid, photoId } = await params
  const { type: entityType = 'area' } = await searchParams

  const photoData = await usePhotoData(uuid, photoId, entityType)

  if (photoData == null) {
    return null
  }

  const { entityData, photos, currentPhoto, currentIndex, prevPhoto, nextPhoto } = photoData

  return (
    <ModalWrapper>
      <ModalContent
        entityData={entityData}
        currentPhoto={currentPhoto}
        currentIndex={currentIndex}
        photos={photos}
        prevPhoto={prevPhoto}
        nextPhoto={nextPhoto}
        uuid={uuid}
        entityType={entityType}
      />
    </ModalWrapper>
  )
}
