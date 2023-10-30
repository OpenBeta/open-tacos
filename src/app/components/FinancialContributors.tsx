import { getSummaryReport } from '@/js/graphql/opencollective'
import { FinancialBackerAccountType } from '@/js/types'
import { DonateButton } from './LandingCTA'

/**
 * List financial contributors
 */
export const FinancialContributors: React.FC = async () => {
  const { donors, totalRaised } = await getSummaryReport()

  return (
    <div className='rounded-box bg-accent/80 block w-full p-4 xl:p-10 mx-auto max-w-5xl xl:max-w-7xl'>
      <div className='flex items-center gap-6'>
        <h2>Financial Contributors</h2>
        <span className='mt-0.5 text-sm'>Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRaised)}</span>
      </div>
      <hr className='mb-6 border-2 border-base-content' />
      <div className='columns-3xs'>
        {donors.map(donor => <Donor key={donor.account.id} donor={donor} />)}
      </div>

      <div className='mt-6'><DonateButton /></div>
    </div>
  )
}

const Donor: React.FC<{ donor: FinancialBackerAccountType }> = ({ donor }) => {
  const { name } = donor.account
  return (<div className='text-sm uppercase'>{name}</div>)
}
