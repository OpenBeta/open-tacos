import { useMutation } from '@apollo/client'

import { MUTATION_REMOVE_MEDIA_TAG } from '../graphql/gql/tags'
import { graphqlClient } from '../graphql/Client'
import { actions } from '../../js/stores'

interface ReturnType {
  onDelete: (tagId: string) => Promise<void>
}

interface RemoveTagMutationProps {
  tagId: string
}

export interface DeleteTagResult {
  id: string
  mediaUuid: string
  destType: number
  destinationId: string
}

export interface GQLRemoveTagType {
  removeTag: DeleteTagResult
}

/**
 * This custom hook allows you to remove a tag from the backend.
 * It also updates the local store.
 * @returns see type declaration
 */
export default function useDeleteTagBackend (): ReturnType {
  const onCompletedHandler = async (data: GQLRemoveTagType): Promise<void> => {
    if (data?.removeTag == null) return
    await actions.media.removeTag(data.removeTag)
  }

  const [removeTag] = useMutation<GQLRemoveTagType, RemoveTagMutationProps>(
    MUTATION_REMOVE_MEDIA_TAG, {
      client: graphqlClient,
      onCompleted: onCompletedHandler
    }
  )

  const onDelete = async (tagId: string): Promise<void> => {
    await removeTag({
      variables: {
        tagId
      }
    })
  }

  return { onDelete }
}
