import React from 'react'
import { Button, ButtonVariant } from './BaseButton'
import { ArrowRightIcon } from '@heroicons/react/outline'
export default function LandingHero () {
  return (
    <section className='z-0 bg-ob-primary bg-opacity-80 flex items-center flex-col justify-center  gap-y-8 py-8 lg:py-24'>
      <div className='z-0 px-8 flex flex-col md:flex-row  md:space-x-16 md:space-y-0 space-y-12 text-black'>
        <div className='text-center md:text-left md:pt-4'><h3 className='font-bold'>Free & Open Source</h3><div className='text-lg text-primary'>$0 to use and 100% open source</div></div>
        <div className='text-center md:text-left md:pt-4'><h3 className='font-bold'>Respect user privacy</h3><div className='text-lg text-primary'>No Ads, No tracking</div></div>
        <div className='text-center md:text-left md:pt-4'><h3 className='font-bold'>Community over profits</h3><div className='text-lg text-primary'>Backed by a nonprofit collective</div></div>
      </div>
      <div className='block'>
        <Button label={<>Start Exploring&nbsp;<ArrowRightIcon className='w-4 h-4' /></>} href='/' variant={ButtonVariant.SOLID_DEFAULT} />
      </div>
    </section>
  )
}
