import { DefaultContext, useLazyQuery, useMutation } from '@apollo/client'
import { toast } from 'react-toastify'

import { graphqlClient } from '../graphql/Client'
import { AddEntityTagProps, QUERY_USER_MEDIA, QUERY_MEDIA_BY_ID, MUTATION_ADD_ENTITY_TAG, MUTATION_REMOVE_ENTITY_TAG, GetMediaForwardQueryReturn, AddEntityTagMutationReturn, RemoveEntityTagMutationReturn, RemoveEntityTagMutationProps } from '../graphql/gql/tags'
import { MediaWithTags, EntityTag, MediaConnection, TagTargetType } from '../types'
import { AddNewMediaObjectsArgs, AddMediaObjectsReturn, MUTATION_ADD_MEDIA_OBJECTS, NewMediaObjectInput, DeleteOneMediaObjectArgs, DeleteOneMediaObjectReturn, MUTATION_DELETE_ONE_MEDIA_OBJECT } from '../graphql/gql/media'
import { useUserGalleryStore } from '../stores/useUserGalleryStore'
import { deleteMediaFromStorage } from '../userApi/media'
import { invalidateAreaPageCache, invalidateClimbPageCache, invalidateHomePageCache } from '../utils'

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
  after?: string
}
export interface RemoveEntityTagProps extends RemoveEntityTagMutationProps {
  entityId: string
  entityType: TagTargetType
  ancestorList: string[]
}

type FetchMoreMediaForwardCmd = (args: FetchMoreMediaForwardProps) => Promise<MediaConnection | null>
type AddEntityTagCmd = (props: AddEntityTagProps, jwtToken?: string) => Promise<[EntityTag | null, MediaWithTags | null]>
type RemoveEntityTagCmd = (args: RemoveEntityTagProps, jwtToken?: string) => Promise<[boolean, MediaWithTags | null]>
type GetMediaByIdCmd = (id: string) => Promise<MediaWithTags | null>
type AddMediaObjectsCmd = (mediaList: NewMediaObjectInput[], jwtToken?: string) => Promise<MediaWithTags[] | null>
type DeleteOneMediaObjectCmd = (mediaId: string, mediaUrl: string, jwtToken?: string) => Promise<boolean>

/**
 * A React hook for handling media tagging operations.
 *
 * Apollo cache is used for state management to increase page
 * load performance.
 *
 * Apollo cache: https://www.apollographql.com/docs/react/caching/overview
 */
