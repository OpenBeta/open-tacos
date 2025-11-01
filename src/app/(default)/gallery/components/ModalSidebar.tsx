'use client'

import Link from 'next/link'
import { ArrowDownTrayIcon, CameraIcon } from '@heroicons/react/24/outline'
import TagList from '@/components/media/TagList'
import PhotoNavButtons from '@/app/(default)/gallery/components/PhotoNavButtons'
import { BaseUploader } from '@/components/media/BaseUploader'
import { downloadPhoto } from '@/app/(default)/gallery/util/downloadPhoto'
import type { MediaWithTags, TagTargetType } from '@/js/types'
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
  const handleDownload = (): void => {
    if (currentPhoto.mediaUrl === undefined) return
    const fileName = `photo-${currentIndex + 1}.jpg`
    void downloadPhoto(currentPhoto.mediaUrl, fileName)
  }

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
              href={`/u/${currentPhoto.username}`}
              className='text-ob-primary hover:opacity-90 hover:underline transition-opacity'
            >
              {currentPhoto.username}
            </Link>
          </p>
        </div>
      )}

      {/* Navigation buttons - at bottom */}
      <div className='flex-1 flex flex-col items-end justify-end'>
        {/* Photo counter with download button */}
        <div className='text-sm text-base-content/60 mb-3 w-full flex items-center justify-between'>
          <span>Photo {currentIndex + 1} of {totalPhotos}</span>
          <button
            onClick={handleDownload}
            className='w-8 h-8 flex items-center justify-center text-base-content/60 hover:text-base-content hover:bg-base-200 rounded transition-colors'
            title='Download photo'
            aria-label='Download photo'
          >
            <ArrowDownTrayIcon className='w-5 h-5' />
          </button>
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

        {/* Upload CTA - below nav buttons */}
        <div className='w-full mt-4 pt-4 border-t border-base-300'>
          <BaseUploader
            className='flex flex-col items-center justify-center p-4 border-2 border-dashed border-base-content/30 rounded-lg hover:border-base-content/50 hover:bg-base-200/30 transition-colors cursor-pointer'
            tagType={(entityType === 'climb' ? 0 : 1) as TagTargetType}
            uuid={uuid}
          >
            <CameraIcon className='w-6 h-6 text-base-content/60 mb-2' />
            <span className='text-xs text-base-content/60'>Share a photo</span>
          </BaseUploader>
        </div>
      </div>
    </div>
  )
}
