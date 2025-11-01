import Link from 'next/link'
import Image from 'next/image'
import ModalWrapper from '@/app/(default)/gallery/components/ModalWrapper'
import ModalContent from '@/app/(default)/gallery/components/ModalContent'
import { usePhotoData } from '@/app/(default)/gallery/hooks/usePhotoData'
import { fetchGalleryData } from '@/app/(default)/gallery/util/galleryUtils'
import type { GalleryPageProps } from '@/app/(default)/gallery/types'

export default async function Modal ({ params, searchParams }: GalleryPageProps): Promise<JSX.Element | null> {
  const { uuid, photoId } = await params
  const { type: entityType = 'area' } = await searchParams

  const photoData = await usePhotoData(uuid, photoId, entityType)
  const gallery = await fetchGalleryData(uuid, entityType)

  if (photoData == null || gallery == null) {
    return null
  }

  const { entityData, photos, currentPhoto, currentIndex, prevPhoto, nextPhoto } = photoData

  const { imageContent, sidebarContent } = ModalContent({
    entityData,
    currentPhoto,
    currentIndex,
    photos,
    prevPhoto,
    nextPhoto,
    uuid,
    entityType
  })

  return (
    <>
      {/* Gallery Grid Background */}
      <div className='min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Navigation */}
          <div className='mb-6'>
            <Link
              href={`/${entityType}/${uuid}/${gallery.slug}`}
              className='text-ob-primary hover:opacity-80 text-sm'
            >
              ← Back to {gallery.name}
            </Link>
          </div>

          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-base-content mb-2'>
              {gallery.name} Gallery
            </h1>
            <p className='text-base-content/60'>
              {gallery.mediaList.length} photo{gallery.mediaList.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Gallery Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {gallery.mediaList.map((media, idx) => {
              const mediaTitle = media.entityTags?.[0]?.climbName ?? media.entityTags?.[0]?.areaName
              return (
                <Link
                  key={media.id}
                  href={`/gallery/${uuid}/modal/${media.id}?type=${entityType}`}
                  className='group relative aspect-square overflow-hidden rounded-lg bg-base-200 hover:shadow-lg transition-shadow'
                >
                  <Image
                    src={media.mediaUrl}
                    alt={mediaTitle ?? `Photo ${idx + 1}`}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                  />
                  {mediaTitle != null && (
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end'>
                      <p className='text-white p-3 text-sm line-clamp-2'>
                        {mediaTitle}
                      </p>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      <ModalWrapper
        imageContainer={imageContent}
        sidebarContainer={sidebarContent}
      />
    </>
  )
}
