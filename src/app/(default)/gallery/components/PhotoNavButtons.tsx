'use client'

import Link from 'next/link'
import type { MediaWithTags } from '@/js/types'

interface PhotoNavButtonsProps {
  prevPhoto: MediaWithTags | null
  nextPhoto: MediaWithTags | null
  currentIndex: number
  totalPhotos: number
  uuid: string
  entityType: 'area' | 'climb'
  basePath: string // e.g., '/gallery/{uuid}' or '/gallery/{uuid}/modal'
}

export default function PhotoNavButtons ({
  prevPhoto,
  nextPhoto,
  currentIndex,
  totalPhotos,
  uuid,
  entityType,
  basePath
}: PhotoNavButtonsProps): JSX.Element {
  return (
    <div className='flex justify-between items-center gap-4 pt-4 border-t border-base-300'>
      {(prevPhoto != null)
        ? (
          <Link
            href={`${basePath}/${prevPhoto.id}?type=${entityType}`}
            className='px-4 py-2 bg-ob-primary text-white rounded hover:opacity-80 transition-opacity'
          >
            ← Previous
          </Link>
          )
        : (
          <div />
          )}

      <span className='text-sm text-base-content/60'>
        Photo {currentIndex + 1} of {totalPhotos}
      </span>

      {(nextPhoto != null)
        ? (
          <Link
            href={`${basePath}/${nextPhoto.id}?type=${entityType}`}
            className='px-4 py-2 bg-ob-primary text-white rounded hover:opacity-80 transition-opacity'
          >
            Next →
          </Link>
          )
        : (
          <div />
          )}
    </div>
  )
}
