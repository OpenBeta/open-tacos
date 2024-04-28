import { getClient } from '../ServerClient'
import { MediaByUsers } from '@/js/types'
import { QUERY_MEDIA_FOR_FEED } from './tags'

/**
 * Server component API: Get recent media for feed.
 * @param maxUsers
 * @param maxFiles
 */
export const getMediaForFeedSC = async (maxUsers: number, maxFiles: number): Promise<MediaByUsers[]> => {
  try {
    const rs = await getClient().query<{ getMediaForFeed: MediaByUsers[] }>({
      query: QUERY_MEDIA_FOR_FEED,
      variables: {
        maxUsers,
        maxFiles
      },
      fetchPolicy: 'cache-first'
    })

    if (Array.isArray(rs.data?.getMediaForFeed)) {
      return rs.data?.getMediaForFeed
    }
    console.log('WARNING: getMediaForFeed() returns non-array data')
    return []
  } catch (e) {
    console.log('####### getMediaForFeed() error', e)
  }
  return []
}
