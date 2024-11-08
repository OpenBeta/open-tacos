import { MouseEventHandler, useEffect, useState } from 'react'
import Image from 'next/image'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import clx from 'classnames'

interface ResponsiveImageProps {
  mediaUrl: string
  isHero: boolean
  isSquare?: boolean
  sizes?: string
}

/**
 * NextJS image wrapper with loading indicator
 */
export default function ResponsiveImage ({ mediaUrl, isHero = true, isSquare = false, sizes = '20vw' }: ResponsiveImageProps): JSX.Element {
  const [isLoading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    setLoading(true)
  }, [mediaUrl])
  return (
    <div
      className={clx('block relative w-full h-full overflow-hidden', isSquare ? 'aspect-square' : '')}
    >
      <Image
        src={mediaUrl}
        fill
        sizes={sizes}
        priority={isHero}
        onLoadingComplete={() => setLoading(false)}
        style={{
          objectFit: isSquare ? 'cover' : 'contain'
        }}
        alt=''
      />
      <div className='absolute w-full h-full flex items-center'>
        {isLoading &&
          <div className='mx-auto'>
            <EllipsisHorizontalIcon className='text-gray-200 w-16 h-16 animate-pulse' />
          </div>}
      </div>
    </div>
  )
}

/**
 * Image container with a known width.
 */
export const FixedWidthImageContainer: React.FC<{
  mediaUrl: string
  naturalWidth: number
  naturalHeight: number
  desiredWidth?: number
  onClick?: MouseEventHandler<HTMLImageElement>
  priority?: boolean
}> = ({ mediaUrl, naturalWidth, naturalHeight, desiredWidth = 300, onClick, priority = false }) => {
  const aspectRatio = naturalWidth / naturalHeight
  const height = desiredWidth / aspectRatio
  return (
    <Image
      priority={priority}
      src={mediaUrl}
      sizes='(max-width: 768px) 100vw,
      (max-width: 1200px) 50vw,
      20vw'
      width={desiredWidth}
      height={height}
      onClick={onClick !== undefined ? onClick : undefined}
      alt=''
    />
  )
}
