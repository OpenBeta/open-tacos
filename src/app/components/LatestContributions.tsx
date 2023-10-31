import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

import { getChangeHistoryServerSide } from '@/js/graphql/contribAPI'
import { ChangesetCard } from '@/components/edit/RecentChangeHistory'

/**
 * Show most recent contributions
 */
export const LatestContributions: React.FC = async () => {
  const history = await getChangeHistoryServerSide()
  return (
    <Container>
      {history.splice(0, 10).map(changetset =>
        <ChangesetCard key={changetset.id} changeset={changetset} />
      )}
    </Container>
  )
}

/**
 * Resuable container for actual and skeleton
 */
const Container: React.FC<{ children: ReactNode }> = ({ children }) => (
  <section className='px-4 w-full'>
    <div className='mt-2 flex items-center justify-between'>
      <h3>Latest contributions </h3>
      <Link href='/edit' className='text-sm hover:underline'>See more</Link>
    </div>
    <hr className='mb-6 border-1 border-base-content' />
    <div className='mt-4 flex justify-center flex-row flex-wrap gap-y-10 gap-x-4'>
      {children}
    </div>
    <div className='flex justify-center py-10'>
      <Link href='/edit' className='btn btn-sm btn-outline'>See more <ArrowRightIcon className='w-4 h-4' /></Link>
    </div>
  </section>
)

/**
 * Loading skelton
 */
export const LatestContributionsSkeleton: React.FC = () => {
  return (
    <Container>
      {[1, 2, 3, 4, 5].map(item => <div key={item} className='w-full bg-base-200/20 h-36 rounded-box' />)}
    </Container>
  )
}
