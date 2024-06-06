import { getSummaryReport } from '@/js/graphql/opencollective'
import { FinancialBackerAccountType } from '@/js/types'
import { DonateButton } from './LandingCTA'
import { SectionContainer, Padding } from './ui/SectionContainer'
/**
 * List financial contributors
 */
export const FinancialContributors: React.FC = async () => {
  const { donors, totalRaised } = await getSummaryReport()

  return (
    <SectionContainer
      className='bg-accent/80 rounded-box'
      padding={Padding.default}
      header={
        <div className='flex items-center gap-6'>
          <h2>Financial Contributors</h2>
          <span className='mt-0.5 text-sm'>Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRaised)}</span>
        </div>
      }
    >
      <div className='columns-3xs'>
        {donors.map(donor => <Donor key={donor.account.id} donor={donor} />)}
      </div>
      <div className='mt-6'><DonateButton /></div>
    </SectionContainer>
  )
}

const Donor: React.FC<{ donor: FinancialBackerAccountType }> = ({ donor }) => {
  const { name } = donor.account
  return (<div className='text-sm uppercase'>{name}</div>)
}
