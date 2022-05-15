import React, { useState } from 'react'
import Image, { StaticImageData } from 'next/image'
// import guyOnBoulder from '../images/guy_on_boulder.png'
// import guyOnBoulderBG from '../images/guy_on_boulder_bg.png'
import useResponsive from '../../js/hooks/useResponsive'

interface ImagePlaneProps {
  foregroundImage: StaticImageData
  backgroundImage: StaticImageData
  style?: React.CSSProperties
  className?: string
  children?: JSX.Element
}

/**
 * For manually seperated foreground / background images, this component
 * separates them with some scaffolding styles. You CAN override the default
 * styles and class's... but not the required styles to scaffold images on top
 * of each other.
 */
export default function ImagePlane (props: ImagePlaneProps): JSX.Element {
  const { foregroundImage, backgroundImage, style, className } = props
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
    <div
      style={style}
      className={`overflow-hidden ${className !== undefined ? className : 'bg-gray-50 h-screen'}`}
    >
      <div className='relative h-full overflow-hidden'>
        <div className='absolute h-full w-full p-32 flex justify-center align-baseline'>
          <div className='flex absolute bottom-0 w-full
          opacity-100 xl:opacity-40 transition-opacity'
          >
            <Image
              style={{ bottom: '0' }}
              src={backgroundImage}
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
              src={foregroundImage}
              alt='Guy sitting on a boulder'
              layout='fixed'
              onLoadingComplete={({ naturalWidth, naturalHeight }) =>
                setRatio(naturalWidth / naturalHeight)}
            />

          </div>
        </div>

        <div className='absolute w-full flex justify-center p-8 sm:p-16 lg:p-32 lg:pt-16'>
          {(props as any).children}
        </div>
      </div>
    </div>
  )
}
