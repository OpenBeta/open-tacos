import Heart from '@/assets/icons/heart-hero'

export const LandingHero: React.FC = () => {
  return (
    <section className='w-full rounded-box p-10 flex justify-center'>
      <div className='flex flex-wrap justify-center items-center gap-10'>
        <span className='text-4xl md:text-6xl tracking-tight'>Knowledge</span>
        <span className='align-text-bottom font-semibold text-2xl'>+</span>
        <span className='-translate-y-1 -rotate-6 font-bold text-4xl md:text-6xl tracking-tight hero-text-shadow'>You</span> <span className='font-semibold text-2xl'>=</span> <Heart className='h-16 w-16' />
      </div>
    </section>
  )
}
