'use client'
import Image from 'next/image'
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
  return (
    <div className='relative w-full h-full bg-base-200 overflow-hidden flex items-center justify-center'>
      {photo.mediaUrl !== undefined && (
        <Image
          src={photo.mediaUrl}
          alt={`Photo ${currentIndex + 1} of ${totalPhotos} for ${name}`}
          fill
          className='object-contain'
          priority
        />
      )}
    </div>
  )
}
