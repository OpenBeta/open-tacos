import { createStore } from '@udecode/zustood'
import { v5 as uuidv5 } from 'uuid'
import { Dictionary } from 'underscore'
import produce from 'immer'

import type { MediaType, HybridMediaTag, MediaBaseTag } from '../../js/types'
import { DeleteTagResult } from '../hooks/useDeleteTagBackend'

interface UserMediaStateProps {
  uid: string | null
  imageList: MediaType[]
  /**
   * A map of \<mediaUuid\>: \<array of tags\>
   *
   * Why use array of tags where JS `Set` would have been a better choice
   * for handling dups?
   * Because we use `underscore.groupBy()` to process server-side tags.
   */
  tagMap: Dictionary<HybridMediaTag[]>
  initialized: boolean
  photoUploadErrorMessage: string | null
  photoList: MediaBaseTag[]
}

const INITIAL_STATE: UserMediaStateProps = {
  uid: null,
  imageList: [],
  tagMap: {},
  initialized: false,
  photoUploadErrorMessage: null,
  photoList: []
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
          console.log(newEntry)
        })
      } else {
        newList = produce(currentList, draft => {
          draft.unshift(newEntry)
        })
      }

      set.imageList(newList)

      if (revalidateSSR) {
        await revalidateUserHomePage(uid)
      }
    },
    removeImage: async (mediaId: string) => {
      const currentList = await get.imageList()
      let updatedList: MediaType[] = []

      updatedList = produce(currentList, draft => {
        const imageToRemove = draft.findIndex(image => image.mediaId === mediaId)
        if (imageToRemove !== -1) draft.splice(imageToRemove, 1)
      })

      set.imageList(updatedList)
      await revalidateUserHomePage(get.uid())
    }
  })).extendActions((set, get, api) => ({
    /**
      * Add a new tag to local store
      */
    addTag: async (data: any) => {
      const { setTag } = data
      if (setTag == null) return
      const { mediaUuid } = setTag

      const newState = produce<Dictionary<HybridMediaTag[]>>(get.tagMap(), draft => {
        const currentTagList = draft?.[mediaUuid] ?? []
        if (currentTagList.length === 0) {
          draft[mediaUuid] = [setTag]
        } else {
          draft[mediaUuid].push(setTag)
        }
        return draft
      })

      set.tagMap(newState)
      await revalidateUserHomePage(get.uid())
    },
    /**
     * Remove a tag from local store
     */
    removeTag: async ({ id, mediaUuid }: DeleteTagResult) => {
      // Let's see if the media exists in local store?
      if ((get.tagMap()?.[mediaUuid] ?? null) == null) {
        // Media doesn't exist. Do nothing.
        return
      }

      // find the tag by id and remove it
      const newState = produce<Dictionary<HybridMediaTag[]>>(get.tagMap(), draft => {
        const idx = draft[mediaUuid].findIndex((tag: HybridMediaTag) => tag.id === id)
        if (idx > -1) {
          draft[mediaUuid].splice(idx, 1)
        }
        return draft
      })

      set.tagMap(newState)
      // rebuild user home page
      await revalidateUserHomePage(get.uid())
    }
  })).extendActions((set, get, api) => ({
    /**
     *
     * @param errorMessage
     * @returns
     */
    setPhotoUploadErrorMessage: async (errorMessage: string | null) => {
      set.photoUploadErrorMessage(errorMessage)
    }
  })).extendActions((set, get, api) => ({
    /**
     *
     * @param photoList
     * @returns
     */
    setPhotoList: async (photoList: MediaBaseTag[] | []) => {
      set.photoList(photoList)
    }
  }))

/**
 * TODO: put this behind a protected API
 * Call NextJS backend webhook to regenerate user profile page.
 * See https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
 * The token is URL encoded value of .env PAGE_REVALIDATE_TOKEN
 * @param uid user id
 */
export const revalidateUserHomePage = async (uid: string|null): Promise<any> => {
  if (uid == null) return
  try {
    await fetch(`/api/revalidate?&u=${uid}`)
  } catch {}
}
