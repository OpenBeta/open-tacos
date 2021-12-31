import React from 'react'

import { TextButton } from './Button'

export default function LandingHero () {
  return (
    <div style={{ display: 'grid' }}>
      {/* <StaticImage
        src='../../images/landing-hero-v1.jpg'
        alt='Indian Creek at sunset'
        layout='fullWidth'
        placeholder='blurred'
        quality='90'
        style={{
          gridArea: '1/1'
        }}
      /> */}
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
        {/* In order to create full-screen effect this hero component is placed outside
        of global Layout. Make sure the container's width below is the same Layout's */}
        <div className='w-full max-w-4xl mx-auto md:px-8 md:py-20 sm:px-4'>
          <h1 className='text-5xl text-white antialiased tracking-tight leading-tight mt-4 mb-2'>
            Open collaboration <br /> climbing route catalog
          </h1>
          <TextButton label='Learn more' to='/about' />
        </div>
      </div>
    </div>
  )
}
