import { useMutation } from '@apollo/client'
import { MUTATION_REMOVE_MEDIA_TAG } from '../graphql/fragments'
import { graphqlClient } from '../graphql/Client'

interface ReturnType {
  onDelete: (mediaUuid: string, destinationId: string) => Promise<void>
}

/**
 * This custom hook allows you to remove a tag from the backend
 * @returns see type declaration
 */
export default function useDeleteTagBackend (): ReturnType {
  const [removeTag] = useMutation(
    MUTATION_REMOVE_MEDIA_TAG, {
      client: graphqlClient
      // onCompleted: onDeleted
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
