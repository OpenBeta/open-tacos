import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAreaPageFriendlyUrl, getClimbPageFriendlyUrl } from '@/js/utils'
import { getEntityDataForPhotoDisplay } from '@/app/(default)/gallery/util/galleryUtils'

interface PhotoPageProps {
  params: {
    uuid: string
    photoId: string
  }
  searchParams?: {
    type?: 'area' | 'climb'
  }
}

// Server component to display a single photo as a fallback for the modal
export default async function PhotoPage ({ params, searchParams }: PhotoPageProps): Promise<JSX.Element> {
  const { uuid, photoId: currentPhotoId } = params
  const entityType = searchParams?.type

  if (uuid === undefined || currentPhotoId === undefined || (entityType !== 'area' && entityType !== 'climb')) {
    console.error('PhotoParamsPage: Missing critical parameters.', { params, searchParams })
    notFound()
  }

  const entityData = await getEntityDataForPhotoDisplay(uuid, entityType)

  if ((entityData == null) || entityData.photos == null || entityData.photos.length === 0) {
    console.warn(`PhotoParamsPage: No photos found for entity ${uuid} (type: ${entityType}).`)
    notFound()
  }

  const photos = entityData.photos
  const currentIndex = photos.findIndex((p) => p.id === currentPhotoId)

  if (currentIndex === -1) {
    console.warn(`PhotoParamsPage: Photo ID ${currentPhotoId} not found in entity ${uuid}.`)
    notFound()
  }

  const currentPhoto = photos[currentIndex]
  const prevPhoto = currentIndex > 0 ? photos[currentIndex - 1] : null
  const nextPhoto = currentIndex < photos.length - 1 ? photos[currentIndex + 1] : null

  // Determine the URL back to the main gallery for this entity
  const galleryListUrl = entityType === 'area'
    ? getAreaPageFriendlyUrl(entityData.id, entityData.name)
    : getClimbPageFriendlyUrl(entityData.id, entityData.name)

  return (
    <div className='container mx-auto h-full px-4 py-8 flex flex-col items-center'>
      <div className='w-full max-w-5xl'>
        <div className='mb-4 flex justify-between items-center'>
          <Link href={galleryListUrl} className='text-blue-600 hover:underline'>
            &larr; Back to {entityData.name} Gallery
          </Link>
          <h1 className='text-2xl font-bold text-center'>
            {entityData.name} - Photo {currentIndex + 1} of {photos.length}
          </h1>
          {/* Placeholder for equal spacing or other actions */}
          <div style={{ width: 'calc(env(safe-area-inset-left) + 100px)' }} />

        </div>

        {/* Basic Image Display */}
        <div className='relative w-full aspect-[3/2] bg-gray-200 rounded-lg overflow-hidden mb-4'>
          {currentPhoto.mediaUrl !== undefined && (
            <Image
              src={currentPhoto.mediaUrl}
              alt={`Photo ${currentIndex + 1} for ${entityData.name}`}
              fill
              className='object-contain'
              priority
            />
          )}
        </div>

        {/* Basic Next/Previous Navigation */}
        <div className='flex justify-between items-center'>
          {(prevPhoto != null)
            ? (
              <Link
                href={`/gallery/p/${uuid}/${prevPhoto.id}?type=${entityType}`}
                className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800'
              >
                &larr; Previous
              </Link>
              )
            : (
              <div className='px-4 py-2 invisible'>Previous</div> // Placeholder for spacing
              )}

          {(nextPhoto != null)
            ? (
              <Link
                href={`/gallery/p/${uuid}/${nextPhoto.id}?type=${entityType}`}
                className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800'
              >
                Next &rarr;
              </Link>
              )
            : (
              <div className='px-4 py-2 invisible'>Next</div> // Placeholder for spacing
              )}
        </div>
      </div>
    </div>
  )
}

// Update metadata to use uuid and entityData
export async function generateMetadata ({ params, searchParams }: PhotoPageProps): Promise<{ title: string, description?: string }> {
  const { uuid, photoId } = params
  const entityType = searchParams?.type

  if (uuid === undefined || photoId === undefined || (entityType !== 'area' && entityType !== 'climb')) return { title: 'Photo' }

  const entityData = await getEntityDataForPhotoDisplay(uuid, entityType)
  if ((entityData == null) || entityData.photos == null || entityData.photos.length === 0) return { title: `Gallery - ${entityData?.name !== undefined ? entityData.name : uuid}` }

  const currentPhoto = entityData.photos.find(p => p.id === photoId)
  const photoTitle = (currentPhoto != null) ? `Photo of ${entityData.name}` : `${entityData.name} Gallery`

  return {
    title: `${photoTitle} (ID: ${photoId.substring(0, 8)})`,
    description: `View photo for ${entityData.name} (${entityType})`
    // Add OpenGraph images etc. if desired
  }
}
