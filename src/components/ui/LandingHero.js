import React, { useEffect, useState } from 'react'
import { TextButton } from './Button'
import Image from 'next/image'
import Topography from '../../assets/topography.svg'

export default function LandingHero () {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setLoaded(true)
  }, [])
  const effectClz = loaded ? 'md:-translate-y-5 opacity-100' : 'md:opacity-0'
  const clz = `transform transition-all duration-1000 ease-in ${effectClz}`
  return (
    <div className='bg-gray-800 md:h-3/5' style={{ display: 'grid' }}>
      <Topography
        className='w-full h-full opacity-20' style={{
          gridArea: '1/1'
        }}
      />
      <div
        style={{
          // By using the same grid area for both, they are stacked on top of each other
          gridArea: '1/1',
          position: 'relative',
          // This centers the other elements inside the hero component
          placeItems: 'center',
          display: 'grid'
        }}
      >
        <section className='pt-32 md:pb-0 px-8 flex flex-col md:flex-row  md:gap-x-16 gap-y-12'>
          <div className={`delay-75 ${clz} flex flex-col items-center`}>
            <Image className='' src='/tortilla.png' height={125} width={125} />
            <div className='mt-4 font-sans text-xl text-white tracking-tight text-custom-primary'>OpenTacos</div>
          </div>
          <div className={`delay-300 ${clz} text-white text-center md:text-left`}><h2 className='font-light'>Free & Open Source</h2><div className='text-lg text-custom-green'>$0 to use and 100% open source</div></div>
          <div className={`delay-500 ${clz} text-white text-center md:text-left`}><h2 className=' font-light'>Respect user privacy</h2><div className='text-lg text-custom-green'>No Ads, No tracking</div></div>
          <div className={`delay-700 ${clz} text-white text-center md:text-left`}><h2 className='font-light'>Community over profits</h2><div className='text-lg text-custom-green'>Backed by a nonprofit collective</div></div>
        </section>
        <div className={`delay-1000 ${clz}`}>
          <TextButton label='Explore' to='/' />
        </div>
      </div>
    </div>
  )
}
