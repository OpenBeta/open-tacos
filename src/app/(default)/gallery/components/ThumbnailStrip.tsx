'use client'

import { useEffect, useRef } from 'react'
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
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbnailRefs = useRef<Array<HTMLAnchorElement | null>>([])

  useEffect(() => {
    const currentThumbnail = thumbnailRefs.current[currentIndex]
    if ((currentThumbnail != null) && (containerRef.current != null)) {
      // Use requestAnimationFrame to ensure DOM is painted
      requestAnimationFrame(() => {
        currentThumbnail.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        })
      })
    }
  }, [currentIndex])

  return (
    <div className='mt-4'>
      <div ref={containerRef} className='flex gap-2 overflow-x-auto pb-2'>
        {photos.map((photo, idx) => (
          <Link
            key={photo.id}
            ref={(el) => {
              thumbnailRefs.current[idx] = el
            }}
            href={`/gallery/${uuid}/modal/${photo.id}?type=${entityType}`}
            className={`flex-shrink-0 transition-all rounded-lg overflow-hidden border-2 ${
              idx === currentIndex
                ? 'border-blue-500 ring-2 ring-blue-400'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Image
              src={photo.mediaUrl ?? ''}
              alt={`Thumbnail ${idx + 1}`}
              width={80}
              height={80}
              className='object-cover w-20 h-20'
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
