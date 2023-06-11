import { useSession } from 'next-auth/react'
import { useMutation } from '@apollo/client'
import { toast } from 'react-toastify'
import { MUTATION_REMOVE_ENTITY_TAG } from '../graphql/gql/tags'
import { graphqlClient } from '../graphql/Client'

interface ReturnType {
  onDelete: onDeleteCallback
}

export type onDeleteCallback = (props: RemoveTagMutationProps) => Promise<void>

interface RemoveTagMutationProps {
  mediaId: string
  tagId: string
}

export interface DeleteTagResult {
  id: string
  mediaUuid: string
  destType: number
  destinationId: string
}

export interface GQLRemoveTagType {
  removeTag: boolean
}

/**
 * This custom hook allows you to remove a tag from the backend.
 * It also updates the local store.
 * @returns see type declaration
 */
export default function useDeleteTagBackend (): ReturnType {
  const session = useSession({ required: true })
  const onCompletedHandler = async (data: GQLRemoveTagType): Promise<void> => {
    if (!data.removeTag) return
    toast.success('Tag removed')
    // await actions.media.removeTag(data.removeTag)
  }

  // eslint-disable-next-line
  const [removeTag] = useMutation<GQLRemoveTagType, RemoveTagMutationProps>(
    MUTATION_REMOVE_ENTITY_TAG, {
      client: graphqlClient,
      onCompleted: onCompletedHandler
    }
  )

  const onDelete: onDeleteCallback = async ({ mediaId, tagId }) => {
    await removeTag({
      variables: {
        mediaId,
        tagId
      },
      context: {
        headers: {
          authorization: `Bearer ${session.data?.accessToken ?? ''}`
        }
      }
    })
  }

  return { onDelete }
}
