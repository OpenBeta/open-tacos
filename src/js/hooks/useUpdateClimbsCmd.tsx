import { useMutation } from '@apollo/client'
import { GraphQLError } from 'graphql'
import { toast } from 'react-toastify'
import { graphqlClient } from '../graphql/Client'
import { MUTATION_UPDATE_CLIMBS, MUTATION_DELETE_CLIMBS, UpdateClimbsInput, DeleteManyClimbsInputType } from '../graphql/gql/contribs'
import { invalidateAreaPageCache, invalidateClimbPageCache } from '../utils'

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
   * Add/Update Climbs API
   */
  const [updateClimbsApi] = useMutation<{ updateClimbs: string[] }, { input: UpdateClimbsInput }>(
    MUTATION_UPDATE_CLIMBS, {
      client: graphqlClient,
      errorPolicy: 'none'
    }
  )

  const updateClimbCmd: UpdateClimbCmdType = async (input) => {
    if (input.changes.length === 0) {
      toast('Nothing to submit.  Please check your input.')
      return
    }
    try {
      const res = await updateClimbsApi({
        variables: {
          input
        },
        context: {
          headers: {
            authorization: `Bearer ${accessToken ?? ''}`
          }
        }
      })

      if (res.errors != null) {
        toast.error(`Climb update error: ${res.errors[0]?.message ?? 'Unknown error'}`)
        if (onUpdateError != null) {
          onUpdateError(res.errors)
        }
        return
      }

      if (res.data != null) {
        // Trigger Next to build newly create climb pages
        const { updateClimbs } = res.data
        const idList = Array.isArray(updateClimbs) ? updateClimbs : []

        idList.forEach(climbId => {
          void invalidateClimbPageCache(climbId)
        })

        // Rebuild the parent area page
        void invalidateAreaPageCache(parentId)

        toast('Climbs updated ✨')

        if (onUpdateCompleted != null) {
          onUpdateCompleted(res.data)
        }
      }
    } catch (error) {
      toast.error(`Climb update error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      if (onUpdateError != null) {
        onUpdateError(error)
      }
    }
  }

  /**
   * Delete climbs API
   */
  const [deleteClimbsApi] = useMutation<{ deleteClimbsApi: number }, { input: DeleteManyClimbsInputType }>(
    MUTATION_DELETE_CLIMBS, {
      client: graphqlClient,
      errorPolicy: 'none'
    }
  )

  const deleteClimbsCmd: DeleteClimbsCmdType = async (idList) => {
    try {
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

      if (rs.errors != null) {
        toast.error(`Climb delete error: ${rs.errors[0]?.message ?? 'Unknown error'}`)
        if (onDeleteError != null) {
          onDeleteError(rs.errors)
        }
        throw new GraphQLError('Error running deleteClimbsApi()')
      }

      if (rs.data == null) {
        throw new GraphQLError('Error running deleteClimbsApi()')
      }

      void invalidateAreaPageCache(parentId)
      toast('Climbs deleted ✔️')
      if (onDeleteCompleted != null) {
        onDeleteCompleted(rs.data)
      }

      return rs.data.deleteClimbsApi
    } catch (error) {
      if (error instanceof GraphQLError) {
        throw error
      }
      toast.error(`Climb delete error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      if (onDeleteError != null) {
        onDeleteError(error)
      }
      throw new GraphQLError('Error running deleteClimbsApi()')
    }
  }

  return { updateClimbCmd, deleteClimbsCmd }
}
