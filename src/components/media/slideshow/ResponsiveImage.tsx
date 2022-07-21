import { useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import Image from 'next/image'
import { DotsHorizontalIcon } from '@heroicons/react/outline'
import { DefaultLoader, MobileLoader } from '../../../js/sirv/util'

const keyStr =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

const triplet = (e1, e2, e3): string =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63)

const rgbDataURL = (r, g, b): string =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`

const DefaultPlaceholder = rgbDataURL(226, 232, 240)

interface ResponsiveImageProps {
  mediaUrl: string
  isHero: boolean
  loader?: null | ((props: any) => string)
}

/**
 * NextJS image wrapper with loading indicator
 */
export default function ResponsiveImage ({ mediaUrl, isHero = true, loader = null }: ResponsiveImageProps): JSX.Element {
  const [isLoading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    setLoading(true)
  }, [mediaUrl])
  return (
    <Transition
      show
      enter='transition duration-500 ease-out'
      enterFrom='transform opacity-50'
      enterTo='transform opacity-100'
      as='div'
      className='block relative w-full h-full aspect-square'
    >
      <Image
        src={mediaUrl}
        loader={loader ?? DefaultLoader}
        quality={90}
        layout='fill'
        sizes='100vw'
        objectFit='contain'
        priority={isHero}
        onLoadingComplete={() => setLoading(false)}
      />
      <div className='absolute w-full h-full flex items-center'>
        {isLoading &&
          <div className='mx-auto'>
            <DotsHorizontalIcon className='text-gray-200 w-16 h-16 animate-pulse' />
          </div>}
      </div>
    </Transition>
  )
}

interface SSRResponsiveImageProps extends ResponsiveImageProps {
  naturalWidth: number
  naturalHeight: number
}

export function ResponsiveImage2 ({ mediaUrl, naturalWidth, naturalHeight, isHero = true, loader = null }: SSRResponsiveImageProps): JSX.Element {
  const aspectRatio = naturalWidth / naturalHeight
  const width = 300
  const height = width / aspectRatio
  return (
    <Image
      src={mediaUrl}
      loader={MobileLoader}
      layout='responsive'
      sizes='50vw'
      width={width}
      height={height}
      objectFit='contain'
      placeholder='blur'
      blurDataURL={DefaultPlaceholder}
    />
  )
}
// style={{ maxWidth: width, maxHeight: height, aspectRatio: aspectRatio as string }}
