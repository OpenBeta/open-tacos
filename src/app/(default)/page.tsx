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
import { ChangesetType } from '@/js/types'

export const revalidate = 3600 // 1 hour

/**
 * Root home page
 */
export default async function Home (): Promise<any> {
  let history: ChangesetType[] = []
  try {
    history = await getChangeHistoryServerSide()
  } catch (error) {
    console.error('Failed to fetch change history during build:', error)
    // Continue with empty history if API is down
  }
  return (
    <>
      <div className='default-page-margins flex flex-col justify-center w-fit'>
        <LandingHero />
      </div>
      <div className='default-page-margins flex flex-col gap-y-12 mb-16'>
        <RecentTags />
        <div className='lg:grid lg:grid-cols-3 gap-x-2'>
          <div className='lg:overflow-y-auto lg:h-[450px] w-full border-2 rounded-box'>
            <Suspense fallback={<LatestContributionsSkeleton />}>
              <LatestContributions />
            </Suspense>
          </div>

          <div className='lg:col-span-2 h-[450px]'>
            <RecentContributionsMap history={history} />
          </div>
        </div>
        <InternationalToC />
        <USAToC />
        <FinancialContributors />
        <Volunteers />
      </div>
    </>
  )
}
