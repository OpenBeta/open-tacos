import React from 'react'
import Topography from '../../assets/topography.svg'
import { Button, ButtonVariant } from './BaseButton'

export default function LandingHero () {
  return (
    <div className='z-0 bg-gray-800 h-screen lg:h-3/5' style={{ display: 'grid', minHeight: '350px' }}>
      <Topography
        className='w-full h-full opacity-60 z-10' style={{
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
        <section className='z-0 pt-16 lg:pb-4 px-8 flex flex-col md:flex-row  md:gap-x-16 gap-y-12'>
          <div className='text-center md:text-left md:pt-4'><h3 className='text-white font-bold'>Free & Open Source</h3><div className='text-lg text-pink-500'>$0 to use and 100% open source</div></div>
          <div className='text-center md:text-left md:pt-4'><h3 className='text-white font-bold'>Respect user privacy</h3><div className='text-lg text-pink-500'>No Ads, No tracking</div></div>
          <div className='text-center md:text-left md:pt-4'><h3 className='text-white font-bold'>Community over profits</h3><div className='text-lg text-pink-500'>Backed by a nonprofit collective</div></div>
        </section>
        <div className='pt-8 lg:-mt-24 2xl:-mt-32 z-50'>
          <Button label='Explore' onClick={() => alert('click')} variant={ButtonVariant.OUTLINED_PRIMARY} />
        </div>
      </div>
    </div>
  )
}
