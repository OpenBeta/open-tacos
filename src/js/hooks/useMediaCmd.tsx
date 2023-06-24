import { useEffect } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { toast } from 'react-toastify'

import { graphqlClient } from '../graphql/Client'
import { SetTagType, QUERY_USER_MEDIA, FRAGMENT_MEDIA_WITH_TAGS } from '../graphql/gql/tags'
import { MediaWithTags, UserMedia } from '../types'

export interface UsePhotTagReturn {
  tagPhotoCmd: (props: SetTagType) => Promise<void>
}

export interface P {
  // userUuid: string
  media: UserMedia
}
/**
 * A React hook for handling photo tagging.
 * Todo: Move `useDeleteTagBanckend()` here.
 */
export default function useMediaCmd ({ media }: P): any {
  useEffect(() => {
    if (media != null) {
      console.log('#initialize cache')
      initializeCache(media)
    }
  }, [media])

  const [fetchMore, { loading, error, data }] = useLazyQuery<UserMedia, { userUuid: string }>(
    QUERY_USER_MEDIA, {
      variables: {
        userUuid: media.userUuid
      },
      client: graphqlClient,

      errorPolicy: 'none',
      onError: error => toast.error(error.message)
      // onCompleted: async () => {
      //   toast.success('fetchMore()')
      // }
    }
  )

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
  return { data, fetchMore }

  // const tagPhotoCmd = async (props: SetTagType): Promise<any> => {
  //   await f.addEntityTag({
  //     variables: props,
  //     context: {
  //       headers: {
  //         authorization: `Bearer ${session.data?.accessToken ?? ''}`
  //       }
  //     }
  //   })
  // }
}
