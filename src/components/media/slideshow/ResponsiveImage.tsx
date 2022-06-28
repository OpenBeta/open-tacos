import { useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import Image from 'next/image'
import { DotsHorizontalIcon } from '@heroicons/react/outline'

import { DefaultLoader } from '../../../js/sirv/util'

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
