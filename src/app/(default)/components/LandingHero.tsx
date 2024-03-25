import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

export const LandingHero: React.FC = () => {
  return (
    <section className='w-full px-6 py-4'>
      <h1 className='text-2xl tracking-tighter font-semibold'>Share your climbing route knowledge!</h1>
      <div className='font-medium text-neutral/80'>
        Join us to help improve this comprehensive climbing resource for the community.
      </div>
      <div className='mt-2'>
        <HeroAlert />
      </div>
    </section>
  )
}

export const HeroAlert: React.FC = () => (
  <div className='alert alert-warning'>
    <span className='badge badge-sm badge-primary'>NEW</span>
    <a href='/maps' className='underline flex items-center gap-1 text-sm'>Crag maps<ArrowRight size={20} /></a>
  </div>)
