import { createStore } from '@udecode/zustood'
import { v5 as uuidv5 } from 'uuid'
import { Dictionary } from 'underscore'
import produce from 'immer'

import type { MediaType, MediaTagWithClimb } from '../../js/types'

interface UserMediaStateProps {
  uid: string | null
  imageList: MediaType[]
  tagMap: Dictionary<MediaTagWithClimb[]>
  initialized: boolean
}

const INITIAL_STATE: UserMediaStateProps = {
  uid: null,
  imageList: [],
  tagMap: {},
  initialized: false
}

const STORE_OPTS = {}

export const userMediaStore = createStore('userMedia')(INITIAL_STATE, STORE_OPTS)
  .extendActions((set, get, api) => ({
    /**
     *
     * @param uid
     * @param uuid
     * @param imageUrl
     * @param revalidateSSR
     * @returns
     */
    addImage: async (uid, uuid: string, imageUrl: string, revalidateSSR: boolean) => {
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

      const shouldAppend = currentList.length < 3

      let newList: MediaType[] = []

      if (shouldAppend) {
        newList = produce(currentList, draft => {
          draft.push(newEntry)
        })
      } else {
        newList = produce(currentList, draft => {
          draft.unshift(newEntry)
        })
      }

      set.imageList(newList)

      if (revalidateSSR) {
        await revalidateServePage(uid)
      }
    },
    removeImage: async (mediaId) => {
      console.log('mediaId: ', mediaId)

      const currentList = get.imageList()
      let updatedList: MediaType[] = []

      updatedList = produce(currentList, draft => {
        const imageToRemove = draft.findIndex(image => image.mediaId === mediaId)
        console.log('Deleting ', draft[imageToRemove].mediaId)
        if (imageToRemove !== -1) draft.splice(imageToRemove, 1)
      })

      set.imageList(updatedList)

      await revalidateServePage(get.uid())
    }
  })).extendActions((set, get, api) => ({
    /**
      * Add a new tag to local store
      */
    addTag: async (data: any) => {
      const { setTag } = data
      if (setTag == null) return
      const { mediaUuid } = setTag
      const { id } = setTag.climb
      const currentTagList = get.tagMap()?.[mediaUuid] ?? []
      if (currentTagList.findIndex((tag: MediaTagWithClimb) => tag.climb.id === id) !== -1) {
        // Tag for the same climb exists
        // We only allow 1 climb/area tag per media
        return
      }

      const newState = produce<Dictionary<MediaTagWithClimb[]>>(get.tagMap(), draft => {
        const currentTagList = draft?.[mediaUuid] ?? []
        if (currentTagList.length === 0) {
          draft[mediaUuid] = [setTag]
        } else {
          draft[mediaUuid].push(setTag)
        }
        return draft
      })

      set.tagMap(newState)
      await revalidateServePage(get.uid())
    },

    removeTag: async (data: any) => {
      const { removeTag } = data
      if (removeTag == null) return
      const { mediaUuid, destinationId } = removeTag

      if ((get.tagMap()?.[mediaUuid] ?? null) == null) {
        // Try to remove a tag that doesn't exist in local state. Do nothing.
        return
      }

      const newState = produce<Dictionary<MediaTagWithClimb[]>>(get.tagMap(), draft => {
        const idx = draft[mediaUuid].findIndex((tag: MediaTagWithClimb) => tag.climb.id === destinationId)
        draft[mediaUuid].splice(idx, 1)
        return draft
      })

      set.tagMap(newState)
      await revalidateServePage(get.uid())
    }
  }))

/**
 * TODO: put this behind a protected API
 * Call NextJS backend webhook to regenerate user profile page.
 * See https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
 * The token is URL encoded value of .env PAGE_REVALIDATE_TOKEN
 * @param uid user id
 */
export const revalidateServePage = async (uid: string|null): Promise<any> => uid != null && await fetch(`/api/revalidate?&u=${uid}`)
