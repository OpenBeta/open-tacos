import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { produce } from 'immer'

import { MediaConnection, MediaWithTags } from '../types'

export interface UserGalleryState {
  mediaConnection: MediaConnection
  uploading: boolean
}

export interface UserGalleryStore extends UserGalleryState {
  setUploading: (uploadingState: boolean) => void
  addToFront: (nextConnection: MediaConnection) => void
  append: (nextConnection: MediaConnection) => void
  updateOne: (media: MediaWithTags) => void
  delete: (mediaId: string) => void
  reset: (nextConnection: MediaConnection) => void
}

const DEFAUL_STATES: UserGalleryState = {
  mediaConnection: {
    edges: [],
    pageInfo: {
      hasNextPage: false,
      endCursor: ''
    }
  },
  uploading: false
}

const OPTIONS = {
  name: 'UserGallery',
  enabled: process?.env?.NEXT_PUBLIC_DEVTOOLS_ENABLED === 'true'
}

/**
 * Data store for UserGallery.
 */
export const useUserGalleryStore = create<UserGalleryStore>()(devtools((set, get) => ({
  ...DEFAUL_STATES,

  setUploading: (uploadingState) => set((state) => ({
    uploading: uploadingState
  }), false, 'setUploading'),

  /**
   * Add new media connection to the front of the list.
   * Use this to add a newly upload new media.
   * @param nextConnection
   */
  addToFront: (nextConnection) => set((state) => ({
    mediaConnection: {
      edges: nextConnection.edges.concat(state.mediaConnection.edges),
      pageInfo: nextConnection.pageInfo
    }
  }), false, 'addToFront'),

  /**
   * Append new media connection to the end of the list.
   * Use this then when the client fetches more from the backend in response to a user scrolling down.
   * @param nextConnection
   */
  append: (nextConnection) => set((state) => ({
    mediaConnection: {
      edges: state.mediaConnection.edges.concat(nextConnection.edges),
      pageInfo: nextConnection.pageInfo
    }
  }), false, 'append'),

  updateOne: (media) => set((state) => {
    const currentList = state.mediaConnection.edges
    const foundIndex = currentList.findIndex(mediaEdge => mediaEdge.node.id === media.id)

    if (foundIndex < 0) {
      return state
    }
    const newState = produce(state.mediaConnection, draft => {
      draft.edges[foundIndex].node = media
    })

    return ({
      mediaConnection: newState
    })
  }, false, 'updateOne'),

  /**
   * Delete a media node by mediaId.
   * @param mediaId
   */
  delete: (mediaId) => set((state) => {
    const currentList = state.mediaConnection.edges
    const foundIndex = currentList.findIndex(mediaEdge => mediaEdge.node.id === mediaId)

    // not found, do nothing
    if (foundIndex < 0) return state

    const newState = produce(state.mediaConnection, draft => {
      draft.edges.splice(foundIndex, 1)
    })

    return ({
      mediaConnection: newState
    })
  }, false, 'delete'),

  /**
   * Reset the store.
   */
  reset: (nextConnection) => set(() => ({
    mediaConnection: {
      edges: nextConnection.edges,
      pageInfo: nextConnection.pageInfo
    }
  }), false, 'reset')
}
),
OPTIONS
))
