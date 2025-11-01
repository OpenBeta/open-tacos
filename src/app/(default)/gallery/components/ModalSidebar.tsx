'use client'

import Link from 'next/link'
import TagList from '@/components/media/TagList'
import PhotoNavButtons from '@/app/(default)/gallery/components/PhotoNavButtons'
import type { MediaWithTags } from '@/js/types'
import type { GalleryData } from '@/app/(default)/gallery/util/galleryUtils'

interface ModalSidebarProps {
  entityData: GalleryData
  currentPhoto: MediaWithTags
  currentIndex: number
  totalPhotos: number
  prevPhoto: MediaWithTags | null
  nextPhoto: MediaWithTags | null
  uuid: string
  entityType: 'area' | 'climb'
}

export default function ModalSidebar ({
  entityData,
  currentPhoto,
  currentIndex,
  totalPhotos,
  prevPhoto,
  nextPhoto,
  uuid,
  entityType
}: ModalSidebarProps): JSX.Element {
  return (
    <div className='flex flex-col h-full p-4 space-y-4'>
      {/* Entity link - Back to area/climb */}
      <div className='border-b border-base-300 pb-3'>
        <Link
          href={`/${entityData.type ?? ''}/${entityData.uuid ?? ''}/${entityData.slug ?? ''}`}
          className='text-sm font-semibold text-ob-primary hover:opacity-90 hover:underline transition-opacity'
        >
          ← {entityData.name}
        </Link>
      </div>

      {/* Tags section */}
      {currentPhoto.entityTags != null && currentPhoto.entityTags.length > 0 && (
        <div>
          <h3 className='text-xs font-semibold text-base-content mb-2'>Tags</h3>
          <TagList mediaWithTags={currentPhoto} />
        </div>
      )}

      {/* Photo upload info if available */}
      {currentPhoto.username != null && (
        <div className='text-xs border-t border-base-300 pt-3'>
          <p>
            Uploaded by{' '}
            <Link
              href={`/user/${currentPhoto.username}`}
              className='text-ob-primary hover:opacity-90 hover:underline transition-opacity'
            >
              {currentPhoto.username}
            </Link>
          </p>
        </div>
      )}

      {/* Navigation buttons - at bottom */}
      <div className='flex-1 flex flex-col items-end justify-end'>
        {/* Photo counter - above buttons */}
        <div className='text-xs text-base-content/60 mb-3 w-full text-center'>
          Photo {currentIndex + 1} of {totalPhotos}
        </div>

        <div className='w-full'>
          <PhotoNavButtons
            prevPhoto={prevPhoto}
            nextPhoto={nextPhoto}
            currentIndex={currentIndex}
            totalPhotos={totalPhotos}
            uuid={uuid}
            entityType={entityType}
            basePath={`/gallery/${uuid}/modal`}
          />
        </div>
      </div>
    </div>
  )
}
