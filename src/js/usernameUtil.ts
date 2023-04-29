import { AxiosResponse } from 'axios'

import { checkUsername } from './utils'
import { httpClient as cdnHttpClient } from './cdn/cdnClient'

/**
 * Given a user UUID return the user nick name
 * @param uuid
 * @returns user nick name or `null` if not found
 */
export const getUserNickFromMediaDir = async (uuid: string): Promise<string|null> => {
  let res: AxiosResponse<{uid: string}> | undefined
  try {
    const res = await cdnHttpClient.get<{uid: string}>(`/u/${uuid}/uid.json`)
    const username = res.data?.uid?.toLowerCase() ?? ''
    if (res.status >= 200 && res.status <= 204 && checkUsername(username)) {
      return username
    } else return null
  } catch (e) {
    console.log(`Error fetching /u/${uuid}/uid.json`, res?.statusText)
    return null
  }
}
