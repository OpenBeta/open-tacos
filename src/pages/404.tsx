import React, { useState } from 'react'
import Header from '../components/Header'
import Image from 'next/image'
import guyOnBoulder from '../images/guy_on_boulder.png'
import guyOnBoulderBG from '../images/guy_on_boulder_bg.png'
import useResponsive from '../js/hooks/useResponsive'

function NotFoundPage (): JSX.Element {
  const [ratio, setRatio] = useState(1)
  const { isMobile, isTablet } = useResponsive()

  let imageSize = 650
  if (isTablet) {
    imageSize = 580
  }
  if (isMobile) {
    imageSize = 480
  }

  return (
    <div className='h-screen bg-gray-50 overflow-hidden'>
      <div className='bg-white'>
        <Header />
      </div>

      <div
        className='relative h-full overflow-hidden'
      >
        <div
          className='absolute h-full w-full p-32 flex justify-center align-baseline'
        >
          <div className='flex absolute bottom-0 w-full
          opacity-100 xl:opacity-40 transition-opacity'
          >
            <Image
              style={{ bottom: '0' }}
              src={guyOnBoulderBG}
              layout='intrinsic'
            />
          </div>
        </div>

        <div className=' absolute h-full w-full p-32
        flex justify-center align-baseline'
        >
          <div className='flex absolute bottom-0'>
            <Image
              style={{ bottom: '0' }}
              width={imageSize}
              height={imageSize / ratio}
              src={guyOnBoulder}
              alt='Guy sitting on a boulder'
              layout='fixed'
              onLoadingComplete={({ naturalWidth, naturalHeight }) =>
                setRatio(naturalWidth / naturalHeight)}
            />
          </div>
        </div>

        <div className='absolute w-full flex justify-center p-8 sm:p-16 lg:p-32 lg:pt-16'>
          <div className='text-center mt-8'>
            <div className='flex justify-center'>
              <div className='bg-yellow-100 italic mb-2'>
                404
              </div>
            </div>

            <div className='bg-white text-6xl tracking-wide font-bold px-2 py-1'>
              Page not found
            </div>

            <div className='mt-2 bg-white'>
              You'll have to look somewhere else, it's not here
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
