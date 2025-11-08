import Link from 'next/link'
import { notFound } from 'next/navigation'
import PhotoDisplay from '@/app/(default)/gallery/components/PhotoDisplay'
import PhotoNavButtons from '@/app/(default)/gallery/components/PhotoNavButtons'
import ThumbnailStrip from '@/app/(default)/gallery/components/ThumbnailStrip'
import { usePhotoData } from '@/app/(default)/gallery/hooks/usePhotoData'
import type { GalleryPageProps } from '@/app/(default)/gallery/types'

export default async function PhotoPage ({ params, searchParams }: GalleryPageProps): Promise<JSX.Element> {
  const { uuid, photoId } = await params
  const { type: entityType = 'area' } = await searchParams

  const photoData = await usePhotoData(uuid, photoId, entityType)

  if (photoData == null) {
    notFound()
  }

  const { entityData, photos, currentPhoto, currentIndex, prevPhoto, nextPhoto } = photoData

  return (
    <div className='min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Back button */}
        <div className='mb-6'>
          <Link
            href={`/gallery/${uuid}?type=${entityType}`}
            className='text-ob-primary hover:opacity-80 text-sm'
          >
            ← Back to Gallery
          </Link>
        </div>

        {/* Modal-like container */}
        <div className='bg-base-100 rounded-lg shadow-2xl overflow-auto'>
          <div className='p-6 flex flex-col gap-4'>
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
            <PhotoNavButtons
              prevPhoto={prevPhoto}
              nextPhoto={nextPhoto}
              currentIndex={currentIndex}
              totalPhotos={photos.length}
              uuid={uuid}
              entityType={entityType}
              basePath={`/gallery/${uuid}`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
