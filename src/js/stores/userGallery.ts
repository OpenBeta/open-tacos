import { create } from 'zustand'
import { MediaConnection } from '../types'

export interface UserGalleryState {
  mediaConnection: MediaConnection
  addToFront: (nextConnection: MediaConnection) => void
  append: (nextConnection: MediaConnection) => void
  reset: (nextConnection: MediaConnection) => void
}

const DEFAUL_STATES: MediaConnection = {
  edges: [],
  pageInfo: {
    hasNextPage: false,
    endCursor: ''
  }
}

/**
 * Data store for UserGallery.
 */
export const useUserGalleryStore = create<UserGalleryState>(set => ({
  mediaConnection: {
    ...DEFAUL_STATES
  },

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
  })),

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
  })),

  /**
   * Reset the store.
   */
  reset: (nextConnection) => set(() => ({
    mediaConnection: {
      edges: nextConnection.edges,
      pageInfo: nextConnection.pageInfo
    }
  }))
}))
