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
import { invalidateAreaPageCache } from '../utils'

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
      errorPolicy: 'none'
    }
  )

  const updateOneAreaCmd: UpdateOneAreaCmdType = async (input: UpdateOneAreaInputType) => {
    try {
      const res = await updateAreaApi({
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

      if (res.errors != null) {
        toast.error(`Unexpected error: ${res.errors[0]?.message ?? 'Unknown error'}`)
        if (onUpdateError != null) onUpdateError(res.errors)
        return
      }

      if (res.data != null) {
        toast.info('Area updated successfully ✔️')
        void invalidateAreaPageCache(res.data.updateArea.uuid)
        if (onUpdateCompleted != null) onUpdateCompleted(res.data)
      }
    } catch (error) {
      toast.error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      if (onUpdateError != null) onUpdateError(error)
    }
  }

  const [updateAreasSortingOrder] = useMutation<{ updateAreaSortingOrder: any }, { input: AreaSortingInput[] }>(
    MUTATION_UPDATE_AREAS_SORTING_ORDER, {
      client: graphqlClient,
      errorPolicy: 'none'
    }
  )

  const updateAreasSortingOrderCmd: UpdateAreasSortingOrderCmdType = async (input: AreaSortingInput[]) => {
    if (input.length < 1) {
      toast.info('Nothing to update')
      return
    }
    try {
      const res = await updateAreasSortingOrder({
        variables: { input },
        context: {
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        }
      })

      if (res.errors != null) {
        toast.error(`Unexpected error: ${res.errors[0]?.message ?? 'Unknown error'}`)
        return
      }

      void invalidateAreaPageCache(areaId)
      toast.info('Areas sorting order updated successfully.')
    } catch (error) {
      toast.error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const [addArea] = useMutation<{ addArea: AddAreaReturnType }, AddAreaProps>(
    MUTATION_ADD_AREA, {
      client: graphqlClient,
      errorPolicy: 'none'
    }
  )

  const addOneAreaCmd: AddOneAreCmdType = async ({ name, parentUuid, isBoulder, isLeaf }: AddAreaProps) => {
    try {
      const res = await addArea({
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

      if (res.errors != null) {
        toast.error(`Unexpected error: ${res.errors[0]?.message ?? 'Unknown error'}`)
        if (onAddError != null) {
          onAddError(res.errors)
        }
        return
      }

      if (res.data != null) {
        if (onAddCompleted != null) {
          void onAddCompleted(res.data.addArea)
        }
        toast.info('Area added 🔥')

        void invalidateAreaPageCache(areaId) // parent page
        void invalidateAreaPageCache(res.data.addArea.uuid) // new page
      }
    } catch (error) {
      toast.error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      if (onAddError != null) {
        onAddError(error)
      }
    }
  }

  const [deleteOneArea] = useMutation<{ deleteOneArea: DeleteOneAreaReturnType }, DeleteOneAreaInputType>(
    MUTATION_REMOVE_AREA, {
      client: graphqlClient,
      errorPolicy: 'none',
      fetchPolicy: 'no-cache'
    }
  )

  const deleteOneAreaCmd: DeleteOneAreaCmdType = async ({ uuid }) => {
    try {
      const res = await deleteOneArea({
        variables: { uuid },
        context: {
          headers: {
            authorization: `Bearer ${accessToken}`
          }
        }
      })

      if (res.errors != null) {
        toast.error(`Unexpected error: ${res.errors[0]?.message ?? 'Unknown error'}`)
        if (onDeleteError != null) {
          onDeleteError(res.errors)
        }
        return
      }

      void invalidateAreaPageCache(areaId) // update parent page

      if (onDeleteCompleted != null) {
        onDeleteCompleted(res.data)
      }
    } catch (error) {
      toast.error(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      if (onDeleteError != null) {
        onDeleteError(error)
      }
    }
  }

  return { updateOneAreaCmd, addOneAreaCmd, deleteOneAreaCmd, getAreaByIdCmd, updateAreasSortingOrderCmd }
}

export const refreshPage = async (url: string): Promise<void> => {
  try {
    await fetch(url)
  } catch {}
}
