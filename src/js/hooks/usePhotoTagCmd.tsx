import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

import { graphqlClient } from '../graphql/Client'
import { MUTATION_ADD_ENTITY_TAG, SetTagType } from '../graphql/gql/tags'
import { actions } from '../stores'

export interface UsePhotTagReturn {
  tagPhotoCmd: (props: SetTagType) => Promise<void>
}

/**
 * A React hook for handling photo tagging.
 * Todo: Move `useDeleteTagBanckend()` here.
 */
export default function usePhotoTagCmd (): UsePhotTagReturn {
  const session = useSession({ required: true })
  const addTagToLocalStore = async (data: any): Promise<void> => await actions.media.addTag(data)

  // eslint-disable-next-line
  const [tagPhoto] = useMutation<any, SetTagType>(
    MUTATION_ADD_ENTITY_TAG, {
      client: graphqlClient,
      errorPolicy: 'none',
      onError: error => toast.error(error.message),
      onCompleted: async (data) => {
        await addTagToLocalStore(data)
        toast.success('Tag added.')
      }
    }
  )

  const tagPhotoCmd = async (props: SetTagType): Promise<any> => {
    await tagPhoto({
      variables: props,
      context: {
        headers: {
          authorization: `Bearer ${session.data?.accessToken ?? ''}`
        }
      }
    })
  }

  return { tagPhotoCmd }
}
