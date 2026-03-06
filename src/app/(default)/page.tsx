import { LandingHero } from './components/LandingHero'
// import { getChangeHistoryServerSide } from '@/js/graphql/contribAPI'
import { LatestContributions } from './components/LatestContributions'
import { FinancialContributors } from './components/FinancialContributors'
import { RecentTags } from './components/RecentTags'
import { USAToC } from './components/USAToC'
import { InternationalToC } from './components/InternationalToC'
import { Volunteers } from './components/Volunteers'
// import { RecentContributionsMap } from './components/recent/RecentContributionsMap'
// import { ChangesetType } from '@/js/types'

export const revalidate = 3600 // 1 hour

/**
 * Root home page
 */
export default async function Home (): Promise<any> {
  // Temporarily disabled to test if this is causing build failures
  // let history: ChangesetType[] = []
  // try {
  //   history = await getChangeHistoryServerSide()
  // } catch (error) {
  //   console.error('Failed to fetch change history during build:', error)
  //   // Continue with empty history if API is down
  // }
  // const history: never[] = []
  return (
    <>
      <div className='default-page-margins flex flex-col justify-center w-fit'>
        <LandingHero />
      </div>
      <div className='default-page-margins flex flex-col gap-y-12 mb-16'>
        <RecentTags />
        <LatestContributions />
        {/* Temporarily disabled to test if this is causing build failures */}
        {/* <div className='lg:col-span-2 h-[450px]'>
            <RecentContributionsMap history={history} />
          </div> */}
        <InternationalToC />
        <USAToC />
        <FinancialContributors />
        <Volunteers />
      </div>
    </>
  )
}
