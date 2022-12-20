import React, { ReactElement } from 'react'
import { NextPage, GetStaticProps } from 'next'
import Link from 'next/link'
import Layout from '../components/layout'
import SeoTags from '../components/SeoTags'
import clz from 'classnames'

import { getSummaryReport } from '../js/graphql/opencollective'
import { getTagsLeaderboard } from '../js/graphql/pulse'
import { FinancialReportType, TagsByUserType, TagsLeaderboardType } from '../js/types'
import BackerCard from '../components/ui/BackerCard'

interface HomePageType {
  donationSummary: FinancialReportType
  tagsLeaderboard: TagsLeaderboardType
}

const Page: NextPage<HomePageType> = ({ donationSummary, tagsLeaderboard }) => {
  return (
    <>
      <SeoTags
        title='OpenBeta'
        description='Pulse: stats and activities'
      />
      <Layout
        contentContainerClass='content-default bg-gradient-to-br from-cyan-600 to-sky-400 py-8'
        showFilterBar={false}
        showFooter
      >
        <div className='lg:columns-2 mx-auto'>
          <TagsSummary tagsLeaderboard={tagsLeaderboard} />
          <TagsLeaderboard tagsLeaderboard={tagsLeaderboard} />
          <FinancialReport donationSummary={donationSummary} />
        </div>
      </Layout>
    </>
  )
}

const TagsSummary = ({ tagsLeaderboard }: TagsLeaderboardProps): JSX.Element => {
  return (
    <Box className='bg-purple-400 mt-0 stats shadow p-0'>
      <div className='stat'>
        <div className='stat-title font-bold'>Photos with tags</div>
        <div className='stat-value'>
          {tagsLeaderboard.grandTotal}
        </div>
        <div className='stat-desc'>Tags help others learn more about the climbing areas.</div>
      </div>
    </Box>
  )
}
interface TagsLeaderboardProps {
  tagsLeaderboard: TagsLeaderboardType
}
const TagsLeaderboard = ({ tagsLeaderboard }: TagsLeaderboardProps): JSX.Element => {
  return (
    <Box className='bg-purple-700'>
      <h2>Tags Leaderboard</h2>
      <div className='mt-4 grid grid-cols-6 gap-2 items-center'>
        {tagsLeaderboard.list.map(LeaderboardRow)}
      </div>
    </Box>
  )
}

const LeaderboardRow = (value: TagsByUserType, index: number): JSX.Element => {
  const url = `/u/${value?.username ?? ''}`

  return (
    <React.Fragment key={value?.username ?? index}>
      <div className='text-left align-middle text-xs'>
        <span className={
          clz(
            'p-1 rounded',
            index <= 2 ? 'bg-pink-500' : '') // a naive ranking highlight.  It can't handle the situation where there are ties.
          }
        >
          {index + 1}
        </span>
      </div>
      <div className='text-left col-span-4 text-xs uppercase'>
        {value?.username == null ? 'unknown' : <Link href={url}>{value.username}</Link>}
      </div>
      <div className='text-right opacity-80 font-bold text-sm'>
        {value.total}
      </div>
    </React.Fragment>
  )
}

interface FinancialReportProps {
  donationSummary: FinancialReportType
}

const FinancialReport = ({ donationSummary }: FinancialReportProps): ReactElement => {
  const { totalRaised, donors } = donationSummary

  return (
    <Box className='bg-accent bg-opacity-90 text-center'>
      <h2>Donations</h2>
      <p className='mt-4 text-sm'>This platform is supported by climbers like you.  Thanks to our financial backers we've raised ${totalRaised}.</p>
      <div className='flex gap-2 xl:gap-4 flex-wrap items-center justify-center'>
        {donors.map(({ account }) =>
          <BackerCard key={account.id} name={account.name} imageUrl={account.imageUrl} />
        )}
      </div>
    </Box>

  )
}

const Box = ({ className, children }): ReactElement => {
  return (
    <section className={clz('break-inside-avoid-column break-inside-avoid relative block max-w-lg  border-4 p-4 mb-4 border-black rounded-box', className)}>
      {children}
    </section>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const openCollectiveReport = await getSummaryReport()
  const leaderboard = await getTagsLeaderboard()
  return {
    props: {
      donationSummary: openCollectiveReport,
      tagsLeaderboard: leaderboard
    },
    revalidate: 60
  }
}

export default Page
