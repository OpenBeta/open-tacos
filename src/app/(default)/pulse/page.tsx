import React, { ReactNode } from 'react'
import Link from 'next/link'
import clz from 'classnames'

import { getSummaryReport } from '@/js/graphql/opencollective'
import { getTagsLeaderboard } from '@/js/graphql/pulse'
import { FinancialReportType, TagsByUserType, TagsLeaderboardType } from '@/js/types'
import BackerCard from '@/components/ui/BackerCard'

/**
 *  Display key metrics and statistics
 */
export default async function Page (): Promise<JSX.Element> {
  const donationSummary: FinancialReportType = await getSummaryReport()
  const tagsLeaderboard: TagsLeaderboardType = await getTagsLeaderboard()

  return (
    <>
      <div className='default-page-margins grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div>
          <TagsSummary tagsLeaderboard={tagsLeaderboard} />
          <TagsLeaderboard tagsLeaderboard={tagsLeaderboard} />
        </div>
        <div className='lg:col-span-2'>
          <FinancialReport donationSummary={donationSummary} />
        </div>
      </div>
    </>
  )
}

const TagsSummary = ({ tagsLeaderboard }: TagsLeaderboardProps): JSX.Element => {
  return (
    <Box className='mt-4 stats'>
      <div className='stat'>
        <div className='stat-title font-bold'>Photos with tags</div>
        <div className='stat-value'>
          {tagsLeaderboard.allTime.totalMediaWithTags}
        </div>
        <div className='stat-desc whitespace-normal'>Tags help others learn more about the climbing areas.</div>
      </div>
    </Box>
  )
}
interface TagsLeaderboardProps {
  tagsLeaderboard: TagsLeaderboardType
}
const TagsLeaderboard = ({ tagsLeaderboard }: TagsLeaderboardProps): JSX.Element => {
  return (
    <Box className='mt-4 lg:mb-4'>
      <h2>Tags Leaderboard</h2>
      <div className='grid grid-cols-6 gap-2 items-center'>
        {tagsLeaderboard.allTime.byUsers.map(LeaderboardRow)}
      </div>
    </Box>
  )
}

const LeaderboardRow = (value: TagsByUserType, index: number): JSX.Element => {
  const url = `/u/${value?.username ?? ''}`

  return (
    <React.Fragment key={value.userUuid}>
      <div className='text-left align-middle text-sm'>
        <span className={
          clz(
            'p-1 rounded',
            index <= 2 ? 'bg-pink-500' : '') // a naive ranking highlight.  It can't handle ties.
          }
        >
          {index + 1}
        </span>
      </div>
      <div className='text-left col-span-4 uppercase thick-link'>
        {value?.username == null ? 'unknown' : <Link href={url} legacyBehavior>{value.username}</Link>}
      </div>
      <div className='text-right font-bold text-sm'>
        {value.total}
      </div>
    </React.Fragment>
  )
}

interface FinancialReportProps {
  donationSummary: FinancialReportType
}

const FinancialReport: React.FC<FinancialReportProps> = ({ donationSummary }) => {
  const { totalRaised, donors } = donationSummary

  return (
    <Box className='text-center mb-4 lg:mt-4'>
      <h2>Donations</h2>
      <p className='my-4 text-sm'>This platform is supported by climbers like you.  Thanks to our financial backers we've raised ${totalRaised}.</p>
      <div className='flex gap-2 xl:gap-4 flex-wrap items-center justify-center'>
        {donors.map(({ account }) =>
          <BackerCard key={account.id} name={account.name} imageUrl={account.imageUrl} />
        )}
      </div>
    </Box>

  )
}

const Box: React.FC<{ className?: string, children: ReactNode }> = ({ className, children }) => {
  return (
    <section
      className={clz(
        'break-inside-avoid-column break-inside-avoid relative block border-4 p-4 border-black rounded-box',
        className
      )}
    >
      {children}
    </section>
  )
}
