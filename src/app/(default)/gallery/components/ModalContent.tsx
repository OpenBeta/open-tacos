import Link from 'next/link'
import PhotoDisplay from '@/app/(default)/gallery/components/PhotoDisplay'
import PhotoNavButtons from '@/app/(default)/gallery/components/PhotoNavButtons'
import ThumbnailStrip from '@/app/(default)/gallery/components/ThumbnailStrip'
import type { MediaWithTags } from '@/js/types'
import type { GalleryData } from '@/app/(default)/gallery/util/galleryUtils'

interface ModalContentProps {
  entityData: GalleryData
  currentPhoto: MediaWithTags
  currentIndex: number
  photos: MediaWithTags[]
  prevPhoto: MediaWithTags | null
  nextPhoto: MediaWithTags | null
  uuid: string
  entityType: 'area' | 'climb'
}

export default function ModalContent ({
  entityData,
  currentPhoto,
  currentIndex,
  photos,
  prevPhoto,
  nextPhoto,
  uuid,
  entityType
}: ModalContentProps): JSX.Element {
  return (
    <div className='flex flex-col gap-4'>
      {/* Header with title */}
      <div className='pb-4 border-b'>
        <Link
          href={`/${entityData.type ?? ''}/${entityData.uuid ?? ''}/${entityData.slug ?? ''}`}
          className='text-2xl font-bold text-ob-primary hover:opacity-90 hover:underline transition-opacity'
        >
          ← Back to {entityData.name}
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
  )
}
