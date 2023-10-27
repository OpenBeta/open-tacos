import { LandingCTA } from './components/LandingCTA'
import { LandingHero } from './components/LandingHero'
import { RecentEdits } from './components/RecentEdits'
import { RecentTags } from './components/RecentTags'
import { USAToC } from './components/USAToC'

export default async function Home (): Promise<any> {
  return (
    <div className='mt-8 w-full flex flex-col gap-y-24'>
      <div className='lg:pl-4 lg:grid lg:grid-cols-3'>
        <div className='col-span-2 pb-10 bg-gradient-to-r from-cyan-500/40 to-blue-500/60 rounded-box'>
          <LandingHero />
          <LandingCTA />
          <p className='mt-12 px-10 text-center text-sm'>Our website is undergoing a facelift. Visit the <a href='/classic' className='underline'>old home</a>. <br /><span className='text-base-content/60'>Questions or comments? <a href='mailto:hello@openbeta.io'>hello@openbeta.io</a></span></p>
        </div>
        <div className='mt-8 lg:mt-0 lg:overflow-y-auto lg:h-[800px] w-full'>
          <RecentEdits />
        </div>
      </div>
      <RecentTags />
      <USAToC />
    </div>
  )
}
