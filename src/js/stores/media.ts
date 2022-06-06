import { createStore } from '@udecode/zustood'
import { v5 as uuidv5 } from 'uuid'
import type { MediaType } from '../../js/types'

interface UserMediaStateProps {
  imageList: MediaType[]
}

const INITIAL_STATE: UserMediaStateProps = {
  imageList: []
}

const STORE_OPTS = {}

export const userMediaStore = createStore('userMedia')(INITIAL_STATE, STORE_OPTS)
  .extendActions((set, get, api) => ({
    /**
     *
     * @param uid
     * @param uuid
     * @param imageUrl
     * @param append
     * @param revalidateSSR
     * @returns
     */
    addImage: async (uid, uuid: string, imageUrl: string, append = false, revalidateSSR: boolean) => {
      const newMediaUuid = uuidv5(imageUrl, uuidv5.URL)
      const currentList = get.imageList()
      // Image already exists (same URL), don't add to current list
      const existed = currentList.findIndex(({ mediaId }) => mediaId === newMediaUuid)
      if (existed >= 0) { return currentList }

      const newEntry = {
        ownerId: uuid,
        mediaId: newMediaUuid,
        filename: imageUrl,
        ctime: new Date(),
        mtime: new Date(),
        contentType: 'image/jpeg',
        meta: {}
      }

      if (append) {
        set.imageList([...currentList, newEntry])
      } else {
        set.imageList([newEntry, ...currentList])
      }

      if (revalidateSSR) {
        await revalidateServePage(uid)
      }
    }
  }))

/**
 * TODO: put this behind a protected API
 * Call NextJS backend webhook to regenerate user profile page.
 * See https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
 * The token is URL encoded value of .env PAGE_REVALIDATE_TOKEN
 * @param uid user id
 */
export const revalidateServePage = async (uid: string): Promise<any> => await fetch(`/api/revalidate?token=8b%26o4t%21xUqAN3Y%239&u=${uid}`)
