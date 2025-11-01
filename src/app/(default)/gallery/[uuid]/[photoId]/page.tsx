import Link from 'next/link'
import { notFound } from 'next/navigation'
import PhotoDisplay from '@/app/(default)/gallery/components/PhotoDisplay'
import ThumbnailStrip from '@/app/(default)/gallery/components/ThumbnailStrip'
import { fetchGalleryData } from '@/app/(default)/gallery/util/galleryUtils'

interface PhotoPageProps {
  params: Promise<{
    uuid: string
    photoId: string
  }>
  searchParams: Promise<{
    type?: 'area' | 'climb'
  }>
}

export default async function PhotoPage ({ params, searchParams }: PhotoPageProps): Promise<JSX.Element> {
  const { uuid, photoId } = await params
  const { type: entityType = 'area' } = await searchParams

  if (photoId === undefined || uuid === undefined || (entityType !== 'area' && entityType !== 'climb')) {
    notFound()
  }

  const entityData = await fetchGalleryData(uuid, entityType)

  if ((entityData == null) || entityData.mediaList == null || entityData.mediaList.length === 0) {
    notFound()
  }

  const photos = entityData.mediaList
  const currentIndex = photos.findIndex((p) => p.id === photoId)

  if (currentIndex === -1) {
    notFound()
  }

  const currentPhoto = photos[currentIndex]
  const prevPhoto = currentIndex > 0 ? photos[currentIndex - 1] : null
  const nextPhoto = currentIndex < photos.length - 1 ? photos[currentIndex + 1] : null

  return (
    <div className='min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Back button */}
        <div className='mb-6'>
          <Link
            href={`/gallery/${uuid}?type=${entityType}`}
            className='text-blue-600 hover:underline text-sm'
          >
            ← Back to Gallery
          </Link>
        </div>

        {/* Modal-like container */}
        <div className='bg-white rounded-lg shadow-2xl overflow-auto'>
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
            <div className='flex justify-between items-center gap-4 pt-4 border-t'>
              {(prevPhoto != null)
                ? (
                  <Link
                    href={`/gallery/${uuid}?type=${entityType}&photoId=${prevPhoto.id}`}
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
                    href={`/gallery/${uuid}?type=${entityType}&photoId=${nextPhoto.id}`}
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
        </div>
      </div>
    </div>
  )
}
