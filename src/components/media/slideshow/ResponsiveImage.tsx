import { useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import Image from 'next/image'
import { DotsHorizontalIcon } from '@heroicons/react/outline'
import ContentLoader from 'react-content-loader'
import classNames from 'classnames'
import { DefaultLoader, MobileLoader } from '../../../js/sirv/util'

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

export function ResponsiveImage2 ({ mediaUrl, isHero = true, loader = null }: ResponsiveImageProps): JSX.Element {
  const [dimension, setDimension] = useState({ naturalWidth: 300, naturalHeight: 400 })
  const [isLoading, setIsLoading] = useState(true)
  // useEffect(() => {
  //   setLoaded(false)
  // }, [mediaUrl])
  return (
    <>
      <div className={classNames('block relative', isLoading ? 'w-[300] h-[400] bg-gray-400' : 'visible')}>
        <Image
          src={mediaUrl}
          loader={MobileLoader}
          layout='responsive'
          sizes='100vw'
          width={dimension.naturalWidth}
          height={dimension.naturalHeight}
          objectFit='cover'
          onLoadingComplete={(d) => {
            setDimension(d)
            setIsLoading(false)
            console.log('#loaded')
          }}
        />
        {/* {isLoading && <ImagePlaceholder uniqueKey={mediaUrl} />} */}
        {/* {!loaded && <ImagePlaceholder uniqueKey={mediaUrl} />} */}

      </div>
      {/* <div className='absolute block w-full h-full'> */}
      {/* </div> */}
    </>
  )
}

const ImagePlaceholder = ({ uniqueKey }): JSX.Element => (
  <ContentLoader
    uniqueKey={uniqueKey}
    // height={400}
    width={400}
    speed={0}
    backgroundColor='rgb(243 244 246)'
    viewBox='0 0 40 40'
  >
    <rect rx={0} ry={0} width='40' height='40' />
  </ContentLoader>)
