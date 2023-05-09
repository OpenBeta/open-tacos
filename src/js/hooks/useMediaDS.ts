import { useEffect } from 'react'
import { MediaType } from '../types'

import { userMediaStore } from '../stores/media'

interface MediaStoreHookProp {
  isAuthorized: boolean
  uid: string
  serverMediaList: MediaType[]
}

interface MediaStoreHookResult {
  mediaList: MediaType[]
  // tagMap: Dictionary<HybridMediaTag[]>
  // singleTagList: HybridMediaTag[] // For single view page
}
/**
 * A React hook for initializing user media datastore.
 * By mirroring image and tag state on the client, we can provide a more
 * interactive UI (using local state), and at the same time be able to
 * take advantage of NextJS server-side page generation (using DB data).
 */
export default function useMediaDS ({ isAuthorized, uid, serverMediaList }: MediaStoreHookProp): MediaStoreHookResult {
  useEffect(() => {
    if (isAuthorized && !userMediaStore.get.initialized()) {
      // Load server side image data into local state for client-side add/remove
      userMediaStore.set.initialized(true)
      userMediaStore.set.imageList(serverMediaList)
      userMediaStore.set.uid(uid)
    }
  }, [isAuthorized])

  const clientSideList = userMediaStore.use.imageList()

  const mediaList = isAuthorized ? clientSideList : serverMediaList

  return {
    mediaList
    // singleTagList: (mediaList?.length ?? 0) === 1 ? tagMap[mediaList[0]?.mediaId] : []
  }
}
