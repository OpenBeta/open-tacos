'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MediaWithTags } from '@/js/types'

interface ThumbnailStripProps {
  photos: MediaWithTags[]
  currentIndex: number
  uuid: string
  entityType: 'area' | 'climb'
}

export default function ThumbnailStrip ({
  photos,
  currentIndex,
  uuid,
  entityType
}: ThumbnailStripProps): JSX.Element {
  return (
    <div className='mt-4'>
      <div className='flex gap-2 overflow-x-auto pb-2'>
        {photos.map((photo, idx) => (
          <Link
            key={photo.id}
            href={`/gallery/${uuid}/modal/${photo.id}?type=${entityType}`}
            className={`flex-shrink-0 transition-all rounded-lg overflow-hidden border-2 cursor-pointer ${
              idx === currentIndex
                ? 'border-ob-primary ring-2 ring-ob-primary ring-opacity-40'
                : 'border-base-300 hover:border-ob-primary'
            }`}
          >
            <Image
              src={photo.mediaUrl ?? ''}
              alt={`Thumbnail ${idx + 1}`}
              width={80}
              height={80}
              className='object-cover w-20 h-20 pointer-events-none select-none'
              draggable={false}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
