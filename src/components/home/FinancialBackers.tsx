import BackerCard from '../ui/BackerCard'
import { FinancialBackerAccountType } from '../../js/types'
import { uniq } from 'underscore'

export interface FinancialBackersProps {
  donors: FinancialBackerAccountType[]
  totalRaised: string
}
export default function FinancialBackers ({ donors, totalRaised }: FinancialBackersProps): JSX.Element {
  const uniqDonors = uniq(donors, (donor) => donor.account.name) // Using the underscore library to get unique donors, based on their name
  return (
    <div className='text-primary text-center pb-10'>
      <h3>Thanks to our financial backers we've raised ${totalRaised}</h3>
      <div>
        <div className='grid grid-cols-4 gap-4 columns-xs'>
          {uniqDonors?.map(donor => {
            const name = donor.account.name
            const imageUrl = donor.account.imageUrl
            return (
              <BackerCard key='name' name={name} imageUrl={imageUrl} />
            )
          })}
        </div>
      </div>
    </div>
  )
}
