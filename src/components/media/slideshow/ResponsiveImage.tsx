import { MouseEventHandler, useEffect, useState } from 'react'
import Image from 'next/image'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import clx from 'classnames'

import { DefaultLoader, MobileLoader } from '../../../js/sirv/util'

const keyStr =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

const triplet = (e1, e2, e3): string =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63)

const rgbDataURL = (r, g, b): string =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`

const DefaultPlaceholder = rgbDataURL(226, 232, 240)

interface ResponsiveImageProps {
  mediaUrl: string
  isHero: boolean
  isSquare?: boolean
  loader?: null | ((props: any) => string)
}

/**
 * NextJS image wrapper with loading indicator
 */
export default function ResponsiveImage ({ mediaUrl, isHero = true, isSquare = false, loader = null }: ResponsiveImageProps): JSX.Element {
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
        loader={loader ?? DefaultLoader}
        quality={90}
        layout='fill'
        sizes='100vw'
        objectFit={isSquare ? 'cover' : 'contain'}
        priority={isHero}
        onLoadingComplete={() => setLoading(false)}
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

interface SSRResponsiveImageProps extends ResponsiveImageProps {
  naturalWidth: number
  naturalHeight: number
  onClick?: MouseEventHandler<HTMLImageElement> | undefined
}

export function ResponsiveImage2 ({ mediaUrl, naturalWidth, naturalHeight, isHero = true, loader = null, onClick = undefined }: SSRResponsiveImageProps): JSX.Element {
  const aspectRatio = naturalWidth / naturalHeight
  const width = 300
  const height = width / aspectRatio
  return (
    <Image
      src={mediaUrl}
      loader={MobileLoader}
      layout='responsive'
      sizes='(max-width: 768px) 100vw,
      (max-width: 1200px) 50vw,
      33vw'
      width={width}
      height={height}
      objectFit='fill'
      placeholder='blur'
      blurDataURL={DefaultPlaceholder}
      onClick={onClick !== undefined ? onClick : undefined}
    />
  )
}
