import axios, { AxiosResponse } from 'axios'

import { SIRV_CONFIG } from './sirv/SirvClient'
import { MediaBaseTag } from './types'
import { checkUsername } from './utils'

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
    if (mediaUrl == null) {
      continue
    }
    const _arr = mediaUrl.split('/')
    uuidMap.set(mediaUrl, { ...media, uuid: _arr[2] })
    uuidSet.add(_arr[2])
  }

  const usernameMap = new Map<string, string|null>()
  for await (const uuid of uuidSet.keys()) {
    const username = await getUserNickFromMediaDir(uuid)
    usernameMap.set(uuid, username)
  }

  const enhancedPaths: MediaBaseTag[] = []
  for (const obj of uuidMap.values()) {
    const { uuid, ...rest } = obj
    enhancedPaths.push({
      ...rest,
      uid: usernameMap.get(obj.uuid) ?? null
    })
  }
  return enhancedPaths
}

/**
 * Given a user uuid, locate the media server for the user home dir and their nick name
 * @param uuid
 * @returns user nick name or `null` if not found
 */
export const getUserNickFromMediaDir = async (uuid: string): Promise<string|null> => {
  let res: AxiosResponse<{uid: string}> | undefined
  try {
    const res = await genericClient.get<{uid: string}>(`${SIRV_CONFIG.baseUrl}/u/${uuid}/uid.json`)
    const username = res.data?.uid?.toLowerCase() ?? ''
    if (res.status >= 200 && res.status <= 204 && checkUsername(username)) {
      return username
    } else return null
  } catch (e) {
    console.log(`Error fetching /u/${uuid}/uid.json`, res?.statusText)
    return null
  }
}
