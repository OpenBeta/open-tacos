import { uniq } from 'underscore'
import { openCollectiveClient } from './Client'
import { FinancialBackersResponseType, FinancialReportType } from '../types'
import { openCollectiveQuery } from './gql/opencollective'

/**
 * Get all donors from OpenCollective
 */
export const getSummaryReport = async (): Promise<FinancialReportType> => {
  const ocResponse = await openCollectiveClient.query<FinancialBackersResponseType>({
    query: openCollectiveQuery,
    variables: {
      slug: 'openbeta'
    }
  })

  const donors = ocResponse.data.account.members.nodes
  const totalRaised = ocResponse.data.account.stats.totalNetAmountReceived.value

  // Using the underscore library to get unique donors, based on their id
  const uniqDonors = uniq(donors, donor => donor.account.id)

  return {
    totalRaised,
    donors: uniqDonors
  }
}
