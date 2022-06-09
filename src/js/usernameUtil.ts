import axios from 'axios'

import { SIRV_CONFIG } from './sirv/SirvClient'
import { MediaBaseTag } from './types'

const genericClient = axios.create({
  headers: {
    'content-type': 'application/json'
  }
})

/**
 * Given a list of media URLs, get a username for each url.
 */
export const enhanceMediaListWithUsernames = async (mediaList: MediaBaseTag[]): Promise<MediaBaseTag[]> => {
  // use a Set to consolidate duplicate uuid's
  const uuidSet = new Set<string>()
  // Convert array of media to a map of <url, media object>
  const uuidMap = new Map<string, MediaBaseTag & {uuid: string}>()
  for (const media of mediaList) {
    const { mediaUrl } = media
    const _arr = mediaUrl.split('/')
    uuidMap.set(mediaUrl, { ...media, uuid: _arr[2] })
    uuidSet.add(_arr[2])
  }

  const usernameMap = new Map<string, string>()
  for await (const uuid of uuidSet.keys()) {
    const res = await genericClient.get<{uid: string}>(`${SIRV_CONFIG.baseUrl}/u/${uuid}/uid.json`)

    if (res.status >= 200 && res.status <= 204) {
      usernameMap.set(uuid, res.data.uid)
    }
  }

  const enhancedPaths: MediaBaseTag[] = []
  for (const obj of uuidMap.values()) {
    const { uuid, ...rest } = obj
    enhancedPaths.push({
      ...rest,
      uid: usernameMap.get(obj.uuid)
    })
  }
  return enhancedPaths
}
