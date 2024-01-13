import { getChangeHistoryServerSide } from '../../js/graphql/contribAPI'
import RecentChangeHistory from '@/components/edit/RecentChangeHistory'
import { ReactElement } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contribute to OpenBeta',
  description: 'Share your climbing adventure photos and contribute to the climbing route catalog.'
}

export default async function Page (): Promise<ReactElement> {
  const history = await getChangeHistoryServerSide()
  return (
    <section className='max-w-lg mx-auto w-full'>
      <h2 className='px-4 sm:px-0'>Recent history</h2>
      <RecentChangeHistory history={history} />
    </section>
  )
}
