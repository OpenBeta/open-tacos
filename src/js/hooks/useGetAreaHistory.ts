import { useQuery } from '@apollo/client'
import { ChangesetType } from '../types'
import { graphqlClient } from '../graphql/Client'
import { GET_AREA_HISTORY } from '../graphql/gql/history'

export function useAreaHistory (areaId: string): ReturnType<typeof useQuery> {
  return useQuery<{getAreaHistory: ChangesetType}, {filter: {areaId: string}}>(
    GET_AREA_HISTORY, {
      client: graphqlClient,
      variables: {
        filter: {
          areaId
        }
      },
      fetchPolicy: 'no-cache',
      ssr: false
    })
}
