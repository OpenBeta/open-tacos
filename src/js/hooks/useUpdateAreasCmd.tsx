import { useMutation } from '@apollo/client'
import { toast } from 'react-toastify'

import { graphqlClient } from '../graphql/Client'
import { MUTATION_UPDATE_AREA, MUTATION_ADD_AREA, UpdateOneAreaInputType, UpdateAreaApiReturnType, AddAreaReturnType, AddAreaProps } from '../graphql/gql/contribs'

type UpdateOneAreaCmdType = (input: UpdateOneAreaInputType) => Promise<void>
type AddOneAreCmdType = ({ name, parentUuid }: AddAreaProps) => Promise<void>

interface Props {
  areaId: string
  accessToken: string
  onUpdateCompleted?: (data: any) => void
  onUpdateError?: (error: any) => void
}

interface UpdateClimbsHookReturn {
  updateOneAreaCmd: UpdateOneAreaCmdType
  addOneAreaCmd: AddOneAreCmdType
}

/**
 * React hook for Area update/delete API
 * @param areaId current area id
 * @param accessToken JWT token
 * @param onUpdateCompleted Optional success callback
 * @param onError Optiona error callback
 */
export default function useUpdateAreasCmd ({ areaId, accessToken = '', onUpdateCompleted, onUpdateError }: Props): UpdateClimbsHookReturn {
  const [updateAreaApi] = useMutation<{ updateAreaApi: UpdateAreaApiReturnType }, UpdateOneAreaInputType>(
    MUTATION_UPDATE_AREA, {
      client: graphqlClient,
      onCompleted: (data) => {
        toast.info('Area updated successfully 🔥')
        void fetch(`/api/revalidate?s=${areaId}`)
        if (onUpdateCompleted != null) onUpdateCompleted(data)
      },
      onError: (error) => {
        toast.error(`Unexpected error: ${error.message}`)
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

  const [addArea] = useMutation<{ addArea: AddAreaReturnType }, AddAreaProps>(
    MUTATION_ADD_AREA, {
      client: graphqlClient,
      onCompleted: (data) => {
        toast.info('Area added ✔️')
        void fetch(`/api/revalidate?a=${data.addArea.uuid}`) // build new area page
        void fetch(`/api/revalidate?a=${areaId}`) // rebuild parent page
      },
      onError: (error) => {
        toast.error(`Unexpected error: ${error.message}`)
      }
    }
  )

  const addOneAreaCmd: AddOneAreCmdType = async ({ name, parentUuid }: AddAreaProps) => {
    await addArea({
      variables: {
        name,
        parentUuid: parentUuid
      },
      context: {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      }
    })
  }
  return { updateOneAreaCmd, addOneAreaCmd }
}
