import Link from 'next/link'
import ModalWrapper from '@/app/(default)/gallery/components/ModalWrapper'
import PhotoDisplay from '@/app/(default)/gallery/components/PhotoDisplay'
import PhotoNavButtons from '@/app/(default)/gallery/components/PhotoNavButtons'
import ThumbnailStrip from '@/app/(default)/gallery/components/ThumbnailStrip'
import { usePhotoData } from '@/app/(default)/gallery/hooks/usePhotoData'

interface ModalPageProps {
  params: Promise<{
    uuid: string
    photoId: string
  }>
  searchParams: Promise<{
    type?: 'area' | 'climb'
  }>
}

export default async function Modal ({ params, searchParams }: ModalPageProps): Promise<JSX.Element | null> {
  const { uuid, photoId } = await params
  const { type: entityType = 'area' } = await searchParams

  const photoData = await usePhotoData(uuid, photoId, entityType)

  if (photoData == null) {
    return null
  }

  const { entityData, photos, currentPhoto, currentIndex, prevPhoto, nextPhoto } = photoData

  return (
    <ModalWrapper>
      <div className='flex flex-col gap-4'>
        {/* Header with title */}
        <div className='pb-4 border-b'>
          <Link
            href={`/${entityData.type ?? ''}/${entityData.uuid ?? ''}/${entityData.slug ?? ''}`}
            className='text-2xl font-bold text-ob-primary hover:opacity-90 hover:underline transition-opacity'
          >
            ←  Back to {entityData.name}
          </Link>
        </div>

        {/* Photo Display with Tags */}
        <PhotoDisplay
          photo={currentPhoto}
          name={entityData.name}
          currentIndex={currentIndex}
          totalPhotos={photos.length}
        />

        {/* Thumbnail Strip */}
        <ThumbnailStrip
          photos={photos}
          currentIndex={currentIndex}
          uuid={uuid}
          entityType={entityType}
        />

        {/* Navigation Buttons */}
        <PhotoNavButtons
          prevPhoto={prevPhoto}
          nextPhoto={nextPhoto}
          currentIndex={currentIndex}
          totalPhotos={photos.length}
          uuid={uuid}
          entityType={entityType}
          basePath={`/gallery/${uuid}/modal`}
        />
      </div>
    </ModalWrapper>
  )
}
