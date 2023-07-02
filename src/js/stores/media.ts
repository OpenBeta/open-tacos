import { createStore } from '@udecode/zustood'
import { v5 as uuidv5 } from 'uuid'
import produce from 'immer'

import type { MediaType, MediaWithTags } from '../../js/types'

interface UserMediaStateProps {
  uid: string | null
  imageList: MediaType[]
  initialized: boolean
  photoUploadErrorMessage: string | null
  photoList: MediaWithTags[]
}

const INITIAL_STATE: UserMediaStateProps = {
  uid: null,
  imageList: [],
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
    setPhotoList: async (photoList: MediaWithTags[] | []) => {
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
