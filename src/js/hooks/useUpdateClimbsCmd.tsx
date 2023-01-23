import { useMutation } from '@apollo/client'
import { GraphQLError } from 'graphql'
import { toast } from 'react-toastify'
import { graphqlClient } from '../graphql/Client'
import { MUTATION_UPDATE_CLIMBS, MUTATION_DELETE_CLIMBS, UpdateClimbsInput, DeleteManyClimbsInputType } from '../graphql/gql/contribs'

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
 * React hook for update/delete Climb API
 * @param parentId
 * @param accessToken JWT token
 */
export default function useUpdateClimbsCmd ({ parentId, accessToken = '', onUpdateCompleted, onUpdateError, onDeleteCompleted, onDeleteError }: UpdateClimbsHookProps): UpdateClimbsHookReturn {
  /**
   * Add/Update Clims API
   */
  const [updateClimbsApi] = useMutation<{ updateClimbsApi: string[] }, { input: UpdateClimbsInput }>(
    MUTATION_UPDATE_CLIMBS, {
      client: graphqlClient,

      onCompleted: (returnValue) => {
        // Trigger Next to build newly create climb pages
        const { updateClimbsApi } = returnValue
        const idList = Array.isArray(updateClimbsApi) ? updateClimbsApi : []
        idList.forEach(climbId => {
          void fetch(`/api/revalidate?s=${climbId}`)
        })

        // Rebuild the parent area page
        void fetch(`/api/revalidate?s=${parentId}`)

        toast('Climbs updated ✨')

        if (onUpdateCompleted != null) {
          onUpdateCompleted(returnValue)
        }
      },

      onError: (error) => {
        toast.error(`Climb update error: ${error.message}`)
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

  /**
   * Delete climbs API
   */
  const [deleteClimbsApi] = useMutation<{ deleteClimbsApi: number }, { input: DeleteManyClimbsInputType }>(
    MUTATION_DELETE_CLIMBS, {
      client: graphqlClient,
      onCompleted: (data) => {
        void fetch(`/api/revalidate?s=${parentId}`)
        toast('Climbs deleted ✔️')
        if (onDeleteCompleted != null) {
          onDeleteCompleted(data)
        }
      },
      onError: (error) => {
        toast.error(`Climb delete error: ${error.message}`)
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
