import { useMutation } from '@apollo/client'

import { graphqlClient } from '../graphql/Client'
import { MUTATION_UPDATE_AREA, UpdateOneAreaApiType, UpdateAreaApiReturnType } from '../graphql/gql/contribs'

type UpdateOneAreaCmdType = (input: UpdateOneAreaApiType) => Promise<void>

interface Props {
  areaId: string
  accessToken: string
  onUpdateCompleted?: (data: any) => void
  onUpdateError?: (error: any) => void
}

interface UpdateClimbsHookReturn {
  updateOneAreaCmd: UpdateOneAreaCmdType
}

/**
 * React hook for update areas API
 * @param parentId
 * @param accessToken JWT token
 * @param onUpdateCompleted Optional success callback
 * @param onError Optiona error callback
 * @returns updateOneAreaCmd
 */
export default function useUpdateAreasCmd ({ areaId, accessToken = '', onUpdateCompleted, onUpdateError }: Props): UpdateClimbsHookReturn {
  const [updateAreaApi] = useMutation<{ updateAreaApi: UpdateAreaApiReturnType }, UpdateOneAreaApiType>(
    MUTATION_UPDATE_AREA, {
      client: graphqlClient,
      onCompleted: (data) => {
        void fetch(`/api/revalidate?s=${areaId}`)
        if (onUpdateCompleted != null) onUpdateCompleted(data)
      },
      onError: (error) => {
        console.log(error)
        if (onUpdateError != null) onUpdateError(error)
      }
    }
  )

  const updateOneAreaCmd: UpdateOneAreaCmdType = async (input: UpdateOneAreaApiType) => {
    await updateAreaApi({
      variables: {
        ...input,
        uuid: areaId
      },
      context: {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      }
    })
  }

  return { updateOneAreaCmd }
}
