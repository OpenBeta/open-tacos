import { useMutation } from '@apollo/client'

import { graphqlClient } from '../../js/graphql/Client'
import { MUTATION_ADD_CLIMB_TAG_TO_MEDIA, SetTagType } from '../../js/graphql/gql/tags'
import { actions } from '../../js/stores'

export interface UsePhotTagReturn {
  tagPhotoCmd: (props: SetTagType) => Promise<void>
}

export default function usePhotoTag (): UsePhotTagReturn {
  const addTagToLocalStore = async (data: any): Promise<void> => await actions.media.addTag(data)

  const [tagPhoto] = useMutation<any, SetTagType>(
    MUTATION_ADD_CLIMB_TAG_TO_MEDIA, {
      client: graphqlClient,
      errorPolicy: 'none',
      onError: error => console.log('Error adding tag: ', error.message), // Todo: send a Toast message
      onCompleted: addTagToLocalStore // Todo: send a Toast message
    }
  )

  const tagPhotoCmd = async (props: SetTagType): Promise<any> => {
    await tagPhoto({
      variables: props
    })
  }

  return { tagPhotoCmd }
}
