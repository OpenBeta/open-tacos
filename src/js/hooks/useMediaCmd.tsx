import { useSession } from 'next-auth/react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

import { graphqlClient } from '../graphql/Client'
import { AddEntityTagProps, QUERY_USER_MEDIA, QUERY_MEDIA_BY_ID, MUTATION_ADD_ENTITY_TAG, MUTATION_REMOVE_ENTITY_TAG } from '../graphql/gql/tags'
import { MediaWithTags, UserMedia, EntityTag } from '../types'

export interface UseMediaCmdReturn {
  addEntityTagCmd: AddEntityTagCmd
  removeEntityTagCmd: RemoveEntityTagCmd
  getMediaById: (id: string) => Promise<MediaWithTags | null>
  fetchMore: (args: any) => any
}

export interface RemoveEntityTagProps {
  mediaId: string
  tagId: string
}

type AddEntityTagCmd = (props: AddEntityTagProps) => Promise<[EntityTag | null, MediaWithTags | null]>
type RemoveEntityTagCmd = (args: RemoveEntityTagProps) => Promise<[boolean, MediaWithTags | null]>
export interface P {
  // userUuid: string
  media: UserMedia
}
/**
 * A React hook for handling photo tagging.
 */
export default function useMediaCmd (): UseMediaCmdReturn {
  const session = useSession()
  const router = useRouter()

  const [fetchMore] = useLazyQuery<UserMedia, { userUuid: string }>(
    QUERY_USER_MEDIA, {
      client: graphqlClient,
      errorPolicy: 'none',
      onError: error => toast.error(error.message)
    }
  )

  const [getMediaByIdGGL] = useLazyQuery<{media: MediaWithTags}, { id: string }>(QUERY_MEDIA_BY_ID, {
    client: graphqlClient,
    fetchPolicy: 'network-only',
    onError: () => toast.error('Unexpected error.  Please try again.')
  })

  const getMediaById = async (id: string): Promise<MediaWithTags | null> => {
    const res = await getMediaByIdGGL({ variables: { id } })
    return res.data?.media ?? null
  }

  const initializeCache = (media: UserMedia): void => {
    // for (const media of mediaList) {
    //   graphqlClient.writeFragment({
    //     fragmentName: 'MediaWithTagsFields',
    //     id: `MediaWithTags:${media.id}`,
    //     fragment: FRAGMENT_MEDIA_WITH_TAGS,
    //     data: media
    //   })
    // }

    // graphqlClient.writeQuery({
    //   query: QUERY_USER_MEDIA,
    //   data: {
    //     getUserMediaPagination: {
    //       ...media
    //       // ___typename: 'UserMedia'
    //     }
    //   }
    // })
  }

  const [addEntityTagGQL] = useMutation<{ addEntityTag: EntityTag }, AddEntityTagProps>(
    MUTATION_ADD_ENTITY_TAG, {
      client: graphqlClient,
      errorPolicy: 'none',
      onError: error => toast.error(error.message),
      onCompleted: () => {
        toast.success('Tag added 🎉')
      }
    }
  )

  const addEntityTagCmd: AddEntityTagCmd = async (args: AddEntityTagProps) => {
    const { mediaId } = args
    const res = await addEntityTagGQL({
      variables: args,
      context: {
        headers: {
          authorization: `Bearer ${session.data?.accessToken ?? ''}`
        }
      }
    })

    // refetch the media object to update local cache
    const mediaRes = await getMediaById(mediaId)

    return [res.data?.addEntityTag ?? null, mediaRes]
  }

  const [removeEntityTagGQL] = useMutation<any, RemoveEntityTagProps>(
    MUTATION_REMOVE_ENTITY_TAG, {
      client: graphqlClient,
      onCompleted: () => toast.success('Tag removed.'),
      onError: () => {
        toast.error(<span>Error deleting tag.  <button className='btn btn-xs' onClick={() => router.reload()}>Refresh page</button> the browser</span>)
      }
    }
  )

  const removeEntityTagCmd: RemoveEntityTagCmd = async ({ mediaId, tagId }) => {
    const res = await removeEntityTagGQL({
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

    // refetch the media object to update local cache
    const mediaRes = await getMediaById(mediaId)

    return [res.data ?? false, mediaRes]
  }

  return { fetchMore, getMediaById, addEntityTagCmd, removeEntityTagCmd }
}
