import { RECENT_CHANGE_HISTORY } from './contribGQL'
import { graphqlClient } from './Client'

export const getChangeHistory = async (): Promise<any> => {
  try {
    const rs = await graphqlClient.query<{getChangeHistory: any[]}>({
      query: RECENT_CHANGE_HISTORY
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
