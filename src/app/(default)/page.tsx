import { Suspense } from 'react'
import { LandingHero } from './components/LandingHero'
import { getChangeHistoryServerSide } from '@/js/graphql/contribAPI'
import { LatestContributions, LatestContributionsSkeleton } from './components/LatestContributions'
import { FinancialContributors } from './components/FinancialContributors'
import { RecentTags } from './components/RecentTags'
import { USAToC } from './components/USAToC'
import { InternationalToC } from './components/InternationalToC'
import { Volunteers } from './components/Volunteers'
import { RecentContributionsMap } from './components/recent/RecentContributionsMap'

/**
 * Root home page
 */
export default async function Home (): Promise<any> {
  const history = await getChangeHistoryServerSide()
  return (
    <div>
      <LandingHero />

      <hr className='py-2 border-base-content' />

      <div className='w-full flex flex-col gap-y-16'>
        <div className='lg:grid lg:grid-cols-3 gap-x-2'>

          <div className='mt-8 lg:mt-0 lg:overflow-y-auto lg:h-[450px] w-full border-2 rounded-box'>
            <Suspense fallback={<LatestContributionsSkeleton />}>
              <LatestContributions />
            </Suspense>
          </div>

          <div className='lg:col-span-2 h-[450px]'>
            <RecentContributionsMap history={history} />
          </div>
        </div>
        <RecentTags />
        <InternationalToC />
        <USAToC />
        <div className='flex flex-col gap-10'>
          <FinancialContributors />
          <Volunteers />
        </div>
      </div>
    </div>
  )
}
