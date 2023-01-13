import { useMutation } from '@apollo/client'

import { graphqlClient } from '../graphql/Client'
import { MUTATION_UPDATE_AREA, UpdateOneAreaInputType, UpdateAreaApiReturnType } from '../graphql/gql/contribs'

type UpdateOneAreaCmdType = (input: UpdateOneAreaInputType) => Promise<void>

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
 * React hook for Area update/delete API
 * @param parentId
 * @param accessToken JWT token
 * @param onUpdateCompleted Optional success callback
 * @param onError Optiona error callback
 */
export default function useUpdateAreasCmd ({ areaId, accessToken = '', onUpdateCompleted, onUpdateError }: Props): UpdateClimbsHookReturn {
  const [updateAreaApi] = useMutation<{ updateAreaApi: UpdateAreaApiReturnType }, UpdateOneAreaInputType>(
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

  const updateOneAreaCmd: UpdateOneAreaCmdType = async (input: UpdateOneAreaInputType) => {
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
