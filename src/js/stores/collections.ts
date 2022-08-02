import { createStore } from '@udecode/zustood'
// import produce from 'immer'

interface UserCollectionsStateProps {
  favorites: {
    areas: string[]
    climbs: string[]
  }
}

const INITIAL_STATE: UserCollectionsStateProps = {
  favorites: {
    areas: [],
    climbs: []
  }
}

const STORE_OPTS = {}

export const userCollectionsStore = createStore('userCollections')(INITIAL_STATE, STORE_OPTS)
  .extendActions((set, get, api) => ({
    load: async (uuid: string) => {

    }
  })).extendActions((set, get, api) => ({
    save: async () => {
    }
  }))
