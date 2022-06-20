import { useEffect } from 'react'
import { Dictionary } from 'underscore'
import { MediaTagWithClimb, MediaType } from '../types'

import { userMediaStore } from '../stores/media'

interface MediaStoreHookProp {
  isAuthorized: boolean
  uid: string
  serverMediaList: MediaType[]
  serverTagMap: Dictionary<MediaTagWithClimb[]>
}

interface MediaStoreHookResult {
  mediaList: MediaType[]
  tagMap: Dictionary<MediaTagWithClimb[]>
  singleTagList: MediaTagWithClimb[] // For single view page
}
/**
 * A React hook for initializing user media datastore.
 * By mirroring image and tag state on the client, we can provide a more
 * interactive UI (using local state), and at the same time be able to
 * take advantage of NextJS server-side page generation (using DB data).
 */
export default function useMediaDS ({ isAuthorized, uid, serverMediaList, serverTagMap }: MediaStoreHookProp): MediaStoreHookResult {
  useEffect(() => {
    if (isAuthorized) {
      // Load server side image data into local state for client-side add/remove
      userMediaStore.set.imageList(serverMediaList)
      userMediaStore.set.tagMap(serverTagMap)
      userMediaStore.set.uid(uid)
    }
  }, [isAuthorized])

  const clientSideList = userMediaStore.use.imageList()
  const clientSideTagMap = userMediaStore.use.tagMap()

  const mediaList = isAuthorized ? clientSideList : serverMediaList
  const tagMap = isAuthorized ? clientSideTagMap : serverTagMap

  return {
    mediaList,
    tagMap,
    singleTagList: (mediaList?.length ?? 0) === 1 ? tagMap[mediaList[0]?.mediaId] : []
  }
}
