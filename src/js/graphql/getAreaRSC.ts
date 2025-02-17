import { FetchPolicy } from '@apollo/client'

import { QUERY_AREA_BY_ID } from './gql/areaById'
import { getClient } from './ServerClient'
import { AreaType } from '../types'

export interface AreaPageDataProps {
  area: AreaType | null
}

/**
 * Get area page data React Server Component version.
 * @param uuid area uuid
 */
export const getAreaRSC = async (uuid: string, fetchPolicy: FetchPolicy = 'no-cache'): Promise<AreaPageDataProps> => {
  try {
    const rs = await getClient().query<AreaPageDataProps>({
      query: QUERY_AREA_BY_ID,
      variables: {
        uuid
      },
      context: {
        dynamicTag: `areaId=${uuid}`
      },
      fetchPolicy
    })
    return rs.data
  } catch (error) {
    console.error(error)
    return { area: null }
  }
}