export default function useMediaCmd (): UseMediaCmdReturn {
  const addNewMediaToUserGallery = useUserGalleryStore(set => set.addToFront)
  const updateOneMediaUserGallery = useUserGalleryStore(set => set.updateOne)
  const deleteMediaFromUserGallery = useUserGalleryStore(set => set.delete)

  const [fetchMoreMediaGQL] = useLazyQuery<GetMediaForwardQueryReturn, FetchMoreMediaForwardProps>(
    QUERY_USER_MEDIA, {
      client: graphqlClient,
      errorPolicy: 'none',
      fetchPolicy: 'network-only'
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
      if (res.error != null) {
        toast.error(res.error.message)
        return null
      }
      return res.data?.getUserMediaPagination.mediaConnection ?? null
    } catch {
      return null
    }
  }

  const [getMediaByIdGGL] = useLazyQuery<{ media: MediaWithTags }, { id: string }>(QUERY_MEDIA_BY_ID, {
    client: graphqlClient,
    fetchPolicy: 'network-only'
  })

  /**
   * Get one media object by id
   * @param id media object Id
   * @returns MediaWithTags object.  `null` if not found.
   */
  const getMediaById: GetMediaByIdCmd = async (id) => {
    try {
      const res = await getMediaByIdGGL({ variables: { id } })
      if (res.error != null) {
        toast.error('Unexpected error. Please try again.')
        return null
      }
      return res.data?.media ?? null
    } catch {
      return null
    }
  }

  const [addMediaObjects] = useMutation<AddMediaObjectsReturn, AddNewMediaObjectsArgs>(
    MUTATION_ADD_MEDIA_OBJECTS, {
      client: graphqlClient,
      errorPolicy: 'none'
    }
  )

  const addMediaObjectsCmd: AddMediaObjectsCmd = async (mediaList, jwtToken) => {
    const res = await addMediaObjects({
      variables: {
        mediaList
      },
      context: apolloClientContext(jwtToken)
    })
    if (res.errors != null) {
      console.error(res.errors)
      return null
    }
    if (res.data != null) {
      // Update the data store to trigger UserGallery re-rendering
      res.data.addMediaObjects.forEach(media => {
        void getMediaById(media.id)
        addNewMediaToUserGallery({
          edges: [
            {
              node: media,
              cursor: ''
            }
          ],
          pageInfo: {
            hasNextPage: true,
            endCursor: ''
          }
        })
      })
    }
    return res.data?.addMediaObjects ?? null
  }

  const [deleteOneMediaObject] = useMutation<DeleteOneMediaObjectReturn, DeleteOneMediaObjectArgs>(
    MUTATION_DELETE_ONE_MEDIA_OBJECT, {
      client: graphqlClient,
      errorPolicy: 'none'
    })

  /**
    * Delete media object from the backend and media storage
    * @param mediaId
    * @param mediaUrl
    */
  const deleteOneMediaObjectCmd: DeleteOneMediaObjectCmd = async (mediaId, mediaUrl, jwtToken) => {
    try {
      const res = await deleteOneMediaObject({
        variables: {
          mediaId
        },
        context: apolloClientContext(jwtToken)
      })
      if (res.errors != null) {
        throw new Error('Unexpected API error.')
      }
      await deleteMediaFromStorage(mediaUrl)
      deleteMediaFromUserGallery(mediaId)
      toast.success('Photo deleted.')
      return true
    } catch {
      toast.error('Cannot delete media. Please try again.')
      return false
    }
  }

  const [addEntityTagGQL] = useMutation<AddEntityTagMutationReturn, AddEntityTagProps>(
    MUTATION_ADD_ENTITY_TAG, {
      client: graphqlClient,
      errorPolicy: 'none'
    }
  )

  /**
   * Add an entity tag (climb or area) to a media
   */
  const addEntityTagCmd: AddEntityTagCmd = async (args: AddEntityTagProps, jwtToken) => {
    try {
      const { mediaId, entityId, entityType } = args
      const res = await addEntityTagGQL({
        variables: args,
        context: apolloClientContext(jwtToken)
      })

      if (res.errors != null) {
        toast.error(res.errors[0]?.message ?? 'Unexpected error')
        return [null, null]
      }

      toast.success('Tag added 🎉')

      // refetch the media object to update local cache
      const mediaRes = await getMediaById(mediaId)

      if (mediaRes != null) {
        updateOneMediaUserGallery(mediaRes)
      }

      const ancestorList = res.data?.addEntityTag.ancestors.split(',') ?? []
      await invalidateAncestorPagesWithEntity({ entityId, entityType, ancestorList })

      return [res.data?.addEntityTag ?? null, mediaRes]
    } catch {
      return [null, null]
    }
  }

  const [removeEntityTagGQL] = useMutation<RemoveEntityTagMutationReturn, RemoveEntityTagMutationProps>(
    MUTATION_REMOVE_ENTITY_TAG, {
      client: graphqlClient
    }
  )

  /**
   * Remove an entity tag from a media
   */
  const removeEntityTagCmd: RemoveEntityTagCmd = async ({ mediaId, tagId, entityId, entityType, ancestorList }, jwtToken) => {
    try {
      const res = await removeEntityTagGQL({
        variables: {
          mediaId,
          tagId
        },
        context: apolloClientContext(jwtToken)
      })

      if (res.errors != null) {
        toast.error(<span>Error deleting tag. <button className='btn btn-xs' onClick={() => window.location.reload()}>Refresh page</button></span>)
        return [false, null]
      }

      toast.success('Tag removed.')

      // refetch the media object to update local cache
      const mediaRes = await getMediaById(mediaId)

      if (mediaRes != null) {
        // update local cache for gallery infinite scroll component
        updateOneMediaUserGallery(mediaRes)
      }

      await invalidateAncestorPagesWithEntity({ entityId, entityType, ancestorList })

      return [res.data?.removeEntityTag ?? false, mediaRes]
    } catch {
      toast.error(<span>Error deleting tag. <button className='btn btn-xs' onClick={() => window.location.reload()}>Refresh page</button></span>)
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

interface InvalidateAncestorPages {
  entityType: TagTargetType
  entityId: string
  ancestorList: string[]
}

/**
 * Request Nextjs to invalidate ancestor pages
 */
export const invalidateAncestorPagesWithEntity = async ({ entityId, entityType, ancestorList }: InvalidateAncestorPages): Promise<void> => {
  // If tagging a climb then invalidate climb page cache
  if (entityType === TagTargetType.climb) {
    await invalidateClimbPageCache(entityId)
  }

  // Also invalidate all ancestor pages
  await Promise.all(ancestorList.map(async uuid => {
    await invalidateAreaPageCache(uuid)
    return await Promise.resolve()
  }))

  await invalidateHomePageCache()
}

const apolloClientContext = (jwtToken?: string): DefaultContext => {
  if (jwtToken == null) {
    throw new Error('Auth token should be defined')
  }
  return ({
    headers: {
      authorization: `Bearer ${jwtToken}`
    }
  })
}
