import { createStore } from '@udecode/zustood'

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
