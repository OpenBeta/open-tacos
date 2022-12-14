import { NextPage, GetStaticProps } from 'next'
import Layout from '../components/layout'
import SeoTags from '../components/SeoTags'
import { getSummaryReport } from '../js/graphql/opencollective'
import { FinancialReportType } from '../js/types'
import BackerCard from '../components/ui/BackerCard'

interface HomePageType {
  donationSummary: FinancialReportType
}

const Page: NextPage<HomePageType> = ({ donationSummary }) => {
  return (
    <>
      <SeoTags
        title='OpenBeta'
        description='Puse: stats and activities'
      />
      <Layout
        contentContainerClass='content-default'
        showFilterBar={false}
        showFooter
      >
        <div className='flex flex-cols'>
          <FinancialReport donationSummary={donationSummary} />
        </div>
      </Layout>
    </>
  )
}

interface FinancialReportProps {
  donationSummary: FinancialReportType
}
const FinancialReport = ({ donationSummary }: FinancialReportProps): JSX.Element => {
  const { totalRaised, donors } = donationSummary

  return (
    <section className='text-center'>
      <h2>Donations</h2>
      <p className='text-sm'>This platform is supported by climbers like you.  Thanks to our financial backers we've raised ${totalRaised}</p>
      <div className='flex gap-2 xl:gap-4 flex-wrap items-center justify-center'>
        {donors.map(({ account }) =>
          <BackerCard key={account.id} name={account.name} imageUrl={account.imageUrl} />
        )}
      </div>
    </section>

  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const openCollectiveReport = await getSummaryReport()
  return {
    props: {
      donationSummary: openCollectiveReport
    },
    revalidate: 60
  }
}

export default Page
