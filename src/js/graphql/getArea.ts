import { QUERY_AREA_BY_ID } from './gql/areaById'
import { graphqlClient } from './Client'
import { AreaType, ChangesetType } from '../types'

export interface AreaPageDataProps {
  area: AreaType
  getAreaHistory: ChangesetType[]
}

/**
 * Get area page data
 * @param uuid area uuid
 */
export const getArea = async (uuid: string): Promise<AreaPageDataProps> => {
  const rs = await graphqlClient.query<AreaPageDataProps>({
    query: QUERY_AREA_BY_ID,
    variables: {
      uuid
    },
    fetchPolicy: 'no-cache'
  })

  return rs.data
}
