import { useMutation } from '@apollo/client'

import { MUTATION_REMOVE_MEDIA_TAG } from '../graphql/gql/fragments'
import { graphqlClient } from '../graphql/Client'
import { actions } from '../../js/stores'

interface ReturnType {
  onDelete: (mediaUuid: string, destinationId: string) => Promise<void>
}

/**
 * This custom hook allows you to remove a tag from the backend.
 * It also updates the local store.
 * @returns see type declaration
 */
export default function useDeleteTagBackend (): ReturnType {
  const onCompletedHandler = async (data): Promise<void> => {
    await actions.media.removeTag(data)
  }

  const [removeTag] = useMutation(
    MUTATION_REMOVE_MEDIA_TAG, {
      client: graphqlClient,
      onCompleted: onCompletedHandler
    }
  )

  const onDelete = async (mediaUuid: string, destinationId: string): Promise<void> => {
    await removeTag({
      variables: {
        mediaUuid,
        destinationId
      }
    })
  }

  return { onDelete }
}
