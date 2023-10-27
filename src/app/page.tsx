import { LandingCTA } from './components/LandingCTA'
import { LandingHero } from './components/LandingHero'
import { RecentEdits } from './components/RecentEdits'
import { RecentTags } from './components/RecentTags'
import { USAToC } from './components/USAToC'

export default async function Home (): Promise<any> {
  return (
    <div className='mt-8 w-full flex flex-col gap-y-24'>
      <div className='px-4 lg:grid lg:grid-cols-3'>
        <div className='col-span-2 px-10 pb-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-box'>
          <LandingHero />
          <LandingCTA />
        </div>
        <div className='lg:overflow-y-auto lg:h-[800px] w-full'>
          <RecentEdits />
        </div>
      </div>
      <RecentTags />
      <USAToC />
    </div>
  )
}
