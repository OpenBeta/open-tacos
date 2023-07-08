import { useSession } from 'next-auth/react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

import { graphqlClient } from '../graphql/Client'
import { AddEntityTagProps, QUERY_USER_MEDIA, QUERY_MEDIA_BY_ID, MUTATION_ADD_ENTITY_TAG, MUTATION_REMOVE_ENTITY_TAG, GetMediaForwardQueryReturn, AddEntityTagMutationReturn, RemoveEntityTagMutationReturn } from '../graphql/gql/tags'
import { MediaWithTags, EntityTag, MediaConnection } from '../types'
import { AddNewMediaObjectsArgs, AddMediaObjectsReturn, MUTATION_ADD_MEDIA_OBJECTS, NewMediaObjectInput, DeleteOneMediaObjectArgs, DeleteOneMediaObjectReturn, MUTATION_DELETE_ONE_MEDIA_OBJECT } from '../graphql/gql/media'
import { useUserGalleryStore } from '../stores/useUserGalleryStore'
import { deleteMediaFromStorage } from '../userApi/media'

export interface UseMediaCmdReturn {
  addEntityTagCmd: AddEntityTagCmd
  removeEntityTagCmd: RemoveEntityTagCmd
  getMediaById: GetMediaByIdCmd
  addMediaObjectsCmd: AddMediaObjectsCmd
  deleteOneMediaObjectCmd: DeleteOneMediaObjectCmd
  fetchMoreMediaForward: FetchMoreMediaForwardCmd
}

interface FetchMoreMediaForwardProps {
  userUuid: string
  first?: number
  after: string
}
export interface RemoveEntityTagProps {
  mediaId: string
  tagId: string
}

type FetchMoreMediaForwardCmd = (args: FetchMoreMediaForwardProps) => Promise<MediaConnection | null>
type AddEntityTagCmd = (props: AddEntityTagProps) => Promise<[EntityTag | null, MediaWithTags | null]>
type RemoveEntityTagCmd = (args: RemoveEntityTagProps) => Promise<[boolean, MediaWithTags | null]>
type GetMediaByIdCmd = (id: string) => Promise<MediaWithTags | null>
type AddMediaObjectsCmd = (mediaList: NewMediaObjectInput[]) => Promise<MediaWithTags[] | null>
type DeleteOneMediaObjectCmd = (mediaId: string, mediaUrl: string) => Promise<boolean>

/**
 * A React hook for handling media tagging operations.
 *
 * Apollo cache is used for state management to increase page
 * load performance.
 *
 * Apollo cache: https://www.apollographql.com/docs/react/caching/overview
 */
