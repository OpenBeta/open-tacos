import { useMutation } from '@apollo/client'
import { GraphQLError } from 'graphql'

import { graphqlClient } from '../graphql/Client'
import { MUTATION_UPDATE_CLIMBS, MUTATION_DELETE_CLIMBS, UpdateClimbsInput, DeleteManyClimbsAPI, DeleteManyClimbsInputType } from '../graphql/gql/contribs'

type UpdateClimbCmdType = (input: UpdateClimbsInput) => Promise<void>
type DeleteClimbsCmdType = (idList: string[]) => Promise<number>

interface UpdateClimbsHookProps {
  parentId: string
  accessToken: string
  onUpdateCompleted?: (data: any) => void
  onUpdateError?: (error: any) => void
  onDeleteCompleted?: (data: any) => void
  onDeleteError?: (error: any) => void
}

interface UpdateClimbsHookReturn {
  updateClimbCmd: UpdateClimbCmdType
  deleteClimbsCmd: DeleteClimbsCmdType
}

/**
 * React hook for update climbs API
 * @param parentId
 * @param accessToken JWT token
 * @param onCompleted Optional success callback
 * @param onError Optiona error callback
 * @returns updateClimbCmd
 */
export default function useUpdateClimbsCmd ({ parentId, accessToken = '', onUpdateCompleted, onUpdateError, onDeleteCompleted, onDeleteError }: UpdateClimbsHookProps): UpdateClimbsHookReturn {
  const [updateClimbsApi] = useMutation<{ updateClimbsApi: string[] }, { input: UpdateClimbsInput }>(
    MUTATION_UPDATE_CLIMBS, {
      client: graphqlClient,
      onCompleted: (data) => {
        // void fetch(`/api/revalidate?c=${id}`)
        if (onUpdateCompleted != null) {
          onUpdateCompleted(data)
        }
      },
      onError: (error) => {
        console.log('updateClimbsApi error', error)
        if (onUpdateError != null) {
          onUpdateError(error)
        }
      }
    }
  )

  const updateClimbCmd: UpdateClimbCmdType = async (input) => {
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

  const [deleteClimbsApi] = useMutation<{ deleteClimbsApi: number }, { input: DeleteManyClimbsInputType }>(
    MUTATION_DELETE_CLIMBS, {
      client: graphqlClient,
      onCompleted: (data) => {
        void fetch(`/api/revalidate?a=${parentId}`)
        if (onDeleteCompleted != null) {
          onDeleteCompleted(data)
        }
      },
      onError: (error) => {
        console.log('deleteClimbsApi error', error)
        if (onDeleteError != null) {
          onDeleteError(error)
        }
      }
    }
  )

  const deleteClimbsCmd: DeleteClimbsCmdType = async (idList) => {
    const rs = await deleteClimbsApi({
      variables: {
        input: {
          parentId,
          idList
        }
      },
      context: {
        headers: {
          authorization: `Bearer ${accessToken ?? ''}`
        }
      }
    })

    if (rs.data == null) {
      throw new GraphQLError('Error running deleteClimbsApi()')
    }
    return rs.data.deleteClimbsApi
  }

  return { updateClimbCmd, deleteClimbsCmd }
}
