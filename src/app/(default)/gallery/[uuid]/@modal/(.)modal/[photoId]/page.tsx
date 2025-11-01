import Link from 'next/link'
import ModalWrapper from '@/app/(default)/gallery/components/ModalWrapper'
import PhotoNavigator from '@/app/(default)/gallery/components/PhotoNavigator'
import PhotoDisplay from '@/app/(default)/gallery/components/PhotoDisplay'
import ThumbnailStrip from '@/app/(default)/gallery/components/ThumbnailStrip'
import { fetchGalleryData } from '@/app/(default)/gallery/util/galleryUtils'

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

  console.log('Modal page rendering:', { uuid, photoId, entityType })

  // If no photoId or uuid, don't render the modal
  if (photoId === undefined || uuid === undefined || (entityType !== 'area' && entityType !== 'climb')) {
    console.log('Modal returning null - photoId:', photoId, 'uuid:', uuid, 'entityType:', entityType)
    return null
  }

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

  return (
    <ModalWrapper>
      <div className='flex flex-col gap-4'>
        {/* Header with title */}
        <div className='pb-4 border-b'>
          <h2 className='text-xl font-bold'>
            {entityData.name}
          </h2>
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
        <div className='flex justify-between items-center gap-4 pt-4 border-t'>
          {(prevPhoto != null)
            ? (
              <Link
                href={`/gallery/${uuid}/modal/${prevPhoto.id}?type=${entityType}`}
                className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition-colors'
              >
                ← Previous
              </Link>
              )
            : (
              <div />
              )}

          <span className='text-sm text-gray-600'>
            Photo {currentIndex + 1} of {photos.length}
          </span>

          {(nextPhoto != null)
            ? (
              <Link
                href={`/gallery/${uuid}/modal/${nextPhoto.id}?type=${entityType}`}
                className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800 transition-colors'
              >
                Next →
              </Link>
              )
            : (
              <div />
              )}
        </div>
      </div>

      <PhotoNavigator
        prevPhotoUrl={(prevPhoto != null) ? `/gallery/${uuid}/modal/${prevPhoto.id}?type=${entityType}` : undefined}
        nextPhotoUrl={(nextPhoto != null) ? `/gallery/${uuid}/modal/${nextPhoto.id}?type=${entityType}` : undefined}
      />
    </ModalWrapper>
  )
}
