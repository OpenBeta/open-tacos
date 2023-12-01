import { QUERY_AREA_BY_ID } from './gql/areaById'
import { graphqlClient } from './Client'
import { AreaType, ChangesetType } from '../types'
import { FetchPolicy } from '@apollo/client'

export interface AreaPageDataProps {
  area: AreaType
  getAreaHistory: ChangesetType[]
}

/**
 * Get area page data.
 * @param uuid area uuid
 */
export const getArea = async (uuid: string, fetchPolicy: FetchPolicy = 'no-cache'): Promise<AreaPageDataProps> => {
  const rs = await graphqlClient.query<AreaPageDataProps>({
    query: QUERY_AREA_BY_ID,
    variables: {
      uuid
    },
    fetchPolicy
  })
  return rs.data
}
