import Link from 'next/link'
import { ArrowRightIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { SectionContainer } from './ui/SectionContainer'

// Temporarily disabled to test build - this fetches 6MB of data
// import { getChangeHistoryServerSide } from '@/js/graphql/contribAPI'
// import { ChangesetCard } from '@/components/edit/RecentChangeHistory'

/**
 * Show most recent contributions
 */
export const LatestContributions: React.FC = async () => {
  // Temporarily disabled - fetches 6MB history just to show 10 items
  // const history = await getChangeHistoryServerSide()
  return (
    <SectionContainer header={<h2>Latest Contributions</h2>}>
      <Link
        href='/edit'
        className='group flex items-center justify-between gap-4 w-full rounded-box border border-base-content/20 bg-base-200/40 hover:bg-base-200 hover:border-base-content/40 transition-all duration-200 p-5 lg:p-6'
      >
        <div className='flex items-center gap-4'>
          <div className='flex-shrink-0 w-10 h-10 rounded-box bg-base-content/10 group-hover:bg-base-content/15 flex items-center justify-center transition-colors duration-200'>
            <PencilSquareIcon className='w-5 h-5 text-base-content/70' />
          </div>
          <div>
            <p className='font-semibold text-base-content text-sm uppercase tracking-wide'>View recent edits</p>
            <p className='text-sm text-base-content/60 mt-0.5'>Browse the latest changes made by the community</p>
          </div>
        </div>
        <ArrowRightIcon className='w-5 h-5 text-base-content/40 group-hover:text-base-content/70 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0' />
      </Link>
    </SectionContainer>
  )
}
