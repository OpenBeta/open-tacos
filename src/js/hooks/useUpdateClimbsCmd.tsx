import { useMutation } from '@apollo/client'

import { graphqlClient } from '../graphql/Client'
import { MUTATION_UPDATE_CLIMBS, UpdateClimbsInput } from '../graphql/gql/contribs'

type updateClimbCmdType = (input: UpdateClimbsInput) => Promise<void>

interface UpdateClimbsHookProps {
  accessToken: string
  onCompleted?: (data: any) => void
  onError?: (error: any) => void
}

interface UpdateClimbsHookReturn {
  updateClimbCmd: updateClimbCmdType
}

/**
 * React hook for update climbs API
 * @param accessToken JWT token
 * @param onCompleted Optional success callback
 * @param onError Optiona error callback
 * @returns updateClimbCmd
 */
export default function useUpdateClimbsCmd ({ accessToken = '', onCompleted = () => {}, onError = () => {} }: UpdateClimbsHookProps): UpdateClimbsHookReturn {
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

  return { updateClimbCmd }
}
