import { ArrowRightIcon } from '@heroicons/react/24/outline'

import { getChangeHistoryServerSide } from '@/js/graphql/contribAPI'
import { ChangesetRow } from '@/components/edit/RecentChangeHistory'
import Link from 'next/link'

export const RecentEdits: React.FC = async () => {
  const history = await getChangeHistoryServerSide()
  return (
    <section className='px-4 w-full'>
      <div className='flex items-center justify-between'>
        <h2>Recent edits</h2>
        <Link href='/edit' className='text-sm hover:underline'>See more</Link>
      </div>
      <hr className='mb-6 border-2 border-base-content' />
      <div className='mt-4 flex justify-center flex-row flex-wrap gap-y-10 gap-x-4'>
        {history.splice(0, 10).map(changetset =>
          <ChangesetRow key={changetset.id} changeset={changetset} />)}
      </div>
      <div className='flex justify-center py-10'>
        <Link href='/edit' className='btn btn-sm btn-outline'>See more <ArrowRightIcon className='w-4 h-4' /></Link>
      </div>
    </section>
  )
}
