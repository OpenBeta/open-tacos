import { LazyQueryExecFunction, useLazyQuery } from '@apollo/client'
import { ChangesetType } from '../types'
import { graphqlClient } from '../graphql/Client'
import { GET_AREA_HISTORY } from '../graphql/gql/history'
import { useEffect, useState } from 'react'

interface GetAreaHistoryReturnType {
  changeHistory: ChangesetType[]
  getAreaHistory: LazyQueryExecFunction<{ getAreaHistory: ChangesetType[] }, {filter: {areaId: string}}>
}

export function useUpdateAreaHistory (areaId: string, history: ChangesetType[]): GetAreaHistoryReturnType {
  const [changeHistory, setChangeHistory] = useState<ChangesetType[]>(history)

  const res = useLazyQuery<{getAreaHistory: ChangesetType[]}, {filter: {areaId: string}}>(
    GET_AREA_HISTORY, {
      client: graphqlClient,
      variables: {
        filter: {
          areaId
        }
      },
      fetchPolicy: 'no-cache',
      ssr: false,
      onCompleted: () => console.log('getAreaHistory from client')
    })

  const [getAreaHistory, { data }] = res

  useEffect(() => {
    if ((data?.getAreaHistory) != null) {
      setChangeHistory(data.getAreaHistory)
    }
  }, [data])

  return {
    getAreaHistory,
    changeHistory
  }
}
