import { useMutation, useQuery } from '@apollo/client'
import { toast } from 'react-toastify'

import { graphqlClient } from '../graphql/Client'
import {
  MUTATION_UPDATE_AREA, MUTATION_ADD_AREA,
  UpdateOneAreaInputType, UpdateAreaApiReturnType, AddAreaReturnType, AddAreaProps,
  DeleteOneAreaInputType, DeleteOneAreaReturnType,
  MUTATION_REMOVE_AREA, MUTATION_UPDATE_AREAS_SORTING_ORDER, AreaSortingInput
} from '../graphql/gql/contribs'
import { QUERY_AREA_FOR_EDIT } from '../../js/graphql/gql/areaById'
import { AreaType } from '../../js/types'

type UpdateOneAreaCmdType = (input: UpdateOneAreaInputType) => Promise<void>
type AddOneAreCmdType = ({ name, parentUuid }: AddAreaProps) => Promise<void>
type DeleteOneAreaCmdType = ({ uuid }: DeleteOneAreaInputType) => Promise<void>
type GetAreaByIdCmdType = ({ skip }: { skip?: boolean }) => any
type UpdateAreasSortingOrderCmdType = (input: AreaSortingInput[]) => Promise<void>

interface CallbackProps {
  onUpdateCompleted?: (data: any) => void
  onUpdateError?: (error: any) => void
  onAddCompleted?: (data: AddAreaReturnType) => void
  onAddError?: (error: any) => void
  onDeleteCompleted?: (data: any) => void
  onDeleteError?: (error: any) => void
}

type Props = CallbackProps & {
  areaId: string
  accessToken: string
}

interface UpdateAreasHookReturn {
  getAreaByIdCmd: GetAreaByIdCmdType
  updateOneAreaCmd: UpdateOneAreaCmdType
  addOneAreaCmd: AddOneAreCmdType
  deleteOneAreaCmd: DeleteOneAreaCmdType
  updateAreasSortingOrderCmd: UpdateAreasSortingOrderCmdType
}

/**
 * React hook for Area update/delete API
 * @param areaId current area id
 * @param accessToken JWT token
 * @param onUpdateCompleted Optional success callback
 * @param onError Optiona error callback
 */
export default function useUpdateAreasCmd ({ areaId, accessToken = '', ...props }: Props): UpdateAreasHookReturn {
  const { onUpdateCompleted, onUpdateError, onAddCompleted, onAddError, onDeleteCompleted, onDeleteError } = props

  const getAreaByIdCmd: GetAreaByIdCmdType = ({ skip = false }) => {
    return useQuery<{ area: AreaType }, { uuid: string }>(
      QUERY_AREA_FOR_EDIT, {
        client: graphqlClient,
        variables: {
          uuid: areaId
        },
        fetchPolicy: 'no-cache',
        ssr: false,
        skip
      })
  }

  const [updateAreaApi] = useMutation<{ updateArea: UpdateAreaApiReturnType }, UpdateOneAreaInputType>(
    MUTATION_UPDATE_AREA, {
      client: graphqlClient,
      onCompleted: (data) => {
        toast.info('Area updated successfully ✔️')
        void updateAreaPageCache(data.updateArea.uuid)
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

  const [updateAreasSortingOrder] = useMutation<{ updateAreaSortingOrder: any }, { input: AreaSortingInput[] }>(
    MUTATION_UPDATE_AREAS_SORTING_ORDER, {
      client: graphqlClient,
      onCompleted: (data) => {
        void refreshPage(`/api/revalidate?s=${areaId}`)
      },
      onError: (error) => {
        toast.error(`Unexpected error: ${error.message}`)
      }
    }
  )

  const updateAreasSortingOrderCmd: UpdateAreasSortingOrderCmdType = async (input: AreaSortingInput[]) => {
    await updateAreasSortingOrder({
      variables: { input },
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
        if (onAddCompleted != null) {
          void onAddCompleted(data.addArea)
        }
        toast.info('Area added 🔥')

        void updateAreaPageCache(areaId) // parent page
        void updateAreaPageCache(data.addArea.uuid) // new page
      },
      onError: (error) => {
        toast.error(`Unexpected error: ${error.message}`)
        if (onAddError != null) {
          onAddError(error)
        }
      }
    }
  )

  const addOneAreaCmd: AddOneAreCmdType = async ({ name, parentUuid, isBoulder, isLeaf }: AddAreaProps) => {
    await addArea({
      variables: {
        name,
        parentUuid,
        ...(isBoulder != null && { isBoulder }),
        ...(isLeaf != null && { isLeaf })
      },
      context: {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      }
    })
  }

  const [deleteOneArea] = useMutation<{ deleteOneArea: DeleteOneAreaReturnType }, DeleteOneAreaInputType>(
    MUTATION_REMOVE_AREA, {
      client: graphqlClient,
      onCompleted: (data) => {
        void updateAreaPageCache(areaId) // update parent page

        if (onDeleteCompleted != null) {
          onDeleteCompleted(data)
        }
      },
      onError: (error) => {
        toast.error(`Unexpected error: ${error.message}`)
        if (onDeleteError != null) {
          onDeleteError(error)
        }
      },
      fetchPolicy: 'no-cache'
    }
  )

  const deleteOneAreaCmd: DeleteOneAreaCmdType = async ({ uuid }) => {
    await deleteOneArea({
      variables: { uuid },
      context: {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      }
    })
  }

  return { updateOneAreaCmd, addOneAreaCmd, deleteOneAreaCmd, getAreaByIdCmd, updateAreasSortingOrderCmd }
}

export const refreshPage = async (url: string): Promise<void> => {
  try {
    await fetch(url)
  } catch {}
}

export const updateAreaPageCache = async (uuid: string): Promise<void> => {
  await fetch(`/api/updateAreaPage?uuid=${uuid}`)
}
