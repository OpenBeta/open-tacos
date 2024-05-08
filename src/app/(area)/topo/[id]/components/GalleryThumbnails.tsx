'use client'
import { useState, Dispatch, SetStateAction } from 'react'
import Image from 'next/image'
import clx from 'classnames'
import { AreaType, MediaWithTags } from '@/js/types'

type GalleryThumbnailsProps = AreaType

export const GalleryThumbnails: React.FC<GalleryThumbnailsProps> = ({ media }) => {
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(media[0]?.id ?? null)
  const currentMedia = media.find(media => media.id === currentPhoto)
  return (
    <div className='w-full'>
      <div className='flex flex-rows flex-wrap gap-4'>
        {media.map(media =>
          <Thumbnail
            key={media.id}
            {...media} onClick={setCurrentPhoto}
            selected={currentPhoto === media.id}
          />)}
      </div>
      <div className='mt-6'>
        {(currentMedia != null) && <ActivePhoto {...currentMedia} />}
      </div>
    </div>
  )
}

const IMAGE_MAX_WIDITH = 200

interface ThumbnailProps extends MediaWithTags {
  onClick: Dispatch<SetStateAction<string | null>>
  selected: boolean
}

const Thumbnail: React.FC<ThumbnailProps> = ({ id, mediaUrl, width, height, entityTags, onClick, selected }) => {
  const imageRatio = width / height
  return (
    <div className={clx('relative block hover:cursor-pointer', selected && 'ring-2 ring-offset-1')} onClick={() => onClick(id)}>
      <Image
        src={mediaUrl}
        width={IMAGE_MAX_WIDITH}
        height={IMAGE_MAX_WIDITH / imageRatio}
        sizes='25vw'
        alt=''
      />
    </div>
  )
}

const ActivePhoto: React.FC<MediaWithTags> = ({ mediaUrl, width, height, entityTags }) => {
  const imageRatio = width / height
  const WIDTH = 800
  return (
    <div className='relative block w-full'>
      <Image
        src={mediaUrl}
        width={WIDTH}
        height={WIDTH / imageRatio}
        sizes='25vw'
        alt=''
      />
    </div>
  )
}
