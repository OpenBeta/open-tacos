import PhotoDisplay from '@/app/(default)/gallery/components/PhotoDisplay'
import ThumbnailStrip from '@/app/(default)/gallery/components/ThumbnailStrip'
import ModalSidebar from '@/app/(default)/gallery/components/ModalSidebar'
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

interface ModalContentReturn {
  imageContent: JSX.Element
  sidebarContent: JSX.Element
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
}: ModalContentProps): ModalContentReturn {
  // Left side: Image with thumbnail strip overlaid at bottom
  const imageContent = (
    <div className='relative w-full h-full'>
      {/* Photo Display */}
      <PhotoDisplay
        photo={currentPhoto}
        name={entityData.name}
        currentIndex={currentIndex}
        totalPhotos={photos.length}
      />

      {/* Thumbnail strip overlay at bottom */}
      <div className='absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-2'>
        <ThumbnailStrip
          photos={photos}
          currentIndex={currentIndex}
          uuid={uuid}
          entityType={entityType}
        />
      </div>
    </div>
  )

  // Right side: Entity info, tags, photo metadata, navigation
  const sidebarContent = (
    <ModalSidebar
      entityData={entityData}
      currentPhoto={currentPhoto}
      currentIndex={currentIndex}
      totalPhotos={photos.length}
      prevPhoto={prevPhoto}
      nextPhoto={nextPhoto}
      uuid={uuid}
      entityType={entityType}
    />
  )

  return { imageContent, sidebarContent }
}
