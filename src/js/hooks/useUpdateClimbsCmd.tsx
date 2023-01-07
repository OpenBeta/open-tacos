import { useMutation } from '@apollo/client'

import { graphqlClient } from '../graphql/Client'
import { MUTATION_UPDATE_CLIMBS, MUTATION_DELETE_CLIMBS, UpdateClimbsInput } from '../graphql/gql/contribs'

type updateClimbCmdType = (input: UpdateClimbsInput) => Promise<void>
type deleteClimbsCmdType = (idList: string[]) => Promise<void>

interface UpdateClimbsHookProps {
  parentId: string
  accessToken: string
  onCompleted?: (data: any) => void
  onError?: (error: any) => void
}

interface UpdateClimbsHookReturn {
  updateClimbCmd: updateClimbCmdType
  deleteClimbsCmd: deleteClimbsCmdType
}

/**
 * React hook for update climbs API
 * @param parentId
 * @param accessToken JWT token
 * @param onCompleted Optional success callback
 * @param onError Optiona error callback
 * @returns updateClimbCmd
 */
export default function useUpdateClimbsCmd ({ parentId, accessToken = '', onCompleted = () => {}, onError = () => {} }: UpdateClimbsHookProps): UpdateClimbsHookReturn {
  const [updateClimbsApi] = useMutation<{ updateClimbsApi: string[] }, { input: UpdateClimbsInput }>(
    MUTATION_UPDATE_CLIMBS, {
      client: graphqlClient,
      onCompleted: (data) => {
        // void fetch(`/api/revalidate?c=${id}`)
        onCompleted(data)
      },
      onError: (error) => {
        console.log('updateClimbsCmd error', error)
        onError(error)
      }
    }
  )

  const updateClimbCmd: updateClimbCmdType = async (input) => {
    await updateClimbsApi({
      variables: {
        input
      },
      context: {
        headers: {
          authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    })
  }

  const [deleteClimbsApi] = useMutation<{ deleteClimbsApi: string[] }, { idList: string[] }>(
    MUTATION_DELETE_CLIMBS, {
      client: graphqlClient,
      onCompleted: (data) => {
        void fetch(`/api/revalidate?a=${parentId}`)
        onCompleted(data)
      },
      onError: (error) => {
        console.log('updateClimbsCmd error', error)
        onError(error)
      }
    }
  )

  const deleteClimbsCmd: deleteClimbsCmdType = async (idList) => {
    await deleteClimbsApi({
      variables: {
        idList
      },
      context: {
        headers: {
          authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    })
  }

  return { updateClimbCmd, deleteClimbsCmd }
}
