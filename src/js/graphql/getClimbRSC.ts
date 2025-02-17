import { FetchPolicy } from '@apollo/client'

import { ClimbType } from '../types'
import { getClient } from './ServerClient'
import { QUERY_CLIMB_BY_ID } from './gql/climbById'

/**
 * Get climb by id for React Server Components.
 * @param id climb id as string in uuid v4 format
 */
export const getClimbByIdRSC = async (id: string, fetchPolicy: FetchPolicy = 'no-cache'): Promise<ClimbType> => {
  const res = await getClient().query<{ climb: ClimbType }, { id: string }>({
    query: QUERY_CLIMB_BY_ID,
    variables: {
      id
    },
    context: {
      dynamicTag: `climbId=${id}`
    },
    fetchPolicy
  }).catch(e => { throw new Error(e) })
  return res.data.climb
}
