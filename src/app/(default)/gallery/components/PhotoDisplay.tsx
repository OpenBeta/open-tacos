'use client'
import { useState } from 'react'
import Image from 'next/image'
import PhotoFooter from '@/components/media/PhotoFooter'
import { MediaWithTags } from '@/js/types'

interface PhotoDisplayProps {
  photo: MediaWithTags
  name: string
  currentIndex: number
  totalPhotos: number
}

export default function PhotoDisplay ({
  photo,
  name,
  currentIndex,
  totalPhotos
}: PhotoDisplayProps): JSX.Element {
  const [hover, setHover] = useState(false)

  return (
    <div
      className='relative w-full aspect-[3/2] bg-base-200 rounded-lg overflow-hidden mb-4'
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {photo.mediaUrl !== undefined && (
        <Image
          src={photo.mediaUrl}
          alt={`Photo ${currentIndex + 1} of ${totalPhotos} for ${name}`}
          fill
          className='object-contain'
          priority
        />
      )}
      <PhotoFooter mediaWithTags={photo} hover={hover} />
    </div>
  )
}
