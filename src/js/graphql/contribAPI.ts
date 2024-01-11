import { QUERY_RECENT_CHANGE_HISTORY } from './gql/contribs'
import { graphqlClient } from './Client'
import { ChangesetType } from '../types'

export const getChangeHistoryServerSide = async (): Promise<ChangesetType[]> => {
  try {
    const rs = await graphqlClient.query<{ getChangeHistory: ChangesetType[] }>({
      query: QUERY_RECENT_CHANGE_HISTORY,
      fetchPolicy: 'cache-first'
    })

    if (Array.isArray(rs.data?.getChangeHistory)) {
      return rs.data?.getChangeHistory.slice(0, 50)
    }
    console.log('WARNING: getChangeHistory() returns non-array data')
    return []
  } catch (e) {
    console.log('getChangeHistory() error', e)
  }
  return []
}
