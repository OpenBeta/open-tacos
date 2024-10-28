import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

export const LandingHero: React.FC = () => {
  return (
    <section className='mt-6'>
      <h1 className='text-2xl tracking-tighter font-bold'>Share your climbing route knowledge!</h1>
      <div className='font-medium text-neutral/80'>
        Join us to help improve this comprehensive climbing resource for the community.
      </div>
      <div className='mt-2 flex gap-6'>
        <HeroAlert link="/maps" text="Clmbing Areas By State" badge='Find'/>
        <HeroAlert link="/maps" text="Crag maps" badge='New'/>

      </div>
    </section>
  )
}

interface HeroAlertProps {
  link: string;
  text: string;
  badge: string;
}

export const HeroAlert: React.FC<HeroAlertProps> = ({ link, text,badge }) => (
  <div className='alert alert-warning w-[50%]'>
    <span className='badge badge-sm badge-primary'>{ badge}</span>
    <Link href={link} className='underline flex items-center gap-1 text-sm'>
      {text} <ArrowRight size={20} />
    </Link>
  </div>
)
