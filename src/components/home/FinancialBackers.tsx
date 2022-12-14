import BackerCard from '../ui/BackerCard'
import { FinancialReportType } from '../../js/types'

export type FinancialBackersProps = FinancialReportType

export default function FinancialBackers ({ donors, totalRaised }: FinancialBackersProps): JSX.Element {
  return (
    <div className='text-primary text-center pb-10'>
      <h3>Thanks to our financial backers we've raised ${totalRaised}</h3>
      <div>
        <div className='grid grid-cols-4 gap-4 columns-xs'>
          {donors.map(({ account }) =>
            <BackerCard key={account.id} name={account.name} imageUrl={account.imageUrl} />
          )}
        </div>
      </div>
    </div>
  )
}
