import { FetchPolicy } from '@apollo/client'

import { QUERY_AREA_BY_ID } from './gql/areaById'
import { QUERY_CHILD_AREAS_FOR_BREADCRUMBS, ChildAreasQueryReturn, AreaWithChildren } from './gql/breadcrumbs'
import { graphqlClient } from './Client'
import { AreaType, ChangesetType } from '../types'

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

/**
 * Get child areas for breadcrumbs.
 * @param uuid parent area uuid
 * @param fetchPolicy
 */
export const getChildAreasForBreadcrumbs = async (uuid: string, fetchPolicy: FetchPolicy = 'no-cache'): Promise<AreaWithChildren> => {
  const rs = await graphqlClient.query<ChildAreasQueryReturn>({
    query: QUERY_CHILD_AREAS_FOR_BREADCRUMBS,
    variables: {
      uuid
    },
    fetchPolicy
  })
  return rs.data.area
}
