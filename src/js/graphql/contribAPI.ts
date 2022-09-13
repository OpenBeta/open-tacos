import { RECENT_CHANGE_HISTORY } from './contribGQL'
import { graphqlClient } from './Client'

export const getChangeHistoryServerSide = async (): Promise<any> => {
  try {
    const rs = await graphqlClient.query<{getChangeHistory: any[]}>({
      query: RECENT_CHANGE_HISTORY,
      fetchPolicy: 'network-only'
    })

    if (Array.isArray(rs.data?.getChangeHistory)) {
      return rs.data?.getChangeHistory
    }
    console.log('WARNING: getChangeHistory() returns non-array data')
    return []
  } catch (e) {
    console.log('getChangeHistory() error', e)
  }
  return []
}
