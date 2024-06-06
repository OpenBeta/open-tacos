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

export const revalidate = 3600 // 1 hour

/**
 * Root home page
 */
export default async function Home (): Promise<any> {
  const history = await getChangeHistoryServerSide()
  return (
    <>
      <div className='default-page-margins'>
        <LandingHero />
        <hr className='my-4 border-base-content' />
      </div>
      <div className='default-page-margins flex flex-col gap-y-16 mb-16'>
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
        <FinancialContributors />
        <Volunteers />
      </div>
    </>
  )
}