export default function useMediaCmd (): UseMediaCmdReturn {
  const session = useSession()
  const router = useRouter()

  const apolloClientContext = {
    headers: {
      authorization: `Bearer ${session.data?.accessToken ?? ''}`
    }
  }

  const addNewMediaToUserGallery = useUserGalleryStore(set => set.addToFront)
  const updateOneMediaUserGallery = useUserGalleryStore(set => set.updateOne)
  const deleteMediaFromUserGallery = useUserGalleryStore(set => set.delete)

  const [fetchMoreMediaGQL] = useLazyQuery<GetMediaForwardQueryReturn, FetchMoreMediaForwardProps>(
    QUERY_USER_MEDIA, {
      client: graphqlClient,
      errorPolicy: 'none',
      onError: error => toast.error(error.message)
    }
  )

  const fetchMoreMediaForward: FetchMoreMediaForwardCmd = async ({ userUuid, first = 6, after }) => {
    try {
      const res = await fetchMoreMediaGQL({
        variables: {
          userUuid,
          first,
          after
        }
      })
      return res.data?.getUserMediaPagination.mediaConnection ?? null
    } catch {
      return null
    }
  }

  const [getMediaByIdGGL] = useLazyQuery<{media: MediaWithTags}, { id: string }>(QUERY_MEDIA_BY_ID, {
    client: graphqlClient,
    fetchPolicy: 'network-only',
    onError: () => toast.error('Unexpected error.  Please try again.')
  })

  /**
   * Get one media object by id
   * @param id media object Id
   * @returns MediaWithTags object.  `null` if not found.
   */
  const getMediaById: GetMediaByIdCmd = async (id) => {
    try {
      const res = await getMediaByIdGGL({ variables: { id } })
      return res.data?.media ?? null
    } catch {
      return null
    }
  }

  const [addMediaObjects] = useMutation<AddMediaObjectsReturn, AddNewMediaObjectsArgs>(
    MUTATION_ADD_MEDIA_OBJECTS, {
      client: graphqlClient,
      errorPolicy: 'none',
      onError: error => toast.error(error.message),
      onCompleted: (data) => {
        /**
         * Now update the data store to trigger UserGallery re-rendering.
         */
        data.addMediaObjects.forEach(media => {
          addNewMediaToUserGallery({
            edges: [
              {
                node: media,
                /**
                 * We don't care about setting cursor because newer images are added to the front
                 * of the list.
                 */
                cursor: ''
              }
            ],
            pageInfo: {
              hasNextPage: true,
              endCursor: '' // not supported
            }
          })
        })
      }
    }
  )

  const addMediaObjectsCmd: AddMediaObjectsCmd = async (mediaList) => {
    const res = await addMediaObjects({
      variables: {
        mediaList
      },
      context: apolloClientContext
    })
    return res.data?.addMediaObjects ?? null
  }

  const [deleteOneMediaObject] = useMutation<DeleteOneMediaObjectReturn, DeleteOneMediaObjectArgs>(
    MUTATION_DELETE_ONE_MEDIA_OBJECT, {
      client: graphqlClient,
      errorPolicy: 'none',
      onError: console.error
    })

  /**
     * Delete media object from the backend and media storage
     * @param mediaId
     * @param mediaUrl
     */
  const deleteOneMediaObjectCmd: DeleteOneMediaObjectCmd = async (mediaId, mediaUrl) => {
    try {
      const res = await deleteOneMediaObject({
        variables: {
          mediaId
        },
        context: apolloClientContext
      })
      if (res.errors != null) {
        throw new Error('Unexpected API error.')
      }
      await deleteMediaFromStorage(mediaUrl)
      deleteMediaFromUserGallery(mediaId)
      return true
    } catch {
      toast.error('Cannot delete media. Please try again.')
      return false
    }
  }

  const [addEntityTagGQL] = useMutation<AddEntityTagMutationReturn, AddEntityTagProps>(
    MUTATION_ADD_ENTITY_TAG, {
      client: graphqlClient,
      errorPolicy: 'none',
      onError: error => toast.error(error.message),
      onCompleted: () => {
        toast.success('Tag added 🎉')
      }
    }
  )

  /**
   * Add an entity tag (climb or area) to a media
   */
  const addEntityTagCmd: AddEntityTagCmd = async (args: AddEntityTagProps) => {
    try {
      const { mediaId } = args
      const res = await addEntityTagGQL({
        variables: args,
        context: apolloClientContext
      })

      // refetch the media object to update local cache
      const mediaRes = await getMediaById(mediaId)

      if (mediaRes != null) {
        updateOneMediaUserGallery(mediaRes)
      }
      return [res.data?.addEntityTag ?? null, mediaRes]
    } catch {
      return [null, null]
    }
  }

  const [removeEntityTagGQL] = useMutation<RemoveEntityTagMutationReturn, RemoveEntityTagProps>(
    MUTATION_REMOVE_ENTITY_TAG, {
      client: graphqlClient,
      onCompleted: () => toast.success('Tag removed.'),
      onError: () => {
        toast.error(<span>Error deleting tag.  <button className='btn btn-xs' onClick={() => router.reload()}>Refresh page</button> the browser</span>)
      }
    }
  )

  /**
   * Remove an entity tag from a media
   */
  const removeEntityTagCmd: RemoveEntityTagCmd = async ({ mediaId, tagId }) => {
    try {
      const res = await removeEntityTagGQL({
        variables: {
          mediaId,
          tagId
        },
        context: apolloClientContext
      })

      if (res.errors != null) {
        throw new Error('Unexpected API error.')
      }
      // refetch the media object to update local cache
      const mediaRes = await getMediaById(mediaId)

      if (mediaRes != null) {
        updateOneMediaUserGallery(mediaRes)
      }

      return [res.data?.removeEntityTag ?? false, mediaRes]
    } catch {
      return [false, null]
    }
  }

  return {
    fetchMoreMediaForward,
    getMediaById,
    addMediaObjectsCmd,
    deleteOneMediaObjectCmd,
    addEntityTagCmd,
    removeEntityTagCmd
  }
}
