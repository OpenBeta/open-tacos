'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [isDown, setIsDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (containerRef.current === null) return
    setIsDown(true)
    setIsDragging(false)
    setStartX(e.pageX - (containerRef.current.offsetLeft ?? 0))
    setScrollLeft(containerRef.current.scrollLeft ?? 0)
  }

  const handleMouseLeave = (): void => {
    setIsDown(false)
    setIsDragging(false)
  }

  const handleMouseUp = (): void => {
    setIsDown(false)
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!isDown || containerRef.current === null) return
    const x = e.pageX - (containerRef.current.offsetLeft ?? 0)
    const walk = (x - startX) * 1
    // Only consider it a drag if movement is more than 5 pixels
    if (Math.abs(walk) > 5) {
      setIsDragging(true)
      e.preventDefault()
      containerRef.current.scrollLeft = (scrollLeft ?? 0) - walk
    }
  }

  return (
    <div className='mt-4'>
      <div
        ref={containerRef}
        className='flex gap-2 overflow-x-auto pb-2 justify-center cursor-grab active:cursor-grabbing'
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onDragStart={(e) => {
          e.preventDefault()
        }}
      >
        {photos.map((photo, idx) => (
          <Link
            key={photo.id}
            ref={(el) => {
              thumbnailRefs.current[idx] = el
            }}
            href={`/gallery/${uuid}/modal/${photo.id}?type=${entityType}`}
            onClick={(e) => {
              if (isDragging) {
                e.preventDefault()
              }
            }}
            className={`flex-shrink-0 transition-all rounded-lg overflow-hidden border-2 ${
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
