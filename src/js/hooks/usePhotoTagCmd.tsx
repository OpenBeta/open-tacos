import { useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

import { graphqlClient } from '../graphql/Client'
import { MUTATION_ADD_ENTITY_TAG, SetTagType } from '../graphql/gql/tags'
import { actions } from '../stores'
import { EntityTag } from '../types'

export interface UsePhotTagReturn {
  tagPhotoCmd: (props: SetTagType) => Promise<void>
}

export interface P {
  addEntityTag: EntityTag
}
/**
 * A React hook for handling photo tagging.
 * Todo: Move `useDeleteTagBanckend()` here.
 */
export default function usePhotoTagCmd (): UsePhotTagReturn {
  const session = useSession({ required: true })
  const [addEntityTag] = useMutation<P, SetTagType>(
    MUTATION_ADD_ENTITY_TAG, {
      client: graphqlClient,
      errorPolicy: 'none',
      onError: error => toast.error(error.message),
      onCompleted: async ({ addEntityTag: newTag }) => {
        // await actions.media.addTag(newTag)
        toast.success('Tag added.')
      }
    }
  )

  const tagPhotoCmd = async (props: SetTagType): Promise<any> => {
    await addEntityTag({
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
