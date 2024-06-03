import Image from 'next/image'
import { CheckCircle } from '@phosphor-icons/react/dist/ssr'

import mapHero from '@/public/hero-map.jpg'
import CodingSvg from '@/assets/illustrations/coding-5-7'

export const Hero: React.FC = () => (
  <section className='bg-accent/80'>
    <div className='default-page-margins'>
      <div className='p-8 2xl:p-0 2xl:pb-8 2xl:pl-16'>
        <Heading />
        <Values />
      </div>
    </div>
  </section>
)

const Heading: React.FC = () => (
  <div className='py-16 max-w-lg'>
    <h1 className='text-5xl tracking-tighter font-bold mb-6'>A Free Resource For Climbers</h1>
    <p>Inspired by Wikipedia and OpenStreetMap, we're building an <span className='bg-yellow-400/60 p-1 rounded'>open source and open license</span> rock climbing catalog.</p>
  </div>
)

const Values: React.FC = () => (
  <div className='block lg:grid lg:grid-cols-2 gap-8'>
    <div>
      <h3 className='text-2xl text-secondary pb-4 font-bold'>Our values</h3>

      <div className='flex flex-col gap-6'>
        <ValuePropCard
          title='Free & Open Source'
          description='$0 to use and 100% open source.'
        />

        <ValuePropCard
          title='Respect user privacy'
          description='No Ads, No tracking.'
        />

        <ValuePropCard
          title='Community First'
          description='Backed by a volunteer-run nonprofit organization.'
        />
      </div>
    </div>
    <div className='pt-8 lg:pt-0 relative'>
      <div className='pb-16'>
        <Image
          className='block rounded-box border-4 border-slate-600 shadow-xl'
          src={mapHero}
          alt='Picture of a map'
          width={400}
          unoptimized
        />
      </div>
      <div className='absolute bottom-0 left-24'>
        <CodingSvg className='block w-56 stroke-slate-800' />
      </div>
    </div>
  </div>
)

const ValuePropCard: React.FC<{ title: string, description: string }> = ({ title, description }) => (
  <div className='flex gap-2'>
    <CheckCircle size={28} weight='bold' />
    <div>
      <span className='font-semibold text-xl'>{title}</span>
      <p className='text-secondary'>{description}</p>
    </div>
  </div>
)
