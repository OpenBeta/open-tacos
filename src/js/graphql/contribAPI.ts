import { QUERY_RECENT_CHANGE_HISTORY } from './gql/contribs'
import { getClient } from './ServerClient'
import { ChangesetType } from '../types'

export const getChangeHistoryServerSide = async (): Promise<ChangesetType[]> => {
  try {
    const rs = await getClient().query<{ getChangeHistory: ChangesetType[] }>({
      query: QUERY_RECENT_CHANGE_HISTORY,
      fetchPolicy: 'no-cache'
    })

    if (Array.isArray(rs.data?.getChangeHistory)) {
      return rs.data?.getChangeHistory.slice(0, 20)
    }
    console.log('WARNING: getChangeHistory() returns non-array data')
    return []
  } catch (e) {
    console.log('getChangeHistory() error', e)
  }
  return []
}
